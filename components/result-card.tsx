"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Volume2, AlertTriangle, CheckCircle, Info, Sparkles, TrendingUp, Shield } from "lucide-react"

interface PredictionResult {
  disease: string
  confidence: number
  severity: "Low" | "Medium" | "High"
  symptoms: string
  treatment: string
  prevention: string
  isHealthy: boolean
}

interface ResultCardProps {
  result: PredictionResult
  onRetry: () => void
}

export function ResultCard({ result, onRetry }: ResultCardProps) {
  const [isSpeaking, setIsSpeaking] = useState(false)

  const speakResult = () => {
    if ("speechSynthesis" in window) {
      setIsSpeaking(true)
      const utterance = new SpeechSynthesisUtterance()

      const text = `Disease detected: ${result.disease}. Confidence: ${result.confidence}%. Treatment: ${result.treatment}`

      utterance.text = text
      utterance.lang = "en-US"
      utterance.onend = () => setIsSpeaking(false)

      speechSynthesis.speak(utterance)
    }
  }

  const getSeverityConfig = (severity: string) => {
    switch (severity) {
      case "Low":
        return {
          color: "bg-success/10 text-success border-success/20",
          icon: CheckCircle,
          gradient: "from-green-500/20 to-emerald-500/20",
        }
      case "Medium":
        return {
          color: "bg-warning/10 text-warning border-warning/20",
          icon: Info,
          gradient: "from-yellow-500/20 to-orange-500/20",
        }
      case "High":
        return {
          color: "bg-destructive/10 text-destructive border-destructive/20",
          icon: AlertTriangle,
          gradient: "from-red-500/20 to-pink-500/20",
        }
      default:
        return {
          color: "bg-muted text-muted-foreground border-border",
          icon: Info,
          gradient: "from-gray-500/20 to-slate-500/20",
        }
    }
  }

  const severityConfig = getSeverityConfig(result.severity)
  const SeverityIcon = severityConfig.icon

  return (
    <Card className="w-full max-w-3xl mx-auto animate-fade-in-scale shadow-2xl border-0 bg-gradient-to-br from-card to-surface/50">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-3">
            <div className={`p-2 rounded-xl bg-gradient-to-br ${severityConfig.gradient}`}>
              {result.isHealthy ? (
                <CheckCircle className="h-6 w-6 text-success" />
              ) : (
                <SeverityIcon className="h-6 w-6 text-destructive" />
              )}
            </div>
            <div>
              <span className="font-display text-2xl">Analysis Result</span>
              <div className="flex items-center mt-1">
                <Sparkles className="h-4 w-4 text-primary mr-1" />
                <span className="text-sm text-muted-foreground font-normal">AI-Powered Diagnosis</span>
              </div>
            </div>
          </CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={speakResult}
            disabled={isSpeaking}
            className="btn-hover-lift bg-transparent"
          >
            <Volume2 className="h-4 w-4 mr-2" />
            {isSpeaking ? "Speaking..." : "Listen"}
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Disease Header */}
        <div className="flex items-center justify-between p-6 bg-gradient-to-r from-surface to-surface/50 rounded-xl">
          <div>
            <h3 className="font-display text-2xl font-bold text-foreground mb-2">{result.disease}</h3>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-4 w-4 text-primary" />
                <span className="text-sm text-muted-foreground">Confidence:</span>
                <span className="font-semibold text-primary">{result.confidence}%</span>
              </div>
              <Badge className={`${severityConfig.color} border`}>
                <SeverityIcon className="h-3 w-3 mr-1" />
                {result.severity} Risk
              </Badge>
            </div>
          </div>
          <div className="text-right">
            <div className="text-3xl font-display font-bold text-primary">{result.confidence}%</div>
            <div className="text-xs text-muted-foreground">Accuracy</div>
          </div>
        </div>

        <Separator />

        {/* Content Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Symptoms */}
          {result.symptoms && (
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-warning rounded-full"></div>
                <h4 className="font-display font-semibold text-foreground">Symptoms Identified</h4>
              </div>
              <p className="text-muted-foreground leading-relaxed pl-4 border-l-2 border-warning/20">
                {result.symptoms}
              </p>
            </div>
          )}

          {/* Treatment */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-success rounded-full"></div>
              <h4 className="font-display font-semibold text-foreground">Recommended Treatment</h4>
            </div>
            <p className="text-muted-foreground leading-relaxed pl-4 border-l-2 border-success/20">
              {result.treatment}
            </p>
          </div>
        </div>

        {/* Prevention */}
        {result.prevention && (
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Shield className="h-4 w-4 text-primary" />
              <h4 className="font-display font-semibold text-foreground">Prevention Tips</h4>
            </div>
            <div className="bg-primary/5 border border-primary/10 rounded-xl p-4">
              <p className="text-muted-foreground leading-relaxed">{result.prevention}</p>
            </div>
          </div>
        )}

        <Separator />

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
          <Button onClick={onRetry} variant="outline" className="btn-hover-lift bg-transparent">
            Analyze Another Image
          </Button>
          <Button variant="default" className="btn-hover-lift bg-gradient-to-r from-gradient-from to-gradient-to">
            Save Results
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
