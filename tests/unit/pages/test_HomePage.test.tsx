import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import HomePage from '@/app/page';
import { useLanguage } from '@/context/LanguageContext';

vi.mock('@/context/LanguageContext', () => ({
  useLanguage: vi.fn()
}));

vi.mock('next/link', () => ({
  default: ({ children, href }: { children: React.ReactNode, href: string }) => (
    <a href={href}>{children}</a>
  )
}));

describe('HomePage Unit Tests', () => {
  beforeEach(() => {
    (useLanguage as any).mockReturnValue({
      dict: {
        home: {
          title: 'Witaj w Alkozon',
          subtitle: 'Najlepszy sklep',
          tiles: {
            shop: { title: 'Sklep', desc: 'Opis' },
            cart: { title: 'Koszyk', desc: 'Opis koszyka' },
            status: { title: 'Status', desc: 'Opis statusu' },
            history: { title: 'Historia', desc: 'Opis historii' },
            custom: { title: 'Custom', desc: 'Opis custom' },
            faq: { title: 'FAQ', desc: 'Opis faq' }
          }
        }
      }
    });
  });

  it('powinien wyrenderować główny tytuł i wszystkie kafelki', () => {
    render(<HomePage />);
    expect(screen.getByText('Witaj w Alkozon')).toBeInTheDocument();
    expect(screen.getByText('Najlepszy sklep')).toBeInTheDocument();
    
    const links = screen.getAllByRole('link');
    expect(links.length).toBe(6);
    expect(screen.getByText('Sklep')).toBeInTheDocument();
    expect(screen.getByText('Koszyk')).toBeInTheDocument();
  });
});
