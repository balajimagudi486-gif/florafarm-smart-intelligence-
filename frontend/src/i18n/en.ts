// FloraFarm — English translations
const en = {
  // Navbar
  nav: {
    home: 'Home',
    cropAI: 'Crop AI',
    fertilizerAI: 'Fertilizer AI',
    howItWorks: 'How It Works',
    about: 'About',
    dashboard: 'Dashboard',
    history: 'History',
    analyzeCrop: 'Analyze Crop',
  },

  // Hero
  hero: {
    headline: 'Smarter Crop Health Starts Here.',
    subheadline: 'Detect Diseases. Understand Nutrition. Grow Smarter.',
    description:
      'FloraFarm uses AI-powered crop image analysis and intelligent fertilizer recommendations to help farmers make informed crop-health decisions.',
    primaryCta: 'Analyze Your Crop',
    secondaryCta: 'Explore FloraFarm',
    card1Title: 'AI Crop Analysis',
    card1Status: 'Ready',
    card2Title: 'Crop Health',
    card2Status: 'Analysis Available',
    card3Title: 'AI Confidence',
    card3Value: '96.4%',
  },

  // Welcome
  welcome: {
    heading: 'Welcome to FloraFarm',
    description:
      'FloraFarm brings computer vision and agricultural intelligence together to help farmers identify crop diseases and make informed fertilizer decisions.',
    card1Number: '01',
    card1Title: 'Disease Detection',
    card1Text:
      'Upload a crop image and identify possible diseases using a MobileNetV2 computer-vision model trained on PlantVillage.',
    card2Number: '02',
    card2Title: 'Crop Health',
    card2Text:
      'Understand the detected condition, confidence and severity of the crop problem.',
    card3Number: '03',
    card3Title: 'Smart Nutrition',
    card3Text:
      'Use crop and soil information to receive fertilizer recommendations with organic and inorganic options.',
  },

  // How It Works
  howItWorks: {
    heading: 'How FloraFarm Works',
    step1Title: 'Upload',
    step1Text: 'Upload a clear crop image.',
    step2Title: 'Detect',
    step2Text: 'MobileNetV2 analyzes the crop image.',
    step3Title: 'Understand',
    step3Text: 'FloraFarm presents disease information and crop-health insights.',
    step4Title: 'Nourish',
    step4Text: 'Provide soil/crop information to receive fertilizer recommendations.',
  },

  // Crop AI Page
  cropAI: {
    heading: 'AI Crop Doctor',
    subheading: 'Upload a crop image and let FloraFarm analyze it.',
    uploadLabel: 'Upload your crop image',
    uploadHint: 'JPG, JPEG or PNG • Maximum 10 MB',
    uploadDragText: 'Drag & drop your crop image here, or',
    uploadBrowse: 'browse file',
    uploadMobile: 'Take Photo',
    analyzeBtn: 'Analyze Crop',
    removeImage: 'Remove Image',
    analyzing: 'Analyzing…',
  },

  // Scanning stages
  scanning: {
    stage1: 'Reading crop image…',
    stage2: 'Preparing image…',
    stage3: 'Analyzing leaf patterns…',
    stage4: 'Comparing disease features…',
    stage5: 'Identifying crop condition…',
    stage6: 'Preparing results…',
  },

  // Disease Result
  disease: {
    resultHeading: 'Crop Analysis Result',
    crop: 'Crop',
    condition: 'Detected Condition',
    confidence: 'Confidence',
    severity: 'Severity',
    topPredictions: 'Top Predictions',
    symptoms: 'Symptoms',
    management: 'Management Guidance',
    riskLevel: 'Risk Level',
    disclaimer:
      'AI-generated analysis. Verify with an agricultural expert when necessary.',
    nutritionNote:
      'Balanced crop nutrition may support overall plant health, but disease management should follow appropriate agricultural guidance.',
    demoLabel: 'Demo Prediction',
    severityHealthy: 'Healthy',
    severityLow: 'Low',
    severityModerate: 'Moderate',
    severityHigh: 'High',
  },

  // Fertilizer AI Page
  fertilizerAI: {
    heading: 'Smart Fertilizer Recommendation',
    subheading:
      'Enter your soil and crop details to receive an AI-powered fertilizer recommendation.',
    soilType: 'Soil Type',
    soilPH: 'Soil pH',
    soilPHTooltip: 'Measure of soil acidity or alkalinity (0–14 scale).',
    soilMoisture: 'Soil Moisture (%)',
    soilMoistureTooltip: 'Percentage of water content in the soil.',
    organicCarbon: 'Organic Carbon (%)',
    organicCarbonTooltip: 'Organic carbon content in the soil (%).',
    electricalConductivity: 'Electrical Conductivity (dS/m)',
    electricalConductivityTooltip: 'Measure of soil salinity.',
    nitrogenLevel: 'Nitrogen Level (kg/ha)',
    nitrogenTooltip: 'Nitrogen level from your soil test.',
    phosphorusLevel: 'Phosphorus Level (kg/ha)',
    phosphorusTooltip: 'Phosphorus level from your soil test.',
    potassiumLevel: 'Potassium Level (kg/ha)',
    potassiumTooltip: 'Potassium level from your soil test.',
    cropType: 'Crop Type',
    cropGrowthStage: 'Crop Growth Stage',
    season: 'Season',
    irrigationType: 'Irrigation Type',
    previousCrop: 'Previous Crop',
    region: 'Region',
    recommendBtn: 'Get Recommendation',
    recommending: 'Analyzing…',
  },

  // Fertilizer Result
  fertilizerResult: {
    heading: 'Recommended Fertilizer',
    type: 'Type',
    confidence: 'Confidence',
    reason:
      'Based on the provided crop, soil and nutrient information, the model identified this as the highest-probability recommendation.',
    topOptions: 'Top Options',
    recommended: 'Recommended',
    alternative: 'Alternative',
    organic: 'Organic',
    inorganic: 'Inorganic',
    organicDesc:
      'Organic nutrient source that can contribute to soil organic matter and plant nutrition.',
    inorganicDesc:
      'Inorganic fertilizers provide specific nutrients in concentrated forms.',
    safetyTitle: 'Important',
    safetyText:
      'Fertilizer recommendations are AI-generated decision support. Actual application should consider soil-test results, crop requirements, product labels and local agricultural recommendations.',
    demoLabel: 'Demo Prediction',
  },

  // Combined Analysis
  combined: {
    heading: 'Complete Crop Check',
    step1: 'Upload Image',
    step2: 'Disease Analysis',
    step3: 'Disease Result',
    step4: 'Soil & Crop Info (Optional)',
    step5: 'Fertilizer Analysis',
    step6: 'Complete Advisory',
    addFertilizer: 'Get Fertilizer Recommendation',
    skipFertilizer: 'Skip',
    advisory: 'Crop Advisory Summary',
    nextAction: 'Next Action',
    nextActionText:
      'Verify soil nutrient status and follow appropriate crop-management guidance.',
  },

  // Dashboard
  dashboard: {
    heading: 'FloraFarm Crop Intelligence',
    totalAnalyses: 'Disease Analyses',
    healthyCrops: 'Healthy Crops',
    attentionCrops: 'Crops Requiring Attention',
    fertilizerRecs: 'Fertilizer Recommendations',
    recentAnalyses: 'Recent Analyses',
    noHistory: 'No analyses yet. Start by uploading a crop image.',
  },

  // History
  history: {
    heading: 'Analysis History',
    date: 'Date',
    crop: 'Crop',
    disease: 'Disease',
    confidence: 'Confidence',
    fertilizer: 'Fertilizer',
    status: 'Status',
    searchPlaceholder: 'Search crop, disease…',
    filterAll: 'All',
    filterHealthy: 'Healthy',
    filterDisease: 'Disease Detected',
    noResults: 'No matching records found.',
    clearHistory: 'Clear History',
  },

  // About
  about: {
    heading: 'Technology That Puts Crop Health First.',
    description:
      'FloraFarm combines computer vision and agricultural machine learning into one simple platform for farmers.',
    feature1: 'AI Disease Detection',
    feature2: 'Smart Fertilizer Recommendation',
    feature3: 'Bilingual Farmer Interface',
    tech: 'Technology Stack',
    tagline: '"Detect. Understand. Nourish."',
    mission:
      'FloraFarm focuses on AI-assisted identification of crop diseases and intelligent nutrient-management support, helping farmers recognize crop problems earlier and make more informed decisions.',
  },

  // Errors
  errors: {
    invalidImage: 'Please upload a valid JPG, JPEG or PNG image.',
    imageTooBig: 'Image size must be below 10 MB.',
    nonCropImage: 'Please upload a crop image. Non-crop images are not supported.',
    backendUnavailable:
      'FloraFarm AI service is temporarily unavailable. Please try again.',
    lowConfidence:
      'FloraFarm could not confidently identify the crop condition. Please upload a clearer image.',
    genericError: 'Something went wrong. Please try again.',
  },

  // Loading
  loading: {
    disease: 'Analyzing crop…',
    fertilizer: 'Generating recommendation…',
  },

  // Common
  common: {
    back: 'Back',
    tryAgain: 'Try Again',
    newAnalysis: 'New Analysis',
    loading: 'Loading…',
    or: 'or',
  },

  // Footer
  footer: {
    tagline: 'Smart Intelligence for Healthier Crops.',
    quickLinks: 'Quick Links',
    aiModules: 'AI Modules',
    legal: 'Disclaimer',
    legalText:
      'FloraFarm is an AI decision-support tool. Results should be verified with qualified agricultural professionals.',
    copyright: '© 2026 FloraFarm. Built for smarter agriculture.',
  },
};

export default en;
export type Translations = typeof en;
