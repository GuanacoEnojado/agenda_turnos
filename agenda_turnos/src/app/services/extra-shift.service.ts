import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, firstValueFrom } from 'rxjs';
import { ExtraShift, trabajador } from './datos';
import { TrabajadoresService } from './trabajadores.service';
import { map, catchError, tap } from 'rxjs/operators';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { of } from 'rxjs';

export interface ExtraShiftApiResponse {
  message?: string;
  extraShift?: ExtraShift;
  extraShifts?: ExtraShift[];
}

@Injectable({
  providedIn: 'root'
})
export class ExtraShiftService {
  private readonly API_URL = 'http://localhost:3000';
  
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  // Local cache for extra shifts
  private extraShifts = new BehaviorSubject<ExtraShift[]>([]);

  constructor(
    private trabajadoresService: TrabajadoresService,
    private http: HttpClient
  ) {
    // Load extra shifts from backend on initialization
    this.loadExtraShiftsFromBackend();
  }

  /**
   * Load extra shifts from backend
   */
  private loadExtraShiftsFromBackend(): void {
    this.getExtraShiftsFromApi().subscribe({
      next: (shifts) => {
        this.extraShifts.next(shifts);
      },
      error: (error) => {
        console.error('Error loading extra shifts from backend:', error);
        // Keep empty array if backend fails
        this.extraShifts.next([]);
      }
    });
  }

  /**
   * Get extra shifts from API
   */
  private getExtraShiftsFromApi(): Observable<ExtraShift[]> {
    return this.http.get<ExtraShiftApiResponse>(`${this.API_URL}/extrashifts`, this.httpOptions)
      .pipe(
        map((response: any) => {
          const shifts = response.extraShifts || [];
          // Convert date strings to Date objects
          return shifts.map((shift: any) => ({
            ...shift,
            fechaCreacion: new Date(shift.fechaCreacion || shift.createdAt),
            fechaTurnoExtra: new Date(shift.fechaTurnoExtra),
            createdAt: shift.createdAt ? new Date(shift.createdAt) : undefined,
            updatedAt: shift.updatedAt ? new Date(shift.updatedAt) : undefined
          }));
        }),
        catchError(this.handleError<ExtraShift[]>('getExtraShiftsFromApi', []))
      );
  }

  /**
   * Create extra shift via API
   */
  private createExtraShiftApi(extraShift: Omit<ExtraShift, 'id' | 'createdAt' | 'updatedAt'>): Observable<ExtraShift | null> {
    return this.http.post<ExtraShiftApiResponse>(`${this.API_URL}/extrashifts`, extraShift, this.httpOptions)
      .pipe(
        map((response: any) => {
          const shift = response.extraShift;
          if (shift) {
            return {
              ...shift,
              fechaCreacion: new Date(shift.fechaCreacion || shift.createdAt),
              fechaTurnoExtra: new Date(shift.fechaTurnoExtra),
              createdAt: shift.createdAt ? new Date(shift.createdAt) : undefined,
              updatedAt: shift.updatedAt ? new Date(shift.updatedAt) : undefined
            };
          }
          return null;
        }),
        catchError(this.handleError<ExtraShift | null>('createExtraShiftApi', null))
      );
  }

  /**
   * Update extra shift via API
   */
  private updateExtraShiftApi(id: number, updates: Partial<ExtraShift>): Observable<ExtraShift | null> {
    return this.http.put<ExtraShiftApiResponse>(`${this.API_URL}/extrashifts/${id}`, updates, this.httpOptions)
      .pipe(
        map((response: any) => {
          const shift = response.extraShift;
          if (shift) {
            return {
              ...shift,
              fechaCreacion: new Date(shift.fechaCreacion || shift.createdAt),
              fechaTurnoExtra: new Date(shift.fechaTurnoExtra),
              createdAt: shift.createdAt ? new Date(shift.createdAt) : undefined,
              updatedAt: shift.updatedAt ? new Date(shift.updatedAt) : undefined
            };
          }
          return null;
        }),
        catchError(this.handleError<ExtraShift | null>('updateExtraShiftApi', null))
      );
  }

  /**
   * Error handler
   */
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: HttpErrorResponse): Observable<T> => {
      console.error(`${operation} failed:`, error);
      return of(result as T);
    };
  }

  /**
   * Get all extra shifts
   */
  getExtraShifts(): Observable<ExtraShift[]> {
    return this.extraShifts.asObservable();
  }

  /**
   * Refresh extra shifts from backend
   */
  refreshExtraShifts(): void {
    this.loadExtraShiftsFromBackend();
  }

  /**
   * Get extra shifts for a specific date
   */
  getExtraShiftsForDate(date: Date): Observable<ExtraShift[]> {
    return this.extraShifts.pipe(
      map(shifts => shifts.filter(shift => 
        this.isSameDate(shift.fechaTurnoExtra, date) && 
        shift.estado === 'programado'
      ))
    );
  }

  /**
   * Get extra shifts for a specific worker
   */
  getExtraShiftsForWorker(trabajadorId: number): Observable<ExtraShift[]> {
    return this.extraShifts.pipe(
      map(shifts => shifts.filter(shift => shift.trabajadorId === trabajadorId))
    );
  }

  /**
   * Assign extra shift to worker and update their estado
   */
  async assignExtraShift(
    trabajador: trabajador, 
    fechaTurnoExtra: Date, 
    horasExtras: number, 
    tipoTurno: 'day' | 'night', 
    detalles: string
  ): Promise<boolean> {
    try {
      // Check if worker can be assigned extra shift
      if (trabajador.estado === 'activo') {
        throw new Error('No se puede asignar turno extra a trabajadores activos');
      }

      // Create extra shift record via API
      const extraShiftData = {
        trabajadorId: trabajador.id,
        fechaCreacion: new Date(),
        fechaTurnoExtra,
        horasExtras,
        tipoTurno,
        detalles,
        estado: 'programado' as const
      };

      const createdShift = await firstValueFrom(this.createExtraShiftApi(extraShiftData));
      
      if (!createdShift) {
        throw new Error('Failed to create extra shift via API');
      }

      // Update worker estado to activoextra
      const updateResult = await firstValueFrom(
        this.trabajadoresService.updateTrabajador(
          trabajador.id!, 
          { estado: 'activoextra' }
        )
      );

      if (updateResult) {
        // Refresh extra shifts from backend
        this.loadExtraShiftsFromBackend();
        return true;
      } else {
        console.error('Failed to update worker estado, rolling back extra shift creation');
        return false;
      }

    } catch (error) {
      console.error('Error assigning extra shift:', error);
      throw error;
    }
  }

  /**
   * Cancel extra shift and restore worker estado
   */
  async cancelExtraShift(extraShiftId: number, newEstado: string = 'inactivo'): Promise<boolean> {
    try {
      const currentShifts = this.extraShifts.value;
      const shift = currentShifts.find(s => s.id === extraShiftId);
      
      if (!shift) {
        throw new Error('Turno extra no encontrado');
      }

      // Update extra shift status via API
      const updatedShift = await firstValueFrom(
        this.updateExtraShiftApi(extraShiftId, { estado: 'cancelado' })
      );

      if (updatedShift) {
        // Update worker estado
        const updateSuccess = await firstValueFrom(
          this.trabajadoresService.updateTrabajador(
            shift.trabajadorId, 
            { estado: newEstado }
          )
        );

        if (updateSuccess) {
          // Refresh extra shifts from backend
          this.loadExtraShiftsFromBackend();
          return true;
        }
      }

      return false;
    } catch (error) {
      console.error('Error cancelling extra shift:', error);
      throw error;
    }
  }

  /**
   * Complete extra shift
   */
  async completeExtraShift(extraShiftId: number): Promise<boolean> {
    try {
      const updatedShift = await firstValueFrom(
        this.updateExtraShiftApi(extraShiftId, { estado: 'completado' })
      );

      if (updatedShift) {
        // Refresh extra shifts from backend
        this.loadExtraShiftsFromBackend();
        return true;
      }

      return false;
    } catch (error) {
      console.error('Error completing extra shift:', error);
      return false;
    }
  }

  /**
   * Check if worker has extra shift on specific date
   */
  hasExtraShiftOnDate(trabajadorId: number, date: Date): Observable<boolean> {
    return this.extraShifts.pipe(
      map(shifts => shifts.some(shift => 
        shift.trabajadorId === trabajadorId &&
        this.isSameDate(shift.fechaTurnoExtra, date) &&
        shift.estado === 'programado'
      ))
    );
  }

  /**
   * Get extra shift details for worker on specific date
   */
  getExtraShiftForWorkerOnDate(trabajadorId: number, date: Date): Observable<ExtraShift | null> {
    return this.extraShifts.pipe(
      map(shifts => {
        const shift = shifts.find(shift => 
          shift.trabajadorId === trabajadorId &&
          this.isSameDate(shift.fechaTurnoExtra, date) &&
          shift.estado === 'programado'
        );
        return shift || null;
      })
    );
  }

  /**
   * Validate if worker can be assigned extra shift
   */
  canAssignExtraShift(trabajador: trabajador): { canAssign: boolean, reason?: string } {
    if (trabajador.estado === 'activo') {
      return { 
        canAssign: false, 
        reason: 'No se puede asignar turno extra a trabajadores activos' 
      };
    }

    if (trabajador.estado === 'activoextra') {
      return { 
        canAssign: false, 
        reason: 'El trabajador ya tiene un turno extra asignado' 
      };
    }

    return { canAssign: true };
  }

  /**
   * Helper method to compare dates (ignore time)
   */
  private isSameDate(date1: Date, date2: Date): boolean {
    const d1 = new Date(date1);
    const d2 = new Date(date2);
    return d1.getFullYear() === d2.getFullYear() &&
           d1.getMonth() === d2.getMonth() &&
           d1.getDate() === d2.getDate();
  }
}
