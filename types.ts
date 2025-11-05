
export interface Product {
  id: string;
  name: string;
  sku: string;
  category: string;
  currentStock: number;
  reorderLevel: number;
}

export interface SalesHistory {
  productId: string;
  weeklySales: number[]; // e.g., [10, 12, 15, 11, ...] for past weeks
}

export interface RestockRecommendation {
  shouldRestock: boolean;
  quantity: number;
  reason: string;
}

export interface PredictionResult {
  productId: string;
  forecastedDemand: number[]; // for next 4 weeks
  restockRecommendation: RestockRecommendation;
}

export interface EnrichedProduct extends Product {
  prediction: PredictionResult | null;
  salesHistory: number[];
}
