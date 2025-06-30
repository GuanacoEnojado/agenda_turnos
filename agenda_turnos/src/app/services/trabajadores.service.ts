import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { trabajador } from './datos';
import { retry, catchError, map } from 'rxjs/operators';
import { of } from 'rxjs';

export interface TrabajadorApiResponse {
  message?: string;
  trabajador?: trabajador;
  trabajadores?: trabajador[];
}

@Injectable({
  providedIn: 'root'
})
export class TrabajadoresService {
  private readonly API_URL = 'http://localhost:3000';
  
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  constructor(private http: HttpClient) { }

  /**
   * Get all trabajadores
   */
  getTrabajadores(): Observable<trabajador[]> {
    return this.http.get<TrabajadorApiResponse>(`${this.API_URL}/trabajadores`, this.httpOptions)
      .pipe(
        map((response: any) => response.trabajadores || []),
        retry(2),
        catchError(this.handleError<trabajador[]>('getTrabajadores', []))
      );
  }

  /**
   * Create a new trabajador
   */
  createTrabajador(trabajadorData: Omit<trabajador, 'id'>): Observable<trabajador | null> {
    console.log('TrabajadoresService createTrabajador called with:', trabajadorData);
    return this.http.post<TrabajadorApiResponse>(`${this.API_URL}/trabajadores`, trabajadorData, this.httpOptions)
      .pipe(
        map((response: any) => {
          console.log('Create trabajador response:', response);
          return response.trabajador || null;
        }),
        catchError(this.handleError<trabajador | null>('createTrabajador', null))
      );
  }

  /**
   * Update an existing trabajador
   */
  updateTrabajador(id: number, trabajadorData: Partial<trabajador>): Observable<trabajador | null> {
    console.log('TrabajadoresService updateTrabajador called with:', id, trabajadorData);
    return this.http.put<TrabajadorApiResponse>(`${this.API_URL}/trabajadores/${id}`, trabajadorData, this.httpOptions)
      .pipe(
        map((response: any) => {
          console.log('Update trabajador response:', response);
          return response.trabajador || null;
        }),
        catchError(this.handleError<trabajador | null>('updateTrabajador', null))
      );
  }

  /**
   * Delete a trabajador
   */
  deleteTrabajador(id: number): Observable<boolean> {
    console.log('TrabajadoresService deleteTrabajador called with:', id);
    return this.http.delete<TrabajadorApiResponse>(`${this.API_URL}/trabajadores/${id}`, this.httpOptions)
      .pipe(
        map((response: any) => {
          console.log('Delete trabajador response:', response);
          return true;
        }),
        catchError(this.handleError<boolean>('deleteTrabajador', false))
      );
  }

  /**
   * Get a single trabajador by ID
   */
  getTrabajadorById(id: number): Observable<trabajador | null> {
    return this.http.get<TrabajadorApiResponse>(`${this.API_URL}/trabajadores/${id}`, this.httpOptions)
      .pipe(
        map((response: any) => response.trabajador || null),
        retry(2),
        catchError(this.handleError<trabajador | null>('getTrabajadorById', null))
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
