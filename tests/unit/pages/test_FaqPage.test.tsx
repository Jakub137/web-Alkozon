import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import FaqPage from '@/app/faq/page';
import { useLanguage } from '@/context/LanguageContext';

vi.mock('@/context/LanguageContext', () => ({
  useLanguage: vi.fn()
}));

const mockDict = {
  faqPage: {
    title: 'FAQ',
    subtitle: 'Pomoc',
    searchPlaceholder: 'Szukaj...',
    categories: {
      all: 'Wszystkie',
      orders: 'Zamówienia',
      payments: 'Płatności',
      delivery: 'Dostawa',
      products: 'Produkty',
      account: 'Konto'
    },
    noResults: 'Brak wyników',
    items: [
      {
        id: '1',
        category: 'orders',
        question: 'Jak anulować zamówienie?',
        answer: 'Skontaktuj się z supportem.'
      },
      {
        id: '2',
        category: 'delivery',
        question: 'Ile trwa dostawa?',
        answer: 'Zazwyczaj 2 dni robocze.'
      }
    ]
  }
};

describe('FaqPage Unit Tests', () => {
  beforeEach(() => {
    (useLanguage as any).mockReturnValue({ dict: mockDict });
  });

  it('powinien wyrenderować wszystkie pytania w kategorii "Wszystkie"', () => {
    render(<FaqPage />);
    
    expect(screen.getByText('Jak anulować zamówienie?')).toBeInTheDocument();
    expect(screen.getByText('Ile trwa dostawa?')).toBeInTheDocument();
  });

  it('powinien przefiltrować listę po kliknięciu w kategorię', () => {
    render(<FaqPage />);
    
    // Klikamy w kategorie Dostawa
    fireEvent.click(screen.getByText('Dostawa'));

    // Powinno ukryć pytania z innej kategorii
    expect(screen.queryByText('Jak anulować zamówienie?')).not.toBeInTheDocument();
    expect(screen.getByText('Ile trwa dostawa?')).toBeInTheDocument();
  });

  it('powinien wyszukiwać pytania po wpisanym tekście', () => {
    render(<FaqPage />);
    
    const input = screen.getByPlaceholderText('Szukaj...');
    fireEvent.change(input, { target: { value: 'anulować' } });

    expect(screen.getByText('Jak anulować zamówienie?')).toBeInTheDocument();
    expect(screen.queryByText('Ile trwa dostawa?')).not.toBeInTheDocument();
  });

  it('powinien otwierać i zamykać akordeon z odpowiedzią', () => {
    render(<FaqPage />);
    
    const questionButton = screen.getByText('Jak anulować zamówienie?');
    
    // Odpowiedź domyślnie ukryta
    expect(screen.queryByText('Skontaktuj się z supportem.')).not.toBeInTheDocument();

    // Klikamy by otworzyć
    fireEvent.click(questionButton);
    expect(screen.getByText('Skontaktuj się z supportem.')).toBeInTheDocument();

    // Klikamy ponownie by zamknąć
    fireEvent.click(questionButton);
    expect(screen.queryByText('Skontaktuj się z supportem.')).not.toBeInTheDocument();
  });
});
