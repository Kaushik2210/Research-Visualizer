export enum AppState {
  UPLOAD = 'UPLOAD',
  PROCESSING = 'PROCESSING',
  VISUALIZE = 'VISUALIZE',
  ERROR = 'ERROR'
}

export interface QuantitativeMetric {
  label: string;
  value: number; // 0-100 scale
  description: string;
}

export interface ConceptNode {
  id: string;
  name: string;
  category: string;
  description: string;
  importance: number;
}

export interface DeepDiveSection {
  title: string;
  simplified_explanation: string;
  technical_detail: string;
  key_takeaway: string;
}

export interface PaperAnalysis {
  title: string;
  authors: string[];
  publication_date: string;
  executive_summary: string;
  metrics: QuantitativeMetric[];
  concepts: ConceptNode[];
  sections: DeepDiveSection[];
  future_implications: string[];
}
