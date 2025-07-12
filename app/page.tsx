"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Upload,
  Brain,
  FileText,
  Users,
  Shield,
  Zap,
  Sparkles,
  TrendingUp,
  Award,
  Globe,
  ArrowRight,
  CheckCircle,
  Star,
  Play,
  Camera,
  Clock,
  Target,
  Lightbulb,
  Smartphone,
} from "lucide-react"
import { useLanguage } from "@/contexts/language-context"
import { useAuth } from "@/contexts/auth-context"
import { t } from "@/lib/i18n"

export default function HomePage() {
  const { language } = useLanguage()
  const { user } = useAuth()

  const steps = [
    {
      icon: Upload,
      title: language === "en" ? "Upload Image" : "छवि अपलोड करें",
      description:
        language === "en"
          ? "Capture or upload a photo of the affected plant part with our intuitive interface"
          : "हमारे सहज इंटरफ़ेस के साथ प्रभावित पौधे के हिस्से की फोटो कैप्चर या अपलोड करें",
      color: "from-blue-500 via-blue-600 to-cyan-500",
      delay: "0ms",
    },
    {
      icon: Brain,
      title: language === "en" ? "AI Analysis" : "AI विश्लेषण",
      description:
        language === "en"
          ? "Our advanced neural networks analyze the image using cutting-edge computer vision"
          : "हमारे उन्नत न्यूरल नेटवर्क अत्याधुनिक कंप्यूटर विज़न का उपयोग करके छवि का विश्लेषण करते हैं",
      color: "from-purple-500 via-purple-600 to-pink-500",
      delay: "200ms",
    },
    {
      icon: FileText,
      title: language === "en" ? "Get Results" : "परिणाम प्राप्त करें",
      description:
        language === "en"
          ? "Receive instant diagnosis with treatment recommendations and prevention tips"
          : "उपचार सिफारिशों और रोकथाम युक्तियों के साथ तत्काल निदान प्राप्त करें",
      color: "from-green-500 via-green-600 to-emerald-500",
      delay: "400ms",
    },
  ]

  const features = [
    {
      icon: Zap,
      title: language === "en" ? "Lightning Fast" : "बिजली की तेज़ी",
      description:
        language === "en"
          ? "Get disease diagnosis in under 3 seconds with 95%+ accuracy using our optimized AI models"
          : "हमारे अनुकूलित AI मॉडल का उपयोग करके 95%+ सटीकता के साथ 3 सेकंड से कम में रोग निदान प्राप्त करें",
      stats: "< 3s",
      gradient: "from-yellow-400 to-orange-500",
    },
    {
      icon: Shield,
      title: language === "en" ? "Precision Detection" : "सटीक पहचान",
      description:
        language === "en"
          ? "Advanced deep learning trained on 100,000+ crop images for unmatched accuracy"
          : "बेजोड़ सटीकता के लिए 100,000+ फसल छवियों पर प्रशिक्षित उन्नत डीप लर्निंग",
      stats: "95%+",
      gradient: "from-blue-400 to-blue-600",
    },
    {
      icon: Users,
      title: language === "en" ? "Farmer-Centric" : "किसान-केंद्रित",
      description:
        language === "en"
          ? "Designed specifically for farmers with simple, intuitive interface and offline capabilities"
          : "सरल, सहज इंटरफ़ेस और ऑफ़लाइन क्षमताओं के साथ विशेष रूप से किसानों के लिए डिज़ाइन किया गया",
      stats: "10K+",
      gradient: "from-green-400 to-green-600",
    },
    {
      icon: Globe,
      title: language === "en" ? "Global Impact" : "वैश्विक प्रभाव",
      description:
        language === "en"
          ? "Supporting sustainable agriculture practices across multiple countries and crop types"
          : "कई देशों और फसल प्रकारों में टिकाऊ कृषि प्रथाओं का समर्थन",
      stats: "50+",
      gradient: "from-purple-400 to-purple-600",
    },
  ]

  const stats = [
    { value: "50K+", label: language === "en" ? "Crops Analyzed" : "फसलों का विश्लेषण", icon: TrendingUp },
    { value: "95%", label: language === "en" ? "Accuracy Rate" : "सटीकता दर", icon: Award },
    { value: "10K+", label: language === "en" ? "Farmers Helped" : "किसानों की मदद", icon: Users },
    { value: "24/7", label: language === "en" ? "Support Available" : "सहायता उपलब्ध", icon: Shield },
  ]

  const testimonials = [
    {
      name: "Rajesh Kumar",
      role: language === "en" ? "Wheat Farmer, Punjab" : "गेहूं किसान, पंजाब",
      content:
        language === "en"
          ? "CropCare AI saved my entire wheat crop! The early detection helped me treat the disease before it spread."
          : "CropCare AI ने मेरी पूरी गेहूं की फसल बचाई! जल्दी पहचान ने मुझे बीमारी फैलने से पहले इलाज करने में मदद की।",
      rating: 5,
      image: "/placeholder.svg?height=60&width=60",
    },
    {
      name: "Priya Sharma",
      role: language === "en" ? "Organic Farmer, Maharashtra" : "जैविक किसान, महाराष्ट्र",
      content:
        language === "en"
          ? "The organic treatment suggestions are fantastic. My tomato yield increased by 40% this season!"
          : "जैविक उपचार सुझाव शानदार हैं। इस सीज़न में मेरी टमाटर की उपज 40% बढ़ गई!",
      rating: 5,
      image: "/placeholder.svg?height=60&width=60",
    },
    {
      name: "Mohammed Ali",
      role: language === "en" ? "Rice Farmer, West Bengal" : "चावल किसान, पश्चिम बंगाल",
      content:
        language === "en"
          ? "Easy to use even for someone like me who's not tech-savvy. The Hindi support is excellent!"
          : "मेरे जैसे व्यक्ति के लिए भी उपयोग करना आसान है जो तकनीक-प्रेमी नहीं है। हिंदी समर्थन उत्कृष्ट है!",
      rating: 5,
      image: "/placeholder.svg?height=60&width=60",
    },
  ]

  const benefits = [
    {
      icon: Clock,
      title: language === "en" ? "Save Time" : "समय बचाएं",
      description: language === "en" ? "Instant diagnosis vs days of waiting" : "दिनों की प्रतीक्षा बनाम तत्काल निदान",
    },
    {
      icon: Target,
      title: language === "en" ? "Increase Yield" : "उपज बढ़ाएं",
      description: language === "en" ? "Early detection prevents crop loss" : "जल्दी पहचान फसल हानि को रोकती है",
    },
    {
      icon: Lightbulb,
      title: language === "en" ? "Expert Knowledge" : "विशेषज्ञ ज्ञान",
      description: language === "en" ? "Access to agricultural expertise 24/7" : "24/7 कृषि विशेषज्ञता तक पहुंच",
    },
    {
      icon: Smartphone,
      title: language === "en" ? "Mobile First" : "मोबाइल फर्स्ट",
      description: language === "en" ? "Works perfectly on your smartphone" : "आपके स्मार्टफोन पर बिल्कुल काम करता है",
    },
  ]

  return (
    <div className="min-h-screen bg-noise">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-background via-surface/30 to-background min-h-screen flex items-center">
        <div className="absolute inset-0 bg-grid-pattern opacity-5" />
        <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-primary/20 to-gradient-to/20 rounded-full blur-3xl animate-float" />
        <div
          className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-r from-gradient-to/20 to-primary/20 rounded-full blur-3xl animate-float"
          style={{ animationDelay: "3s" }}
        />

        <div className="container relative py-24 lg:py-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left Content */}
            <div className="space-y-8 animate-slide-in-left">
              <Badge
                variant="secondary"
                className="mb-6 px-6 py-3 text-sm font-medium glass-card animate-bounce-subtle"
              >
                <Sparkles className="mr-2 h-4 w-4" />
                {language === "en" ? "Revolutionary AI Technology" : "क्रांतिकारी AI तकनीक"}
              </Badge>

              <h1 className="font-display text-5xl font-bold tracking-tight sm:text-6xl lg:text-7xl mb-8">
                <span className="gradient-text-animated">{language === "en" ? "Smart Agriculture" : "स्मार्ट कृषि"}</span>
                <br />
                <span className="text-foreground">{language === "en" ? "Powered by AI" : "AI द्वारा संचालित"}</span>
              </h1>

              <p className="text-xl text-muted-foreground mb-12 leading-relaxed max-w-2xl">
                {language === "en"
                  ? "Transform your farming with instant crop disease detection. Our advanced AI provides accurate diagnosis and treatment recommendations in seconds."
                  : "तत्काल फसल रोग पहचान के साथ अपनी खेती को बदलें। हमारा उन्नत AI सेकंडों में सटीक निदान और उपचार सिफारिशें प्रदान करता है।"}
              </p>

              <div className="flex flex-col sm:flex-row gap-6 mb-16">
                <Button
                  size="lg"
                  asChild
                  className="btn-hover-lift bg-gradient-to-r from-gradient-from to-gradient-to text-lg px-8 py-6 h-auto shadow-glow"
                >
                  <Link href={user ? "/predict" : "/signup"}>
                    {user ? t("predict", language) : t("getStarted", language)}
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  asChild
                  className="text-lg px-8 py-6 h-auto hover:bg-surface glass-card bg-transparent"
                >
                  <Link href="/learn">
                    <Play className="mr-2 h-5 w-5" />
                    {language === "en" ? "Watch Demo" : "डेमो देखें"}
                  </Link>
                </Button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                  <div
                    key={index}
                    className="text-center p-4 glass-card hover-scale"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="flex justify-center mb-3">
                      <div className="p-2 bg-gradient-to-br from-primary/20 to-gradient-to/20 rounded-xl">
                        <stat.icon className="h-6 w-6 text-primary" />
                      </div>
                    </div>
                    <div className="font-display text-2xl font-bold text-foreground mb-1">{stat.value}</div>
                    <div className="text-sm text-muted-foreground">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Content - Interactive Demo */}
            <div className="relative animate-slide-in-right">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-gradient-to/20 rounded-3xl blur-2xl animate-pulse-glow" />
                <Card className="relative glass-card p-8 hover-scale">
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="font-display text-xl font-semibold">
                        {language === "en" ? "Try AI Detection" : "AI पहचान आज़माएं"}
                      </h3>
                      <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white">
                        {language === "en" ? "Live Demo" : "लाइव डेमो"}
                      </Badge>
                    </div>

                    <div className="aspect-video bg-gradient-to-br from-surface to-muted rounded-xl flex items-center justify-center relative overflow-hidden">
                      <div className="absolute inset-0 bg-dot-pattern opacity-20" />
                      <div className="relative z-10 text-center">
                        <Camera className="h-16 w-16 text-primary mx-auto mb-4 animate-bounce-subtle" />
                        <p className="text-muted-foreground">
                          {language === "en"
                            ? "Upload crop image for instant analysis"
                            : "तत्काल विश्लेषण के लिए फसल छवि अपलोड करें"}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-center p-3 bg-surface/50 rounded-lg">
                        <div className="text-2xl font-bold text-green-600">95%</div>
                        <div className="text-xs text-muted-foreground">{language === "en" ? "Accuracy" : "सटीकता"}</div>
                      </div>
                      <div className="text-center p-3 bg-surface/50 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">3s</div>
                        <div className="text-xs text-muted-foreground">
                          {language === "en" ? "Response" : "प्रतिक्रिया"}
                        </div>
                      </div>
                      <div className="text-center p-3 bg-surface/50 rounded-lg">
                        <div className="text-2xl font-bold text-purple-600">24/7</div>
                        <div className="text-xs text-muted-foreground">{language === "en" ? "Available" : "उपलब्ध"}</div>
                      </div>
                    </div>

                    <Button
                      className="w-full btn-hover-lift bg-gradient-to-r from-gradient-from to-gradient-to"
                      asChild
                    >
                      <Link href={user ? "/predict" : "/signup"}>
                        {user ? t("predict", language) : t("getStarted", language)}
                      </Link>
                    </Button>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-32 bg-gradient-to-b from-surface/30 to-background relative">
        <div className="absolute inset-0 bg-dot-pattern opacity-5" />
        <div className="container relative">
          <div className="text-center mb-20 animate-fade-in-up">
            <Badge variant="outline" className="mb-6 glass-card">
              {language === "en" ? "Simple Process" : "सरल प्रक्रिया"}
            </Badge>
            <h2 className="font-display text-4xl font-bold sm:text-5xl lg:text-6xl mb-8">
              {language === "en" ? "How It " : "यह कैसे "}
              <span className="gradient-text-animated">{language === "en" ? "Works" : "काम करता है"}</span>
            </h2>
            <p className="mx-auto max-w-3xl text-xl text-muted-foreground leading-relaxed">
              {language === "en"
                ? "Three simple steps to diagnose and treat crop diseases with AI precision"
                : "AI सटीकता के साथ फसल रोगों का निदान और उपचार करने के लिए तीन सरल चरण"}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-16">
            {steps.map((step, index) => (
              <div key={index} className="relative group animate-fade-in-up" style={{ animationDelay: step.delay }}>
                <Card className="card-hover border-0 shadow-xl glass-card relative overflow-hidden">
                  <div
                    className="absolute inset-0 bg-gradient-to-br opacity-5"
                    style={{
                      background: `linear-gradient(135deg, ${step.color.split(" ")[1]}, ${step.color.split(" ")[3]})`,
                    }}
                  />
                  <CardContent className="p-10 text-center relative z-10">
                    <div className="relative mb-8">
                      <div
                        className={`inline-flex p-6 rounded-3xl bg-gradient-to-br ${step.color} mb-6 group-hover:scale-110 transition-transform duration-500 shadow-glow`}
                      >
                        <step.icon className="h-10 w-10 text-white" />
                      </div>
                      <div className="absolute -top-4 -right-4 text-8xl font-display font-bold text-muted/5">
                        {index + 1}
                      </div>
                    </div>
                    <h3 className="font-display text-2xl font-semibold mb-6">{step.title}</h3>
                    <p className="text-muted-foreground leading-relaxed text-lg">{step.description}</p>
                  </CardContent>
                </Card>

                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-8 transform -translate-y-1/2 z-20">
                    <div className="bg-gradient-to-r from-primary to-gradient-to p-2 rounded-full shadow-glow">
                      <ArrowRight className="h-6 w-6 text-white" />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-32 relative">
        <div className="container">
          <div className="text-center mb-20 animate-fade-in-up">
            <Badge variant="outline" className="mb-6 glass-card">
              {language === "en" ? "Advanced Features" : "उन्नत सुविधाएं"}
            </Badge>
            <h2 className="font-display text-4xl font-bold sm:text-5xl lg:text-6xl mb-8">
              {language === "en" ? "Why Choose " : "क्यों चुनें "}
              <span className="gradient-text-animated">CropCare AI</span>
            </h2>
            <p className="mx-auto max-w-3xl text-xl text-muted-foreground leading-relaxed">
              {language === "en"
                ? "Cutting-edge technology meets practical farming solutions"
                : "अत्याधुनिक तकनीक व्यावहारिक कृषि समाधानों से मिलती है"}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="card-hover group border-0 shadow-xl glass-card relative overflow-hidden animate-fade-in-up"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-5 group-hover:opacity-10 transition-opacity`}
                />
                <CardContent className="p-10 relative z-10">
                  <div className="flex items-start space-x-6">
                    <div
                      className={`bg-gradient-to-br ${feature.gradient} p-4 rounded-2xl group-hover:scale-110 transition-transform shadow-glow`}
                    >
                      <feature.icon className="h-8 w-8 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-display text-2xl font-semibold">{feature.title}</h3>
                        <Badge variant="secondary" className="text-lg px-4 py-2 font-bold">
                          {feature.stats}
                        </Badge>
                      </div>
                      <p className="text-muted-foreground leading-relaxed text-lg">{feature.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-32 bg-gradient-to-b from-surface/30 to-background relative">
        <div className="absolute inset-0 bg-grid-pattern opacity-5" />
        <div className="container relative">
          <div className="text-center mb-20 animate-fade-in-up">
            <h2 className="font-display text-4xl font-bold sm:text-5xl lg:text-6xl mb-8">
              {language === "en" ? "Transform Your " : "अपनी "}
              <span className="gradient-text-animated">{language === "en" ? "Farming" : "खेती को बदलें"}</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <Card
                key={index}
                className="card-hover text-center border-0 shadow-xl glass-card animate-fade-in-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardContent className="p-8">
                  <div className="bg-gradient-to-br from-primary/20 to-gradient-to/20 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                    <benefit.icon className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="font-display text-xl font-semibold mb-4">{benefit.title}</h3>
                  <p className="text-muted-foreground">{benefit.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-32 relative">
        <div className="container">
          <div className="text-center mb-20 animate-fade-in-up">
            <Badge variant="outline" className="mb-6 glass-card">
              {language === "en" ? "Success Stories" : "सफलता की कहानियां"}
            </Badge>
            <h2 className="font-display text-4xl font-bold sm:text-5xl lg:text-6xl mb-8">
              {language === "en" ? "What Farmers " : "किसान क्या "}
              <span className="gradient-text-animated">{language === "en" ? "Say" : "कहते हैं"}</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card
                key={index}
                className="card-hover border-0 shadow-xl glass-card animate-fade-in-up"
                style={{ animationDelay: `${index * 200}ms` }}
              >
                <CardContent className="p-8">
                  <div className="flex items-center mb-6">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-muted-foreground mb-6 leading-relaxed italic">"{testimonial.content}"</p>
                  <div className="flex items-center">
                    <img
                      src={testimonial.image || "/placeholder.svg"}
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full mr-4"
                    />
                    <div>
                      <div className="font-semibold">{testimonial.name}</div>
                      <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 bg-gradient-to-br from-primary via-primary to-gradient-to relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-10" />
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-20 left-20 w-64 h-64 bg-white/10 rounded-full blur-3xl animate-float" />
          <div
            className="absolute bottom-20 right-20 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-float"
            style={{ animationDelay: "2s" }}
          />
        </div>
        <div className="container relative text-center text-white">
          <div className="animate-fade-in-up">
            <h2 className="font-display text-4xl font-bold sm:text-5xl lg:text-6xl mb-8">
              {language === "en" ? "Ready to Transform Your Farming?" : "अपनी खेती को बदलने के लिए तैयार हैं?"}
            </h2>
            <p className="mx-auto max-w-3xl text-xl text-primary-foreground/90 mb-16 leading-relaxed">
              {language === "en"
                ? "Join thousands of farmers already using AI to protect their crops and increase yields"
                : "हजारों किसानों के साथ जुड़ें जो पहले से ही अपनी फसलों की सुरक्षा और उपज बढ़ाने के लिए AI का उपयोग कर रहे हैं"}
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
              <Button
                size="lg"
                variant="secondary"
                asChild
                className="btn-hover-lift text-xl px-12 py-6 h-auto shadow-glow"
              >
                <Link href={user ? "/predict" : "/signup"}>
                  {user
                    ? language === "en"
                      ? "Start Analyzing"
                      : "विश्लेषण शुरू करें"
                    : language === "en"
                      ? "Start Free Analysis"
                      : "मुफ्त विश्लेषण शुरू करें"}
                  <ArrowRight className="ml-3 h-6 w-6" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                asChild
                className="text-xl px-12 py-6 h-auto border-white/20 text-white hover:bg-white/10 glass bg-transparent"
              >
                <Link href="/about">{language === "en" ? "Learn More" : "और जानें"}</Link>
              </Button>
            </div>

            <div className="flex flex-wrap justify-center gap-8 text-primary-foreground/80">
              <div className="flex items-center text-lg">
                <CheckCircle className="h-6 w-6 mr-3" />
                {language === "en" ? "Free to start" : "शुरू करने के लिए मुफ्त"}
              </div>
              <div className="flex items-center text-lg">
                <CheckCircle className="h-6 w-6 mr-3" />
                {language === "en" ? "No credit card required" : "कोई क्रेडिट कार्ड आवश्यक नहीं"}
              </div>
              <div className="flex items-center text-lg">
                <CheckCircle className="h-6 w-6 mr-3" />
                {language === "en" ? "Instant results" : "तत्काल परिणाम"}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
