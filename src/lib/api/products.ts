import { apiRequest } from "./client";
import type { Product, ProductCategory } from "@/types/product";

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

interface ApiProduct {
  id: number;
  name: string;
  description: string | null;
  category: string | null;
  price: number;
  volumeMl: number | null;
  abv: number | null;
  imageUrl: string | null;
  active: boolean;
  stockQuantity: number;
}

const VALID_CATEGORIES: ProductCategory[] = ["vodka", "whisky", "wine", "beer", "liqueur", "rum"];

function normalizeCategory(category: string | null): ProductCategory {
  const normalized = (category || "").toLowerCase() as ProductCategory;
  if (VALID_CATEGORIES.includes(normalized)) return normalized;
  return "vodka";
}

function normalizeImageUrl(imageUrl: string | null): string {
  if (!imageUrl) return "/placeholder-product.png";
  if (imageUrl.startsWith("http")) return imageUrl;
  if (imageUrl.startsWith("/")) return imageUrl;
  return `/${imageUrl}`;
}

function toCapacity(volumeMl: number | null): string {
  if (!volumeMl || volumeMl <= 0) return "—";
  if (volumeMl % 1000 === 0) return `${volumeMl / 1000}L`;
  return `${(volumeMl / 1000).toFixed(2).replace(/\.00$/, "")}L`;
}

function mapApiProduct(apiProduct: ApiProduct): Product {
  return {
    id: String(apiProduct.id),
    name: apiProduct.name,
    category: normalizeCategory(apiProduct.category),
    price: Number(apiProduct.price),
    capacity: toCapacity(apiProduct.volumeMl),
    alcoholContent: apiProduct.abv ?? undefined,
    image: normalizeImageUrl(apiProduct.imageUrl),
    description: apiProduct.description || undefined,
  };
}

type ProductSort = "nameAsc" | "nameDesc" | "priceAsc" | "priceDesc";

const SORT_TO_API: Record<ProductSort, string> = {
  nameAsc: "name,asc",
  nameDesc: "name,desc",
  priceAsc: "price,asc",
  priceDesc: "price,desc",
};

export interface ProductsQuery {
  page: number;
  size: number;
  sort: ProductSort;
  q?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
}

export async function getProducts(query: ProductsQuery): Promise<PageResponse<Product>> {
  const params = new URLSearchParams();
  params.set("page", String(query.page));
  params.set("size", String(query.size));
  params.set("sort", SORT_TO_API[query.sort]);

  if (query.q?.trim()) params.set("q", query.q.trim());
  if (query.category?.trim()) params.set("category", query.category.trim());
  if (typeof query.minPrice === "number") params.set("minPrice", query.minPrice.toString());
  if (typeof query.maxPrice === "number") params.set("maxPrice", query.maxPrice.toString());

  const response = await apiRequest<PageResponse<ApiProduct>>(`/api/products?${params.toString()}`);
  return {
    ...response,
    content: response.content.map(mapApiProduct),
  };
}

export async function getProductById(id: string): Promise<Product> {
  const response = await apiRequest<ApiProduct>(`/api/products/${id}`);
  return mapApiProduct(response);
}
