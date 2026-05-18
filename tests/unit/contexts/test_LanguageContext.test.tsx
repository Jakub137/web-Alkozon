import { describe, it, expect } from "vitest";
import { render, screen, act } from "@testing-library/react";
import { LanguageProvider, useLanguage } from "@/context/LanguageContext";

const TestComponent = () => {
  const { lang, setLang, dict } = useLanguage();
  return (
    <div>
      <div data-testid="current-lang">{lang}</div>
      <div data-testid="dict-val">{dict.navbar?.login || "brak-klucza"}</div>
      <button onClick={() => setLang("en")} data-testid="btn-en">
        EN
      </button>
      <button onClick={() => setLang("pl")} data-testid="btn-pl">
        PL
      </button>
    </div>
  );
};

describe("LanguageContext Unit Tests", () => {
  it("domyślnym językiem powinien być polski i zawierać polskie klucze", () => {
    render(
      <LanguageProvider>
        <TestComponent />
      </LanguageProvider>
    );

    expect(screen.getByTestId("current-lang").textContent).toBe("pl");
    // Upewniamy się, że dict jest podpięty poprawnie - tu testujemy ogólne działanie
    // Spodziewamy się polskiego tłumaczenia (w zależności od pl.json np. Zaloguj)
    expect(screen.getByTestId("dict-val").textContent).not.toBe("brak-klucza");
  });

  it("powinien pozwalać na zmianę języka za pomocą setLang", () => {
    render(
      <LanguageProvider>
        <TestComponent />
      </LanguageProvider>
    );

    act(() => {
      screen.getByTestId("btn-en").click();
    });

    expect(screen.getByTestId("current-lang").textContent).toBe("en");

    act(() => {
      screen.getByTestId("btn-pl").click();
    });

    expect(screen.getByTestId("current-lang").textContent).toBe("pl");
  });
});
