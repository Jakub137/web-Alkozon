# Integracja frontu (web-Alkozon) z API

## Wymagania

- Node.js (wersja zgodna z projektem, np. 20+)
- Działający backend REST pod adresem ustawionym w zmiennych środowiskowych

## Zmienne środowiskowe

Skopiuj `.env.example` do `.env.local` i uzupełnij:

| Zmienna | Opis |
|--------|------|
| `NEXT_PUBLIC_API_URL` | Bazowy URL API (bez końcowego `/`), np. `https://api-alcozon.onrender.com` |
| `NEXT_PUBLIC_WS_URL` | Opcjonalnie: pełny URL WebSocketa do powiadomień o statusie zamówienia. Jeśli puste, front próbuje wywnioskować adres z `NEXT_PUBLIC_API_URL` |

## Uruchomienie lokalne

```bash
npm install
npm run dev
```

Aplikacja domyślnie: `http://localhost:3000`.

## Zamówienia i konto

- **Koszyk** działa lokalnie (bez logowania).
- **Złożenie zamówienia** (produkty z katalogu + zamówienia własne wysyłane jako custom orders) wymaga zalogowania użytkownika z rolą **`CUSTOMER`** oraz potwierdzenia pełnoletności w modalu wieku.
- **Lista „Moje zamówienia”** (`/my-orders`) i podgląd szczegółów z API po zalogowaniu — tak samo tylko dla `CUSTOMER`.
- **Status po numerze i e-mailu** (`/order-status`) — wyszukiwanie po danych demonstracyjnych z mocków; zalogowany klient może dodatkowo odświeżać szczegóły z API po numerze zamówienia.

## Testy (skrót)

```bash
npm run lint
npm run test
npm run build
npm run test:e2e
```

E2E zakładają uruchomiony serwer deweloperski (zgodnie z konfiguracją Playwright w repo).
