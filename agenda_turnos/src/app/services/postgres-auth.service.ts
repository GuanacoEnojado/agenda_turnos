import { Injectable } from '@angular/core';
import { PostgresApiService, User } from './postgres-api.service';
import { BehaviorSubject } from 'rxjs';

// Interfaz para coincidir con las expectativas actuales de tu aplicación
export interface AppUser {
  id?: number;
  username: string;  // Se mapea a 'name' en PostgreSQL
  email: string;
  password: string;
  created_at?: string;
}

@Injectable({
  providedIn: 'root'
})
export class PostgresAuthService {  
  private currentUserSubject = new BehaviorSubject<AppUser | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private postgresApiService: PostgresApiService) {
    this.loadStoredUser();
  }

  private loadStoredUser() {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      this.currentUserSubject.next(JSON.parse(storedUser));
    }
  }

  /**
   * Convert PostgreSQL User to AppUser format
   */
  private convertToAppUser(postgresUser: User): AppUser {
    return {
      id: postgresUser.id,
      username: postgresUser.name,
      email: postgresUser.email,
      password: postgresUser.password,
      created_at: postgresUser.createdAt
    };
  }

  /**
   * Convert AppUser to PostgreSQL User format
   */
  private convertToPostgresUser(appUser: AppUser): { name: string; email: string; password: string } {
    return {
      name: appUser.username,
      email: appUser.email,
      password: appUser.password
    };
  }

  async login(username: string, password: string): Promise<{success: boolean; message: string}> {
    try {
      const postgresUser = await this.postgresApiService.loginUser(username, password);

      if (postgresUser) {
        const appUser = this.convertToAppUser(postgresUser);
        localStorage.setItem('currentUser', JSON.stringify(appUser));
        this.currentUserSubject.next(appUser);
        return { success: true, message: 'Ingreso exitoso' };
      } else {
        return { success: false, message: 'Usuario o Contraseña incorrectas' };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, message: 'Ingreso fallido, intenta de nuevo.' };
    }
  }

  async register(userData: AppUser): Promise<{success: boolean; message: string}> {
    try {
      const userExists = await this.postgresApiService.checkUserExists(userData.username, userData.email);

      if (userExists) {
        return { success: false, message: 'Usuario o email ya están registrados' };
      }

      const postgresUserData = this.convertToPostgresUser(userData);
      const success = await this.postgresApiService.registerUser(postgresUserData);

      if (success) {
        return { success: true, message: 'Registro exitoso' };
      } else {
        return { success: false, message: 'Registro fallido' };
      }
    } catch (error) {
      console.error('Registration error:', error);
      return { success: false, message: 'Registro fallido, favor intentar de nuevo' };
    }
  }

  logout(): void {
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
  }

  isAuthenticated(): boolean {
    return this.currentUserSubject.value !== null;
  }

  getCurrentUser(): AppUser | null {
    return this.currentUserSubject.value;
  }

  /**
   * Check if user exists (maintaining the same interface as the original)
   */
  async checkUserExists(username: string, email: string): Promise<boolean> {
    return await this.postgresApiService.checkUserExists(username, email);
  }

  /**
   * Register user (maintaining the same interface as the original)
   */
  async registerUser(userData: AppUser): Promise<boolean> {
    const result = await this.register(userData);
    return result.success;
  }

  /**
   * Login user (maintaining the same interface as the original)
   */
  async loginUser(username: string, password: string): Promise<AppUser | null> {
    const result = await this.login(username, password);
    if (result.success) {
      return this.getCurrentUser();
    }
    return null;
  }

  /**
   * Get auth token (if you want to add token support later)
   */
  getAuthToken(): string {
    return localStorage.getItem('authToken') || '';
  }
}
