/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require('fs');

const products = [];
let id = 1;

function add(name, category, price, capacity, alcoholContent, imageIndex, maxImages) {
    const currentImageIndex = (imageIndex % maxImages) + 1;
    const image = `${category}-mockup-${currentImageIndex}.png`;
    products.push({ id: id.toString(), name, category, price, capacity, alcoholContent, image: `/products/${image}` });
    id++;
}

// Vodka (Polska)
const vodkas = [
    ["Chopin Potato", 159.99, "0.7L", 40],
    ["Biały Bocian", 49.99, "0.7L", 40],
    ["Wyborowa", 44.99, "0.7L", 40],
    ["Żubrówka Bison Grass", 45.99, "0.7L", 37.5],
    ["Pan Tadeusz", 48.99, "0.7L", 40],
    ["Soplica Szlachetna", 42.99, "0.7L", 40]
];
vodkas.forEach((v, index) => add(v[0], "vodka", v[1], v[2], v[3], index, 3));

// Whisky (Polskie destylaty)
const whiskys = [
    ["J.A. Baczewski Whisky", 139.99, "0.7L", 43],
    ["Wild Fields Single Malt", 249.99, "0.7L", 46],
    ["Kozuba Starkus", 179.99, "0.7L", 40],
    ["Bieszczadzka Whisky", 159.99, "0.7L", 40],
    ["Langlander Polish Whisky", 129.99, "0.7L", 40],
    ["Balticus Single Malt", 299.99, "0.7L", 46]
];
whiskys.forEach((v, index) => add(v[0], "whisky", v[1], v[2], v[3], index, 3));

// Wine (Polskie winnice)
const wines = [
    ["Winnica Turnau Rondo/Regent", 99.99, "0.75L", 12.5],
    ["Srebrna Góra Cabernet Cortis", 79.99, "0.75L", 13],
    ["Winnica Adoria Riesling", 89.99, "0.75L", 11.5],
    ["Winnica Jaworek Pinot Noir", 119.99, "0.75L", 12],
    ["Winnica Płochockich Hibernal", 85.99, "0.75L", 12.5],
    ["Winnica Silesian Solaris", 95.99, "0.75L", 13]
];
wines.forEach((v, index) => add(v[0], "wine", v[1], v[2], v[3], index, 3));

// Beer (Polskie browary)
const beers = [
    ["Tyskie Gronie", 4.50, "0.5L", 5.2],
    ["Żywiec Premium", 4.60, "0.5L", 5.6],
    ["Perła Chmielowa", 4.20, "0.5L", 6.0],
    ["Łomża Jasne", 4.00, "0.5L", 5.7],
    ["Kasztelan Niepasteryzowane", 3.99, "0.5L", 5.0],
    ["Namysłów Pils", 4.30, "0.5L", 5.8]
];
beers.forEach((v, index) => add(v[0], "beer", v[1], v[2], v[3], index, 3));

// Liqueur (Polskie nalewki i likiery)
const liqueurs = [
    ["Soplica Wiśniowa", 35.99, "0.5L", 28],
    ["Krupnik Miodowy", 39.99, "0.5L", 38],
    ["Nalewka Babuni Malina", 34.99, "0.5L", 18],
    ["J.A. Baczewski Pomarańczówka", 79.99, "0.5L", 38],
    ["Soplica Orzech Laskowy", 35.99, "0.5L", 28],
    ["Złota Woda (Goldwasser)", 129.99, "0.5L", 40]
];
liqueurs.forEach((v, index) => add(v[0], "liqueur", v[1], v[2], v[3], index, 3));

// Rum (Popularne w PL lub polskie marki)
const rums = [
    ["Rum Seniorita", 59.99, "0.7L", 37.5],
    ["J.A. Baczewski Rum", 89.99, "0.7L", 38],
    ["Galeon Rum", 49.99, "0.5L", 38],
    ["Golden Rum Polmos", 54.99, "0.5L", 38],
    ["Dictador 12 YO (Polski kapitał)", 199.99, "0.7L", 40],
    ["Copernicus Rum", 79.99, "0.5L", 40]
];
rums.forEach((v, index) => add(v[0], "rum", v[1], v[2], v[3], index, 2));

const output = `import { Product } from "@/types/product";

export const mockProducts: Product[] = ${JSON.stringify(products, null, 2)};
`;

fs.writeFileSync('src/data/products.ts', output);
console.log("Done generating 36 Polish products");
