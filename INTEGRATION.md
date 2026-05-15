# Integracja frontu (web-Alkozon) z API

## Wymagania

- Node.js (wersja zgodna z projektem, np. 20+)
- Działający backend REST pod adresem ustawionym w zmiennych środowiskowych

## Backend `api-alcozon` (lokalnie)

- Domyślny port: **8080** (`application.yml`).
- Prefiks ścieżek: **`/api`** — kontrolery w pakiecie `modules` są mapowane np. na `/api/auth/login`, `/api/products`, `/api/orders`, `/api/custom-orders`.
- CORS: w `application.yml` jest już whitelist m.in. dla `http://localhost:3000` (Next.js).
- Dokumentacja: **Swagger UI** pod `http://localhost:8080/docs`, OpenAPI pod `/api-docs`.
- WebSocket (STOMP): typowo `ws://localhost:8080/ws` — ustaw `NEXT_PUBLIC_WS_URL` jeśli inferencja z `NEXT_PUBLIC_API_URL` nie pasuje.

## Zmienne środowiskowe

Skopiuj `.env.example` do `.env.local` i uzupełnij:

| Zmienna | Opis |
|--------|------|
| `NEXT_PUBLIC_API_URL` | Bazowy URL API (bez końcowego `/`), np. `https://api-alcozon.onrender.com` |
| `NEXT_PUBLIC_WS_URL` | Opcjonalnie: pełny URL WebSocketa do powiadomień o statusie zamówienia. Jeśli puste, front próbuje wywnioskować adres z `NEXT_PUBLIC_API_URL` |
| `NEXT_PUBLIC_ENABLE_WEB_PUSH` | `true`/`false` — włącza bootstrap Web Push (domyślnie `false`) |
| `NEXT_PUBLIC_FIREBASE_API_KEY` | Konfiguracja Firebase Web App |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | Konfiguracja Firebase Web App |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | Konfiguracja Firebase Web App |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | Konfiguracja Firebase Web App |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | Konfiguracja Firebase Web App |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | Konfiguracja Firebase Web App |
| `NEXT_PUBLIC_FIREBASE_VAPID_KEY` | Klucz Web Push (Firebase Cloud Messaging) |
| `NEXT_PUBLIC_ENABLE_NOTIFICATION_MOCK_WS` | Opcjonalne mock powiadomień w UI (`true` tylko do demo; domyślnie `false`) |

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
- **Status po numerze i e-mailu** (`/order-status`) — publiczny track przez `GET /api/orders/track?orderId=...&email=...` (bez JWT). Zalogowany klient ma pełne szczegóły przez endpointy konta.
- **Profil użytkownika** — po logowaniu/rejestracji/odświeżeniu front synchronizuje dane konta przez `GET /api/users/me` (rola, imię, nazwisko, email itp.).
- **Token urządzenia (FCM / WEB)** — front ma przygotowany endpoint `POST /api/devices/fcm` (platforma `WEB`) i rejestruje zapisany token po loginie / odświeżeniu sesji. Integracja z Firebase po stronie web może użyć `registerWebPushToken(...)` z `AuthContext`.
- **Web Push bootstrap** — komponent `WebPushBootstrap` uruchamia pobranie tokena FCM dla zalogowanego użytkownika (nie `GUEST`) i przesyła token do API. Działa tylko gdy `NEXT_PUBLIC_ENABLE_WEB_PUSH=true` oraz konfiguracja Firebase jest kompletna.
- **Globalny feed powiadomień** — mock `[MOCK WS]` jest wyłączony domyślnie; można go włączyć tylko zmienną `NEXT_PUBLIC_ENABLE_NOTIFICATION_MOCK_WS=true` do celów demo.

## Testy (skrót)

```bash
npm run lint
npm run test
npm run build
npm run test:e2e
```

E2E zakładają uruchomiony serwer deweloperski (zgodnie z konfiguracją Playwright w repo).
