import { Injectable } from '@angular/core';
import { PostgresApiService } from './postgres-api.service';
import { User } from './datos';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {  
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private postgresApiService: PostgresApiService) {
    this.loadStoredUser();
  }

  private loadStoredUser(){
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser){
      this.currentUserSubject.next(JSON.parse(storedUser));
    }
  }

  async login(username: string, password: string): Promise<{success: boolean; message: string}> {
    try {
      // Obtener todos los usuarios y buscar credenciales coincidentes
      const users = await this.postgresApiService.getUsers().toPromise();
      if (!users) {
        return { success: false, message: 'Error de conexión con el servidor' };
      }

      const user = users.find(u => 
        (u.email === username || u.name === username) && u.password === password
      );

      if (user) {
        localStorage.setItem('currentUser', JSON.stringify(user));
        this.currentUserSubject.next(user);
        return { success: true, message: 'Ingreso exitoso' };
      } else {
        return { success: false, message: 'Usuario o Contraseña incorrectas' };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, message: 'Error de ingreso, intenta de nuevo.' };
    }
  }

  async register(userData: { name: string; email: string; password: string }): Promise<{success: boolean; message: string}> {
    try {      console.log('AuthService register called with:', userData); // Log de depuración

      // Verificar si el usuario ya existe
      const users = await this.postgresApiService.getUsers().toPromise();      console.log('Retrieved users:', users); // Log de depuración

      if (!users) {
        console.log('Failed to retrieve users'); // Log de depuración
        return { success: false, message: 'Error de conexión con el servidor' };
      }

      const userExists = users.some(user => 
        user.name === userData.name || user.email === userData.email
      );

      if (userExists) {
        console.log('User already exists'); // Log de depuración
        return { success: false, message: 'Usuario o email ya están registrados' };
      }

      // Crear nuevo usuario
      console.log('Creating new user...'); // Log de depuración
      const newUser = await this.postgresApiService.createUser(userData).toPromise();
      console.log('New user created:', newUser); // Log de depuración

      if (newUser) {
        return { success: true, message: 'Registro exitoso' };
      } else {
        console.log('Failed to create user'); // Log de depuración
        return { success: false, message: 'Error en el registro' };
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

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }
}
