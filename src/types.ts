export type CategoryType = 'appliance' | 'transport' | 'energy' | 'waste';
export type UnitType = 'hours' | 'km' | 'kWh';

export interface DetectedItem {
  item_name: string;
  category: CategoryType;
  default_unit: UnitType;
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
