import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type ThemeMode = 'auto' | 'light' | 'dark';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private readonly THEME_KEY = 'user-theme-preference';
  private themeSubject = new BehaviorSubject<ThemeMode>('auto');
  
  constructor() {
    this.initializeTheme();
  }

  /**
   * Observable for theme changes
   */
  get theme$() {
    return this.themeSubject.asObservable();
  }

  /**
   * Get current theme setting
   */
  get currentTheme(): ThemeMode {
    return this.themeSubject.value;
  }

  /**
   * Initialize theme from localStorage or default to 'auto'
   */
  private initializeTheme(): void {
    const savedTheme = localStorage.getItem(this.THEME_KEY) as ThemeMode;
    const theme = savedTheme || 'auto';
    this.setTheme(theme);
  }

  /**
   * Set theme and apply it to the document
   * @param theme - Theme mode to apply
   */
  setTheme(theme: ThemeMode): void {
    this.themeSubject.next(theme);
    localStorage.setItem(this.THEME_KEY, theme);
    this.applyTheme(theme);
  }

  /**
   * Apply theme to document body
   * @param theme - Theme mode to apply
   */
  private applyTheme(theme: ThemeMode): void {
    const body = document.body;
    
    // Remove existing theme classes
    body.classList.remove('dark-theme', 'light-theme');
    
    if (theme === 'dark') {
      body.classList.add('dark-theme');
    } else if (theme === 'light') {
      body.classList.add('light-theme');
    } else {
      // Auto mode: respect system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (prefersDark) {
        body.classList.add('dark-theme');
      } else {
        body.classList.add('light-theme');
      }
    }
  }

  /**
   * Toggle between light and dark themes (ignores auto)
   */
  toggleTheme(): void {
    const currentTheme = this.currentTheme;
    
    if (currentTheme === 'light') {
      this.setTheme('dark');
    } else if (currentTheme === 'dark') {
      this.setTheme('light');
    } else {
      // If auto, switch to light or dark based on current system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      this.setTheme(prefersDark ? 'light' : 'dark');
    }
  }

  /**
   * Check if current effective theme is dark
   */
  isDarkMode(): boolean {
    const currentTheme = this.currentTheme;
    
    if (currentTheme === 'dark') {
      return true;
    } else if (currentTheme === 'light') {
      return false;
    } else {
      // Auto mode: check system preference
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
  }

  /**
   * Get display name for theme
   */
  getThemeDisplayName(theme: ThemeMode): string {
    switch (theme) {
      case 'auto':
        return 'Automático (Sistema)';
      case 'light':
        return 'Claro';
      case 'dark':
        return 'Oscuro';
      default:
        return 'Desconocido';
    }
  }
}
