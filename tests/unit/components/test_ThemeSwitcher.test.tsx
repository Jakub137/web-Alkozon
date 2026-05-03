import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ThemeSwitcher from '@/components/ThemeSwitcher';
import { useLanguage } from '@/context/LanguageContext';
import { useTheme } from '@/context/ThemeContext';

vi.mock('@/context/LanguageContext', () => ({
  useLanguage: vi.fn()
}));

vi.mock('@/context/ThemeContext', () => ({
  useTheme: vi.fn()
}));

describe('ThemeSwitcher Unit Tests', () => {
  beforeEach(() => {
    (useLanguage as any).mockReturnValue({
      dict: {
        navbar: {
          lightMode: 'Jasny',
          darkMode: 'Ciemny'
        }
      }
    });
  });

  it('powinien wyświetlić tekst DarkMode gdy motyw jest dark', () => {
    (useTheme as any).mockReturnValue({
      theme: 'dark',
      toggleTheme: vi.fn()
    });

    render(<ThemeSwitcher />);
    expect(screen.getByRole('button')).toHaveTextContent('Ciemny');
  });

  it('powinien wyświetlić tekst LightMode gdy motyw jest light', () => {
    (useTheme as any).mockReturnValue({
      theme: 'light',
      toggleTheme: vi.fn()
    });

    render(<ThemeSwitcher />);
    expect(screen.getByRole('button')).toHaveTextContent('Jasny');
  });

  it('powinien wywołać toggleTheme przy kliknięciu', () => {
    const toggleThemeMock = vi.fn();
    (useTheme as any).mockReturnValue({
      theme: 'dark',
      toggleTheme: toggleThemeMock
    });

    render(<ThemeSwitcher />);
    fireEvent.click(screen.getByRole('button'));

    expect(toggleThemeMock).toHaveBeenCalled();
  });
});
