import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import { AuthProvider, useAuth } from '@/context/AuthContext';

// Helper component to consume the context
const TestComponent = () => {
  const { user, token, login, logout, toast } = useAuth();
  
  return (
    <div>
      <div data-testid="token">{token ?? 'null'}</div>
      <div data-testid="user">{user ? user.username : 'null'}</div>
      <div data-testid="toast">{toast ?? 'null'}</div>
      <button onClick={() => login('testuser', 'fake-token')} data-testid="login-btn">
        Login
      </button>
      <button onClick={() => logout('Zostałeś wylogowany')} data-testid="logout-btn">
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
    localStorage.setItem('jwt_token', 'stored-token');
    localStorage.setItem('user', JSON.stringify({ username: 'storedUser' }));

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
    expect(localStorage.getItem('jwt_token')).toBe('fake-token');
    expect(JSON.parse(localStorage.getItem('user') || '{}').username).toBe('testuser');
  });

  it('funkcja logout powinna wyczyścić stan, localStorage i pokazać toast, po czym zniknąć po 5s', () => {
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
    act(() => {
      screen.getByTestId('logout-btn').click();
    });

    expect(screen.getByTestId('token').textContent).toBe('null');
    expect(screen.getByTestId('user').textContent).toBe('null');
    expect(localStorage.getItem('jwt_token')).toBeNull();
    expect(localStorage.getItem('user')).toBeNull();
    
    // Sprawdź toast z wylogowania
    expect(screen.getByTestId('toast').textContent).toBe('Zostałeś wylogowany');

    // Przyspiesz czas o 5 sekund by toast zniknął
    act(() => {
      vi.advanceTimersByTime(5000);
    });

    expect(screen.getByTestId('toast').textContent).toBe('null');
  });
});
