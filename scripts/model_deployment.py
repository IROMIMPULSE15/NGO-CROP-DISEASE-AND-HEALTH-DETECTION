import os
import json
import logging
from typing import Dict, List, Optional
import tensorflow as tf
import numpy as np
from fastapi import FastAPI, File, UploadFile, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import uvicorn
from PIL import Image
import io
import cv2
from datetime import datetime
import asyncio
import aiofiles

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class ModelServer:
    def __init__(self, model_path: str, metadata_path: str):
        """Initialize the model server"""
        self.model = None
        self.metadata = {}
        self.class_names = []
        self.input_shape = (224, 224, 3)
        self.load_model(model_path, metadata_path)
        
    def load_model(self, model_path: str, metadata_path: str):
        """Load the trained model and metadata"""
        try:
            # Load model
            self.model = tf.keras.models.load_model(model_path)
            logger.info(f"Model loaded successfully from {model_path}")
            
            # Load metadata
            with open(metadata_path, 'r') as f:
                self.metadata = json.load(f)
            
            self.class_names = self.metadata['class_names']
            self.input_shape = tuple(self.metadata['input_shape'])
            
            logger.info(f"Model metadata loaded: {len(self.class_names)} classes")
            
        except Exception as e:
            logger.error(f"Error loading model: {str(e)}")
            raise
    
    def preprocess_image(self, image_bytes: bytes) -> np.ndarray:
        """Preprocess image for prediction"""
        try:
            # Load image from bytes
            image = Image.open(io.BytesIO(image_bytes))
            
            # Convert to RGB if needed
            if image.mode != 'RGB':
                image = image.convert('RGB')
            
            # Convert to numpy array
            image_array = np.array(image)
            
            # Resize image
            image_array = cv2.resize(image_array, (self.input_shape[1], self.input_shape[0]))
            
            # Normalize
            image_array = image_array.astype(np.float32) / 255.0
            
            # Apply ImageNet normalization
            mean = np.array([0.485, 0.456, 0.406])
            std = np.array([0.229, 0.224, 0.225])
            image_array = (image_array - mean) / std
            
            # Add batch dimension
            image_array = np.expand_dims(image_array, axis=0)
            
            return image_array
            
        except Exception as e:
            logger.error(f"Error preprocessing image: {str(e)}")
            raise
    
    async def predict(self, image_bytes: bytes, plant_part: str = "leaves") -> Dict:
        """Make prediction on image"""
        try:
            # Preprocess image
            processed_image = self.preprocess_image(image_bytes)
            
            # Make prediction
            predictions = self.model.predict(processed_image, verbose=0)
            probabilities = predictions[0]
            
            # Get top predictions
            top_indices = np.argsort(probabilities)[-5:][::-1]
            
            # Calculate confidence
            confidence = float(probabilities[top_indices[0]]) * 100
            
            # Get predicted class
            predicted_class = self.class_names[top_indices[0]]
            
            # Determine severity
            severity = self.calculate_severity(confidence, predicted_class)
            
            # Get disease information
            disease_info = self.get_disease_info(predicted_class)
            
            result = {
                'disease': predicted_class,
                'confidence': round(confidence, 2),
                'severity': severity,
                'symptoms': disease_info['symptoms'],
                'treatment': disease_info['treatment'],
                'prevention': disease_info['prevention'],
                'isHealthy': predicted_class.lower() == 'healthy',
                'plantPart': plant_part,
                'timestamp': datetime.now().isoformat(),
                'top_predictions': [
                    {
                        'class': self.class_names[idx],
                        'confidence': round(float(probabilities[idx]) * 100, 2)
                    }
                    for idx in top_indices
                ]
            }
            
            return result
            
        except Exception as e:
            logger.error(f"Error during prediction: {str(e)}")
            raise
    
    def calculate_severity(self, confidence: float, disease: str) -> str:
        """Calculate disease severity"""
        if disease.lower() == 'healthy':
            return 'Low'
        
        severe_diseases = ['bacterial_blight', 'leaf_blast', 'tungro']
        moderate_diseases = ['brown_spot', 'sheath_blight']
        
        disease_lower = disease.lower()
        
        if any(severe in disease_lower for severe in severe_diseases):
            return 'High' if confidence > 80 else 'Medium'
        elif any(moderate in disease_lower for moderate in moderate_diseases):
            return 'Medium' if confidence > 85 else 'Low'
        else:
            return 'Medium' if confidence > 90 else 'Low'
    
    def get_disease_info(self, disease: str) -> Dict[str, str]:
        """Get disease information"""
        disease_database = {
            'healthy': {
                'symptoms': 'No disease symptoms detected. Plant appears healthy.',
                'treatment': 'Continue regular care and monitoring.',
                'prevention': 'Maintain good agricultural practices and regular monitoring.'
            },
            'bacterial_blight': {
                'symptoms': 'Water-soaked lesions on leaves, yellowing and wilting of affected areas.',
                'treatment': 'Apply copper-based bactericides, remove infected plant parts, improve drainage.',
                'prevention': 'Use disease-free seeds, maintain proper plant spacing, avoid overhead irrigation.'
            },
            'brown_spot': {
                'symptoms': 'Small brown spots with yellow halos on leaves, spots may coalesce.',
                'treatment': 'Apply fungicide sprays, improve air circulation, remove infected debris.',
                'prevention': 'Balanced fertilization, proper water management, crop rotation.'
            },
            'leaf_blast': {
                'symptoms': 'Diamond-shaped lesions with gray centers and brown borders on leaves.',
                'treatment': 'Apply systemic fungicides, remove infected plant parts, improve air circulation.',
                'prevention': 'Use resistant varieties, balanced nutrition, proper water management.'
            },
            'sheath_blight': {
                'symptoms': 'Oval to irregular lesions on leaf sheaths, may spread to leaves.',
                'treatment': 'Apply fungicides, improve air circulation, remove infected debris.',
                'prevention': 'Proper plant spacing, balanced fertilization, crop rotation.'
            }
        }
        
        disease_key = disease.lower().replace(' ', '_')
        return disease_database.get(disease_key, disease_database['healthy'])

# Initialize FastAPI app
app = FastAPI(title="Crop Disease Detection API", version="1.0.0")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize model server
model_server = None

@app.on_event("startup")
async def startup_event():
    """Initialize model on startup"""
    global model_server
    try:
        model_path = os.getenv("MODEL_PATH", "models/crop_disease_model.h5")
        metadata_path = os.getenv("METADATA_PATH", "models/model_metadata.json")
        
        model_server = ModelServer(model_path, metadata_path)
        logger.info("Model server initialized successfully")
    except Exception as e:
        logger.error(f"Failed to initialize model server: {str(e)}")
        raise

@app.get("/")
async def root():
    """Root endpoint"""
    return {"message": "Crop Disease Detection API", "status": "running"}

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "model_loaded": model_server is not None,
        "timestamp": datetime.now().isoformat()
    }

@app.post("/predict")
async def predict_disease(
    image: UploadFile = File(...),
    plant_part: str = Form(default="leaves")
):
    """Predict crop disease from image"""
    try:
        if not model_server:
            raise HTTPException(status_code=503, detail="Model not loaded")
        
        # Validate file type
        if not image.content_type.startswith('image/'):
            raise HTTPException(status_code=400, detail="File must be an image")
        
        # Read image bytes
        image_bytes = await image.read()
        
        # Make prediction
        result = await model_server.predict(image_bytes, plant_part)
        
        return JSONResponse(content=result)
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Prediction error: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")

@app.post("/predict/batch")
async def predict_batch(
    images: List[UploadFile] = File(...),
    plant_parts: List[str] = Form(...)
):
    """Predict crop diseases for multiple images"""
    try:
        if not model_server:
            raise HTTPException(status_code=503, detail="Model not loaded")
        
        if len(images) != len(plant_parts):
            raise HTTPException(
                status_code=400, 
                detail="Number of images must match number of plant parts"
            )
        
        results = []
        for image, plant_part in zip(images, plant_parts):
            # Validate file type
            if not image.content_type.startswith('image/'):
                continue
            
            # Read image bytes
            image_bytes = await image.read()
            
            # Make prediction
            result = await model_server.predict(image_bytes, plant_part)
            results.append(result)
        
        return JSONResponse(content={"predictions": results})
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Batch prediction error: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")

@app.get("/classes")
async def get_classes():
    """Get available disease classes"""
    if not model_server:
        raise HTTPException(status_code=503, detail="Model not loaded")
    
    return {
        "classes": model_server.class_names,
        "total_classes": len(model_server.class_names)
    }

@app.get("/model/info")
async def get_model_info():
    """Get model information"""
    if not model_server:
        raise HTTPException(status_code=503, detail="Model not loaded")
    
    return model_server.metadata

if __name__ == "__main__":
    uvicorn.run(
        "model_deployment:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )
