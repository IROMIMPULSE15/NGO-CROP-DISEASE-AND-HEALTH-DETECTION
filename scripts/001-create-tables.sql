-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20),
    password_hash VARCHAR(255) NOT NULL,
    preferred_language VARCHAR(10) DEFAULT 'en',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create scans table for user scan history
CREATE TABLE IF NOT EXISTS scans (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    image_url VARCHAR(500) NOT NULL,
    plant_part VARCHAR(100) NOT NULL,
    prediction_result JSON NOT NULL,
    confidence_score DECIMAL(5,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create diseases table for disease information
CREATE TABLE IF NOT EXISTS diseases (
    id SERIAL PRIMARY KEY,
    name_en VARCHAR(255) NOT NULL,
    name_hi VARCHAR(255) NOT NULL,
    description_en TEXT,
    description_hi TEXT,
    symptoms_en TEXT,
    symptoms_hi TEXT,
    treatment_en TEXT,
    treatment_hi TEXT,
    prevention_en TEXT,
    prevention_hi TEXT,
    crop_type VARCHAR(100),
    severity_level VARCHAR(20),
    image_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create feedback table
CREATE TABLE IF NOT EXISTS feedback (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    scan_id INTEGER REFERENCES scans(id) ON DELETE CASCADE,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    comments TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample disease data
INSERT INTO diseases (name_en, name_hi, description_en, description_hi, symptoms_en, symptoms_hi, treatment_en, treatment_hi, prevention_en, prevention_hi, crop_type, severity_level, image_url) VALUES
('Leaf Blight', 'पत्ती झुलसा', 'A common fungal disease affecting crop leaves', 'फसल की पत्तियों को प्रभावित करने वाली एक आम फंगल बीमारी', 'Brown spots on leaves, yellowing', 'पत्तियों पर भूरे धब्बे, पीलापन', 'Apply fungicide spray, remove affected leaves', 'फंगीसाइड स्प्रे करें, प्रभावित पत्तियों को हटाएं', 'Proper spacing, avoid overhead watering', 'उचित दूरी, ऊपर से पानी देने से बचें', 'Rice', 'Medium', '/placeholder.svg?height=200&width=200'),
('Powdery Mildew', 'चूर्णिल आसिता', 'White powdery coating on plant surfaces', 'पौधे की सतह पर सफेद चूर्णी परत', 'White powdery spots, stunted growth', 'सफेद चूर्णी धब्बे, बौनी वृद्धि', 'Sulfur-based fungicide, neem oil', 'सल्फर आधारित फंगीसाइड, नीम का तेल', 'Good air circulation, avoid overcrowding', 'अच्छा हवा संचार, भीड़भाड़ से बचें', 'Wheat', 'Low', '/placeholder.svg?height=200&width=200'),
('Bacterial Wilt', 'जीवाणु म्लानि', 'Bacterial infection causing plant wilting', 'पौधे के मुरझाने का कारण बनने वाला जीवाणु संक्रमण', 'Sudden wilting, yellowing leaves', 'अचानक मुरझाना, पत्तियों का पीला होना', 'Remove infected plants, copper spray', 'संक्रमित पौधों को हटाएं, कॉपर स्प्रे', 'Crop rotation, clean tools', 'फसल चक्र, साफ उपकरण', 'Tomato', 'High', '/placeholder.svg?height=200&width=200');
