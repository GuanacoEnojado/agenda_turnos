import { Injectable } from '@angular/core';
import { trabajador, turno } from './datos';

export interface ShiftPattern {
  turno: turno;
  cycleLength: number; // Días en el ciclo de turnos
  pattern: ShiftType[]; // Array que representa el patrón de turnos
}

export enum ShiftType {
  DAY_IN = 'day_in',
  NIGHT_IN = 'night_in', 
  DAY_OUT = 'day_out',
  NIGHT_OUT = 'night_out',
  OFF = 'off'
}

export interface WorkerShiftInfo {
  trabajador: trabajador;
  shiftStatus: ShiftType;
  isScheduled: boolean;
  isAbsent: boolean;
  absenceReason?: string;
  isExtra: boolean;
  isShifted: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class ShiftCalculatorService {

  private shiftPatterns: Map<turno, ShiftPattern> = new Map([
    // 4to_turno_modificado: día trabaja, día trabaja, día libre, día libre (ciclo de 4 días)
    ['4to_turno_modificado', {
      turno: '4to_turno_modificado',
      cycleLength: 4,
      pattern: [ShiftType.DAY_IN, ShiftType.DAY_IN, ShiftType.OFF, ShiftType.OFF]
    }],
    
    // 3er_turno: día trabaja, día trabaja, noche trabaja (día siguiente), noche trabaja, día libre, día libre (ciclo de 6 días)
    ['3er_turno', {
      turno: '3er_turno', 
      cycleLength: 6,
      pattern: [ShiftType.DAY_IN, ShiftType.DAY_IN, ShiftType.NIGHT_IN, ShiftType.NIGHT_IN, ShiftType.OFF, ShiftType.OFF]
    }],
    
    // 4to_turno: día trabaja, noche trabaja (día siguiente), día libre, día libre (ciclo de 4 días)
    ['4to_turno', {
      turno: '4to_turno',
      cycleLength: 4, 
      pattern: [ShiftType.DAY_IN, ShiftType.NIGHT_IN, ShiftType.OFF, ShiftType.OFF]
    }],
    
    // diurno_hospital: Lunes a Viernes, 8 AM a 5 PM
    ['diurno_hospital', {
      turno: 'diurno_hospital',
      cycleLength: 7, // Ciclo semanal
      pattern: [ShiftType.DAY_IN, ShiftType.DAY_IN, ShiftType.DAY_IN, ShiftType.DAY_IN, ShiftType.DAY_IN, ShiftType.OFF, ShiftType.OFF] // Lun-Vie trabajo, Sáb-Dom libre
    }],
    
    // diurno_empresa: Lunes a Viernes, 8 AM a 5 PM  
    ['diurno_empresa', {
      turno: 'diurno_empresa',
      cycleLength: 7, // Ciclo semanal
      pattern: [ShiftType.DAY_IN, ShiftType.DAY_IN, ShiftType.DAY_IN, ShiftType.DAY_IN, ShiftType.DAY_IN, ShiftType.OFF, ShiftType.OFF] // Lun-Vie trabajo, Sáb-Dom libre
    }],
    
    // volante: Sin patrón de turno fijo
    ['volante', {
      turno: 'volante',
      cycleLength: 1,
      pattern: [ShiftType.OFF] // Siempre libre a menos que se programe manualmente
    }]
  ]);

  constructor() { }

  /**
   * Calcular el estado del turno para un trabajador en una fecha específica
   * @param trabajador - El trabajador
   * @param targetDate - La fecha objetivo
   * @returns El tipo de turno para esa fecha
   */
  calculateWorkerShift(trabajador: trabajador, targetDate: Date): WorkerShiftInfo {
    const shiftPattern = this.shiftPatterns.get(trabajador.turno as turno);
    
    if (!shiftPattern) {
      return {
        trabajador,
        shiftStatus: ShiftType.OFF,
        isScheduled: false,
        isAbsent: false,
        isExtra: false,
        isShifted: false
      };
    }

    // Para trabajadores volantes, no tienen horario fijo
    if (trabajador.turno === 'volante') {
      return {
        trabajador,
        shiftStatus: ShiftType.OFF,
        isScheduled: false,
        isAbsent: false,
        isExtra: false,
        isShifted: false
      };
    }

    const shiftStartDate = new Date(trabajador.fechainicioturno);
    const daysDifference = this.calculateDaysDifference(shiftStartDate, targetDate);
    
    // Para turnos diurnos, considerar lógica de días laborables
    if (trabajador.turno === 'diurno_hospital' || trabajador.turno === 'diurno_empresa') {
      return this.calculateDiurnoShift(trabajador, targetDate, daysDifference);
    }
    
    // Para turnos rotativos (4to_turno_modificado, 3er_turno, 4to_turno)
    return this.calculateRotatingShift(trabajador, targetDate, daysDifference, shiftPattern);
  }

  /**
   * Calcular turno para trabajadores diurnos (Lunes-Viernes, 8 AM - 5 PM)
   */
  private calculateDiurnoShift(trabajador: trabajador, targetDate: Date, daysDifference: number): WorkerShiftInfo {
    const dayOfWeek = targetDate.getDay(); // 0 = Domingo, 1 = Lunes, ..., 6 = Sábado
    const isWeekday = dayOfWeek >= 1 && dayOfWeek <= 5; // Lunes a Viernes .agrgar holidays
    
    const shiftStatus = isWeekday ? ShiftType.DAY_IN : ShiftType.OFF;
    const isScheduled = isWeekday;
    const isNotScheduled = !isWeekday;

    // Verificar si el trabajador debería estar trabajando pero está ausente por vacaciones/licencia médica
    const isAbsent = isScheduled && this.isWorkerAbsent(trabajador);
    const absenceReason = isAbsent ? this.getAbsenceReason(trabajador) : undefined;
    const isExtra = isNotScheduled && this.isWorkerExtra(trabajador);
    const isShifted = isNotScheduled && this.isWorkerShifted(trabajador);

    return {
      trabajador,
      shiftStatus,
      isScheduled,
      isAbsent,
      isExtra,
      isShifted,
      absenceReason
    };
  }

  /**
   * Calcular turno para trabajadores de turnos rotativos
   */
  private calculateRotatingShift(trabajador: trabajador, targetDate: Date, daysDifference: number, shiftPattern: ShiftPattern): WorkerShiftInfo {
    // Manejar días negativos (fecha objetivo antes del inicio del turno)
    if (daysDifference < 0) {
      return {
        trabajador,
        shiftStatus: ShiftType.OFF,
        isScheduled: false,
        isAbsent: false,
        isExtra: false,
        isShifted: false
      };
    }

    const cyclePosition = daysDifference % shiftPattern.cycleLength;
    const shiftStatus = shiftPattern.pattern[cyclePosition];
    const isScheduled = shiftStatus !== ShiftType.OFF;
    const isNotScheduled = shiftStatus == ShiftType.OFF;
    
    // Verificar si el trabajador debería estar trabajando pero está ausente, o la inversa
    const isAbsent = isScheduled && this.isWorkerAbsent(trabajador);
    const absenceReason = isAbsent ? this.getAbsenceReason(trabajador) : undefined;
    const isExtra = isNotScheduled && this.isWorkerExtra(trabajador);
    const isShifted = isNotScheduled && this.isWorkerShifted(trabajador);

    return {
      trabajador,
      shiftStatus,
      isScheduled,
      isAbsent,
      isExtra,
      isShifted,
      absenceReason
    };
  }

  /**
   * Calcular todos los trabajadores en turno para una fecha específica
   */
  calculateWorkersForDate(trabajadores: trabajador[], targetDate: Date): WorkerShiftInfo[] {
    return trabajadores.map(trabajador => this.calculateWorkerShift(trabajador, targetDate));
  }

  /**
   * Obtener solo los trabajadores que están programados para trabajar en una fecha específica
   */
  getScheduledWorkers(trabajadores: trabajador[], targetDate: Date): WorkerShiftInfo[] {
    return this.calculateWorkersForDate(trabajadores, targetDate)
      .filter(workerInfo => workerInfo.isScheduled);
  }

  /**
   * Obtener trabajadores que deberían estar trabajando pero están ausentes
   */
  getAbsentWorkers(trabajadores: trabajador[], targetDate: Date): WorkerShiftInfo[] {
    return this.calculateWorkersForDate(trabajadores, targetDate)
      .filter(workerInfo => workerInfo.isAbsent);
  }

  /**
   * Obtener trabajadores que están disponibles para cambios de turno (no programados pero activos)
   */
  getAvailableWorkersForShiftChange(trabajadores: trabajador[], targetDate: Date): WorkerShiftInfo[] {
    return this.calculateWorkersForDate(trabajadores, targetDate)
      .filter(workerInfo => 
        !workerInfo.isScheduled && // No programado originalmente
        !workerInfo.isAbsent && // No ausente
        !workerInfo.isExtra && // No en turno extra
        !workerInfo.isShifted && // No con turno cambiado
        (workerInfo.trabajador.estado === 'activo' || workerInfo.trabajador.estado === 'activoextra')
      );
  }

  /**
   * Obtener trabajadores que están programados y pueden solicitar cambios de turno
   */
  getScheduledWorkersForShiftChange(trabajadores: trabajador[], targetDate: Date): WorkerShiftInfo[] {
    return this.calculateWorkersForDate(trabajadores, targetDate)
      .filter(workerInfo => 
        workerInfo.isScheduled && // Programado originalmente
        !workerInfo.isAbsent && // No ausente
        !workerInfo.isExtra && // No en turno extra
        !workerInfo.isShifted && // No con turno cambiado
        workerInfo.trabajador.estado === 'activo'
      );
  }

  /**
   * Verificar si dos trabajadores pueden intercambiar turnos en una fecha específica
   */
  canWorkersSwapShifts(worker1: trabajador, worker2: trabajador, targetDate: Date): {canSwap: boolean, reason?: string} {
    // Deben tener el mismo turno y nivel
    if (worker1.turno !== worker2.turno) {
      return { canSwap: false, reason: 'Los trabajadores deben tener el mismo tipo de turno' };
    }
    
    if (worker1.nivel !== worker2.nivel) {
      return { canSwap: false, reason: 'Los trabajadores deben tener el mismo nivel' };
    }

    const worker1Shift = this.calculateWorkerShift(worker1, targetDate);
    const worker2Shift = this.calculateWorkerShift(worker2, targetDate);

    // Ambos deben estar disponibles para el cambio de turno
    if (worker1Shift.isAbsent || worker1Shift.isExtra || worker1Shift.isShifted) {
      return { canSwap: false, reason: 'El primer trabajador no está disponible para cambio de turno' };
    }

    if (worker2Shift.isAbsent || worker2Shift.isExtra || worker2Shift.isShifted) {
      return { canSwap: false, reason: 'El segundo trabajador no está disponible para cambio de turno' };
    }

    // Uno debe estar programado, el otro debe estar libre
    if (worker1Shift.isScheduled === worker2Shift.isScheduled) {
      if (worker1Shift.isScheduled) {
        return { canSwap: false, reason: 'Ambos trabajadores están programados para trabajar' };
      } else {
        return { canSwap: false, reason: 'Ninguno de los trabajadores está programado para trabajar' };
      }
    }

    return { canSwap: true };
  }

  /**
   * Calcular la diferencia en días entre dos fechas
   */
  private calculateDaysDifference(startDate: Date, endDate: Date): number {
    const oneDay = 24 * 60 * 60 * 1000; // milisegundos en un día
    const startTime = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate()).getTime();
    const endTime = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate()).getTime();
    
    return Math.floor((endTime - startTime) / oneDay);
  }

  /**
   * Verificar si un trabajador está ausente (vacaciones, licencia médica, etc.)
   */
  private isWorkerAbsent(trabajador: trabajador): boolean {
    // Verificar si el trabajador está de vacaciones o con licencia médica
    return trabajador.estado === 'vacaciones' || trabajador.estado === 'licencia' || trabajador.estado === 'turnocambiadoOFF'|| trabajador.estado === 'permisoadm';
  }
  // Verificar si el trabajador está de extra
  private isWorkerExtra(trabajador: trabajador): boolean {
    return trabajador.estado === 'activoextra';
  }
  private isWorkerShifted(trabajador: trabajador): boolean {
    return trabajador.estado === 'turnocamdiadoON';
  }
  /**
   * Obtener la razón de la ausencia del trabajador
   */
  private getAbsenceReason(trabajador: trabajador): string {
    switch (trabajador.estado) {
      case 'vacaciones': return 'Vacaciones';
      case 'licencia': return 'Licencia médica';
      case 'suspendido': return 'Suspendido';
      case 'inactivo': return 'Inactivo';
      case 'permisoadm': return 'Permiso Administrativo';
      case 'turnocambiadoOFF': return 'Cambio de Turno';
      default: return 'Ausente';
    }
  }

  /**
   * Obtener el nombre de visualización del tipo de turno
   */
  getShiftDisplayName(shiftType: ShiftType, isExtra: boolean, isShifted: boolean): string {
    if (isExtra) {
      return 'Turno Extra';
    }
    if (isShifted) {
      return 'Devolución de Turno';
    }
    switch (shiftType) {
      case ShiftType.DAY_IN: return 'Turno de día';
      case ShiftType.NIGHT_IN: return 'Turno de noche'; 
      case ShiftType.DAY_OUT: return 'Libre';
      case ShiftType.NIGHT_OUT: return 'Libre';
      case ShiftType.OFF: return 'Sin turno';
      default: return 'Desconocido';
    }
  }

  
  /**
   * Obtener el color del tipo de turno para la UI
   */
  getShiftColor(shiftType: ShiftType, isExtra: boolean, isShifted: boolean): string {
    if (isExtra) {
      return 'primary';
    }
    if (isShifted) {
      return 'primary';
    }

    switch (shiftType) {
      case ShiftType.DAY_IN: return 'primary';
      case ShiftType.NIGHT_IN: return 'secondary';
      case ShiftType.DAY_OUT: return 'medium';
      case ShiftType.NIGHT_OUT: return 'medium';
      case ShiftType.OFF: return 'light';
      default: return 'medium';
    }
  }
}
