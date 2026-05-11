import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import OrderStatusPage from '@/app/order-status/page';
import { useLanguage } from '@/context/LanguageContext';
import * as ordersData from '@/data/orders';
import { useAuth } from '@/context/AuthContext';
import { getOrderById } from '@/lib/api/orders';

vi.mock('@/context/LanguageContext', () => ({
  useLanguage: vi.fn()
}));
vi.mock('@/context/AuthContext', () => ({
  useAuth: vi.fn()
}));
vi.mock('next/link', () => ({
  default: ({ children, href }: { children: React.ReactNode, href: string }) => (
    <a href={href}>{children}</a>
  )
}));
vi.mock('next/navigation', () => ({
  useSearchParams: () => new URLSearchParams(),
}));
vi.mock('@/data/orders', () => ({
  findOrderByNumberAndEmail: vi.fn()
}));
vi.mock('@/lib/api/orders', () => ({
  getOrderById: vi.fn(),
  extractOrderId: (value: string) => value,
}));

const mockDict = {
  orderStatusPage: {
    title: 'Status',
    subtitle: 'Sprawdź status',
    form: {
      orderNumberLabel: 'Numer',
      orderNumberPlaceholder: 'Nr zamówienia',
      emailLabel: 'Email',
      emailPlaceholder: 'Email',
      submit: 'Sprawdź'
    },
    notFound: 'Nie znaleziono',
    details: {
      title: 'Szczegóły',
      orderNumber: 'Nr zamówienia',
      placedAt: 'Złożono',
      status: 'Status',
      estimatedDelivery: 'Dostawa'
    },
    statuses: {
      processing: 'W trakcie'
    },
    progress: {
      title: 'Postęp',
      steps: { received: 'Otrzymane', processing: 'W trakcie', shipped: 'Wysłane', delivered: 'Dostarczone' }
    },
    nextStepsTitle: 'Kolejne kroki',
    nextSteps: { processing: 'Oczekiwanie' },
    timelineTitle: 'Historia',
    items: {
      title: 'Produkty',
      quantityLabel: 'Ilość',
      unitPriceLabel: 'Cena',
      totalItemsLabel: 'Suma elementów',
      totalValueLabel: 'Suma wartości'
    },
    buttons: { goToShop: 'Sklep', contact: 'Kontakt' }
  }
};

describe('OrderStatusPage Unit Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (useLanguage as any).mockReturnValue({ dict: mockDict, lang: 'pl' });
    (useAuth as any).mockReturnValue({ token: null, user: null });
    (getOrderById as any).mockResolvedValue(null);
  });

  it('powinien zablokować formularz gdy pusty', () => {
    render(<OrderStatusPage />);
    const submitBtn = screen.getByRole('button', { name: 'Sprawdź' });
    expect(submitBtn).toBeDisabled();
  });

  it('powinien wyświetlić brak zamówienia jeśli funkcja zwróci null', () => {
    (ordersData.findOrderByNumberAndEmail as any).mockReturnValue(null);
    render(<OrderStatusPage />);
    
    fireEvent.change(screen.getByPlaceholderText('Nr zamówienia'), { target: { value: '123' } });
    fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'a@a.pl' } });
    
    fireEvent.submit(screen.getByRole('button', { name: 'Sprawdź' }).closest('form')!);
    
    expect(screen.getByText('Nie znaleziono')).toBeInTheDocument();
  });

  it('powinien wyświetlić status po znalezieniu zamówienia', () => {
    (ordersData.findOrderByNumberAndEmail as any).mockReturnValue({
      orderNumber: '123',
      status: 'processing',
      placedAt: '2025-01-01',
      estimatedDelivery: '2025-01-05',
      history: [],
      items: []
    });

    render(<OrderStatusPage />);
    
    fireEvent.change(screen.getByPlaceholderText('Nr zamówienia'), { target: { value: '123' } });
    fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'a@a.pl' } });
    
    fireEvent.submit(screen.getByRole('button', { name: 'Sprawdź' }).closest('form')!);
    
    expect(screen.getAllByText('W trakcie').length).toBeGreaterThan(0);
    expect(screen.getByText('Szczegóły')).toBeInTheDocument();
  });
});
