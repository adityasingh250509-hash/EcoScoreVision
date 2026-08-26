export type CategoryType = 'appliance' | 'transport' | 'energy' | 'waste';
export type UnitType = 'hours' | 'km' | 'kWh';

export interface DetectedItem {
  item_name: string;
  category: CategoryType;
  default_unit: UnitType;
  estimated_quantity?: number;
  estimated_factor?: number;
  factor_label?: string;
}

export interface CalculationResult {
  emissions: number; // in kg CO2
  treeOffset: number; // count of trees
  status: 'low' | 'moderate' | 'high';
  advice: string[];
}

export interface HistoryItem {
  id: string;
  timestamp: string;
  item_name: string;
  category: CategoryType;
  quantity: number;
  unit: UnitType;
  emissions: number;
  treeOffset: number;
}

export interface ClimateNewsArticle {
  id: string;
  title: string;
  summary: string;
  fullContent?: string;
  url: string;
  imageUrl: string;
  category: 'renewables' | 'reforestation' | 'policy' | 'mobility' | 'oceans' | 'general';
  publishedDate: string;
  readTime: string;
  source: string;
  impactScore?: number; // 1-100 positivity/impact metric
  keyTakeaway?: string;
}

export interface ClimateHotspot {
  id: string;
  name: string;
  region: string;
  lat: number;
  lng: number;
  type: 'renewable' | 'reforestation' | 'conservation' | 'research';
  title: string;
  metric: string;
  description: string;
  sdgTarget: string;
}

export interface UserProfile {
  name: string;
  email: string;
  avatar: string;
  title: string;
  joinedDate: string;
  monthlyBudget: number; // in kg CO2
  badges: {
    id: string;
    name: string;
    description: string;
    icon: string;
    unlocked: boolean;
    unlockedAt?: string;
  }[];
}
