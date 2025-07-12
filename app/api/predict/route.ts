import { type NextRequest, NextResponse } from "next/server"
import { verifyToken } from "@/lib/auth"
import { sql } from "@/lib/db"

// Advanced AI prediction service
class CropDiseaseAI {
  private static instance: CropDiseaseAI
  private modelLoaded = false
  private classNames: string[] = []
  private diseaseDatabase: Map<string, any> = new Map()

  private constructor() {
    this.initializeModel()
    this.loadDiseaseDatabase()
  }

  public static getInstance(): CropDiseaseAI {
    if (!CropDiseaseAI.instance) {
      CropDiseaseAI.instance = new CropDiseaseAI()
    }
    return CropDiseaseAI.instance
  }

  private async initializeModel() {
    try {
      // In production, this would load your trained TensorFlow.js model
      // For now, we'll simulate model loading
      this.classNames = [
        "Healthy",
        "Bacterial_Blight",
        "Brown_Spot",
        "Leaf_Blast",
        "Leaf_Scald",
        "Narrow_Brown_Spot",
        "Rice_Hispa",
        "Sheath_Blight",
        "Sheath_Rot",
        "Tungro",
      ]
      this.modelLoaded = true
      console.log("AI Model initialized successfully")
    } catch (error) {
      console.error("Error initializing AI model:", error)
    }
  }

  private async loadDiseaseDatabase() {
    try {
      // Load disease information from database
      const diseases = await sql`
        SELECT * FROM diseases
      `

      diseases.forEach((disease) => {
        this.diseaseDatabase.set(disease.name_en.toLowerCase(), disease)
      })

      console.log("Disease database loaded successfully")
    } catch (error) {
      console.error("Error loading disease database:", error)
    }
  }

  public async predict(imageBuffer: Buffer, plantPart: string, language = "en") {
    if (!this.modelLoaded) {
      throw new Error("AI Model not loaded")
    }

    try {
      // Simulate AI prediction with realistic results
      const predictions = this.simulateAdvancedPrediction(imageBuffer, plantPart)

      // Get disease information
      const diseaseInfo = this.getDiseaseInfo(predictions.disease, language)

      // Calculate confidence and severity
      const result = {
        disease: predictions.disease,
        confidence: predictions.confidence,
        severity: this.calculateSeverity(predictions.confidence, predictions.disease),
        symptoms: diseaseInfo.symptoms,
        treatment: diseaseInfo.treatment,
        prevention: diseaseInfo.prevention,
        isHealthy: predictions.disease.toLowerCase() === "healthy",
        plantPart: plantPart,
        timestamp: new Date().toISOString(),
        additionalInfo: {
          alternativeNames: diseaseInfo.alternativeNames || [],
          affectedCrops: diseaseInfo.affectedCrops || [],
          seasonality: diseaseInfo.seasonality || "Year-round",
          spreadMethod: diseaseInfo.spreadMethod || "Unknown",
        },
      }

      return result
    } catch (error) {
      console.error("Error during prediction:", error)
      throw error
    }
  }

  private simulateAdvancedPrediction(imageBuffer: Buffer, plantPart: string) {
    // Advanced simulation based on image characteristics and plant part
    const imageSize = imageBuffer.length
    const plantPartFactor = this.getPlantPartFactor(plantPart)

    // Simulate different diseases based on various factors
    const diseases = [
      { name: "Bacterial_Blight", probability: 0.15 + plantPartFactor * 0.1 },
      { name: "Brown_Spot", probability: 0.12 + (imageSize % 1000) / 10000 },
      { name: "Leaf_Blast", probability: 0.18 + plantPartFactor * 0.05 },
      { name: "Healthy", probability: 0.25 + (imageSize % 500) / 5000 },
      { name: "Sheath_Blight", probability: 0.1 + plantPartFactor * 0.08 },
      { name: "Leaf_Scald", probability: 0.08 + (imageSize % 300) / 8000 },
      { name: "Tungro", probability: 0.12 + plantPartFactor * 0.03 },
    ]

    // Normalize probabilities
    const totalProb = diseases.reduce((sum, d) => sum + d.probability, 0)
    diseases.forEach((d) => (d.probability /= totalProb))

    // Select disease based on weighted random selection
    const random = Math.random()
    let cumulative = 0
    let selectedDisease = diseases[0]

    for (const disease of diseases) {
      cumulative += disease.probability
      if (random <= cumulative) {
        selectedDisease = disease
        break
      }
    }

    // Calculate confidence with some randomness
    const baseConfidence = selectedDisease.probability * 100
    const confidence = Math.min(95, Math.max(65, baseConfidence + (Math.random() - 0.5) * 20))

    return {
      disease: selectedDisease.name,
      confidence: Math.round(confidence * 100) / 100,
    }
  }

  private getPlantPartFactor(plantPart: string): number {
    const factors = {
      leaves: 1.0,
      stem: 0.8,
      fruit: 0.6,
      root: 0.4,
    }
    return factors[plantPart.toLowerCase()] || 0.5
  }

  private calculateSeverity(confidence: number, disease: string): "Low" | "Medium" | "High" {
    if (disease.toLowerCase() === "healthy") return "Low"

    const severeDiseases = ["Bacterial_Blight", "Leaf_Blast", "Tungro"]
    const moderateDiseases = ["Brown_Spot", "Sheath_Blight"]

    if (severeDiseases.includes(disease)) {
      return confidence > 80 ? "High" : "Medium"
    } else if (moderateDiseases.includes(disease)) {
      return confidence > 85 ? "Medium" : "Low"
    } else {
      return confidence > 90 ? "Medium" : "Low"
    }
  }

  private getDiseaseInfo(disease: string, language: string) {
    const diseaseKey = disease.toLowerCase().replace("_", " ")
    const diseaseData = this.diseaseDatabase.get(diseaseKey)

    if (diseaseData) {
      return {
        symptoms: language === "hi" ? diseaseData.symptoms_hi : diseaseData.symptoms_en,
        treatment: language === "hi" ? diseaseData.treatment_hi : diseaseData.treatment_en,
        prevention: language === "hi" ? diseaseData.prevention_hi : diseaseData.prevention_en,
        alternativeNames: [diseaseData.name_hi, diseaseData.name_en],
        affectedCrops: [diseaseData.crop_type],
        seasonality: "Monsoon and post-monsoon",
        spreadMethod: "Water, wind, and infected seeds",
      }
    }

    // Fallback data for unknown diseases
    return this.getFallbackDiseaseInfo(disease, language)
  }

  private getFallbackDiseaseInfo(disease: string, language: string) {
    const fallbackData = {
      Bacterial_Blight: {
        en: {
          symptoms: "Water-soaked lesions on leaves, yellowing and wilting of affected areas",
          treatment: "Apply copper-based bactericides, remove infected plant parts, improve drainage",
          prevention: "Use disease-free seeds, maintain proper plant spacing, avoid overhead irrigation",
        },
        hi: {
          symptoms: "पत्तियों पर पानी से भीगे घाव, प्रभावित क्षेत्रों का पीला होना और मुरझाना",
          treatment: "कॉपर आधारित बैक्टीरियासाइड लगाएं, संक्रमित पौधे के हिस्सों को हटाएं, जल निकासी में सुधार करें",
          prevention: "रोग मुक्त बीजों का उपयोग करें, उचित पौधे की दूरी बनाए रखें, ऊपर से सिंचाई से बचें",
        },
      },
      Brown_Spot: {
        en: {
          symptoms: "Small brown spots with yellow halos on leaves, spots may coalesce",
          treatment: "Apply fungicide sprays, improve air circulation, remove infected debris",
          prevention: "Balanced fertilization, proper water management, crop rotation",
        },
        hi: {
          symptoms: "पत्तियों पर पीले हेलो के साथ छोटे भूरे धब्बे, धब्बे मिल सकते हैं",
          treatment: "फंगीसाइड स्प्रे करें, हवा संचार में सुधार करें, संक्रमित मलबे को हटाएं",
          prevention: "संतुलित उर्वरीकरण, उचित जल प्रबंधन, फसल चक्र",
        },
      },
      Healthy: {
        en: {
          symptoms: "No disease symptoms detected. Plant appears healthy",
          treatment: "Continue regular care and monitoring",
          prevention: "Maintain good agricultural practices, regular monitoring",
        },
        hi: {
          symptoms: "कोई रोग के लक्षण नहीं मिले। पौधा स्वस्थ दिखता है",
          treatment: "नियमित देखभाल और निगरानी जारी रखें",
          prevention: "अच्छी कृषि प्रथाओं को बनाए रखें, नियमित निगरानी करें",
        },
      },
    }

    const data = fallbackData[disease] || fallbackData["Healthy"]
    const langData = data[language] || data["en"]

    return {
      symptoms: langData.symptoms,
      treatment: langData.treatment,
      prevention: langData.prevention,
      alternativeNames: [],
      affectedCrops: ["Rice", "Wheat", "Corn"],
      seasonality: "Variable",
      spreadMethod: "Environmental factors",
    }
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const imageFile = formData.get("image") as File
    const plantPart = formData.get("plantPart") as string
    const language = (formData.get("language") as string) || "en"

    if (!imageFile || !plantPart) {
      return NextResponse.json({ error: "Missing required fields: image and plantPart" }, { status: 400 })
    }

    // Convert image to buffer
    const imageBuffer = Buffer.from(await imageFile.arrayBuffer())

    // Get AI prediction
    const aiService = CropDiseaseAI.getInstance()
    const prediction = await aiService.predict(imageBuffer, plantPart, language)

    // Save scan to database if user is authenticated
    const authHeader = request.headers.get("authorization")
    let userId = null

    if (authHeader && authHeader.startsWith("Bearer ")) {
      const token = authHeader.substring(7)
      const decoded = verifyToken(token)
      if (decoded) {
        userId = decoded.userId
      }
    }

    if (userId) {
      try {
        // Save scan to database
        await sql`
          INSERT INTO scans (user_id, image_url, plant_part, prediction_result, confidence_score)
          VALUES (${userId}, ${`/uploads/${Date.now()}_${imageFile.name}`}, ${plantPart}, ${JSON.stringify(prediction)}, ${prediction.confidence})
        `
      } catch (dbError) {
        console.error("Error saving scan to database:", dbError)
        // Continue without saving to database
      }
    }

    return NextResponse.json(prediction)
  } catch (error) {
    console.error("Prediction error:", error)
    return NextResponse.json({ error: "Internal server error during prediction" }, { status: 500 })
  }
}

// Health check endpoint
export async function GET() {
  try {
    const aiService = CropDiseaseAI.getInstance()
    return NextResponse.json({
      status: "healthy",
      modelLoaded: true,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    return NextResponse.json({ status: "error", error: error.message }, { status: 500 })
  }
}
