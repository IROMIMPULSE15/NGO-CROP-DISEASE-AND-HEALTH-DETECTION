"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Mail, Phone, MapPin, Send, Loader2 } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"
import { t } from "@/lib/i18n"
import { useToast } from "@/hooks/use-toast"

export default function ContactPage() {
  const { language } = useLanguage()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        toast({
          title: t("success", language),
          description:
            language === "en"
              ? "Message sent successfully! We'll get back to you soon."
              : "संदेश सफलतापूर्वक भेजा गया! हम जल्द ही आपसे संपर्क करेंगे।",
        })
        setFormData({ name: "", email: "", phone: "", message: "" })
      } else {
        throw new Error("Failed to send message")
      }
    } catch (error) {
      toast({
        title: t("error", language),
        description:
          language === "en" ? "Failed to send message. Please try again." : "संदेश भेजने में असफल। कृपया पुनः प्रयास करें।",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const contactInfo = [
    {
      icon: Mail,
      title: language === "en" ? "Email" : "ईमेल",
      value: "info@seerbharat.org",
      description: language === "en" ? "Send us an email anytime" : "हमें कभी भी ईमेल भेजें",
    },
    {
      icon: Phone,
      title: language === "en" ? "Phone" : "फोन",
      value: "+91 9511681037",
      description: language === "en" ? "Call us during business hours" : "व्यावसायिक घंटों के दौरान हमें कॉल करें",
    },
    {
      icon: MapPin,
      title: language === "en" ? "Address" : "पता",
      value: language === "en" ? "C-107,Armada, Parkhe Wasti, Wakad-Hinjewadi Road, Wakad, Pune - 411057" : "सी-107, आर्माडा, पर्खे वस्ती, वाकड-हिंजवडी रोड, वाकड, पुणे - 411057",
      description: language === "en" ? "Visit our office" : "हमारे कार्यालय में आएं",
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{t("contactUs", language)}</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {language === "en"
              ? "Have questions or need support? We're here to help you succeed with your crops."
              : "कोई प्रश्न है या सहायता चाहिए? हम आपकी फसलों के साथ सफल होने में आपकी मदद के लिए यहाँ हैं।"}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Send className="h-5 w-5 text-green-600" />
                <span>{language === "en" ? "Send us a message" : "हमें संदेश भेजें"}</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="name">{t("name", language)}</Label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    disabled={isLoading}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="email">{t("email", language)}</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    disabled={isLoading}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="phone">{t("phone", language)} (Optional)</Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    disabled={isLoading}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="message">{t("message", language)}</Label>
                  <Textarea
                    id="message"
                    name="message"
                    required
                    rows={5}
                    value={formData.message}
                    onChange={handleChange}
                    disabled={isLoading}
                    className="mt-1"
                    placeholder={
                      language === "en" ? "Tell us how we can help you..." : "हमें बताएं कि हम आपकी कैसे मदद कर सकते हैं..."
                    }
                  />
                </div>

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      {language === "en" ? "Sending..." : "भेज रहे हैं..."}
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      {t("send", language)}
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>{language === "en" ? "Get in touch" : "संपर्क में रहें"}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-6">
                  {language === "en"
                    ? "We're committed to helping farmers succeed. Reach out to us through any of the following channels:"
                    : "हम किसानों की सफलता में मदद करने के लिए प्रतिबद्ध हैं। निम्नलिखित में से किसी भी चैनल के माध्यम से हमसे संपर्क करें:"}
                </p>
                <div className="space-y-4">
                  {contactInfo.map((info, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <div className="bg-green-100 p-2 rounded-lg">
                        <info.icon className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{info.title}</h3>
                        <p className="text-gray-700 font-medium">{info.value}</p>
                        <p className="text-sm text-gray-500">{info.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-green-50 border-green-200">
              <CardContent className="p-6">
                <h3 className="font-semibold text-gray-900 mb-3">
                  {language === "en" ? "Emergency Support" : "आपातकालीन सहायता"}
                </h3>
                <p className="text-sm text-gray-700 mb-4">
                  {language === "en"
                    ? "For urgent crop disease issues during critical growing seasons, our emergency support team is available 24/7."
                    : "महत्वपूर्ण बढ़ते मौसम के दौरान तत्काल फसल रोग के मुद्दों के लिए, हमारी आपातकालीन सहायता टीम 24/7 उपलब्ध है।"}
                </p>
                <Button variant="outline" size="sm">
                  <Phone className="h-4 w-4 mr-2" />
                  {language === "en" ? "Emergency Hotline" : "आपातकालीन हॉटलाइन"}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
