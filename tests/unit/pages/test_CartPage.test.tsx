import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import CartPage from '@/app/cart/page';
import { useLanguage } from '@/context/LanguageContext';
import { useCart } from '@/context/CartContext';
import { useAge } from '@/context/AgeContext';
import { useAuth } from '@/context/AuthContext';

vi.mock('@/context/LanguageContext', () => ({
  useLanguage: vi.fn()
}));
vi.mock('@/context/CartContext', () => ({
  useCart: vi.fn()
}));
vi.mock('@/context/AgeContext', () => ({
  useAge: vi.fn()
}));
vi.mock('@/context/AuthContext', () => ({
  useAuth: vi.fn()
}));
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn() }),
}));
vi.mock('next/link', () => ({
  default: ({ children, href }: { children: React.ReactNode, href: string }) => (
    <a href={href}>{children}</a>
  )
}));

const mockDict = {
  ageGate: {
    restrictedMessageTitle: 'Ograniczenie wiekowe',
    restrictedMessage: 'Zablokowane'
  },
  shop: {
    cart: {
      pageTitle: 'Koszyk',
      items: 'Ilość',
      empty: 'Twój koszyk jest pusty',
      backToShop: 'Wróć do sklepu',
      remove: 'Usuń',
      total: 'Suma'
    }
  }
};

describe('CartPage Unit Tests', () => {
  const mockRemoveFromCart = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useLanguage as any).mockReturnValue({ dict: mockDict });
    (useCart as any).mockReturnValue({
      cartItems: [],
      cartItemsCount: 0,
      removeFromCart: mockRemoveFromCart,
      clearCart: vi.fn()
    });
    (useAge as any).mockReturnValue({ ageStatus: 'verified' });
    (useAuth as any).mockReturnValue({ token: null });
  });

  it('powinien wyświetlać komunikat o pustym koszyku', () => {
    render(<CartPage />);
    expect(screen.getByText('Twój koszyk jest pusty')).toBeInTheDocument();
    expect(screen.getByText('Wróć do sklepu')).toBeInTheDocument();
  });

  it('powinien renderować listę produktów z koszyka', () => {
    (useCart as any).mockReturnValue({
      cartItems: [
        { product: { id: '1', name: 'Piwo', price: 10, capacity: '0.5L' }, quantity: 2 }
      ],
      cartItemsCount: 2,
      removeFromCart: mockRemoveFromCart,
      clearCart: vi.fn()
    });

    render(<CartPage />);
    expect(screen.getByText('Piwo')).toBeInTheDocument();
    expect(screen.getByText('x2')).toBeInTheDocument();
    expect(screen.getAllByText('20.00 zl').length).toBeGreaterThan(0); // Ilość x cena + Suma
  });

  it('powinien wywoływać removeFromCart po kliknięciu usuń', () => {
    (useCart as any).mockReturnValue({
      cartItems: [
        { product: { id: '1', name: 'Piwo', price: 10, capacity: '0.5L' }, quantity: 1 }
      ],
      cartItemsCount: 1,
      removeFromCart: mockRemoveFromCart,
      clearCart: vi.fn()
    });

    render(<CartPage />);
    const removeBtn = screen.getByText('Usuń');
    fireEvent.click(removeBtn);
    expect(mockRemoveFromCart).toHaveBeenCalledWith('1');
  });

  it('powinien wyświetlić komunikat o braku wieku', () => {
    (useAge as any).mockReturnValue({ ageStatus: 'underage' });
    render(<CartPage />);
    expect(screen.getByText('Ograniczenie wiekowe')).toBeInTheDocument();
    expect(screen.getByText('Zablokowane')).toBeInTheDocument();
  });
});
