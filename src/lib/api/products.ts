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

function assetPath(category: ProductCategory, fileName: string): string {
  return `/products/${encodeURIComponent(category)}/${encodeURIComponent(fileName)}`;
}

const CATEGORY_ICON_FILES: Record<ProductCategory, string[]> = {
  beer: [
    "Bernard Świąteczny.png",
    "Browar Jabłonowo.png",
    "Cieszyn Wheat.png",
    "Heineken.png",
    "Karmi Classic.png",
    "Lech free.png",
    "Okocim.png",
    "Paropramen.png",
    "Piwo rzemieślnicze mazurskie.png",
    "Tatra jasna.png",
    "Warka Radler Mix.png",
    "Zatecki Svetly Lezak.png",
  ],
  liqueur: [
    "Aperol.png",
    "Baileys.png",
    "Carolans.png",
    "Cointreau.png",
    "Disaronno.png",
    "Drambuie.png",
    "Grand Marnier.png",
    "Jagermeister.png",
    "Kahlua likier kawowy.png",
    "Malibu.png",
    "Passoa.png",
    "Pigwówka.png",
    "Sheridan's.png",
  ],
  rum: [
    "Bacardi Carta Blanca.png",
    "Bacardi Carta Negra.png",
    "Bacardi Carta Oro.png",
    "Botucal Reserva Exclusiva.png",
    "Botucal rum.png",
    "Bumbu XO.png",
    "Bumbu.png",
    "Captain Morgan Dark Rum.png",
    "Captain Morgan Spiced Gold.png",
    "Dictador 12.png",
    "Don Papa Masskara.png",
    "Eminente Ron De Cuba.png",
    "Rum Kraken.png",
  ],
  vodka: [
    "Absolut Vodka.png",
    "Belvedere.png",
    "Biały Bocian.png",
    "Czarna Olcha.png",
    "Finlandia.png",
    "J. A. Baczewski.png",
    "Ogiński Vodka.png",
    "Pan Tadeusz.png",
    "Soplica.png",
    "Stumbras Vodka.png",
    "Wódka Ostoya.png",
    "Wyborowa.png",
  ],
  whisky: [
    "Aberlour 12.png",
    "Ardbeg 10 y.o. Single Malt.png",
    "Ardbeg 8.png",
    "Auchentoshan 12.png",
    "Auchentoshan Three Wood.png",
    "Ballantine's Brasil.png",
    "Ballantine's Finest.png",
    "Balvenie 12.png",
    "Bulleit Bourbon Frontier Whiskey.png",
    "Bulleit Rye Burbon.png",
    "Bushmills Black Bush.png",
    "Bushmills Original.png",
    "Gentleman Jack Tennessee Whiskey.png",
    "Hibiki Suntory Whisky.png",
    "Jack Daniel's Single Barrel.png",
    "Jack Daniel's Tennessee Fire.png",
    "Jack Daniel's Tennessee Honey.png",
    "Jack Daniel's Tennessee Whiskey.png",
    "Knob Creek.png",
    "Macallan 18 Double Cask.png",
    "Macallan Rare Cask 2023.png",
    "Nikka Whisky From The Barrel.png",
    "Tenjaku Blended Japanese Whisky.png",
    "Tenjaku Whisky Pure Malt.png",
    "The Chita whisky.png",
    "Tullamore Dew.png",
  ],
  wine: [
    "Chardonnay 2022.png",
    "CIN&CIN.png",
    "Grzaniec Benedyktyński.png",
    "Pet-Nat brut białe.png",
    "Pet-Nat brut czerwone.png",
    "Rosé Reserva.png",
    "Wino Gruszkowe Musujące.png",
    "Wino Jagodowe Słodkie.png",
    "Wino Mirabelka Słodkie.png",
    "Wino z Aronii Ekologiczne Wytrawne.png",
    "Zachowickie półsłodkie czerwone.png",
  ],
};

function normalizeLabel(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/\b\d+\s?(ml|l)\b/gi, " ")
    .replace(/\b\d+(\.\d+)?\s?%\b/g, " ")
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function resolveLocalImageByName(category: ProductCategory, productName: string): string | null {
  const files = CATEGORY_ICON_FILES[category];
  const normalizedProductName = normalizeLabel(productName);
  if (!normalizedProductName) return null;

  const exactMatch = files.find((fileName) => normalizeLabel(fileName) === normalizedProductName);
  if (exactMatch) return assetPath(category, exactMatch);

  const partialMatch = files.find((fileName) => {
    const normalizedFileName = normalizeLabel(fileName);
    return (
      normalizedFileName.includes(normalizedProductName) ||
      normalizedProductName.includes(normalizedFileName)
    );
  });
  if (partialMatch) return assetPath(category, partialMatch);

  return null;
}

const CATEGORY_VOLUME_ICON_MAP: Record<
  ProductCategory,
  Array<{ maxMl: number; fileName: string }>
> = {
  vodka: [
    { maxMl: 500, fileName: "Biały Bocian.png" },
    { maxMl: 700, fileName: "Absolut Vodka.png" },
    { maxMl: Number.POSITIVE_INFINITY, fileName: "Wyborowa.png" },
  ],
  whisky: [
    { maxMl: 500, fileName: "Ballantine's Finest.png" },
    { maxMl: 700, fileName: "Jack Daniel's Tennessee Whiskey.png" },
    { maxMl: Number.POSITIVE_INFINITY, fileName: "Macallan Rare Cask 2023.png" },
  ],
  wine: [
    { maxMl: 750, fileName: "Chardonnay 2022.png" },
    { maxMl: Number.POSITIVE_INFINITY, fileName: "Rosé Reserva.png" },
  ],
  beer: [
    { maxMl: 330, fileName: "Heineken.png" },
    { maxMl: 500, fileName: "Okocim.png" },
    { maxMl: Number.POSITIVE_INFINITY, fileName: "Bernard Świąteczny.png" },
  ],
  liqueur: [
    { maxMl: 500, fileName: "Malibu.png" },
    { maxMl: 700, fileName: "Jagermeister.png" },
    { maxMl: Number.POSITIVE_INFINITY, fileName: "Sheridan's.png" },
  ],
  rum: [
    { maxMl: 500, fileName: "Bacardi Carta Blanca.png" },
    { maxMl: 700, fileName: "Captain Morgan Spiced Gold.png" },
    { maxMl: Number.POSITIVE_INFINITY, fileName: "Don Papa Masskara.png" },
  ],
};

function resolveLocalImageByVolume(category: ProductCategory, volumeMl: number | null): string {
  const map = CATEGORY_VOLUME_ICON_MAP[category];
  const resolvedMl = typeof volumeMl === "number" && volumeMl > 0 ? volumeMl : 700;
  const entry = map.find((candidate) => resolvedMl <= candidate.maxMl) || map[map.length - 1];
  return assetPath(category, entry.fileName);
}

function normalizeImageUrl(
  imageUrl: string | null,
  category: ProductCategory,
  volumeMl: number | null
): string {
  if (!imageUrl) return "/placeholder-product.svg";
  if (imageUrl.startsWith("http")) return imageUrl;
  if (imageUrl.startsWith("/")) return imageUrl;
  if (imageUrl.toLowerCase() === "frontend:auto") {
    // Optional backend hint for local icon mapping by category + capacity.
    return resolveLocalImageByVolume(category, volumeMl);
  }
  return `/${imageUrl}`;
}

function toCapacity(volumeMl: number | null): string {
  if (!volumeMl || volumeMl <= 0) return "—";
  if (volumeMl % 1000 === 0) return `${volumeMl / 1000}L`;
  return `${(volumeMl / 1000).toFixed(2).replace(/\.00$/, "")}L`;
}

function mapApiProduct(apiProduct: ApiProduct): Product {
  const category = normalizeCategory(apiProduct.category);
  const imageFromName = resolveLocalImageByName(category, apiProduct.name);
  return {
    id: String(apiProduct.id),
    name: apiProduct.name,
    category,
    price: Number(apiProduct.price),
    capacity: toCapacity(apiProduct.volumeMl),
    alcoholContent: apiProduct.abv ?? undefined,
    image: apiProduct.imageUrl
      ? normalizeImageUrl(apiProduct.imageUrl, category, apiProduct.volumeMl)
      : imageFromName || resolveLocalImageByVolume(category, apiProduct.volumeMl),
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
