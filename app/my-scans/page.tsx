"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, Eye, Trash2, Download } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"
import { useAuth } from "@/contexts/auth-context"
import { t } from "@/lib/i18n"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"

interface Scan {
  id: number
  image_url: string
  plant_part: string
  prediction_result: {
    disease: string
    confidence: number
    severity: string
    treatment: string
  }
  created_at: string
}

export default function MyScansPage() {
  const { language } = useLanguage()
  const { user } = useAuth()
  const { toast } = useToast()
  const router = useRouter()
  const [scans, setScans] = useState<Scan[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) {
      router.push("/login")
      return
    }
    fetchScans()
  }, [user, router])

  const fetchScans = async () => {
    try {
      const response = await fetch("/api/scans", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setScans(data)
      }
    } catch (error) {
      console.error("Failed to fetch scans:", error)
      toast({
        title: t("error", language),
        description: language === "en" ? "Failed to load scan history" : "स्कैन इतिहास लोड करने में असफल",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const deleteScan = async (scanId: number) => {
    try {
      const response = await fetch(`/api/scans/${scanId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })

      if (response.ok) {
        setScans(scans.filter((scan) => scan.id !== scanId))
        toast({
          title: t("success", language),
          description: language === "en" ? "Scan deleted successfully" : "स्कैन सफलतापूर्वक हटाया गया",
        })
      }
    } catch (error) {
      toast({
        title: t("error", language),
        description: language === "en" ? "Failed to delete scan" : "स्कैन हटाने में असफल",
        variant: "destructive",
      })
    }
  }

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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString(language === "en" ? "en-US" : "hi-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{t("myScans", language)}</h1>
          <p className="text-lg text-gray-600">
            {language === "en"
              ? "View and manage your crop disease scan history"
              : "अपने फसल रोग स्कैन इतिहास को देखें और प्रबंधित करें"}
          </p>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-500">{t("loading", language)}</p>
          </div>
        ) : scans.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">
              {language === "en"
                ? "No scans found. Start by analyzing your first crop image!"
                : "कोई स्कैन नहीं मिला। अपनी पहली फसल छवि का विश्लेषण करके शुरुआत करें!"}
            </p>
            <Button asChild>
              <a href="/predict">{language === "en" ? "Start Scanning" : "स्कैनिंग शुरू करें"}</a>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {scans.map((scan) => (
              <Card key={scan.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{scan.prediction_result.disease}</CardTitle>
                    <Badge className={getSeverityColor(scan.prediction_result.severity)}>
                      {scan.prediction_result.severity}
                    </Badge>
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <Calendar className="h-4 w-4 mr-1" />
                    {formatDate(scan.created_at)}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <img
                    src={scan.image_url || "/placeholder.svg"}
                    alt="Scanned crop"
                    className="w-full h-32 object-cover rounded-lg"
                  />

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">{language === "en" ? "Plant Part:" : "पौधे का हिस्सा:"}</span>
                      <span className="font-medium capitalize">{scan.plant_part}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">{t("confidence", language)}:</span>
                      <span className="font-medium text-green-600">{scan.prediction_result.confidence}%</span>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-sm text-gray-900 mb-1">{t("treatment", language)}:</h4>
                    <p className="text-xs text-gray-600 line-clamp-2">{scan.prediction_result.treatment}</p>
                  </div>

                  <div className="flex space-x-2 pt-2">
                    <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                      <Eye className="h-3 w-3 mr-1" />
                      {language === "en" ? "View" : "देखें"}
                    </Button>
                    <Button variant="outline" size="sm">
                      <Download className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => deleteScan(scan.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
