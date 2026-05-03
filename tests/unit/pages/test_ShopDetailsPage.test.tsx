import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import ShopProductPage from '@/app/shop/[id]/page';
import { useLanguage } from '@/context/LanguageContext';

vi.mock('@/context/LanguageContext', () => ({
  useLanguage: vi.fn()
}));
vi.mock('next/link', () => ({
  default: ({ children, href }: { children: React.ReactNode, href: string }) => (
    <a href={href}>{children}</a>
  )
}));
vi.mock('@/data/products', () => ({
  mockProducts: [
    { id: '1', name: 'Wódka czysta', capacity: '0.5L', price: 50, alcoholContent: 40 }
  ]
}));

describe('ShopDetailsPage Unit Tests', () => {
  beforeEach(() => {
    (useLanguage as any).mockReturnValue({
      dict: {
        shop: {
          noProducts: 'Nie znaleziono produktu',
          details: {
            backToShop: 'Wróć do sklepu',
            capacity: 'Pojemność',
            alcoholContent: 'Zawartość alkoholu',
            descriptionTitle: 'Opis',
            historyTitle: 'Historia'
          },
          product: { addToCart: 'Dodaj' }
        }
      }
    });
  });

  it('powinien wyrenderować błąd gdy produkt nie istnieje', () => {
    render(<ShopProductPage params={{ id: '999' }} />);
    expect(screen.getByText('Nie znaleziono produktu')).toBeInTheDocument();
  });

  it('powinien wyrenderować szczegóły produktu gdy istnieje', () => {
    render(<ShopProductPage params={{ id: '1' }} />);
    expect(screen.getByText('Wódka czysta')).toBeInTheDocument();
    expect(screen.getAllByText('0.5L').length).toBeGreaterThan(0);
    expect(screen.getByText('50.00 zł')).toBeInTheDocument();
    expect(screen.getByText('40%')).toBeInTheDocument();
  });
});
