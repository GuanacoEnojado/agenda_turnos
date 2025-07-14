import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, firstValueFrom, combineLatest } from 'rxjs';
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
   * Check if worker is eligible for extra shifts based on their base estado
   */
  private isWorkerEligibleForExtraShift(trabajador: trabajador): boolean {
    // Workers who can work extra shifts (those not permanently unavailable)
    const eligibleStates = ['activo', 'inactivo'];
    return eligibleStates.includes(trabajador.estado);
  }

  /**
   * Check if worker has extra shift of specific type on specific date
   */
  hasExtraShiftOfTypeOnDate(trabajadorId: number, date: Date, tipoTurno: 'day' | 'night'): Observable<boolean> {
    return this.extraShifts.pipe(
      map(shifts => shifts.some(shift => 
        shift.trabajadorId === trabajadorId &&
        this.isSameDate(shift.fechaTurnoExtra, date) &&
        shift.tipoTurno === tipoTurno &&
        shift.estado === 'programado'
      ))
    );
  }

  /**
   * Get extra shift of specific type for worker on specific date
   */
  getExtraShiftOfTypeForWorkerOnDate(trabajadorId: number, date: Date, tipoTurno: 'day' | 'night'): Observable<ExtraShift | null> {
    return this.extraShifts.pipe(
      map(shifts => {
        const shift = shifts.find(shift => 
          shift.trabajadorId === trabajadorId &&
          this.isSameDate(shift.fechaTurnoExtra, date) &&
          shift.tipoTurno === tipoTurno &&
          shift.estado === 'programado'
        );
        return shift || null;
      })
    );
  }

  /**
   * Assign extra shift to worker (do NOT change worker's current estado)
   * Now allows multiple shifts per day (day and night separately)
   */
  async assignExtraShift(
    trabajador: trabajador, 
    fechaTurnoExtra: Date, 
    horasExtras: number, 
    tipoTurno: 'day' | 'night', 
    detalles: string
  ): Promise<boolean> {
    try {
      // Check if worker can be assigned extra shift (only check base estado, not current date)
      if (!this.isWorkerEligibleForExtraShift(trabajador)) {
        throw new Error('No se puede asignar turno extra a trabajadores con este estado');
      }

      // Check if worker already has an extra shift of this type on that date
      const hasExtraShiftOfType = await firstValueFrom(
        this.hasExtraShiftOfTypeOnDate(trabajador.id!, fechaTurnoExtra, tipoTurno)
      );
      
      if (hasExtraShiftOfType) {
        const shiftTypeName = tipoTurno === 'day' ? 'día' : 'noche';
        throw new Error(`El trabajador ya tiene un turno extra de ${shiftTypeName} asignado para esta fecha`);
      }

      // Create extra shift record via API (DO NOT change worker estado)
      // Fix date to ensure no timezone issues
      const normalizedDate = new Date(fechaTurnoExtra.getFullYear(), fechaTurnoExtra.getMonth(), fechaTurnoExtra.getDate());
      const extraShiftData = {
        trabajadorId: trabajador.id!,
        fechaCreacion: new Date(),
        fechaTurnoExtra: normalizedDate,
        horasExtras,
        tipoTurno,
        detalles,
        estado: 'programado' as const,
        createdBy: 1 // TODO: Get from current user session
      };

      const createdShift = await firstValueFrom(this.createExtraShiftApi(extraShiftData));
      
      if (!createdShift) {
        throw new Error('Failed to create extra shift via API');
      }

      // Refresh extra shifts from backend
      this.loadExtraShiftsFromBackend();
      return true;

    } catch (error) {
      console.error('Error assigning extra shift:', error);
      throw error;
    }
  }

  /**
   * Cancel extra shift (do NOT change worker's current estado)
   */
  async cancelExtraShift(extraShiftId: number): Promise<boolean> {
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
        // Refresh extra shifts from backend
        this.loadExtraShiftsFromBackend();
        return true;
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
    if (!this.isWorkerEligibleForExtraShift(trabajador)) {
      return { 
        canAssign: false, 
        reason: `No se puede asignar turno extra a trabajadores con estado: ${trabajador.estado}` 
      };
    }

    return { canAssign: true };
  }

  /**
   * Get worker's effective status on a specific date
   * This considers their base estado plus any date-specific statuses (extra shifts, medical leaves, etc.)
   */
  getWorkerStatusOnDate(trabajador: trabajador, date: Date): Observable<{
    baseEstado: string;
    effectiveEstado: string;
    hasExtraShift: boolean;
    extraShiftDetails?: ExtraShift;
    // Future: add medical leaves, vacations, etc.
    hasMedicalLeave?: boolean;
    hasScheduledVacation?: boolean;
  }> {
    return this.getExtraShiftForWorkerOnDate(trabajador.id!, date).pipe(
      map(extraShift => {
        const hasExtraShift = extraShift !== null;
        
        // Determine effective estado for this specific date
        let effectiveEstado = trabajador.estado;
        
        if (hasExtraShift) {
          effectiveEstado = 'activoextra';
        }
        // Future: Add other date-specific status checks here
        // Example:
        // if (hasMedicalLeaveOnDate(trabajador.id!, date)) {
        //   effectiveEstado = 'licencia';
        // }
        // if (hasScheduledVacationOnDate(trabajador.id!, date)) {
        //   effectiveEstado = 'vacaciones';
        // }
        
        return {
          baseEstado: trabajador.estado,
          effectiveEstado,
          hasExtraShift,
          extraShiftDetails: extraShift || undefined
        };
      })
    );
  }

  /**
   * Check if worker is available for assignment on a specific date
   * This considers both their base estado and any date-specific statuses
   */
  isWorkerAvailableOnDate(trabajador: trabajador, date: Date): Observable<{
    isAvailable: boolean;
    reason?: string;
    currentStatus: string;
  }> {
    return this.getWorkerStatusOnDate(trabajador, date).pipe(
      map(statusInfo => {
        const { effectiveEstado } = statusInfo;
        
        // Workers who are not available for any assignments
        const unavailableStates = [
          'licencia', 
          'vacaciones', 
          'suspendido', 
          'activoextra', // Already has extra shift
          'inasistente'
        ];
        
        if (unavailableStates.includes(effectiveEstado)) {
          return {
            isAvailable: false,
            reason: `Trabajador no disponible: ${effectiveEstado}`,
            currentStatus: effectiveEstado
          };
        }
        
        return {
          isAvailable: true,
          currentStatus: effectiveEstado
        };
      })
    );
  }

  /**
   * Get all workers who are available for extra shifts on a specific date
   */
  getAvailableWorkersForExtraShift(trabajadores: trabajador[], date: Date): Observable<trabajador[]> {
    // First filter by base eligibility
    const eligibleWorkers = trabajadores.filter(worker => 
      this.isWorkerEligibleForExtraShift(worker)
    );
    
    // Then check date-specific availability
    const availabilityChecks = eligibleWorkers.map(worker =>
      this.isWorkerAvailableOnDate(worker, date).pipe(
        map(availability => ({ worker, availability }))
      )
    );
    
    // Combine all availability checks
    if (availabilityChecks.length === 0) {
      return of([]);
    }
    
    return combineLatest(availabilityChecks).pipe(
      map((workerAvailabilities: Array<{worker: trabajador, availability: any}>) => 
        workerAvailabilities
          .filter(({ availability }) => availability.isAvailable)
          .map(({ worker }) => worker)
      )
    );
  }

  /**
   * Get all extra shifts for a worker on a specific date (both day and night)
   */
  getAllExtraShiftsForWorkerOnDate(trabajadorId: number, date: Date): Observable<ExtraShift[]> {
    return this.extraShifts.pipe(
      map(shifts => shifts.filter(shift => 
        shift.trabajadorId === trabajadorId &&
        this.isSameDate(shift.fechaTurnoExtra, date) &&
        shift.estado === 'programado'
      ))
    );
  }

  /**
   * Delete/cancel a specific extra shift
   */
  async deleteExtraShift(extraShiftId: number): Promise<boolean> {
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
        // Refresh extra shifts from backend
        this.loadExtraShiftsFromBackend();
        return true;
      }

      return false;
    } catch (error) {
      console.error('Error deleting extra shift:', error);
      throw error;
    }
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
