import tensorflow as tf
import numpy as np
import json
import cv2
from PIL import Image
import logging
from typing import Dict, List, Tuple, Optional
import os

logger = logging.getLogger(__name__)

class CropDiseasePredictor:
    def __init__(self, model_path: str, metadata_path: str):
        """Initialize the crop disease predictor"""
        self.model = None
        self.class_names = []
        self.input_shape = (224, 224, 3)
        self.metadata = {}
        
        self.load_model(model_path, metadata_path)
    
    def load_model(self, model_path: str, metadata_path: str):
        """Load the trained model and metadata"""
        try:
            # Load model
            self.model = tf.keras.models.load_model(model_path)
            logger.info(f"Model loaded from {model_path}")
            
            # Load metadata
            with open(metadata_path, 'r') as f:
                self.metadata = json.load(f)
            
            self.class_names = self.metadata['class_names']
            self.input_shape = tuple(self.metadata['input_shape'])
            
            logger.info(f"Loaded model with {len(self.class_names)} classes")
            
        except Exception as e:
            logger.error(f"Error loading model: {str(e)}")
            raise
    
    def preprocess_image(self, image: np.ndarray) -> np.ndarray:
        """Preprocess image for prediction"""
        # Resize image
        image = cv2.resize(image, (self.input_shape[1], self.input_shape[0]))
        
        # Convert to RGB if needed
        if len(image.shape) == 3 and image.shape[2] == 3:
            image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
        
        # Normalize
        image = image.astype(np.float32) / 255.0
        
        # Apply ImageNet normalization
        mean = np.array([0.485, 0.456, 0.406])
        std = np.array([0.229, 0.224, 0.225])
        image = (image - mean) / std
        
        # Add batch dimension
        image = np.expand_dims(image, axis=0)
        
        return image
    
    def predict(self, image: np.ndarray, top_k: int = 3) -> Dict:
        """Make prediction on image"""
        try:
            # Preprocess image
            processed_image = self.preprocess_image(image)
            
            # Make prediction
            predictions = self.model.predict(processed_image, verbose=0)
            probabilities = predictions[0]
            
            # Get top-k predictions
            top_indices = np.argsort(probabilities)[-top_k:][::-1]
            
            results = {
                'predictions': [],
                'confidence': float(probabilities[top_indices[0]]),
                'top_prediction': {
                    'class': self.class_names[top_indices[0]],
                    'confidence': float(probabilities[top_indices[0]])
                }
            }
            
            for idx in top_indices:
                results['predictions'].append({
                    'class': self.class_names[idx],
                    'confidence': float(probabilities[idx])
                })
            
            return results
            
        except Exception as e:
            logger.error(f"Error during prediction: {str(e)}")
            raise
    
    def predict_batch(self, images: List[np.ndarray]) -> List[Dict]:
        """Make predictions on batch of images"""
        results = []
        for image in images:
            result = self.predict(image)
            results.append(result)
        return results

class ModelEvaluator:
    def __init__(self, model_path: str, metadata_path: str):
        """Initialize model evaluator"""
        self.predictor = CropDiseasePredictor(model_path, metadata_path)
    
    def evaluate_on_dataset(self, test_dir: str) -> Dict:
        """Evaluate model on test dataset"""
        results = {
            'total_samples': 0,
            'correct_predictions': 0,
            'accuracy': 0.0,
            'per_class_accuracy': {},
            'confusion_matrix': []
        }
        
        class_counts = {class_name: 0 for class_name in self.predictor.class_names}
        class_correct = {class_name: 0 for class_name in self.predictor.class_names}
        
        # Process each class directory
        for class_name in self.predictor.class_names:
            class_dir = os.path.join(test_dir, class_name)
            if not os.path.exists(class_dir):
                continue
            
            image_files = [f for f in os.listdir(class_dir) 
                          if f.lower().endswith(('.png', '.jpg', '.jpeg', '.bmp', '.tiff'))]
            
            for image_file in image_files:
                image_path = os.path.join(class_dir, image_file)
                
                # Load and predict
                image = cv2.imread(image_path)
                if image is None:
                    continue
                
                prediction = self.predictor.predict(image)
                predicted_class = prediction['top_prediction']['class']
                
                results['total_samples'] += 1
                class_counts[class_name] += 1
                
                if predicted_class == class_name:
                    results['correct_predictions'] += 1
                    class_correct[class_name] += 1
        
        # Calculate accuracies
        if results['total_samples'] > 0:
            results['accuracy'] = results['correct_predictions'] / results['total_samples']
        
        for class_name in self.predictor.class_names:
            if class_counts[class_name] > 0:
                results['per_class_accuracy'][class_name] = class_correct[class_name] / class_counts[class_name]
            else:
                results['per_class_accuracy'][class_name] = 0.0
        
        return results

def main():
    """Example usage"""
    model_path = "models/crop_disease_model.h5"
    metadata_path = "models/model_metadata.json"
    
    # Initialize predictor
    predictor = CropDiseasePredictor(model_path, metadata_path)
    
    # Example prediction
    image_path = "test_image.jpg"
    if os.path.exists(image_path):
        image = cv2.imread(image_path)
        result = predictor.predict(image)
        print(f"Prediction: {result}")

if __name__ == "__main__":
    main()
