import { TestBed } from '@angular/core/testing';
import { ThemeService, ThemeMode } from './theme.service';

describe('ThemeService', () => {
  let service: ThemeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ThemeService);
    // Clear localStorage before each test
    localStorage.clear();
    // Remove any theme classes from body
    document.body.classList.remove('dark-theme', 'light-theme');
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should default to auto theme when no saved preference', () => {
    const newService = new ThemeService();
    expect(newService.currentTheme).toBe('auto');
  });

  it('should set and get theme correctly', () => {
    service.setTheme('dark');
    expect(service.currentTheme).toBe('dark');
    
    service.setTheme('light');
    expect(service.currentTheme).toBe('light');
    
    service.setTheme('auto');
    expect(service.currentTheme).toBe('auto');
  });

  it('should save theme to localStorage', () => {
    service.setTheme('dark');
    expect(localStorage.getItem('user-theme-preference')).toBe('dark');
    
    service.setTheme('light');
    expect(localStorage.getItem('user-theme-preference')).toBe('light');
  });

  it('should apply theme classes to body', () => {
    service.setTheme('dark');
    expect(document.body.classList.contains('dark-theme')).toBe(true);
    expect(document.body.classList.contains('light-theme')).toBe(false);
    
    service.setTheme('light');
    expect(document.body.classList.contains('light-theme')).toBe(true);
    expect(document.body.classList.contains('dark-theme')).toBe(false);
  });

  it('should toggle theme correctly', () => {
    service.setTheme('light');
    service.toggleTheme();
    expect(service.currentTheme).toBe('dark');
    
    service.toggleTheme();
    expect(service.currentTheme).toBe('light');
  });

  it('should provide correct display names', () => {
    expect(service.getThemeDisplayName('auto')).toBe('Automático (Sistema)');
    expect(service.getThemeDisplayName('light')).toBe('Claro');
    expect(service.getThemeDisplayName('dark')).toBe('Oscuro');
  });

  it('should detect dark mode correctly', () => {
    service.setTheme('dark');
    expect(service.isDarkMode()).toBe(true);
    
    service.setTheme('light');
    expect(service.isDarkMode()).toBe(false);
  });
});
