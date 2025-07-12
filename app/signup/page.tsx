"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, Eye, EyeOff, Check, X, Leaf, Sparkles } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"
import { useAuth } from "@/contexts/auth-context"
import { t } from "@/lib/i18n"
import { useToast } from "@/hooks/use-toast"

export default function SignupPage() {
  const { language } = useLanguage()
  const { signup } = useAuth()
  const { toast } = useToast()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
  })

  const [passwordStrength, setPasswordStrength] = useState({
    hasLength: false,
    hasUpper: false,
    hasLower: false,
    hasNumber: false,
    hasSpecial: false,
  })

  const checkPasswordStrength = (password: string) => {
    setPasswordStrength({
      hasLength: password.length >= 8,
      hasUpper: /[A-Z]/.test(password),
      hasLower: /[a-z]/.test(password),
      hasNumber: /\d/.test(password),
      hasSpecial: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (formData.password !== formData.confirmPassword) {
      toast({
        title: t("error", language),
        description: language === "en" ? "Passwords do not match" : "पासवर्ड मेल नहीं खाते",
        variant: "destructive",
      })
      return
    }

    const isPasswordStrong = Object.values(passwordStrength).every(Boolean)
    if (!isPasswordStrong) {
      toast({
        title: t("error", language),
        description: language === "en" ? "Please meet all password requirements" : "कृपया सभी पासवर्ड आवश्यकताओं को पूरा करें",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      const success = await signup(formData.name, formData.email, formData.password, formData.phone)
      if (success) {
        toast({
          title: t("success", language),
          description: language === "en" ? "Account created successfully" : "खाता सफलतापूर्वक बनाया गया",
        })
        // Redirect to predict page after successful signup
        router.push("/predict")
      } else {
        toast({
          title: t("error", language),
          description: language === "en" ? "Account creation failed" : "खाता निर्माण असफल",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: t("error", language),
        description: language === "en" ? "Signup failed" : "साइनअप असफल",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))

    if (name === "password") {
      checkPasswordStrength(value)
    }
  }

  const PasswordRequirement = ({ met, text }: { met: boolean; text: string }) => (
    <div
      className={`flex items-center space-x-2 text-sm transition-colors ${met ? "text-green-600" : "text-muted-foreground"}`}
    >
      <div className={`w-4 h-4 rounded-full flex items-center justify-center ${met ? "bg-green-100" : "bg-muted"}`}>
        {met ? <Check className="h-3 w-3 text-green-600" /> : <X className="h-3 w-3 text-muted-foreground" />}
      </div>
      <span>{text}</span>
    </div>
  )

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
            <CardTitle className="text-3xl font-display font-bold mb-2">{t("createAccount", language)}</CardTitle>
            <p className="text-muted-foreground">
              {language === "en"
                ? "Join thousands of farmers using AI for crop protection"
                : "फसल सुरक्षा के लिए AI का उपयोग करने वाले हजारों किसानों से जुड़ें"}
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium">
                  {t("name", language)}
                </Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  disabled={isLoading}
                  className="h-12 focus-ring glass"
                  placeholder={language === "en" ? "Enter your full name" : "अपना पूरा नाम दर्ज करें"}
                />
              </div>

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
                <Label htmlFor="phone" className="text-sm font-medium">
                  {t("phone", language)} {language === "en" ? "(Optional)" : "(वैकल्पिक)"}
                </Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  disabled={isLoading}
                  className="h-12 focus-ring glass"
                  placeholder={language === "en" ? "Enter your phone number" : "अपना फोन नंबर दर्ज करें"}
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
                    placeholder={language === "en" ? "Create a strong password" : "एक मजबूत पासवर्ड बनाएं"}
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

                {formData.password && (
                  <div className="mt-4 p-4 bg-surface/50 rounded-lg space-y-2">
                    <p className="text-sm font-medium text-foreground mb-3">
                      {language === "en" ? "Password Requirements:" : "पासवर्ड आवश्यकताएं:"}
                    </p>
                    <PasswordRequirement
                      met={passwordStrength.hasLength}
                      text={language === "en" ? "At least 8 characters" : "कम से कम 8 अक्षर"}
                    />
                    <PasswordRequirement
                      met={passwordStrength.hasUpper}
                      text={language === "en" ? "One uppercase letter" : "एक बड़ा अक्षर"}
                    />
                    <PasswordRequirement
                      met={passwordStrength.hasLower}
                      text={language === "en" ? "One lowercase letter" : "एक छोटा अक्षर"}
                    />
                    <PasswordRequirement
                      met={passwordStrength.hasNumber}
                      text={language === "en" ? "One number" : "एक संख्या"}
                    />
                    <PasswordRequirement
                      met={passwordStrength.hasSpecial}
                      text={language === "en" ? "One special character" : "एक विशेष अक्षर"}
                    />
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-sm font-medium">
                  {t("confirmPassword", language)}
                </Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    required
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    disabled={isLoading}
                    className="h-12 pr-12 focus-ring glass"
                    placeholder={language === "en" ? "Confirm your password" : "अपने पासवर्ड की पुष्टि करें"}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-12 px-3 hover:bg-transparent"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    disabled={isLoading}
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
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
                  t("signup", language)
                )}
              </Button>
            </form>

            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                {t("alreadyHaveAccount", language)}{" "}
                <Link
                  href="/login"
                  className="font-medium text-primary hover:text-primary/80 transition-colors hover:underline"
                >
                  {t("login", language)}
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
