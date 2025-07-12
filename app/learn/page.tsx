"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Search, BookOpen, Camera, Leaf } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"
import { t } from "@/lib/i18n"

interface Disease {
  id: number
  name_en: string
  name_hi: string
  description_en: string
  description_hi: string
  symptoms_en: string
  symptoms_hi: string
  treatment_en: string
  treatment_hi: string
  prevention_en: string
  prevention_hi: string
  crop_type: string
  severity_level: string
  image_url: string
}

export default function LearnPage() {
  const { language } = useLanguage()
  const [diseases, setDiseases] = useState<Disease[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDiseases()
  }, [])

  const fetchDiseases = async () => {
    try {
      const response = await fetch("/api/diseases")
      if (response.ok) {
        const data = await response.json()
        setDiseases(data)
      }
    } catch (error) {
      console.error("Failed to fetch diseases:", error)
    } finally {
      setLoading(false)
    }
  }

  const filteredDiseases = diseases.filter((disease) => {
    const name = language === "en" ? disease.name_en : disease.name_hi
    const cropType = disease.crop_type
    return (
      name.toLowerCase().includes(searchTerm.toLowerCase()) || cropType.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "Low":
        return "bg-green-100 text-green-800"
      case "Medium":
        return "bg-yellow-100 text-yellow-800"
      case "High":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const organicMethods = [
    {
      title: language === "en" ? "Neem Oil Treatment" : "नीम तेल उपचार",
      description:
        language === "en"
          ? "Natural fungicide and insecticide effective against many plant diseases"
          : "कई पौधों की बीमारियों के खिलाफ प्रभावी प्राकृतिक कवकनाशी और कीटनाशक",
      usage:
        language === "en"
          ? "Mix 2-3 tablespoons per liter of water and spray on affected areas"
          : "प्रति लीटर पानी में 2-3 चम्मच मिलाएं और प्रभावित क्षेत्रों पर छिड़काव करें",
    },
    {
      title: language === "en" ? "Copper Sulfate Solution" : "कॉपर सल्फेट समाधान",
      description:
        language === "en"
          ? "Effective against bacterial and fungal infections"
          : "बैक्टीरियल और फंगल संक्रमण के खिलाफ प्रभावी",
      usage:
        language === "en"
          ? "Use 1-2 grams per liter of water, spray during cool hours"
          : "प्रति लीटर पानी में 1-2 ग्राम का उपयोग करें, ठंडे घंटों में छिड़काव करें",
    },
    {
      title: language === "en" ? "Baking Soda Spray" : "बेकिंग सोडा स्प्रे",
      description:
        language === "en"
          ? "Helps control powdery mildew and other fungal diseases"
          : "चूर्णिल आसिता और अन्य फंगल रोगों को नियंत्रित करने में मदद करता है",
      usage:
        language === "en"
          ? "Mix 1 teaspoon per liter of water with a few drops of liquid soap"
          : "प्रति लीटर पानी में 1 चम्मच तरल साबुन की कुछ बूंदों के साथ मिलाएं",
    },
  ]

  const photographyTips = [
    {
      title: language === "en" ? "Good Lighting" : "अच्छी रोशनी",
      tip:
        language === "en"
          ? "Take photos in natural daylight, avoid harsh shadows"
          : "प्राकृतिक दिन के उजाले में फोटो लें, कड़ी छाया से बचें",
    },
    {
      title: language === "en" ? "Close-up Shots" : "क्लोज़-अप शॉट्स",
      tip:
        language === "en"
          ? "Get close to show disease symptoms clearly"
          : "रोग के लक्षणों को स्पष्ट रूप से दिखाने के लिए पास जाएं",
    },
    {
      title: language === "en" ? "Multiple Angles" : "कई कोण",
      tip:
        language === "en"
          ? "Take photos from different angles for better diagnosis"
          : "बेहतर निदान के लिए विभिन्न कोणों से फोटो लें",
    },
    {
      title: language === "en" ? "Clean Background" : "साफ पृष्ठभूमि",
      tip:
        language === "en"
          ? "Use a plain background to highlight the affected area"
          : "प्रभावित क्षेत्र को उजागर करने के लिए सादी पृष्ठभूमि का उपयोग करें",
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {language === "en" ? "Learn About Crop Diseases" : "फसल रोगों के बारे में जानें"}
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {language === "en"
              ? "Comprehensive guide to crop diseases, organic treatments, and photography tips"
              : "फसल रोगों, जैविक उपचार और फोटोग्राफी टिप्स के लिए व्यापक गाइड"}
          </p>
        </div>

        <Tabs defaultValue="diseases" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="diseases" className="flex items-center space-x-2">
              <BookOpen className="h-4 w-4" />
              <span>{t("diseaseLibrary", language)}</span>
            </TabsTrigger>
            <TabsTrigger value="organic" className="flex items-center space-x-2">
              <Leaf className="h-4 w-4" />
              <span>{t("organicMethods", language)}</span>
            </TabsTrigger>
            <TabsTrigger value="photography" className="flex items-center space-x-2">
              <Camera className="h-4 w-4" />
              <span>{t("photographyTips", language)}</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="diseases" className="mt-6">
            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder={language === "en" ? "Search diseases or crops..." : "रोग या फसल खोजें..."}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {loading ? (
              <div className="text-center py-8">
                <p className="text-gray-500">{t("loading", language)}</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredDiseases.map((disease) => (
                  <Card key={disease.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">
                          {language === "en" ? disease.name_en : disease.name_hi}
                        </CardTitle>
                        <Badge className={getSeverityColor(disease.severity_level)}>{disease.severity_level}</Badge>
                      </div>
                      <p className="text-sm text-gray-600">{disease.crop_type}</p>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <img
                        src={disease.image_url || "/placeholder.svg"}
                        alt={language === "en" ? disease.name_en : disease.name_hi}
                        className="w-full h-32 object-cover rounded-lg"
                      />

                      <div>
                        <h4 className="font-semibold text-sm text-gray-900 mb-1">
                          {language === "en" ? "Description" : "विवरण"}
                        </h4>
                        <p className="text-sm text-gray-600">
                          {language === "en" ? disease.description_en : disease.description_hi}
                        </p>
                      </div>

                      <div>
                        <h4 className="font-semibold text-sm text-gray-900 mb-1">
                          {language === "en" ? "Symptoms" : "लक्षण"}
                        </h4>
                        <p className="text-sm text-gray-600">
                          {language === "en" ? disease.symptoms_en : disease.symptoms_hi}
                        </p>
                      </div>

                      <div>
                        <h4 className="font-semibold text-sm text-gray-900 mb-1">{t("treatment", language)}</h4>
                        <p className="text-sm text-gray-600">
                          {language === "en" ? disease.treatment_en : disease.treatment_hi}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="organic" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {organicMethods.map((method, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="text-lg">{method.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-gray-600">{method.description}</p>
                    <div>
                      <h4 className="font-semibold text-sm text-gray-900 mb-2">
                        {language === "en" ? "Usage" : "उपयोग"}
                      </h4>
                      <p className="text-sm text-gray-600">{method.usage}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="photography" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {photographyTips.map((tip, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center space-x-2">
                      <Camera className="h-5 w-5 text-green-600" />
                      <span>{tip.title}</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600">{tip.tip}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
