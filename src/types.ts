export interface MedicalAssessment {
  conditionName: string;
  category: string;
  severity: 'Mild' | 'Moderate' | 'Severe / Seek Emergency Care';
  severityDescription: string;
  fivePointGuide: {
    cause: {
      title: string;
      summary: string;
      details: string[];
    };
    effect: {
      title: string;
      summary: string;
      details: string[];
    };
    reason: {
      title: string;
      summary: string;
      details: string[];
    };
    treatment: {
      title: string;
      immediateFirstAid: string[];
      clinicalTreatments: string[];
      warnings: string[];
    };
    diet: {
      title: string;
      recommendedFoods: string[];
      foodsToAvoid: string[];
      hydrationGuidance: string;
    };
  };
  whenToSeekDoctor: string[];
  disclaimer: string;
  analyzedAt: string;
}

export interface RecommendationRequest {
  symptoms: string;
  painLevel?: number;
  duration?: string;
  language?: string;
  detailLevel?: 'Concise' | 'Standard' | 'Comprehensive';
  imageBase64?: string;
  mimeType?: string;
}

export interface HistoryItem {
  id: string;
  timestamp: string;
  symptomsSummary: string;
  hasImage: boolean;
  imagePreview?: string;
  result: MedicalAssessment;
}

export interface PresetCase {
  id: string;
  name: string;
  badge: string;
  symptoms: string;
  painLevel: number;
  duration: string;
  imagePlaceholderUrl?: string;
}
