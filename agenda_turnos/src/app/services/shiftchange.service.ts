import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, combineLatest } from 'rxjs';
import { map, filter } from 'rxjs/operators';
import { trabajador, turno, nivel, estado } from './datos';
import { ShiftCalculatorService, WorkerShiftInfo, ShiftType } from './shift-calculator.service';
import { TrabajadoresService } from './trabajadores.service';

export interface ShiftChangeRequest {
  originalWorker: trabajador;
  targetWorker: trabajador;
  shiftDate: Date;
  originalShiftType: ShiftType;
  targetShiftType: ShiftType;
  isValidChange: boolean;
  conflictReason?: string;
}

export interface MonthlyShiftInfo {
  date: Date;
  shiftInfo: WorkerShiftInfo;
  isSelectable: boolean; // Can be selected for shift change
  conflictReason?: string;
}

export interface EligibleWorker {
  trabajador: trabajador;
  monthlyShifts: MonthlyShiftInfo[];
}

@Injectable({
  providedIn: 'root'
})
export class ShiftchangeService {

  private currentShiftChangeRequest = new BehaviorSubject<ShiftChangeRequest | null>(null);
  private activeShiftChanges = new BehaviorSubject<Map<string, ShiftChangeRequest>>(new Map());

  constructor(
    private shiftCalculator: ShiftCalculatorService,
    private trabajadoresService: TrabajadoresService
  ) { }

  /**
   * Get current shift change request observable
   */
  getCurrentShiftChangeRequest(): Observable<ShiftChangeRequest | null> {
    return this.currentShiftChangeRequest.asObservable();
  }

  /**
   * Get active shift changes observable
   */
  getActiveShiftChanges(): Observable<Map<string, ShiftChangeRequest>> {
    return this.activeShiftChanges.asObservable();
  }

  /**
   * Get monthly shifts for a worker (current month + next month)
   * Only shows shifts with estado: activo or activoextra
   */
  getWorkerMonthlyShifts(worker: trabajador, startDate: Date = new Date()): MonthlyShiftInfo[] {
    const monthlyShifts: MonthlyShiftInfo[] = [];
    
    // Get current month and next month
    const currentMonth = new Date(startDate.getFullYear(), startDate.getMonth(), 1);
    const nextMonth = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 1);
    const endDate = new Date(startDate.getFullYear(), startDate.getMonth() + 2, 0); // Last day of next month

    // Only process if worker is active or activoextra
    if (!this.isWorkerEligibleForShiftDisplay(worker)) {
      return monthlyShifts;
    }

    // Generate shifts for both months
    for (let date = new Date(currentMonth); date <= endDate; date.setDate(date.getDate() + 1)) {
      const currentDate = new Date(date);
      const shiftInfo = this.shiftCalculator.calculateWorkerShift(worker, currentDate);
      
      // Only include days where worker is scheduled to work (activo or activoextra)
      const isSelectable = this.isShiftSelectable(shiftInfo, currentDate);
      
      monthlyShifts.push({
        date: currentDate,
        shiftInfo,
        isSelectable,
        conflictReason: isSelectable ? undefined : this.getSelectabilityReason(shiftInfo)
      });
    }

    return monthlyShifts;
  }

  /**
   * Get workers eligible for shift change (same turno and nivel)
   */
  getEligibleWorkersForShiftChange(originalWorker: trabajador): Observable<EligibleWorker[]> {
    return this.trabajadoresService.getTrabajadores().pipe(
      map(workers => {
        return workers
          .filter(worker => this.isWorkerEligibleForShiftChange(worker, originalWorker))
          .map(worker => ({
            trabajador: worker,
            monthlyShifts: this.getWorkerMonthlyShifts(worker)
          }));
      })
    );
  }

  /**
   * Validate if a shift change is possible between two workers on a specific date
   */
  validateShiftChange(originalWorker: trabajador, targetWorker: trabajador, shiftDate: Date): ShiftChangeRequest {
    const originalShiftInfo = this.shiftCalculator.calculateWorkerShift(originalWorker, shiftDate);
    const targetShiftInfo = this.shiftCalculator.calculateWorkerShift(targetWorker, shiftDate);

    // Check if both workers are on the same shift at the same time
    const isConflict = this.checkShiftConflict(originalShiftInfo, targetShiftInfo, shiftDate);
    
    const request: ShiftChangeRequest = {
      originalWorker,
      targetWorker,
      shiftDate,
      originalShiftType: originalShiftInfo.shiftStatus,
      targetShiftType: targetShiftInfo.shiftStatus,
      isValidChange: !isConflict.hasConflict,
      conflictReason: isConflict.reason
    };

    return request;
  }

  /**
   * Execute a shift change between two workers
   */
  executeShiftChange(shiftChangeRequest: ShiftChangeRequest): Observable<boolean> {
    if (!shiftChangeRequest.isValidChange) {
      throw new Error('Invalid shift change request: ' + shiftChangeRequest.conflictReason);
    }

    // Update original worker to 'turnocambiadoOFF' (absent with shift change motive)
    const originalWorkerUpdate = this.updateWorkerForShiftChange(
      shiftChangeRequest.originalWorker, 
      'turnocambiadoOFF'
    );

    // Update target worker to 'turnocamdiadoON' (working the shifted day)
    const targetWorkerUpdate = this.updateWorkerForShiftChange(
      shiftChangeRequest.targetWorker, 
      'turnocamdiadoON'
    );

    return combineLatest([originalWorkerUpdate, targetWorkerUpdate]).pipe(
      map(([originalSuccess, targetSuccess]) => {
        if (originalSuccess && targetSuccess) {
          // Add to active shift changes
          const shiftKey = this.generateShiftChangeKey(shiftChangeRequest);
          const currentShiftChanges = this.activeShiftChanges.value;
          currentShiftChanges.set(shiftKey, shiftChangeRequest);
          this.activeShiftChanges.next(currentShiftChanges);
          
          return true;
        }
        return false;
      })
    );
  }

  /**
   * Cancel a shift change and restore original worker states
   */
  cancelShiftChange(shiftChangeRequest: ShiftChangeRequest): Observable<boolean> {
    // Restore original worker to 'activo'
    const originalWorkerRestore = this.updateWorkerForShiftChange(
      shiftChangeRequest.originalWorker, 
      'activo'
    );

    // Restore target worker to 'activo'
    const targetWorkerRestore = this.updateWorkerForShiftChange(
      shiftChangeRequest.targetWorker, 
      'activo'
    );

    return combineLatest([originalWorkerRestore, targetWorkerRestore]).pipe(
      map(([originalSuccess, targetSuccess]) => {
        if (originalSuccess && targetSuccess) {
          // Remove from active shift changes
          const shiftKey = this.generateShiftChangeKey(shiftChangeRequest);
          const currentShiftChanges = this.activeShiftChanges.value;
          currentShiftChanges.delete(shiftKey);
          this.activeShiftChanges.next(currentShiftChanges);
          
          return true;
        }
        return false;
      })
    );
  }

  /**
   * Check if worker is eligible for shift display (activo or activoextra)
   */
  private isWorkerEligibleForShiftDisplay(worker: trabajador): boolean {
    return worker.estado === 'activo' || worker.estado === 'activoextra';
  }

  /**
   * Check if worker is eligible for shift change (same turno, nivel and currently active)
   */
  private isWorkerEligibleForShiftChange(worker: trabajador, originalWorker: trabajador): boolean {
    return worker.id !== originalWorker.id &&
           worker.turno === originalWorker.turno &&
           worker.nivel === originalWorker.nivel &&
           this.isWorkerEligibleForShiftDisplay(worker);
  }

  /**
   * Check if a shift is selectable for shift change
   */
  private isShiftSelectable(shiftInfo: WorkerShiftInfo, date: Date): boolean {
    // Only scheduled shifts (not OFF) can be selected
    // Don't allow selection if worker is already absent or on extra/shifted duty
    return shiftInfo.isScheduled && 
           !shiftInfo.isAbsent && 
           !shiftInfo.isExtra && 
           !shiftInfo.isShifted &&
           date >= new Date(); // Can't change past shifts
  }

  /**
   * Get reason why shift is not selectable
   */
  private getSelectabilityReason(shiftInfo: WorkerShiftInfo): string {
    if (!shiftInfo.isScheduled) return 'Día libre';
    if (shiftInfo.isAbsent) return 'Ausente: ' + (shiftInfo.absenceReason || 'Motivo no especificado');
    if (shiftInfo.isExtra) return 'Turno extra';
    if (shiftInfo.isShifted) return 'Cambio de turno activo';
    return 'No disponible';
  }

  /**
   * Check if there's a conflict between two workers' shifts
   */
  private checkShiftConflict(originalShift: WorkerShiftInfo, targetShift: WorkerShiftInfo, date: Date): {hasConflict: boolean, reason?: string} {
    // Can't change shifts in the past
    if (date < new Date()) {
      return { hasConflict: true, reason: 'No se pueden cambiar turnos del pasado' };
    }

    // Original worker must be scheduled to work
    if (!originalShift.isScheduled) {
      return { hasConflict: true, reason: 'El trabajador original no tiene turno programado este día' };
    }

    // Target worker must be free (not scheduled)
    if (targetShift.isScheduled) {
      return { hasConflict: true, reason: 'El trabajador objetivo ya tiene turno programado este día' };
    }

    // Check if both would be working the same shift type (day/night conflict)
    if (originalShift.shiftStatus === targetShift.shiftStatus && 
        (originalShift.shiftStatus === ShiftType.DAY_IN || originalShift.shiftStatus === ShiftType.NIGHT_IN)) {
      return { hasConflict: true, reason: 'Ambos trabajadores tienen el mismo tipo de turno' };
    }

    // Target worker should not be absent, on extra, or already shifted
    if (targetShift.isAbsent) {
      return { hasConflict: true, reason: 'El trabajador objetivo está ausente: ' + (targetShift.absenceReason || 'Motivo no especificado') };
    }

    if (targetShift.isExtra) {
      return { hasConflict: true, reason: 'El trabajador objetivo ya está en turno extra' };
    }

    if (targetShift.isShifted) {
      return { hasConflict: true, reason: 'El trabajador objetivo ya tiene un cambio de turno activo' };
    }

    return { hasConflict: false };
  }

  /**
   * Update worker estado for shift change
   */
  private updateWorkerForShiftChange(worker: trabajador, newEstado: estado): Observable<boolean> {
    return this.trabajadoresService.updateTrabajador(worker.id, { estado: newEstado }).pipe(
      map(updatedWorker => updatedWorker !== null)
    );
  }

  /**
   * Generate unique key for shift change tracking
   */
  private generateShiftChangeKey(request: ShiftChangeRequest): string {
    return `${request.originalWorker.id}-${request.targetWorker.id}-${request.shiftDate.toISOString().split('T')[0]}`;
  }

  /**
   * Get display information for shift types (day vs night identification)
   */
  getShiftDisplayInfo(shiftType: ShiftType): {name: string, color: string, isDayShift: boolean} {
    switch (shiftType) {
      case ShiftType.DAY_IN:
        return { name: 'Turno de Día', color: 'primary', isDayShift: true };
      case ShiftType.NIGHT_IN:
        return { name: 'Turno de Noche', color: 'secondary', isDayShift: false };
      default:
        return { name: 'Libre', color: 'medium', isDayShift: true };
    }
  }

  /**
   * Set current shift change request for UI state management
   */
  setCurrentShiftChangeRequest(request: ShiftChangeRequest | null): void {
    this.currentShiftChangeRequest.next(request);
  }

  /**
   * Get all active shift changes for a specific date
   */
  getActiveShiftChangesForDate(date: Date): Observable<ShiftChangeRequest[]> {
    return this.activeShiftChanges.pipe(
      map(shiftChangesMap => {
        const dateKey = date.toISOString().split('T')[0];
        return Array.from(shiftChangesMap.values()).filter(request => 
          request.shiftDate.toISOString().split('T')[0] === dateKey
        );
      })
    );
  }

  /**
   * Get all active shift changes for a specific worker
   */
  getActiveShiftChangesForWorker(workerId: number): Observable<ShiftChangeRequest[]> {
    return this.activeShiftChanges.pipe(
      map(shiftChangesMap => {
        return Array.from(shiftChangesMap.values()).filter(request => 
          request.originalWorker.id === workerId || request.targetWorker.id === workerId
        );
      })
    );
  }
}
