export const translations = {
  en: {
    // Navigation
    home: "Home",
    predict: "Predict",
    learn: "Learn",
    about: "About",
    contact: "Contact",
    login: "Login",
    signup: "Sign Up",
    logout: "Logout",
    myScans: "My Scans",

    // Home page
    heroTitle: "AI-Powered Crop Disease Detection",
    heroSubtitle: "Protect your crops with instant disease identification and treatment recommendations",
    getStarted: "Get Started",
    howItWorks: "How It Works",
    step1Title: "Upload Image",
    step1Desc: "Take a photo of affected plant part",
    step2Title: "AI Analysis",
    step2Desc: "Our AI analyzes the image for diseases",
    step3Title: "Get Results",
    step3Desc: "Receive diagnosis and treatment advice",

    // Predict page
    uploadImage: "Upload Plant Image",
    dragDrop: "Drag and drop an image here, or click to select",
    selectPlantPart: "Select Plant Part",
    leaves: "Leaves",
    stem: "Stem",
    fruit: "Fruit",
    root: "Root",
    analyze: "Analyze Image",
    analyzing: "Analyzing...",
    result: "Analysis Result",
    confidence: "Confidence",
    treatment: "Treatment",
    prevention: "Prevention",

    // Auth
    email: "Email",
    password: "Password",
    confirmPassword: "Confirm Password",
    name: "Full Name",
    phone: "Phone Number",
    signInAccount: "Sign in to your account",
    createAccount: "Create your account",
    alreadyHaveAccount: "Already have an account?",
    dontHaveAccount: "Don't have an account?",

    // Learn page
    diseaseLibrary: "Disease Library",
    organicMethods: "Organic Treatment Methods",
    photographyTips: "Photography Tips",

    // About page
    ourMission: "Our Mission",
    missionText: "Empowering farmers with AI technology to protect crops and improve yields",

    // Contact
    contactUs: "Contact Us",
    message: "Message",
    send: "Send Message",

    // Common
    loading: "Loading...",
    error: "Error",
    success: "Success",
    retry: "Retry",
    back: "Back",
    next: "Next",
    save: "Save",
    cancel: "Cancel",
  },
  hi: {
    // Navigation
    home: "होम",
    predict: "पहचान",
    learn: "सीखें",
    about: "हमारे बारे में",
    contact: "संपर्क",
    login: "लॉगिन",
    signup: "साइन अप",
    logout: "लॉगआउट",
    myScans: "मेरे स्कैन",

    // Home page
    heroTitle: "AI-संचालित फसल रोग पहचान",
    heroSubtitle: "तत्काल रोग पहचान और उपचार सुझावों के साथ अपनी फसलों की सुरक्षा करें",
    getStarted: "शुरू करें",
    howItWorks: "यह कैसे काम करता है",
    step1Title: "छवि अपलोड करें",
    step1Desc: "प्रभावित पौधे के हिस्से की फोटो लें",
    step2Title: "AI विश्लेषण",
    step2Desc: "हमारा AI रोगों के लिए छवि का विश्लेषण करता है",
    step3Title: "परिणाम प्राप्त करें",
    step3Desc: "निदान और उपचार सलाह प्राप्त करें",

    // Predict page
    uploadImage: "पौधे की छवि अपलोड करें",
    dragDrop: "यहाँ एक छवि खींचें और छोड़ें, या चुनने के लिए क्लिक करें",
    selectPlantPart: "पौधे का हिस्सा चुनें",
    leaves: "पत्तियाँ",
    stem: "तना",
    fruit: "फल",
    root: "जड़",
    analyze: "छवि का विश्लेषण करें",
    analyzing: "विश्लेषण कर रहे हैं...",
    result: "विश्लेषण परिणाम",
    confidence: "विश्वास",
    treatment: "उपचार",
    prevention: "रोकथाम",

    // Auth
    email: "ईमेल",
    password: "पासवर्ड",
    confirmPassword: "पासवर्ड की पुष्टि करें",
    name: "पूरा नाम",
    phone: "फोन नंबर",
    signInAccount: "अपने खाते में साइन इन करें",
    createAccount: "अपना खाता बनाएं",
    alreadyHaveAccount: "पहले से खाता है?",
    dontHaveAccount: "खाता नहीं है?",

    // Learn page
    diseaseLibrary: "रोग पुस्तकालय",
    organicMethods: "जैविक उपचार विधियाँ",
    photographyTips: "फोटोग्राफी टिप्स",

    // About page
    ourMission: "हमारा मिशन",
    missionText: "फसलों की सुरक्षा और उपज में सुधार के लिए AI तकनीक के साथ किसानों को सशक्त बनाना",

    // Contact
    contactUs: "हमसे संपर्क करें",
    message: "संदेश",
    send: "संदेश भेजें",

    // Common
    loading: "लोड हो रहा है...",
    error: "त्रुटि",
    success: "सफलता",
    retry: "पुनः प्रयास",
    back: "वापस",
    next: "अगला",
    save: "सहेजें",
    cancel: "रद्द करें",
  },
}

export type Language = "en" | "hi"
export type TranslationKey = keyof typeof translations.en

export function t(key: TranslationKey, lang: Language): string {
  return translations[lang][key] || translations.en[key]
}
