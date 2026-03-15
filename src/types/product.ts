export type ProductCategory = "vodka" | "whisky" | "wine" | "beer" | "liqueur";

export interface Product {
  id: string;
  name: string;
  capacity: string;
  price: number;
  image: string;
  category: ProductCategory;
  alcoholContent?: number;
}
