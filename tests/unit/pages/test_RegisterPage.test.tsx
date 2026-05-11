import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import RegisterPage from '@/app/register/page';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { registerApi } from '@/lib/api/auth';

vi.mock('@/context/AuthContext', () => ({
  useAuth: vi.fn()
}));

vi.mock('next/navigation', () => ({
  useRouter: vi.fn()
}));

vi.mock('@/lib/api/auth', () => ({
  registerApi: vi.fn(),
}));

vi.mock('next/link', () => ({
  default: ({ children, href }: { children: React.ReactNode, href: string }) => (
    <a href={href}>{children}</a>
  )
}));

describe('RegisterPage Unit Tests', () => {
  const mockLogin = vi.fn();
  const mockSetToast = vi.fn();
  const mockPush = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useAuth as any).mockReturnValue({ login: mockLogin, setToast: mockSetToast });
    (useRouter as any).mockReturnValue({ push: mockPush });
    (registerApi as any).mockResolvedValue({
      accessToken: 'mocked-jwt-token',
      refreshToken: 'mocked-refresh-token',
      tokenType: 'Bearer',
      expiresAt: Date.now() + 1000 * 60,
      user: { username: 'Tester', email: 'test@test.pl', role: 'CUSTOMER' },
    });
  });

  it('powinien pokazać błędy walidacji dla pustego formularza', async () => {
    render(<RegisterPage />);
    
    const submitBtn = screen.getByRole('button', { name: 'Zarejestruj Konto' });
    fireEvent.submit(submitBtn.closest('form')!);

    await waitFor(() => {
      expect(screen.getByText('Nazwa użytkownika od 3 znaków')).toBeInTheDocument();
      expect(screen.getByText('Niepoprawny format adresu email')).toBeInTheDocument();
      expect(screen.getByText('Hasło musi mieć co najmniej 8 znaków')).toBeInTheDocument();
    });
  });

  it('powinien poprawnie zarejestrować przy prawidłowych danych', async () => {
    render(<RegisterPage />);
    
    fireEvent.change(screen.getByPlaceholderText('Janek123'), { target: { value: 'Tester' } });
    fireEvent.change(screen.getByPlaceholderText('jan@kowalski.pl'), { target: { value: 'test@test.pl' } });
    fireEvent.change(screen.getByPlaceholderText('••••••••'), { target: { value: 'SilneHaslo123!' } });
    
    fireEvent.submit(screen.getByRole('button', { name: 'Zarejestruj Konto' }).closest('form')!);

    await waitFor(() => {
      expect(registerApi).toHaveBeenCalledWith({
        email: 'test@test.pl',
        password: 'SilneHaslo123!',
        firstName: 'Tester',
        lastName: undefined,
      });
      expect(mockLogin).toHaveBeenCalled();
      expect(mockSetToast).toHaveBeenCalled();
      expect(mockPush).toHaveBeenCalledWith('/');
    });
  });
});
