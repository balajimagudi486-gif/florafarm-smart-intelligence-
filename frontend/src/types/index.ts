// FloraFarm — TypeScript interfaces

export interface TopPrediction {
  label: string;
  crop: string;
  disease: string;
  confidence: number;
}

export interface DiseaseResult {
  crop: string;
  disease: string;
  confidence: number;
  severity: 'Healthy' | 'Low' | 'Moderate' | 'High';
  top_predictions: TopPrediction[];
  is_demo: boolean;
  model_version?: string;
}

export interface FertilizerTopOption {
  fertilizer: string;
  confidence: number;
  type: 'Organic' | 'Inorganic';
}

export interface FertilizerResult {
  fertilizer: string;
  type: 'Organic' | 'Inorganic';
  confidence: number;
  top_options: FertilizerTopOption[];
  is_demo: boolean;
  model_version?: string;
}

export interface FertilizerRequest {
  Soil_Type: string;
  Soil_pH: number;
  Soil_Moisture: number;
  Organic_Carbon: number;
  Electrical_Conductivity: number;
  Nitrogen_Level: number;
  Phosphorus_Level: number;
  Potassium_Level: number;
  Crop_Type: string;
  Crop_Growth_Stage: string;
  Season: string;
  Irrigation_Type: string;
  Previous_Crop: string;
  Region: string;
}

export interface AnalysisRecord {
  id: string;
  date: string;
  crop: string;
  disease: string;
  diseaseConfidence: number;
  severity: string;
  fertilizer?: string;
  fertilizerType?: string;
  fertilizerConfidence?: number;
  imageUrl?: string;
  is_demo: boolean;
}

export type Language = 'en' | 'ta';
