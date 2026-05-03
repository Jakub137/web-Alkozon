import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import NotificationToast from '@/components/NotificationToast';
import { useNotification, AppNotification } from '@/context/NotificationContext';

vi.mock('@/context/NotificationContext', () => ({
  useNotification: vi.fn()
}));

describe('NotificationToast Unit Tests', () => {
  const mockNotification: AppNotification = {
    id: '123',
    message: 'Testowy komunikat',
    type: 'success'
  };

  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('powinien poprawnie wyrenderować wiadomość z powiadomienia', () => {
    (useNotification as any).mockReturnValue({
      removeNotification: vi.fn()
    });

    render(<NotificationToast notification={mockNotification} />);
    
    expect(screen.getByText('Testowy komunikat')).toBeInTheDocument();
  });

  it('powinien wywołać removeNotification po zamknięciu (i po animacji 300ms)', () => {
    const removeNotificationMock = vi.fn();
    (useNotification as any).mockReturnValue({
      removeNotification: removeNotificationMock
    });

    render(<NotificationToast notification={mockNotification} />);
    
    const closeBtn = screen.getByRole('button');
    act(() => {
      closeBtn.click();
    });

    // Zanim minie 300ms funkcja nie powinna być wywołana
    expect(removeNotificationMock).not.toHaveBeenCalled();

    // Przyspiesz czas o 300ms
    act(() => {
      vi.advanceTimersByTime(300);
    });

    expect(removeNotificationMock).toHaveBeenCalledWith('123');
  });
});
