import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import LoginPage from '@/app/login/page';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

vi.mock('@/context/AuthContext', () => ({
  useAuth: vi.fn()
}));

vi.mock('next/navigation', () => ({
  useRouter: vi.fn()
}));

vi.mock('next/link', () => ({
  default: ({ children, href }: { children: React.ReactNode, href: string }) => (
    <a href={href}>{children}</a>
  )
}));

describe('LoginPage Unit Tests', () => {
  const mockLogin = vi.fn();
  const mockPush = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    (useAuth as any).mockReturnValue({ login: mockLogin });
    (useRouter as any).mockReturnValue({ push: mockPush });
  });

  it('powinien wyrenderować formularz logowania', () => {
    render(<LoginPage />);
    expect(screen.getByText('Portal Logowania')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('test@test.pl')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('••••••••')).toBeInTheDocument();
  });

  it('powinien wyświetlić błąd walidacji Zod dla błędnego emaila', async () => {
    render(<LoginPage />);
    
    const emailInput = screen.getByPlaceholderText('test@test.pl');
    const passInput = screen.getByPlaceholderText('••••••••');
    const submitBtn = screen.getByRole('button', { name: 'Zaloguj się' });

    fireEvent.change(emailInput, { target: { value: 'zly-email' } });
    fireEvent.change(passInput, { target: { value: 'Test1234!' } });
    fireEvent.submit(submitBtn.closest('form')!);

    await waitFor(() => {
      expect(screen.getByText('Niepoprawny format adresu email')).toBeInTheDocument();
    });
  });

  it('powinien zablokować formularz po 5 nieudanych próbach', async () => {
    // Ustawiamy w localStorage 5 prób
    localStorage.setItem('login_attempts', '5');
    
    render(<LoginPage />);

    expect(screen.getByText('Konto zablokowane ze względów bezpieczeństwa. Zrestartuj sesję (wyczyść klucze przeglądarki).')).toBeInTheDocument();
    
    const submitBtn = screen.getByRole('button', { name: 'System Zablokowany' });
    expect(submitBtn).toBeDisabled();

    const emailInput = screen.getByPlaceholderText('test@test.pl');
    expect(emailInput).toBeDisabled();
  });

  it('powinien poprawnie zalogować po podaniu prawidłowych danych mockowanych', async () => {
    render(<LoginPage />);
    
    const emailInput = screen.getByPlaceholderText('test@test.pl');
    const passInput = screen.getByPlaceholderText('••••••••');
    const submitBtn = screen.getByRole('button', { name: 'Zaloguj się' });

    fireEvent.change(emailInput, { target: { value: 'test@test.pl' } });
    fireEvent.change(passInput, { target: { value: 'Test1234!' } });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith('TestUser', 'mocked-jwt-token-from-brute-force-safe-login');
      expect(mockPush).toHaveBeenCalledWith('/');
    });
  });
});
