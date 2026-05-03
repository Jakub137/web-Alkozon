import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { useAutoLogout } from '@/hooks/useAutoLogout';
import * as AuthContextModule from '@/context/AuthContext';

describe('Unit Tests - useAutoLogout Hook', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.spyOn(AuthContextModule, 'useAuth').mockReturnValue({
      user: { email: 'test@alkozon.pl' } as any,
      logout: vi.fn(),
      login: vi.fn(),
      isAuthenticated: true
    } as any);
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it('nie robi nic, gdy użytkownik nie jest zalogowany', () => {
    // Mockujemy że user = null
    vi.spyOn(AuthContextModule, 'useAuth').mockReturnValue({
      user: null,
      logout: vi.fn(),
      login: vi.fn(),
      isAuthenticated: false
    } as any);

    renderHook(() => useAutoLogout());
    const mockLogout = AuthContextModule.useAuth().logout;

    vi.advanceTimersByTime(3600000);
    expect(mockLogout).not.toHaveBeenCalled();
  });

  it('wylogowuje użytkownika po przekroczeniu czasu bezczynności', () => {
    const mockLogout = vi.fn();
    vi.spyOn(AuthContextModule, 'useAuth').mockReturnValue({
      user: { email: 'test@alkozon.pl' } as any,
      logout: mockLogout,
      login: vi.fn(),
      isAuthenticated: true
    } as any);

    renderHook(() => useAutoLogout());

    // Wylogowuje po 30 sekundach (30000ms)
    vi.advanceTimersByTime(35000);
    expect(mockLogout).toHaveBeenCalledOnce();
  });

  it('resetuje licznik po aktywności użytkownika (mousemove)', () => {
    const mockLogout = vi.fn();
    vi.spyOn(AuthContextModule, 'useAuth').mockReturnValue({
      user: { email: 'test@alkozon.pl' } as any,
      logout: mockLogout,
      login: vi.fn(),
      isAuthenticated: true
    } as any);

    renderHook(() => useAutoLogout());

    // Po 20 sekundach symulujemy ruch myszką
    vi.advanceTimersByTime(20000);
    act(() => {
      window.dispatchEvent(new MouseEvent('mousemove'));
    });

    // Przesuwamy o kolejne 20 sekund. (Łącznie 40 sekund, ale licznik się wyzerował, więc nie osiągnęliśmy 30s).
    vi.advanceTimersByTime(20000);
    expect(mockLogout).not.toHaveBeenCalled();
  });
});
