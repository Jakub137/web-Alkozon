import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { useLanguage } from "@/context/LanguageContext";

vi.mock("@/context/LanguageContext", () => ({
  useLanguage: vi.fn(),
}));

describe("LanguageSwitcher Unit Tests", () => {
  it("powinien wyrenderować dwie flagi i zastosować zieloną ramkę dla wybranego języka", () => {
    (useLanguage as any).mockReturnValue({
      lang: "pl",
      setLang: vi.fn(),
    });

    render(<LanguageSwitcher />);

    const plFlag = screen.getByAltText("PL");
    const enFlag = screen.getByAltText("EN");

    expect(plFlag).toBeInTheDocument();
    expect(enFlag).toBeInTheDocument();

    // Sprawdź czy pl ma zieloną ramkę
    expect(plFlag).toHaveClass("border-green-500");
    expect(enFlag).toHaveClass("border-gray-500");
  });

  it("powinien wywołać setLang przy kliknięciu na flagę", () => {
    const setLangMock = vi.fn();
    (useLanguage as any).mockReturnValue({
      lang: "pl",
      setLang: setLangMock,
    });

    render(<LanguageSwitcher />);

    const enFlag = screen.getByAltText("EN");
    fireEvent.click(enFlag);

    expect(setLangMock).toHaveBeenCalledWith("en");
  });
});
