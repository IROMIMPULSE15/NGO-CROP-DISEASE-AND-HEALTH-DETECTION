"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Users, Target, Leaf, Brain, Heart, Globe } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"
import { t } from "@/lib/i18n"

export default function AboutPage() {
  const { language } = useLanguage()

  const teamMembers = [
    {
      name: "Mr. Anmol Daneti",
      role: language === "en" ? "Full Stack Developer" : "फुल स्टैक डेवलपर",
      description:
        language === "en"
          ? "Full stack developer with 10+ projects of experience in web and mobile applications"
          : "वेब और मोबाइल एप्लिकेशन में 10+ प्रोजेक्ट्स का अनुभव रखने वाले फुल स्टैक डेवलपर",
    },
    {
      name: "Mr. Arnav Bharadwaj",
      role: language === "en" ? "AI Engineer" : "AI इंजीनियर",
      description:
        language === "en"
          ? "Machine Learning expert specializing in computer vision and agricultural applications"
          : "कंप्यूटर विज़न और कृषि अनुप्रयोगों में विशेषज्ञता रखने वाले मशीन लर्निंग विशेषज्ञ",
    },
    {
      name: "Mr. Aviraj Yadav",
      role: language === "en" ? "Data Analyst" : "डेटा एनालिस्ट",
      description:
        language === "en"
          ? "Data analyst with expertise in agricultural data and predictive modeling"
          : "कृषि डेटा और पूर्वानुमान मॉडलिंग में विशेषज्ञता रखने वाले डेटा एनालिस्ट",
    },
  ]

  const values = [
    {
      icon: Heart,
      title: language === "en" ? "Farmer-Centric" : "किसान-केंद्रित",
      description:
        language === "en"
          ? "Every feature is designed with farmers' needs and challenges in mind"
          : "हर सुविधा किसानों की जरूरतों और चुनौतियों को ध्यान में रखकर डिज़ाइन की गई है",
    },
    {
      icon: Brain,
      title: language === "en" ? "AI-Powered" : "AI-संचालित",
      description:
        language === "en"
          ? "Cutting-edge artificial intelligence for accurate disease detection"
          : "सटीक रोग पहचान के लिए अत्याधुनिक कृत्रिम बुद्धिमत्ता",
    },
    {
      icon: Globe,
      title: language === "en" ? "Accessible" : "सुलभ",
      description:
        language === "en"
          ? "Available in multiple languages with simple, intuitive interface"
          : "सरल, सहज इंटरफ़ेस के साथ कई भाषाओं में उपलब्ध",
    },
    {
      icon: Leaf,
      title: language === "en" ? "Sustainable" : "टिकाऊ",
      description:
        language === "en"
          ? "Promoting organic and environmentally friendly farming practices"
          : "जैविक और पर्यावरण अनुकूल कृषि प्रथाओं को बढ़ावा देना",
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">{t("about", language)}</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {language === "en"
              ? "CropCare AI is dedicated to empowering farmers with cutting-edge technology to protect their crops and improve agricultural productivity."
              : "CropCare AI अपनी फसलों की सुरक्षा और कृषि उत्पादकता में सुधार के लिए अत्याधुनिक तकनीक के साथ किसानों को सशक्त बनाने के लिए समर्पित है।"}
          </p>
        </div>

        {/* Mission Section */}
        <section className="mb-16">
          <Card className="bg-green-50 border-green-200">
            <CardContent className="p-8 text-center">
              <Target className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-4">{t("ourMission", language)}</h2>
              <p className="text-lg text-gray-700 max-w-3xl mx-auto">{t("missionText", language)}</p>
            </CardContent>
          </Card>
        </section>

        {/* Values Section */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">{language === "en" ? "Our Values" : "हमारे मूल्य"}</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <value.icon className="h-8 w-8 text-green-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{value.title}</h3>
                  <p className="text-gray-600 text-sm">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Team Section */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">{language === "en" ? "Our Team" : "हमारी टीम"}</h2>
            <p className="text-lg text-gray-600">
              {language === "en" ? "Meet the experts behind CropCare AI" : "CropCare AI के पीछे के विशेषज्ञों से मिलें"}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="bg-gray-200 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="h-12 w-12 text-gray-500" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{member.name}</h3>
                  <p className="text-green-600 font-medium mb-3">{member.role}</p>
                  <p className="text-gray-600 text-sm">{member.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Technology Section */}
        <section className="mb-16">
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-8">
              <div className="text-center mb-8">
                <Brain className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  {language === "en" ? "Our Technology" : "हमारी तकनीक"}
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    {language === "en" ? "Advanced AI Models" : "उन्नत AI मॉडल"}
                  </h3>
                  <p className="text-gray-700">
                    {language === "en"
                      ? "Our deep learning models are trained on thousands of crop disease images, ensuring high accuracy in disease detection and classification."
                      : "हमारे डीप लर्निंग मॉडल हजारों फसल रोग छवियों पर प्रशिक्षित हैं, जो रोग पहचान और वर्गीकरण में उच्च सटीकता सुनिश्चित करते हैं।"}
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    {language === "en" ? "Mobile-First Design" : "मोबाइल-फर्स्ट डिज़ाइन"}
                  </h3>
                  <p className="text-gray-700">
                    {language === "en"
                      ? "Built specifically for mobile devices with offline capabilities, making it accessible even in areas with limited internet connectivity."
                      : "ऑफ़लाइन क्षमताओं के साथ विशेष रूप से मोबाइल उपकरणों के लिए बनाया गया, जो सीमित इंटरनेट कनेक्टिविटी वाले क्षेत्रों में भी इसे सुलभ बनाता है।"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Impact Section */}
        <section>
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">
              {language === "en" ? "Our Impact" : "हमारा प्रभाव"}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="text-4xl font-bold text-green-600 mb-2">50+</div>
                <p className="text-gray-600">{language === "en" ? "Farmers Helped" : "किसानों की मदद की"}</p>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-green-600 mb-2">50,000+</div>
                <p className="text-gray-600">{language === "en" ? "Crops Analyzed" : "फसलों का विश्लेषण"}</p>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-green-600 mb-2">95%</div>
                <p className="text-gray-600">{language === "en" ? "Accuracy Rate" : "सटीकता दर"}</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
