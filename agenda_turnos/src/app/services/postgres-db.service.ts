import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';

export interface User {
  id?: number;
  username: string;
  email: string;
  password: string;
  created_at?: string;
}

@Injectable({
  providedIn: 'root'
})
export class PostgresDbService {
  private apiUrl = 'http://localhost:3000/api'; // Tu servidor PostgreSQL existente
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  private dbReady = new BehaviorSubject<boolean>(false);
  public dbReady$ = this.dbReady.asObservable();

  constructor(private http: HttpClient) {
    this.checkConnection();
  }

  // Check if the PostgreSQL server is reachable
  private async checkConnection() {
    try {
      await this.http.get(`${this.apiUrl}/health`).toPromise();
      this.dbReady.next(true);
      console.log('Connected to PostgreSQL server');
    } catch (error) {
      console.error('Error connecting to PostgreSQL server:', error);
      this.dbReady.next(false);
    }
  }

  // Register a new user
  registerUser(user: User): Observable<any> {
    return this.http.post(`${this.apiUrl}/users/register`, user, this.httpOptions);
  }

  // Login user
  loginUser(username: string, password: string): Observable<any> {
    const loginData = { username, password };
    return this.http.post(`${this.apiUrl}/users/login`, loginData, this.httpOptions);
  }

  // Check if user exists
  checkUserExists(username: string, email: string): Observable<any> {
    const checkData = { username, email };
    return this.http.post(`${this.apiUrl}/users/check`, checkData, this.httpOptions);
  }

  // Get all users (for admin purposes)
  getAllUsers(): Observable<any> {
    return this.http.get(`${this.apiUrl}/users`, this.httpOptions);
  }

  // Update user
  updateUser(id: number, user: Partial<User>): Observable<any> {
    return this.http.put(`${this.apiUrl}/users/${id}`, user, this.httpOptions);
  }

  // Delete user
  deleteUser(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/users/${id}`, this.httpOptions);
  }
}
