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
  isSelectable: boolean; // Puede ser seleccionado para cambio de turno
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
   * Obtener observable de solicitud de cambio de turno actual
   */
  getCurrentShiftChangeRequest(): Observable<ShiftChangeRequest | null> {
    return this.currentShiftChangeRequest.asObservable();
  }

  /**
   * Obtener observable de cambios de turno activos
   */
  getActiveShiftChanges(): Observable<Map<string, ShiftChangeRequest>> {
    return this.activeShiftChanges.asObservable();
  }

  /**
   * Obtener turnos mensuales para un trabajador (mes actual + mes siguiente)
   * Solo muestra turnos con estado: activo o activoextra
   */
  getWorkerMonthlyShifts(worker: trabajador, startDate: Date = new Date()): MonthlyShiftInfo[] {
    const monthlyShifts: MonthlyShiftInfo[] = [];
    
    // Obtener mes actual y mes siguiente
    const currentMonth = new Date(startDate.getFullYear(), startDate.getMonth(), 1);
    const nextMonth = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 1);
    const endDate = new Date(startDate.getFullYear(), startDate.getMonth() + 2, 0); // Último día del mes siguiente

    // Solo procesar si el trabajador está activo o activoextra
    if (!this.isWorkerEligibleForShiftDisplay(worker)) {
      return monthlyShifts;
    }

    // Generar turnos para ambos meses
    for (let date = new Date(currentMonth); date <= endDate; date.setDate(date.getDate() + 1)) {
      const currentDate = new Date(date);
      const shiftInfo = this.shiftCalculator.calculateWorkerShift(worker, currentDate);
      
      // Solo incluir días donde el trabajador está programado para trabajar (activo o activoextra)
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
   * Obtener trabajadores elegibles para cambio de turno (mismo turno y nivel)
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
   * Validar si es posible un cambio de turno entre dos trabajadores en una fecha específica
   */
  validateShiftChange(originalWorker: trabajador, targetWorker: trabajador, shiftDate: Date): ShiftChangeRequest {
    const originalShiftInfo = this.shiftCalculator.calculateWorkerShift(originalWorker, shiftDate);
    const targetShiftInfo = this.shiftCalculator.calculateWorkerShift(targetWorker, shiftDate);

    // Verificar si ambos trabajadores están en el mismo turno al mismo tiempo
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
   * Ejecutar un cambio de turno entre dos trabajadores
   */
  executeShiftChange(shiftChangeRequest: ShiftChangeRequest): Observable<boolean> {
    if (!shiftChangeRequest.isValidChange) {
      throw new Error('Invalid shift change request: ' + shiftChangeRequest.conflictReason);
    }

    // Actualizar trabajador original a 'turnocambiadoOFF' (ausente con motivo de cambio de turno)
    const originalWorkerUpdate = this.updateWorkerForShiftChange(
      shiftChangeRequest.originalWorker, 
      'turnocambiadoOFF'
    );

    // Actualizar trabajador objetivo a 'turnocamdiadoON' (trabajando el día intercambiado)
    const targetWorkerUpdate = this.updateWorkerForShiftChange(
      shiftChangeRequest.targetWorker, 
      'turnocamdiadoON'
    );

    return combineLatest([originalWorkerUpdate, targetWorkerUpdate]).pipe(
      map(([originalSuccess, targetSuccess]) => {
        if (originalSuccess && targetSuccess) {
          // Agregar a cambios de turno activos
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
   * Cancelar un cambio de turno y restaurar estados originales de trabajadores
   */
  cancelShiftChange(shiftChangeRequest: ShiftChangeRequest): Observable<boolean> {
    // Restaurar trabajador original a 'activo'
    const originalWorkerRestore = this.updateWorkerForShiftChange(
      shiftChangeRequest.originalWorker, 
      'activo'
    );

    // Restaurar trabajador objetivo a 'activo'
    const targetWorkerRestore = this.updateWorkerForShiftChange(
      shiftChangeRequest.targetWorker, 
      'activo'
    );

    return combineLatest([originalWorkerRestore, targetWorkerRestore]).pipe(
      map(([originalSuccess, targetSuccess]) => {
        if (originalSuccess && targetSuccess) {
          // Eliminar de cambios de turno activos
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
   * Verificar si el trabajador es elegible para mostrar turno (activo o activoextra)
   */
  private isWorkerEligibleForShiftDisplay(worker: trabajador): boolean {
    return worker.estado === 'activo' || worker.estado === 'activoextra';
  }

  /**
   * Verificar si el trabajador es elegible para cambio de turno (mismo turno, nivel y actualmente activo)
   */
  private isWorkerEligibleForShiftChange(worker: trabajador, originalWorker: trabajador): boolean {
    return worker.id !== originalWorker.id &&
           worker.turno === originalWorker.turno &&
           worker.nivel === originalWorker.nivel &&
           this.isWorkerEligibleForShiftDisplay(worker);
  }

  /**
   * Verificar si un turno es seleccionable para cambio de turno
   */
  private isShiftSelectable(shiftInfo: WorkerShiftInfo, date: Date): boolean {
    // No se pueden cambiar turnos pasados
    if (date < new Date()) {
      return false;
    }

    // Los turnos programados pueden ser seleccionados para intercambio
    // Los días libres también pueden ser seleccionados (para recibir un turno)
    // No permitir selección si el trabajador ya está ausente, en servicio extra o intercambiado
    return (!shiftInfo.isAbsent && 
            !shiftInfo.isExtra && 
            !shiftInfo.isShifted);
  }

  /**
   * Obtener motivo por el cual el turno no es seleccionable
   */
  private getSelectabilityReason(shiftInfo: WorkerShiftInfo): string {
    if (shiftInfo.isAbsent) return 'Ausente: ' + (shiftInfo.absenceReason || 'Motivo no especificado');
    if (shiftInfo.isExtra) return 'Turno extra';
    if (shiftInfo.isShifted) return 'Cambio de turno activo';
    return 'No disponible';
  }

  /**
   * Verificar si hay conflicto entre los turnos de dos trabajadores
   */
  private checkShiftConflict(originalShift: WorkerShiftInfo, targetShift: WorkerShiftInfo, date: Date): {hasConflict: boolean, reason?: string} {
    // No se pueden cambiar turnos en el pasado
    if (date < new Date()) {
      return { hasConflict: true, reason: 'No se pueden cambiar turnos del pasado' };
    }

    // El trabajador original debe estar programado para trabajar
    if (!originalShift.isScheduled) {
      return { hasConflict: true, reason: 'El trabajador original no tiene turno programado este día' };
    }

    // El trabajador objetivo debe estar libre (no programado) O tener un turno diferente (día vs noche)
    if (targetShift.isScheduled) {
      // Si ambos están programados, solo hay conflicto si es exactamente el mismo tipo de turno
      // Los turnos de día y noche son complementarios, no conflictivos
      if (originalShift.shiftStatus === targetShift.shiftStatus) {
        return { hasConflict: true, reason: 'Ambos trabajadores tienen exactamente el mismo turno programado' };
      }
      // Si son turnos diferentes (día/noche), no hay conflicto - pueden intercambiar
    }

    // El trabajador objetivo no debería estar ausente, en extra, o ya intercambiado
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
   * Actualizar estado del trabajador para cambio de turno
   */
  private updateWorkerForShiftChange(worker: trabajador, newEstado: estado): Observable<boolean> {
    return this.trabajadoresService.updateTrabajador(worker.id, { estado: newEstado }).pipe(
      map(updatedWorker => updatedWorker !== null)
    );
  }

  /**
   * Generar clave única para seguimiento de cambio de turno
   */
  private generateShiftChangeKey(request: ShiftChangeRequest): string {
    return `${request.originalWorker.id}-${request.targetWorker.id}-${request.shiftDate.toISOString().split('T')[0]}`;
  }

  /**
   * Obtener información de visualización para tipos de turno (identificación día vs noche)
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
   * Establecer solicitud de cambio de turno actual para gestión de estado de UI
   */
  setCurrentShiftChangeRequest(request: ShiftChangeRequest | null): void {
    this.currentShiftChangeRequest.next(request);
  }

  /**
   * Obtener todos los cambios de turno activos para una fecha específica
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
   * Obtener todos los cambios de turno activos para un trabajador específico
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
