export interface DetectionResult {
  id: string;
  timestamp: string;
  objects: DetectedObject[];
  total_emissions: number;
  image_url: string;
  category: string;
}

export interface DetectedObject {
  name: string;
  confidence: number;
  carbon_footprint: number;
  unit: string;
}

export interface CarbonTrend {
  date: string;
  total_emissions: number;
  count: number;
  average: number;
}

export interface Prediction {
  date: string;
  predicted_emissions: number;
  trend: string;
  confidence: number;
}

export interface Recommendation {
  title: string;
  description: string;
  potential_savings: number;
  impact: string;
  priority: number;
}
