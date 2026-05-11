import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import { AuthProvider, useAuth } from '@/context/AuthContext';

vi.mock('@/lib/api/auth', () => ({
  logoutApi: vi.fn().mockResolvedValue(undefined),
  guestApi: vi.fn().mockResolvedValue({
    accessToken: "guest-token",
    refreshToken: "guest-refresh",
    tokenType: "Bearer",
    expiresAt: 9999999999999,
    user: { username: "guest", role: "GUEST" },
  }),
  refreshApi: vi.fn(),
  hydrateSession: (raw: string) => JSON.parse(raw),
}));

// Helper component to consume the context
const TestComponent = () => {
  const { user, token, login, logout, toast } = useAuth();
  const session = {
    accessToken: 'fake-token',
    refreshToken: 'fake-refresh-token',
    tokenType: 'Bearer',
    expiresAt: 9999999999999,
    user: {
      username: 'testuser',
      email: 'test@example.com',
      role: 'CUSTOMER' as const,
    },
  };
  
  return (
    <div>
      <div data-testid="token">{token ?? 'null'}</div>
      <div data-testid="user">{user ? user.username : 'null'}</div>
      <div data-testid="toast">{toast ?? 'null'}</div>
      <button onClick={() => login(session)} data-testid="login-btn">
        Login
      </button>
      <button onClick={() => void logout('Zostałeś wylogowany')} data-testid="logout-btn">
        Logout
      </button>
    </div>
  );
};

describe('AuthContext Unit Tests', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('powinien domyślnie inicjować z wartościami null jeśli brak danych w localStorage', () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );
    expect(screen.getByTestId('token').textContent).toBe('null');
    expect(screen.getByTestId('user').textContent).toBe('null');
  });

  it('powinien załadować dane z localStorage podczas inicjalizacji', () => {
    localStorage.setItem('alkozon_auth_session', JSON.stringify({
      accessToken: 'stored-token',
      refreshToken: 'stored-refresh',
      tokenType: 'Bearer',
      expiresAt: Date.now() + 1000 * 60,
      user: { username: 'storedUser' },
    }));

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );
    expect(screen.getByTestId('token').textContent).toBe('stored-token');
    expect(screen.getByTestId('user').textContent).toBe('storedUser');
  });

  it('funkcja login powinna poprawnie ustawić token i usera oraz zapisać do localStorage', () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    act(() => {
      screen.getByTestId('login-btn').click();
    });

    expect(screen.getByTestId('token').textContent).toBe('fake-token');
    expect(screen.getByTestId('user').textContent).toBe('testuser');
    expect(JSON.parse(localStorage.getItem('alkozon_auth_session') || '{}').accessToken).toBe('fake-token');
    expect(JSON.parse(localStorage.getItem('alkozon_auth_session') || '{}').user.username).toBe('testuser');
  });

  it('funkcja logout powinna wyczyścić stan, localStorage i pokazać toast, po czym zniknąć po 5s', async () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    // Najpierw się logujemy
    act(() => {
      screen.getByTestId('login-btn').click();
    });

    // Potem wylogowujemy
    await act(async () => {
      screen.getByTestId('logout-btn').click();
    });

    expect(screen.getByTestId('token').textContent).toBe('null');
    expect(screen.getByTestId('user').textContent).toBe('null');
    expect(localStorage.getItem('alkozon_auth_session')).toBeNull();
    
    // Sprawdź toast z wylogowania
    expect(screen.getByTestId('toast').textContent).toBe('Zostałeś wylogowany');

    // Przyspiesz czas o 5 sekund by toast zniknął
    act(() => {
      vi.advanceTimersByTime(5000);
    });

    expect(screen.getByTestId('toast').textContent).toBe('null');
  });
});
