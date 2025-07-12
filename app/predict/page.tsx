"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { ImageUpload } from "@/components/image-upload"
import { ResultCard } from "@/components/result-card"
import { Loader2, Brain, Sparkles, Zap } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { useLanguage } from "@/contexts/language-context"
import { useToast } from "@/hooks/use-toast"
import { t } from "@/lib/i18n"

interface PredictionResult {
  disease: string
  confidence: number
  severity: "Low" | "Medium" | "High"
  symptoms: string
  treatment: string
  prevention: string
  isHealthy: boolean
}

export default function PredictPage() {
  const { user } = useAuth()
  const { language } = useLanguage()
  const { toast } = useToast()
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [plantPart, setPlantPart] = useState<string>("")
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [result, setResult] = useState<PredictionResult | null>(null)

  const plantParts = [
    { value: "leaves", label: t("leaves", language), icon: "🍃" },
    { value: "stem", label: t("stem", language), icon: "🌱" },
    { value: "fruit", label: t("fruit", language), icon: "🍎" },
    { value: "root", label: t("root", language), icon: "🌿" },
  ]

  const handleImageSelect = (file: File) => {
    setSelectedImage(file)
    setResult(null)
  }

  const handleRemoveImage = () => {
    setSelectedImage(null)
    setResult(null)
  }

  const handleAnalyze = async () => {
    if (!selectedImage || !plantPart) {
      toast({
        title: language === "en" ? "Missing Information" : "जानकारी गुम",
        description:
          language === "en"
            ? "Please select an image and plant part before analyzing"
            : "विश्लेषण से पहले कृपया एक छवि और पौधे का हिस्सा चुनें",
        variant: "destructive",
      })
      return
    }

    setIsAnalyzing(true)

    try {
      // Simulate API call with mock data
      await new Promise((resolve) => setTimeout(resolve, 3000))

      const mockResult: PredictionResult = {
        disease: language === "en" ? "Leaf Blight" : "पत्ती झुलसा",
        confidence: 94,
        severity: "Medium",
        symptoms:
          language === "en"
            ? "Brown spots on leaves with yellow halos, progressive yellowing from leaf edges"
            : "पत्तियों पर पीले हेलो के साथ भूरे धब्बे, पत्ती के किनारों से प्रगतिशील पीलापन",
        treatment:
          language === "en"
            ? "Apply copper-based fungicide spray every 7-10 days. Remove affected leaves and improve air circulation around plants."
            : "हर 7-10 दिन में कॉपर आधारित फंगीसाइड स्प्रे करें। प्रभावित पत्तियों को हटाएं और पौधों के चारों ओर हवा संचार में सुधार करें।",
        prevention:
          language === "en"
            ? "Ensure proper plant spacing, avoid overhead watering, and maintain good field hygiene. Use disease-resistant varieties when available."
            : "उचित पौधे की दूरी सुनिश्चित करें, ऊपर से पानी देने से बचें, और अच्छी खेत स्वच्छता बनाए रखें। उपलब्ध होने पर रोग प्रतिरोधी किस्मों का उपयोग करें।",
        isHealthy: false,
      }

      setResult(mockResult)
      toast({
        title: language === "en" ? "Analysis Complete" : "विश्लेषण पूर्ण",
        description: language === "en" ? "Disease detection completed successfully" : "रोग पहचान सफलतापूर्वक पूर्ण",
      })
    } catch (error) {
      console.error("Analysis error:", error)
      toast({
        title: language === "en" ? "Analysis Failed" : "विश्लेषण असफल",
        description:
          language === "en"
            ? "Please try again or contact support if the problem persists"
            : "कृपया पुनः प्रयास करें या समस्या बनी रहने पर सहायता से संपर्क करें",
        variant: "destructive",
      })
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleRetry = () => {
    setResult(null)
    setSelectedImage(null)
    setPlantPart("")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-surface/30 to-background py-12">
      <div className="container max-w-5xl">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in-up">
          <Badge variant="outline" className="mb-4">
            <Brain className="mr-2 h-4 w-4" />
            {language === "en" ? "AI-Powered Detection" : "AI-संचालित पहचान"}
          </Badge>
          <h1 className="font-display text-4xl font-bold sm:text-5xl lg:text-6xl mb-6">
            <span className="gradient-text">{language === "en" ? "Crop Disease" : "फसल रोग"}</span>
            <br />
            <span className="text-foreground">{language === "en" ? "Detection" : "पहचान"}</span>
          </h1>
          <p className="mx-auto max-w-2xl text-xl text-muted-foreground leading-relaxed">
            {language === "en"
              ? "Upload an image of your plant to get instant AI-powered disease diagnosis and personalized treatment recommendations"
              : "तत्काल AI-संचालित रोग निदान और व्यक्तिगत उपचार सिफारिशें प्राप्त करने के लिए अपने पौधे की एक छवि अपलोड करें"}
          </p>
        </div>

        {result ? (
          <div className="animate-fade-in-scale">
            <ResultCard result={result} onRetry={handleRetry} />
          </div>
        ) : (
          <Card className="shadow-2xl border-0 bg-gradient-to-br from-card to-surface/50 animate-fade-in-up">
            <CardHeader className="text-center pb-6">
              <CardTitle className="flex items-center justify-center space-x-3">
                <div className="bg-gradient-to-br from-primary/20 to-primary/10 p-3 rounded-xl">
                  <Sparkles className="h-6 w-6 text-primary" />
                </div>
                <span className="font-display text-2xl">{t("uploadImage", language)}</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-8 p-8">
              <ImageUpload
                onImageSelect={handleImageSelect}
                selectedImage={selectedImage}
                onRemoveImage={handleRemoveImage}
                disabled={isAnalyzing}
              />

              <div className="space-y-3">
                <label className="block text-sm font-medium text-foreground">{t("selectPlantPart", language)}</label>
                <Select value={plantPart} onValueChange={setPlantPart} disabled={isAnalyzing}>
                  <SelectTrigger className="h-12 text-base">
                    <SelectValue
                      placeholder={language === "en" ? "Choose the affected plant part" : "प्रभावित पौधे का हिस्सा चुनें"}
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {plantParts.map((part) => (
                      <SelectItem key={part.value} value={part.value} className="text-base">
                        <div className="flex items-center space-x-3">
                          <span className="text-lg">{part.icon}</span>
                          <span>{part.label}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button
                onClick={handleAnalyze}
                disabled={!selectedImage || !plantPart || isAnalyzing}
                className="w-full h-14 text-lg btn-hover-lift bg-gradient-to-r from-gradient-from to-gradient-to"
                size="lg"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="h-5 w-5 mr-3 animate-spin" />
                    {t("analyzing", language)}
                  </>
                ) : (
                  <>
                    <Zap className="h-5 w-5 mr-3" />
                    {t("analyze", language)}
                  </>
                )}
              </Button>

              {!user && (
                <div className="text-center p-6 bg-primary/5 border border-primary/10 rounded-xl">
                  <p className="text-sm text-muted-foreground">
                    <strong>{t("signup", language)}</strong>{" "}
                    {language === "en"
                      ? "to save your scan history, get personalized recommendations, and access advanced features"
                      : "अपने स्कैन इतिहास को सहेजने, व्यक्तिगत सिफारिशें प्राप्त करने और उन्नत सुविधाओं तक पहुंचने के लिए"}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
