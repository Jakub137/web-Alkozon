import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import BackHomeButton from "@/components/BackHomeButton";
import { useLanguage } from "@/context/LanguageContext";
import { usePathname, useSearchParams } from "next/navigation";

vi.mock("@/context/LanguageContext", () => ({
  useLanguage: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  usePathname: vi.fn(),
  useSearchParams: vi.fn(),
}));

vi.mock("next/link", () => ({
  default: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href} data-testid="back-link">
      {children}
    </a>
  ),
}));

describe("BackHomeButton Unit Tests", () => {
  beforeEach(() => {
    (useLanguage as any).mockReturnValue({
      dict: {
        navbar: {
          returnHome: "Wróć na stronę główną",
        },
      },
    });
  });

  it("nie powinien renderować niczego, gdy jesteśmy na ścieżce /", () => {
    (usePathname as any).mockReturnValue("/");
    (useSearchParams as any).mockReturnValue({ get: vi.fn() });

    const { container } = render(<BackHomeButton />);
    expect(container).toBeEmptyDOMElement();
  });

  it("powinien wyrenderować link do / na standardowej podstronie", () => {
    (usePathname as any).mockReturnValue("/faq");
    (useSearchParams as any).mockReturnValue({ get: vi.fn().mockReturnValue(null) });

    render(<BackHomeButton />);

    const link = screen.getByTestId("back-link");
    expect(link).toHaveAttribute("href", "/");
    expect(link).toHaveTextContent("Wróć na stronę główną");
  });

  it("powinien wyrenderować link do /shop gdy jesteśmy w koszyku z param z shop", () => {
    (usePathname as any).mockReturnValue("/cart");
    (useSearchParams as any).mockReturnValue({ get: vi.fn().mockReturnValue("shop") });

    render(<BackHomeButton />);

    const link = screen.getByTestId("back-link");
    expect(link).toHaveAttribute("href", "/shop");
  });
});
