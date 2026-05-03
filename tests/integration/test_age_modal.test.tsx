import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, beforeEach } from "vitest";
import AgeVerificationModal from "@/components/AgeVerificationModal";
import { AgeProvider } from "@/context/AgeContext";
import { LanguageProvider } from "@/context/LanguageContext";

describe("Integration Tests - AgeVerificationModal", () => {
  beforeEach(() => {
    // Resetujemy localStorage przed każdym testem
    localStorage.clear();
  });

  it("powinien wyrenderować modal, gdy status to unknown", () => {
    render(
      <LanguageProvider>
        <AgeProvider>
          <AgeVerificationModal />
        </AgeProvider>
      </LanguageProvider>
    );

    expect(screen.getByText("Czy masz ukończone 18 lat?")).toBeInTheDocument();
    expect(screen.getByText("Tak, mam ukończone 18 lat")).toBeInTheDocument();
    expect(screen.getByText("Nie mam 18 lat")).toBeInTheDocument();
  });

  it("powinien zaktualizować localStorage i schować modal po kliknięciu 'Tak'", () => {
    render(
      <LanguageProvider>
        <AgeProvider>
          <AgeVerificationModal />
        </AgeProvider>
      </LanguageProvider>
    );

    const yesButton = screen.getByText("Tak, mam ukończone 18 lat");
    fireEvent.click(yesButton);

    expect(screen.queryByText("Czy masz ukończone 18 lat?")).not.toBeInTheDocument();
    expect(localStorage.getItem("alkozon_age_status")).toBe("adult");
  });
  
  it("powinien zablokować i zaktualizować localStorage po kliknięciu 'Nie'", () => {
    render(
      <LanguageProvider>
        <AgeProvider>
          <AgeVerificationModal />
        </AgeProvider>
      </LanguageProvider>
    );

    const noButton = screen.getByText("Nie mam 18 lat");
    fireEvent.click(noButton);

    expect(screen.queryByText("Czy masz ukończone 18 lat?")).not.toBeInTheDocument();
    expect(localStorage.getItem("alkozon_age_status")).toBe("underage");
  });
});
