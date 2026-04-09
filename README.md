# Alkozon - Klient Webowy (Next.js)

Aplikacja webowa dla systemu e-commerce Alkozon, realizująca zaawansowane mechanizmy prezentacyjne oraz twardy system zabezpieczeń front-endowych. Projekt zoptymalizowany pod kątem szybkości działania oraz czystego kodu.

## Technologie

- **Framework:** Next.js 16 (App Router)
- **Biblioteka:** React 19
- **Język:** TypeScript
- **Stylowanie:** Tailwind CSS v4
- **Zarządzanie Stanem & Formularze:** React-Hook-Form, Zod (Schema-Based Validation)
- **UI:** Przystosowane do standardów WCAG, Ikony Lucide React

## Główne funkcjonalności

- **Architektura Bezpieczeństwa:** Izolowany kontekst AuthContext chroniący ścieżki i przechowujący tokeny sesyjne.
- **Ochrona Anti Brute-Force (Rate Limiting):** Aplikacja uczy się wzorców i odrzuca dostęp do autoryzacji po osiągnięciu progu 5 błędnych prób.
- **Funkcja Auto-Logout:** Hook stale monitorujący aktywność urządzenia i zabezpieczający pozostawione otwarte sesje poprzez automatyczne wylogowanie powiadomieniem (30s bezczynności).
- **Zabezpieczenie przed Injection:** Pełne oparcie formularzy Logowania i Rejestracji na predykatach biblioteki Zod.
- **Wielojęzyczność (i18n):** Globalny kontekst dla dynamicznych wdrożeń językowych (PL / ENG).
- **Dark Mode:** Mechanizm Theme Switcher dopasowujący kontrasty przycisków i kafelków strony głównej.

## Uruchomienie lokalne

Aby uruchomić aplikację w środowisku developerskim, upewnij się, że posiadasz zainstalowanego Node.js.

1. Pobierz brakujące moduły `node_modules`:
   ```bash
   npm install
   ```

2. (Opcjonalnie) Zasil zmienne środowiskowe tworząc nową instancję `.env.local` na wzór `.env.example`, aby podłączyć bazowe URL do serwerów API.
   
3. Uruchom silnik deweloperski Next:
   ```bash
   npm run dev
   ```

Otwórz [http://localhost:3000](http://localhost:3000) w swojej przeglądarce, by zobaczyć platformę.

---
*Projekt uczelniany - Warstwa Webowa przygotowana w ramach zespołu Alkozon.*
