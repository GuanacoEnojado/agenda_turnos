import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { retry, catchError, map } from 'rxjs/operators';
import { of } from 'rxjs';
import { User } from './datos';

export interface ApiResponse {
  message?: string;
  user?: User;
  users?: User[];
}

@Injectable({
  providedIn: 'root'
})
export class PostgresApiService {
  private readonly API_URL = 'http://localhost:3000';
  
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  constructor(private http: HttpClient) {}

  /**
   * Get all users
   */
  getUsers(): Observable<User[]> {
    return this.http.get<ApiResponse>(`${this.API_URL}/users`, this.httpOptions)
      .pipe(
        map((response: any) => response.users || []),
        retry(2),
        catchError(this.handleError<User[]>('getUsers', []))
      );
  }

  /**
   * Get user by ID
   */
  getUser(userId: number): Observable<User | null> {
    return this.http.get<ApiResponse>(`${this.API_URL}/users/${userId}`, this.httpOptions)
      .pipe(
        map((response: any) => response.user || null),
        catchError(this.handleError<User | null>('getUser', null))
      );
  }

  /**
   * Create a new user
   */
  createUser(userData: { name: string; email: string; password: string }): Observable<User | null> {
    console.log('PostgresApiService createUser called with:', userData); // Log de depuración
    return this.http.post<ApiResponse>(`${this.API_URL}/users`, userData, this.httpOptions)
      .pipe(
        map((response: any) => {
          console.log('Create user response:', response); // Log de depuración
          return response.user || null;
        }),
        catchError(this.handleError<User | null>('createUser', null))
      );
  }

  /**
   * Update user
   */
  updateUser(userId: number, userData: Partial<User>): Observable<User | null> {
    return this.http.put<ApiResponse>(`${this.API_URL}/users/${userId}`, userData, this.httpOptions)
      .pipe(
        map((response: any) => response.user || null),
        catchError(this.handleError<User | null>('updateUser', null))
      );
  }

  /**
   * Delete user
   */
  deleteUser(userId: number): Observable<boolean> {
    return this.http.delete<ApiResponse>(`${this.API_URL}/users/${userId}`, this.httpOptions)
      .pipe(
        map((response: any) => !!response.message),
        catchError(this.handleError<boolean>('deleteUser', false))
      );
  }

  /**
   * Helper method to handle HTTP errors
   */
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(`${operation} failed:`, error);
      console.error('Error details:', {
        status: error.status,
        statusText: error.statusText,
        url: error.url,
        message: error.message
      });
      return of(result as T);
    };
  }
}
