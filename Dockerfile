# Use official Python runtime as base image
FROM python:3.9-slim

# Set working directory
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    libglib2.0-0 \
    libsm6 \
    libxext6 \
    libxrender-dev \
    libgomp1 \
    libglib2.0-0 \
    libgtk-3-0 \
    libgl1-mesa-glx \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements and install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY scripts/ ./scripts/
COPY models/ ./models/

# Create directories for uploads and logs
RUN mkdir -p uploads logs

# Expose port
EXPOSE 8000

# Set environment variables
ENV MODEL_PATH=models/crop_disease_model.h5
ENV METADATA_PATH=models/model_metadata.json
ENV PYTHONPATH=/app

# Run the application
CMD ["python", "scripts/model_deployment.py"]
