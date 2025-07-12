import os
import numpy as np
import pandas as pd
import tensorflow as tf
from tensorflow import keras
from tensorflow.keras import layers, applications, optimizers, callbacks
from tensorflow.keras.preprocessing.image import ImageDataGenerator
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report, confusion_matrix
import matplotlib.pyplot as plt
import seaborn as sns
from PIL import Image
import json
import pickle
from datetime import datetime
import logging
import albumentations as A
from albumentations.pytorch import ToTensorV2
import cv2
import warnings
warnings.filterwarnings('ignore')

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

class CropDiseaseModel:
    def __init__(self, config_path='model_config.json'):
        """Initialize the crop disease detection model"""
        self.config = self.load_config(config_path)
        self.model = None
        self.history = None
        self.class_names = []
        self.input_shape = self.config.get('input_shape', (224, 224, 3))
        self.num_classes = 0
        
    def load_config(self, config_path):
        """Load model configuration"""
        default_config = {
            "input_shape": [224, 224, 3],
            "batch_size": 32,
            "epochs": 100,
            "learning_rate": 0.001,
            "validation_split": 0.2,
            "test_split": 0.1,
            "early_stopping_patience": 15,
            "reduce_lr_patience": 10,
            "augmentation": True,
            "transfer_learning": True,
            "base_model": "EfficientNetB4",
            "fine_tune_layers": 50,
            "dropout_rate": 0.3,
            "l2_regularization": 0.01,
            "class_weights": True,
            "mixed_precision": True
        }
        
        if os.path.exists(config_path):
            with open(config_path, 'r') as f:
                config = json.load(f)
            # Merge with defaults
            for key, value in default_config.items():
                if key not in config:
                    config[key] = value
        else:
            config = default_config
            # Save default config
            with open(config_path, 'w') as f:
                json.dump(config, f, indent=4)
                
        return config
    
    def setup_mixed_precision(self):
        """Setup mixed precision training for faster training"""
        if self.config.get('mixed_precision', True):
            policy = keras.mixed_precision.Policy('mixed_float16')
            keras.mixed_precision.set_global_policy(policy)
            logger.info("Mixed precision training enabled")
    
    def create_advanced_augmentation(self):
        """Create advanced data augmentation pipeline using Albumentations"""
        transform = A.Compose([
            A.RandomResizedCrop(height=self.input_shape[0], width=self.input_shape[1], scale=(0.8, 1.0)),
            A.HorizontalFlip(p=0.5),
            A.VerticalFlip(p=0.3),
            A.RandomRotate90(p=0.5),
            A.Rotate(limit=30, p=0.7),
            A.RandomBrightnessContrast(brightness_limit=0.2, contrast_limit=0.2, p=0.7),
            A.HueSaturationValue(hue_shift_limit=20, sat_shift_limit=30, val_shift_limit=20, p=0.7),
            A.GaussianBlur(blur_limit=(1, 3), p=0.3),
            A.GaussNoise(var_limit=(10.0, 50.0), p=0.3),
            A.CoarseDropout(max_holes=8, max_height=32, max_width=32, p=0.3),
            A.Cutout(num_holes=8, max_h_size=16, max_w_size=16, p=0.3),
            A.GridDistortion(p=0.3),
            A.ElasticTransform(p=0.3),
            A.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]),
            ToTensorV2()
        ])
        return transform
    
    def load_and_preprocess_data(self, data_dir):
        """Load and preprocess the dataset"""
        logger.info(f"Loading data from {data_dir}")
        
        # Get class names from directory structure
        self.class_names = sorted([d for d in os.listdir(data_dir) 
                                 if os.path.isdir(os.path.join(data_dir, d))])
        self.num_classes = len(self.class_names)
        
        logger.info(f"Found {self.num_classes} classes: {self.class_names}")
        
        # Create class to index mapping
        class_to_idx = {cls_name: idx for idx, cls_name in enumerate(self.class_names)}
        
        # Load all image paths and labels
        image_paths = []
        labels = []
        
        for class_name in self.class_names:
            class_dir = os.path.join(data_dir, class_name)
            class_images = [f for f in os.listdir(class_dir) 
                          if f.lower().endswith(('.png', '.jpg', '.jpeg', '.bmp', '.tiff'))]
            
            for img_name in class_images:
                image_paths.append(os.path.join(class_dir, img_name))
                labels.append(class_to_idx[class_name])
        
        logger.info(f"Total images found: {len(image_paths)}")
        
        # Split data
        X_temp, X_test, y_temp, y_test = train_test_split(
            image_paths, labels, 
            test_size=self.config['test_split'], 
            stratify=labels, 
            random_state=42
        )
        
        X_train, X_val, y_train, y_val = train_test_split(
            X_temp, y_temp, 
            test_size=self.config['validation_split']/(1-self.config['test_split']), 
            stratify=y_temp, 
            random_state=42
        )
        
        logger.info(f"Train samples: {len(X_train)}")
        logger.info(f"Validation samples: {len(X_val)}")
        logger.info(f"Test samples: {len(X_test)}")
        
        return (X_train, y_train), (X_val, y_val), (X_test, y_test)
    
    def create_data_generators(self, train_data, val_data):
        """Create data generators with advanced augmentation"""
        X_train, y_train = train_data
        X_val, y_val = val_data
        
        def preprocess_image(image_path, label, is_training=True):
            """Preprocess individual image"""
            # Load image
            image = tf.io.read_file(image_path)
            image = tf.image.decode_image(image, channels=3)
            image = tf.cast(image, tf.float32)
            
            # Resize image
            image = tf.image.resize(image, [self.input_shape[0], self.input_shape[1]])
            
            if is_training and self.config.get('augmentation', True):
                # Apply augmentations
                image = tf.image.random_flip_left_right(image)
                image = tf.image.random_flip_up_down(image)
                image = tf.image.random_brightness(image, 0.2)
                image = tf.image.random_contrast(image, 0.8, 1.2)
                image = tf.image.random_saturation(image, 0.8, 1.2)
                image = tf.image.random_hue(image, 0.1)
                
                # Random rotation
                angle = tf.random.uniform([], -30, 30) * (3.14159 / 180)
                image = tf.contrib.image.rotate(image, angle)
            
            # Normalize
            image = tf.cast(image, tf.float32) / 255.0
            
            # Apply ImageNet normalization
            mean = tf.constant([0.485, 0.456, 0.406])
            std = tf.constant([0.229, 0.224, 0.225])
            image = (image - mean) / std
            
            return image, label
        
        # Create datasets
        train_dataset = tf.data.Dataset.from_tensor_slices((X_train, y_train))
        train_dataset = train_dataset.map(
            lambda x, y: preprocess_image(x, y, True),
            num_parallel_calls=tf.data.AUTOTUNE
        )
        train_dataset = train_dataset.shuffle(1000).batch(self.config['batch_size']).prefetch(tf.data.AUTOTUNE)
        
        val_dataset = tf.data.Dataset.from_tensor_slices((X_val, y_val))
        val_dataset = val_dataset.map(
            lambda x, y: preprocess_image(x, y, False),
            num_parallel_calls=tf.data.AUTOTUNE
        )
        val_dataset = val_dataset.batch(self.config['batch_size']).prefetch(tf.data.AUTOTUNE)
        
        return train_dataset, val_dataset
    
    def calculate_class_weights(self, y_train):
        """Calculate class weights for imbalanced dataset"""
        from sklearn.utils.class_weight import compute_class_weight
        
        class_weights = compute_class_weight(
            'balanced',
            classes=np.unique(y_train),
            y=y_train
        )
        
        class_weight_dict = dict(enumerate(class_weights))
        logger.info(f"Class weights: {class_weight_dict}")
        
        return class_weight_dict
    
    def create_model(self):
        """Create the model architecture"""
        logger.info(f"Creating model with {self.config['base_model']} backbone")
        
        # Input layer
        inputs = keras.Input(shape=self.input_shape)
        
        # Base model (transfer learning)
        if self.config.get('transfer_learning', True):
            base_model_name = self.config.get('base_model', 'EfficientNetB4')
            
            if base_model_name == 'EfficientNetB4':
                base_model = applications.EfficientNetB4(
                    weights='imagenet',
                    include_top=False,
                    input_tensor=inputs
                )
            elif base_model_name == 'ResNet152V2':
                base_model = applications.ResNet152V2(
                    weights='imagenet',
                    include_top=False,
                    input_tensor=inputs
                )
            elif base_model_name == 'DenseNet201':
                base_model = applications.DenseNet201(
                    weights='imagenet',
                    include_top=False,
                    input_tensor=inputs
                )
            else:
                base_model = applications.EfficientNetB4(
                    weights='imagenet',
                    include_top=False,
                    input_tensor=inputs
                )
            
            # Freeze base model initially
            base_model.trainable = False
            x = base_model.output
        else:
            # Custom CNN architecture
            x = inputs
            x = layers.Conv2D(32, 3, activation='relu')(x)
            x = layers.BatchNormalization()(x)
            x = layers.MaxPooling2D()(x)
            
            x = layers.Conv2D(64, 3, activation='relu')(x)
            x = layers.BatchNormalization()(x)
            x = layers.MaxPooling2D()(x)
            
            x = layers.Conv2D(128, 3, activation='relu')(x)
            x = layers.BatchNormalization()(x)
            x = layers.MaxPooling2D()(x)
            
            x = layers.Conv2D(256, 3, activation='relu')(x)
            x = layers.BatchNormalization()(x)
            x = layers.MaxPooling2D()(x)
        
        # Global pooling
        x = layers.GlobalAveragePooling2D()(x)
        
        # Dense layers with regularization
        x = layers.Dense(512, activation='relu')(x)
        x = layers.BatchNormalization()(x)
        x = layers.Dropout(self.config.get('dropout_rate', 0.3))(x)
        
        x = layers.Dense(256, activation='relu')(x)
        x = layers.BatchNormalization()(x)
        x = layers.Dropout(self.config.get('dropout_rate', 0.3))(x)
        
        # Output layer
        if self.config.get('mixed_precision', True):
            x = layers.Dense(self.num_classes, dtype='float32')(x)
            outputs = layers.Activation('softmax', dtype='float32')(x)
        else:
            outputs = layers.Dense(self.num_classes, activation='softmax')(x)
        
        # Create model
        self.model = keras.Model(inputs, outputs)
        
        # Compile model
        optimizer = optimizers.Adam(learning_rate=self.config['learning_rate'])
        
        self.model.compile(
            optimizer=optimizer,
            loss='sparse_categorical_crossentropy',
            metrics=['accuracy', 'top_3_accuracy']
        )
        
        logger.info(f"Model created with {self.model.count_params():,} parameters")
        return self.model
    
    def create_callbacks(self):
        """Create training callbacks"""
        callbacks_list = []
        
        # Early stopping
        early_stopping = callbacks.EarlyStopping(
            monitor='val_accuracy',
            patience=self.config.get('early_stopping_patience', 15),
            restore_best_weights=True,
            verbose=1
        )
        callbacks_list.append(early_stopping)
        
        # Reduce learning rate
        reduce_lr = callbacks.ReduceLROnPlateau(
            monitor='val_loss',
            factor=0.2,
            patience=self.config.get('reduce_lr_patience', 10),
            min_lr=1e-7,
            verbose=1
        )
        callbacks_list.append(reduce_lr)
        
        # Model checkpoint
        checkpoint = callbacks.ModelCheckpoint(
            'best_model.h5',
            monitor='val_accuracy',
            save_best_only=True,
            save_weights_only=False,
            verbose=1
        )
        callbacks_list.append(checkpoint)
        
        # CSV logger
        csv_logger = callbacks.CSVLogger('training_log.csv')
        callbacks_list.append(csv_logger)
        
        # TensorBoard
        tensorboard = callbacks.TensorBoard(
            log_dir=f'logs/{datetime.now().strftime("%Y%m%d-%H%M%S")}',
            histogram_freq=1,
            write_graph=True,
            write_images=True
        )
        callbacks_list.append(tensorboard)
        
        return callbacks_list
    
    def train(self, data_dir, save_dir='models'):
        """Train the model"""
        logger.info("Starting training process...")
        
        # Setup mixed precision
        self.setup_mixed_precision()
        
        # Load and preprocess data
        train_data, val_data, test_data = self.load_and_preprocess_data(data_dir)
        
        # Create data generators
        train_dataset, val_dataset = self.create_data_generators(train_data, val_data)
        
        # Calculate class weights
        class_weights = None
        if self.config.get('class_weights', True):
            class_weights = self.calculate_class_weights(train_data[1])
        
        # Create model
        self.create_model()
        
        # Print model summary
        self.model.summary()
        
        # Create callbacks
        callbacks_list = self.create_callbacks()
        
        # Train model
        logger.info("Starting initial training...")
        self.history = self.model.fit(
            train_dataset,
            epochs=self.config['epochs'],
            validation_data=val_dataset,
            callbacks=callbacks_list,
            class_weight=class_weights,
            verbose=1
        )
        
        # Fine-tuning (if using transfer learning)
        if self.config.get('transfer_learning', True):
            logger.info("Starting fine-tuning...")
            
            # Unfreeze some layers
            base_model = self.model.layers[1]  # Assuming base model is the second layer
            base_model.trainable = True
            
            # Freeze early layers
            fine_tune_at = len(base_model.layers) - self.config.get('fine_tune_layers', 50)
            for layer in base_model.layers[:fine_tune_at]:
                layer.trainable = False
            
            # Recompile with lower learning rate
            self.model.compile(
                optimizer=optimizers.Adam(learning_rate=self.config['learning_rate']/10),
                loss='sparse_categorical_crossentropy',
                metrics=['accuracy', 'top_3_accuracy']
            )
            
            # Continue training
            fine_tune_epochs = self.config['epochs'] // 2
            total_epochs = self.config['epochs'] + fine_tune_epochs
            
            history_fine = self.model.fit(
                train_dataset,
                epochs=total_epochs,
                initial_epoch=self.history.epoch[-1],
                validation_data=val_dataset,
                callbacks=callbacks_list,
                class_weight=class_weights,
                verbose=1
            )
            
            # Combine histories
            for key in self.history.history.keys():
                self.history.history[key].extend(history_fine.history[key])
        
        # Save model and metadata
        self.save_model(save_dir)
        
        # Evaluate on test set
        self.evaluate_model(test_data)
        
        logger.info("Training completed successfully!")
    
    def evaluate_model(self, test_data):
        """Evaluate model on test set"""
        X_test, y_test = test_data
        
        logger.info("Evaluating model on test set...")
        
        # Create test dataset
        test_dataset = tf.data.Dataset.from_tensor_slices((X_test, y_test))
        test_dataset = test_dataset.map(
            lambda x, y: self.preprocess_image(x, y, False),
            num_parallel_calls=tf.data.AUTOTUNE
        )
        test_dataset = test_dataset.batch(self.config['batch_size'])
        
        # Evaluate
        test_loss, test_accuracy, test_top3_accuracy = self.model.evaluate(test_dataset, verbose=1)
        
        logger.info(f"Test Accuracy: {test_accuracy:.4f}")
        logger.info(f"Test Top-3 Accuracy: {test_top3_accuracy:.4f}")
        
        # Generate predictions for detailed analysis
        predictions = self.model.predict(test_dataset)
        y_pred = np.argmax(predictions, axis=1)
        
        # Classification report
        report = classification_report(y_test, y_pred, target_names=self.class_names)
        logger.info(f"Classification Report:\n{report}")
        
        # Confusion matrix
        cm = confusion_matrix(y_test, y_pred)
        
        # Plot confusion matrix
        plt.figure(figsize=(12, 10))
        sns.heatmap(cm, annot=True, fmt='d', cmap='Blues', 
                   xticklabels=self.class_names, yticklabels=self.class_names)
        plt.title('Confusion Matrix')
        plt.ylabel('True Label')
        plt.xlabel('Predicted Label')
        plt.xticks(rotation=45)
        plt.yticks(rotation=0)
        plt.tight_layout()
        plt.savefig('confusion_matrix.png', dpi=300, bbox_inches='tight')
        plt.close()
        
        # Save evaluation results
        eval_results = {
            'test_accuracy': float(test_accuracy),
            'test_top3_accuracy': float(test_top3_accuracy),
            'test_loss': float(test_loss),
            'classification_report': report,
            'confusion_matrix': cm.tolist()
        }
        
        with open('evaluation_results.json', 'w') as f:
            json.dump(eval_results, f, indent=4)
    
    def save_model(self, save_dir):
        """Save the trained model and metadata"""
        os.makedirs(save_dir, exist_ok=True)
        
        # Save model
        model_path = os.path.join(save_dir, 'crop_disease_model.h5')
        self.model.save(model_path)
        logger.info(f"Model saved to {model_path}")
        
        # Save model in TensorFlow Lite format for mobile deployment
        converter = tf.lite.TFLiteConverter.from_keras_model(self.model)
        converter.optimizations = [tf.lite.Optimize.DEFAULT]
        tflite_model = converter.convert()
        
        tflite_path = os.path.join(save_dir, 'crop_disease_model.tflite')
        with open(tflite_path, 'wb') as f:
            f.write(tflite_model)
        logger.info(f"TensorFlow Lite model saved to {tflite_path}")
        
        # Save class names
        class_names_path = os.path.join(save_dir, 'class_names.json')
        with open(class_names_path, 'w') as f:
            json.dump(self.class_names, f)
        
        # Save model metadata
        metadata = {
            'model_version': '1.0',
            'created_at': datetime.now().isoformat(),
            'num_classes': self.num_classes,
            'class_names': self.class_names,
            'input_shape': self.input_shape,
            'config': self.config,
            'total_params': self.model.count_params()
        }
        
        metadata_path = os.path.join(save_dir, 'model_metadata.json')
        with open(metadata_path, 'w') as f:
            json.dump(metadata, f, indent=4)
        
        # Save training history
        if self.history:
            history_path = os.path.join(save_dir, 'training_history.json')
            with open(history_path, 'w') as f:
                json.dump(self.history.history, f, indent=4)
        
        # Plot training history
        self.plot_training_history(save_dir)
    
    def plot_training_history(self, save_dir):
        """Plot and save training history"""
        if not self.history:
            return
        
        fig, axes = plt.subplots(2, 2, figsize=(15, 10))
        
        # Accuracy
        axes[0, 0].plot(self.history.history['accuracy'], label='Training Accuracy')
        axes[0, 0].plot(self.history.history['val_accuracy'], label='Validation Accuracy')
        axes[0, 0].set_title('Model Accuracy')
        axes[0, 0].set_xlabel('Epoch')
        axes[0, 0].set_ylabel('Accuracy')
        axes[0, 0].legend()
        axes[0, 0].grid(True)
        
        # Loss
        axes[0, 1].plot(self.history.history['loss'], label='Training Loss')
        axes[0, 1].plot(self.history.history['val_loss'], label='Validation Loss')
        axes[0, 1].set_title('Model Loss')
        axes[0, 1].set_xlabel('Epoch')
        axes[0, 1].set_ylabel('Loss')
        axes[0, 1].legend()
        axes[0, 1].grid(True)
        
        # Top-3 Accuracy
        if 'top_3_accuracy' in self.history.history:
            axes[1, 0].plot(self.history.history['top_3_accuracy'], label='Training Top-3 Accuracy')
            axes[1, 0].plot(self.history.history['val_top_3_accuracy'], label='Validation Top-3 Accuracy')
            axes[1, 0].set_title('Model Top-3 Accuracy')
            axes[1, 0].set_xlabel('Epoch')
            axes[1, 0].set_ylabel('Top-3 Accuracy')
            axes[1, 0].legend()
            axes[1, 0].grid(True)
        
        # Learning Rate
        if 'lr' in self.history.history:
            axes[1, 1].plot(self.history.history['lr'], label='Learning Rate')
            axes[1, 1].set_title('Learning Rate Schedule')
            axes[1, 1].set_xlabel('Epoch')
            axes[1, 1].set_ylabel('Learning Rate')
            axes[1, 1].set_yscale('log')
            axes[1, 1].legend()
            axes[1, 1].grid(True)
        
        plt.tight_layout()
        plt.savefig(os.path.join(save_dir, 'training_history.png'), dpi=300, bbox_inches='tight')
        plt.close()

def main():
    """Main training function"""
    # Configuration
    data_directory = "dataset"  # Path to your dataset directory
    model_save_directory = "models"
    
    # Create model instance
    model = CropDiseaseModel()
    
    # Train model
    model.train(data_directory, model_save_directory)

if __name__ == "__main__":
    main()
