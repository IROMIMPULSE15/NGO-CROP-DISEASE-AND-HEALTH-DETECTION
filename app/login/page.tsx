"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, Eye, EyeOff, Leaf, Sparkles } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"
import { useAuth } from "@/contexts/auth-context"
import { t } from "@/lib/i18n"
import { useToast } from "@/hooks/use-toast"

export default function LoginPage() {
  const { language } = useLanguage()
  const { login } = useAuth()
  const { toast } = useToast()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const success = await login(formData.email, formData.password)
      if (success) {
        toast({
          title: t("success", language),
          description: language === "en" ? "Login successful" : "लॉगिन सफल",
        })
        // Redirect to predict page after successful login
        router.push("/predict")
      } else {
        toast({
          title: t("error", language),
          description: language === "en" ? "Invalid credentials" : "गलत प्रमाण पत्र",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: t("error", language),
        description: language === "en" ? "Login failed" : "लॉगिन असफल",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-surface/30 to-background flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-noise relative">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5" />
      <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-primary/20 to-gradient-to/20 rounded-full blur-3xl animate-float" />
      <div
        className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-r from-gradient-to/20 to-primary/20 rounded-full blur-3xl animate-float"
        style={{ animationDelay: "3s" }}
      />

      <div className="w-full max-w-md relative z-10">
        {/* Logo */}
        <div className="text-center mb-8 animate-fade-in-up">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="relative">
              <div className="bg-gradient-to-br from-gradient-from to-gradient-to p-3 rounded-2xl shadow-glow">
                <Leaf className="h-8 w-8 text-white" />
              </div>
              <div className="absolute -top-1 -right-1">
                <Sparkles className="h-4 w-4 text-gradient-from animate-pulse" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="font-display font-bold text-2xl gradient-text-animated">CropCare AI</span>
              <span className="text-sm text-muted-foreground font-medium tracking-wide">Smart Agriculture</span>
            </div>
          </div>
        </div>

        <Card className="glass-card border-0 shadow-2xl animate-fade-in-scale">
          <CardHeader className="text-center pb-6">
            <CardTitle className="text-3xl font-display font-bold mb-2">{t("signInAccount", language)}</CardTitle>
            <p className="text-muted-foreground">
              {language === "en"
                ? "Welcome back! Sign in to access your crop analysis dashboard"
                : "वापस स्वागत है! अपने फसल विश्लेषण डैशबोर्ड तक पहुंचने के लिए साइन इन करें"}
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">
                  {t("email", language)}
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  disabled={isLoading}
                  className="h-12 focus-ring glass"
                  placeholder={language === "en" ? "Enter your email" : "अपना ईमेल दर्ज करें"}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium">
                  {t("password", language)}
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    required
                    value={formData.password}
                    onChange={handleChange}
                    disabled={isLoading}
                    className="h-12 pr-12 focus-ring glass"
                    placeholder={language === "en" ? "Enter your password" : "अपना पासवर्ड दर्ज करें"}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-12 px-3 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isLoading}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full h-12 btn-hover-lift bg-gradient-to-r from-gradient-from to-gradient-to shadow-glow"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                    {t("loading", language)}
                  </>
                ) : (
                  t("login", language)
                )}
              </Button>
            </form>

            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                {t("dontHaveAccount", language)}{" "}
                <Link
                  href="/signup"
                  className="font-medium text-primary hover:text-primary/80 transition-colors hover:underline"
                >
                  {t("signup", language)}
                </Link>
              </p>
            </div>

            {/* Quick Demo Access */}
            <div className="pt-6 border-t border-border/50">
              <div className="text-center">
                <p className="text-xs text-muted-foreground mb-3">
                  {language === "en" ? "Want to try without signing up?" : "साइन अप किए बिना आज़माना चाहते हैं?"}
                </p>
                <Button variant="outline" asChild className="w-full glass bg-transparent">
                  <Link href="/predict">{language === "en" ? "Try Demo" : "डेमो आज़माएं"}</Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
