import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import { ThemeProvider, useTheme } from '@/context/ThemeContext';
import React from 'react';

function ThemeTestComponent() {
  const { theme, toggleTheme } = useTheme();
  return (
    <div>
      <span data-testid="theme-value">{theme}</span>
      <button onClick={toggleTheme}>Toggle</button>
    </div>
  );
}

describe('Unit Tests - ThemeContext', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.classList.remove('dark');
  });

  it('powinien domyślnie ustawić motyw z localStorage (np. light)', () => {
    localStorage.setItem('theme', 'light');
    render(
      <ThemeProvider>
        <ThemeTestComponent />
      </ThemeProvider>
    );
    expect(screen.getByTestId('theme-value').textContent).toBe('light');
  });

  it('powinien zmienić motyw na dark po kliknięciu i zaktualizować klasę HTML', () => {
    localStorage.setItem('theme', 'light');
    render(
      <ThemeProvider>
        <ThemeTestComponent />
      </ThemeProvider>
    );

    fireEvent.click(screen.getByText('Toggle'));
    
    expect(screen.getByTestId('theme-value').textContent).toBe('dark');
    expect(localStorage.getItem('theme')).toBe('dark');
    expect(document.documentElement.classList.contains('dark')).toBe(true);
  });
});
