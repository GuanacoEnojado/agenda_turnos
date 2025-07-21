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
   * Observable para cambios de tema
   */
  get theme$() {
    return this.themeSubject.asObservable();
  }

  /**
   * capturael tema actual
   */
  get currentTheme(): ThemeMode {
    return this.themeSubject.value;
  }

  /**
   * Inicia tema
   */
  private initializeTheme(): void {
    const savedTheme = localStorage.getItem(this.THEME_KEY) as ThemeMode;
    const theme = savedTheme || 'auto';
    this.setTheme(theme);
  }

  /**
   * @param theme - 
   */
  setTheme(theme: ThemeMode): void {
    this.themeSubject.next(theme);
    localStorage.setItem(this.THEME_KEY, theme);
    this.applyTheme(theme);
  }

  /**
   * Aplica tema al body del documento
   * @param theme -
   */
  private applyTheme(theme: ThemeMode): void {
    const body = document.body;
    
    
    body.classList.remove('dark-theme', 'light-theme');
    
    if (theme === 'dark') {
      body.classList.add('dark-theme');
    } else if (theme === 'light') {
      body.classList.add('light-theme');
    } else {
      // Auto 
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (prefersDark) {
        body.classList.add('dark-theme');
      } else {
        body.classList.add('light-theme');
      }
    }
  }

  /**
   * Toggle entre light y dark
   */
  toggleTheme(): void {
    const currentTheme = this.currentTheme;
    
    if (currentTheme === 'light') {
      this.setTheme('dark');
    } else if (currentTheme === 'dark') {
      this.setTheme('light');
    } else {

      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      this.setTheme(prefersDark ? 'light' : 'dark');
    }
  }


  isDarkMode(): boolean {
    const currentTheme = this.currentTheme;
    
    if (currentTheme === 'dark') {
      return true;
    } else if (currentTheme === 'light') {
      return false;
    } else {

      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
  }


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
