
export interface InventoryItem {
  id: string;
  name: string;
  category: string;
  current_stock: number;
  minimum_stock: number;
  average_daily_sales: number;
  today_sales: number;
}

export interface AnalysisResponse {
  status: string;
  actions: string;
  fastSellers: string;
  advice: string;
}
