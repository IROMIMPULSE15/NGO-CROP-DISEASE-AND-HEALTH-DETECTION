import os
import shutil
import random
import json
import cv2
import numpy as np
from PIL import Image, ImageEnhance, ImageFilter
import albumentations as A
from sklearn.model_selection import train_test_split
import logging
from typing import List, Tuple, Dict
from pathlib import Path

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class DatasetPreprocessor:
    def __init__(self, config_path: str = 'preprocessing_config.json'):
        """Initialize dataset preprocessor"""
        self.config = self.load_config(config_path)
        self.augmentation_pipeline = self.create_augmentation_pipeline()
    
    def load_config(self, config_path: str) -> Dict:
        """Load preprocessing configuration"""
        default_config = {
            "target_size": [224, 224],
            "validation_split": 0.2,
            "test_split": 0.1,
            "augmentation_factor": 3,
            "quality_threshold": 50,
            "min_samples_per_class": 100,
            "max_samples_per_class": 2000,
            "image_formats": [".jpg", ".jpeg", ".png", ".bmp", ".tiff"],
            "output_format": "jpg",
            "output_quality": 95
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
            with open(config_path, 'w') as f:
                json.dump(config, f, indent=4)
        
        return config
    
    def create_augmentation_pipeline(self):
        """Create augmentation pipeline using Albumentations"""
        return A.Compose([
            A.RandomResizedCrop(
                height=self.config['target_size'][0], 
                width=self.config['target_size'][1], 
                scale=(0.8, 1.0),
                ratio=(0.75, 1.33),
                p=1.0
            ),
            A.OneOf([
                A.HorizontalFlip(p=1.0),
                A.VerticalFlip(p=1.0),
                A.RandomRotate90(p=1.0),
            ], p=0.8),
            A.OneOf([
                A.Rotate(limit=30, p=1.0),
                A.ShiftScaleRotate(shift_limit=0.1, scale_limit=0.2, rotate_limit=30, p=1.0),
            ], p=0.7),
            A.OneOf([
                A.RandomBrightnessContrast(brightness_limit=0.3, contrast_limit=0.3, p=1.0),
                A.HueSaturationValue(hue_shift_limit=20, sat_shift_limit=30, val_shift_limit=20, p=1.0),
                A.CLAHE(clip_limit=2.0, tile_grid_size=(8, 8), p=1.0),
            ], p=0.8),
            A.OneOf([
                A.GaussianBlur(blur_limit=(1, 3), p=1.0),
                A.MotionBlur(blur_limit=3, p=1.0),
                A.MedianBlur(blur_limit=3, p=1.0),
            ], p=0.3),
            A.OneOf([
                A.GaussNoise(var_limit=(10.0, 50.0), p=1.0),
                A.ISONoise(color_shift=(0.01, 0.05), intensity=(0.1, 0.5), p=1.0),
            ], p=0.3),
            A.OneOf([
                A.CoarseDropout(max_holes=8, max_height=32, max_width=32, p=1.0),
                A.Cutout(num_holes=8, max_h_size=16, max_w_size=16, p=1.0),
            ], p=0.3),
            A.OneOf([
                A.GridDistortion(p=1.0),
                A.ElasticTransform(p=1.0),
                A.OpticalDistortion(p=1.0),
            ], p=0.2),
        ])
    
    def check_image_quality(self, image_path: str) -> bool:
        """Check if image meets quality requirements"""
        try:
            # Load image
            image = cv2.imread(image_path)
            if image is None:
                return False
            
            # Check image size
            height, width = image.shape[:2]
            if height < 100 or width < 100:
                return False
            
            # Check if image is too blurry (Laplacian variance)
            gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
            laplacian_var = cv2.Laplacian(gray, cv2.CV_64F).var()
            
            if laplacian_var < self.config['quality_threshold']:
                return False
            
            return True
            
        except Exception as e:
            logger.warning(f"Error checking image quality for {image_path}: {str(e)}")
            return False
    
    def clean_dataset(self, input_dir: str, output_dir: str):
        """Clean and organize dataset"""
        logger.info(f"Cleaning dataset from {input_dir} to {output_dir}")
        
        os.makedirs(output_dir, exist_ok=True)
        
        # Get all class directories
        class_dirs = [d for d in os.listdir(input_dir) 
                     if os.path.isdir(os.path.join(input_dir, d))]
        
        dataset_stats = {}
        
        for class_name in class_dirs:
            input_class_dir = os.path.join(input_dir, class_name)
            output_class_dir = os.path.join(output_dir, class_name)
            os.makedirs(output_class_dir, exist_ok=True)
            
            # Get all image files
            image_files = []
            for ext in self.config['image_formats']:
                image_files.extend([f for f in os.listdir(input_class_dir) 
                                  if f.lower().endswith(ext.lower())])
            
            valid_images = 0
            invalid_images = 0
            
            for image_file in image_files:
                input_path = os.path.join(input_class_dir, image_file)
                
                # Check image quality
                if self.check_image_quality(input_path):
                    # Copy valid image
                    output_filename = f"{class_name}_{valid_images:04d}.{self.config['output_format']}"
                    output_path = os.path.join(output_class_dir, output_filename)
                    
                    # Load, resize and save image
                    self.process_and_save_image(input_path, output_path)
                    valid_images += 1
                else:
                    invalid_images += 1
            
            dataset_stats[class_name] = {
                'valid_images': valid_images,
                'invalid_images': invalid_images,
                'total_images': valid_images + invalid_images
            }
            
            logger.info(f"Class {class_name}: {valid_images} valid, {invalid_images} invalid images")
        
        # Save dataset statistics
        with open(os.path.join(output_dir, 'dataset_stats.json'), 'w') as f:
            json.dump(dataset_stats, f, indent=4)
        
        return dataset_stats
    
    def process_and_save_image(self, input_path: str, output_path: str):
        """Process and save individual image"""
        try:
            # Load image
            image = cv2.imread(input_path)
            image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
            
            # Resize image
            image = cv2.resize(image, tuple(self.config['target_size']))
            
            # Convert back to BGR for saving
            image = cv2.cvtColor(image, cv2.COLOR_RGB2BGR)
            
            # Save image
            cv2.imwrite(output_path, image, [cv2.IMWRITE_JPEG_QUALITY, self.config['output_quality']])
            
        except Exception as e:
            logger.error(f"Error processing image {input_path}: {str(e)}")
    
    def balance_dataset(self, input_dir: str, output_dir: str):
        """Balance dataset by augmenting underrepresented classes"""
        logger.info(f"Balancing dataset from {input_dir} to {output_dir}")
        
        os.makedirs(output_dir, exist_ok=True)
        
        # Get class statistics
        class_counts = {}
        class_dirs = [d for d in os.listdir(input_dir) 
                     if os.path.isdir(os.path.join(input_dir, d))]
        
        for class_name in class_dirs:
            class_dir = os.path.join(input_dir, class_name)
            image_files = [f for f in os.listdir(class_dir) 
                          if any(f.lower().endswith(ext.lower()) for ext in self.config['image_formats'])]
            class_counts[class_name] = len(image_files)
        
        # Determine target count (median or max based on config)
        target_count = min(max(class_counts.values()), self.config['max_samples_per_class'])
        target_count = max(target_count, self.config['min_samples_per_class'])
        
        logger.info(f"Target samples per class: {target_count}")
        
        for class_name in class_dirs:
            input_class_dir = os.path.join(input_dir, class_name)
            output_class_dir = os.path.join(output_dir, class_name)
            os.makedirs(output_class_dir, exist_ok=True)
            
            # Get all images for this class
            image_files = [f for f in os.listdir(input_class_dir) 
                          if any(f.lower().endswith(ext.lower()) for ext in self.config['image_formats'])]
            
            current_count = len(image_files)
            
            # Copy original images
            for i, image_file in enumerate(image_files):
                input_path = os.path.join(input_class_dir, image_file)
                output_path = os.path.join(output_class_dir, f"{class_name}_orig_{i:04d}.jpg")
                shutil.copy2(input_path, output_path)
            
            # Generate augmented images if needed
            if current_count < target_count:
                augmentations_needed = target_count - current_count
                logger.info(f"Generating {augmentations_needed} augmented images for class {class_name}")
                
                self.generate_augmented_images(
                    input_class_dir, 
                    output_class_dir, 
                    class_name,
                    augmentations_needed
                )
    
    def generate_augmented_images(self, input_dir: str, output_dir: str, class_name: str, count: int):
        """Generate augmented images for a class"""
        # Get all images
        image_files = [f for f in os.listdir(input_dir) 
                      if any(f.lower().endswith(ext.lower()) for ext in self.config['image_formats'])]
        
        generated = 0
        while generated < count:
            # Randomly select an image
            image_file = random.choice(image_files)
            input_path = os.path.join(input_dir, image_file)
            
            try:
                # Load image
                image = cv2.imread(input_path)
                image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
                
                # Apply augmentation
                augmented = self.augmentation_pipeline(image=image)
                augmented_image = augmented['image']
                
                # Save augmented image
                output_path = os.path.join(output_dir, f"{class_name}_aug_{generated:04d}.jpg")
                augmented_image = cv2.cvtColor(augmented_image, cv2.COLOR_RGB2BGR)
                cv2.imwrite(output_path, augmented_image, [cv2.IMWRITE_JPEG_QUALITY, self.config['output_quality']])
                
                generated += 1
                
            except Exception as e:
                logger.error(f"Error generating augmented image: {str(e)}")
                continue
    
    def split_dataset(self, input_dir: str, output_dir: str):
        """Split dataset into train, validation, and test sets"""
        logger.info(f"Splitting dataset from {input_dir} to {output_dir}")
        
        # Create output directories
        for split in ['train', 'val', 'test']:
            os.makedirs(os.path.join(output_dir, split), exist_ok=True)
        
        class_dirs = [d for d in os.listdir(input_dir) 
                     if os.path.isdir(os.path.join(input_dir, d))]
        
        split_stats = {}
        
        for class_name in class_dirs:
            input_class_dir = os.path.join(input_dir, class_name)
            
            # Create class directories in each split
            for split in ['train', 'val', 'test']:
                os.makedirs(os.path.join(output_dir, split, class_name), exist_ok=True)
            
            # Get all images
            image_files = [f for f in os.listdir(input_class_dir) 
                          if any(f.lower().endswith(ext.lower()) for ext in self.config['image_formats'])]
            
            # Split images
            train_files, temp_files = train_test_split(
                image_files, 
                test_size=self.config['validation_split'] + self.config['test_split'],
                random_state=42
            )
            
            val_files, test_files = train_test_split(
                temp_files,
                test_size=self.config['test_split'] / (self.config['validation_split'] + self.config['test_split']),
                random_state=42
            )
            
            # Copy files to respective directories
            for files, split in [(train_files, 'train'), (val_files, 'val'), (test_files, 'test')]:
                for image_file in files:
                    src_path = os.path.join(input_class_dir, image_file)
                    dst_path = os.path.join(output_dir, split, class_name, image_file)
                    shutil.copy2(src_path, dst_path)
            
            split_stats[class_name] = {
                'train': len(train_files),
                'val': len(val_files),
                'test': len(test_files),
                'total': len(image_files)
            }
            
            logger.info(f"Class {class_name}: Train={len(train_files)}, Val={len(val_files)}, Test={len(test_files)}")
        
        # Save split statistics
        with open(os.path.join(output_dir, 'split_stats.json'), 'w') as f:
            json.dump(split_stats, f, indent=4)
        
        return split_stats
    
    def create_dataset_report(self, dataset_dir: str):
        """Create comprehensive dataset report"""
        report = {
            'dataset_path': dataset_dir,
            'created_at': str(pd.Timestamp.now()),
            'classes': {},
            'total_images': 0,
            'image_size_distribution': {},
            'file_format_distribution': {}
        }
        
        class_dirs = [d for d in os.listdir(dataset_dir) 
                     if os.path.isdir(os.path.join(dataset_dir, d))]
        
        for class_name in class_dirs:
            class_dir = os.path.join(dataset_dir, class_name)
            image_files = [f for f in os.listdir(class_dir) 
                          if any(f.lower().endswith(ext.lower()) for ext in self.config['image_formats'])]
            
            class_info = {
                'count': len(image_files),
                'samples': image_files[:5]  # First 5 samples
            }
            
            report['classes'][class_name] = class_info
            report['total_images'] += len(image_files)
        
        # Save report
        with open(os.path.join(dataset_dir, 'dataset_report.json'), 'w') as f:
            json.dump(report, f, indent=4)
        
        return report

def main():
    """Main preprocessing pipeline"""
    # Configuration
    raw_dataset_dir = "raw_dataset"
    cleaned_dataset_dir = "cleaned_dataset"
    balanced_dataset_dir = "balanced_dataset"
    final_dataset_dir = "dataset"
    
    # Initialize preprocessor
    preprocessor = DatasetPreprocessor()
    
    # Step 1: Clean dataset
    logger.info("Step 1: Cleaning dataset...")
    preprocessor.clean_dataset(raw_dataset_dir, cleaned_dataset_dir)
    
    # Step 2: Balance dataset
    logger.info("Step 2: Balancing dataset...")
    preprocessor.balance_dataset(cleaned_dataset_dir, balanced_dataset_dir)
    
    # Step 3: Split dataset
    logger.info("Step 3: Splitting dataset...")
    preprocessor.split_dataset(balanced_dataset_dir, final_dataset_dir)
    
    # Step 4: Create report
    logger.info("Step 4: Creating dataset report...")
    preprocessor.create_dataset_report(final_dataset_dir)
    
    logger.info("Dataset preprocessing completed!")

if __name__ == "__main__":
    main()
