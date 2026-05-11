export type ProductCategory = "vodka" | "whisky" | "wine" | "beer" | "liqueur" | "rum";

export interface Product {
  id: string;
  name: string;
  capacity: string;
  price: number;
  image: string;
  category: ProductCategory;
  alcoholContent?: number;
  description?: string;
  customOrderDetails?: {
    description: string;
    preferences: Record<string, unknown>;
  };
}
