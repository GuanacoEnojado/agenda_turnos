import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, ModalController } from '@ionic/angular';
import { trabajador, ExtraShift } from '../../services/datos';
import { ShiftCalculatorService } from '../../services/shift-calculator.service';
import { ExtraShiftService } from '../../services/extra-shift.service';

interface DayShift {
  date: Date;
  dayOfWeek: string;
  dayNumber: number;
  isToday: boolean;
  isCurrentMonth: boolean;
  shifts: {
    morning?: ShiftInfo;
    evening?: ShiftInfo;
    night?: ShiftInfo;
    extra?: ExtraShiftInfo[];
  };
  status: 'working' | 'free' | 'vacation' | 'sick' | 'absent' | 'swapped';
}

interface ShiftInfo {
  type: 'regular' | 'swapped';
  startTime: string;
  endTime: string;
  details?: string;
  swappedWith?: string;
}

interface ExtraShiftInfo {
  hours: number;
  type: 'day' | 'night';
  details: string;
  assignedBy?: string;
}

@Component({
  selector: 'app-shift-visualization-modal',
  templateUrl: './shift-visualization-modal.component.html',
  styleUrls: ['./shift-visualization-modal.component.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule]
})
export class ShiftVisualizationModalComponent implements OnInit {

  @Input() worker!: trabajador;

  currentMonth: DayShift[] = [];
  nextMonth: DayShift[] = [];
  selectedDay: DayShift | null = null;
  showDayDetails = false;
  workerExtraShifts: ExtraShift[] = [];

  monthNames = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  constructor(
    private modalController: ModalController,
    private shiftCalculatorService: ShiftCalculatorService,
    private extraShiftService: ExtraShiftService
  ) {}

  ngOnInit() {
    this.loadExtraShiftsAndGenerateCalendar();
  }

  private async loadExtraShiftsAndGenerateCalendar() {
    try {
      // Load extra shifts first
      await this.loadExtraShifts();
      // Then generate calendar data
      this.generateCalendarData();
    } catch (error) {
      console.error('Error loading extra shifts:', error);
      // Generate calendar anyway, just without extra shifts
      this.generateCalendarData();
    }
  }

  private async loadExtraShifts() {
    if (!this.worker.id) return;
    
    return new Promise<void>((resolve, reject) => {
      this.extraShiftService.getExtraShiftsForWorker(this.worker.id!).subscribe({
        next: (extraShifts) => {
          this.workerExtraShifts = extraShifts;
          resolve();
        },
        error: (error) => {
          console.error('Error loading extra shifts:', error);
          this.workerExtraShifts = [];
          resolve(); // Don't reject, just continue without extra shifts
        }
      });
    });
  }

  generateCalendarData() {
    const today = new Date();
    const currentMonthStart = new Date(today.getFullYear(), today.getMonth(), 1);
    const nextMonthStart = new Date(today.getFullYear(), today.getMonth() + 1, 1);
    
    this.currentMonth = this.generateMonthData(currentMonthStart, true);
    this.nextMonth = this.generateMonthData(nextMonthStart, false);
  }

  generateMonthData(monthStart: Date, isCurrentMonth: boolean): DayShift[] {
    const days: DayShift[] = [];
    const year = monthStart.getFullYear();
    const month = monthStart.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const today = new Date();
    
    // Get the first day of the month and its day of week
    const firstDay = new Date(year, month, 1);
    const firstDayOfWeek = firstDay.getDay(); // 0 = Sunday, 1 = Monday, etc.
    
    // Add padding days from previous month if needed
    if (firstDayOfWeek > 0) {
      const prevMonth = month === 0 ? 11 : month - 1;
      const prevYear = month === 0 ? year - 1 : year;
      const daysInPrevMonth = new Date(prevYear, prevMonth + 1, 0).getDate();
      
      for (let i = firstDayOfWeek - 1; i >= 0; i--) {
        const prevDate = new Date(prevYear, prevMonth, daysInPrevMonth - i);
        const dayShift: DayShift = {
          date: prevDate,
          dayOfWeek: this.getDayOfWeek(prevDate.getDay()),
          dayNumber: daysInPrevMonth - i,
          isToday: this.isSameDate(prevDate, today),
          isCurrentMonth: false,
          shifts: this.calculateShiftsForDay(prevDate),
          status: this.getWorkerStatusForDay(prevDate)
        };
        days.push(dayShift);
      }
    }

    // Add all days of the current month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const dayShift: DayShift = {
        date,
        dayOfWeek: this.getDayOfWeek(date.getDay()),
        dayNumber: day,
        isToday: this.isSameDate(date, today),
        isCurrentMonth,
        shifts: this.calculateShiftsForDay(date),
        status: this.getWorkerStatusForDay(date)
      };
      days.push(dayShift);
    }

    // Add padding days from next month to complete the grid (42 days = 6 weeks)
    const totalDays = days.length;
    const remainingDays = 42 - totalDays;
    const nextMonth = month === 11 ? 0 : month + 1;
    const nextYear = month === 11 ? year + 1 : year;
    
    for (let day = 1; day <= remainingDays; day++) {
      const nextDate = new Date(nextYear, nextMonth, day);
      const dayShift: DayShift = {
        date: nextDate,
        dayOfWeek: this.getDayOfWeek(nextDate.getDay()),
        dayNumber: day,
        isToday: this.isSameDate(nextDate, today),
        isCurrentMonth: false,
        shifts: this.calculateShiftsForDay(nextDate),
        status: this.getWorkerStatusForDay(nextDate)
      };
      days.push(dayShift);
    }

    return days;
  }

  calculateShiftsForDay(date: Date): DayShift['shifts'] {
    // Calculate regular shifts based on worker's schedule
    const workerShiftInfo = this.shiftCalculatorService.calculateWorkersForDate([this.worker], date)[0];
    const shifts: DayShift['shifts'] = {};

    if (workerShiftInfo?.isScheduled) {
      // Determine shift type and time based on worker's turno
      const shiftInfo = this.getShiftInfoFromTurno(this.worker.turno);
      if (shiftInfo.isNight) {
        shifts.night = {
          type: 'regular',
          startTime: shiftInfo.startTime,
          endTime: shiftInfo.endTime
        };
      } else {
        shifts.morning = {
          type: 'regular',
          startTime: shiftInfo.startTime,
          endTime: shiftInfo.endTime
        };
      }
    }

    // Add extra shifts from pre-loaded data
    const dayExtraShifts = this.workerExtraShifts.filter(shift => 
      this.isSameDate(shift.fechaTurnoExtra, date)
    );
    
    if (dayExtraShifts.length > 0) {
      shifts.extra = dayExtraShifts.map(shift => ({
        hours: shift.horasExtras,
        type: shift.tipoTurno === 'day' ? 'day' : 'night',
        details: shift.detalles,
        assignedBy: `Usuario ${shift.createdBy || 'Desconocido'}`
      }));
    }

    return shifts;
  }

  getWorkerStatusForDay(date: Date): DayShift['status'] {
    // Determine worker status based on their estado and date
    switch (this.worker.estado) {
      case 'vacaciones':
        return 'vacation';
      case 'licencia':
        return 'sick';
      case 'inactivo':
      case 'suspendido':
        return 'absent';
      case 'activoextra':
        return 'working';
      case 'activo':
        const workerShiftInfo = this.shiftCalculatorService.calculateWorkersForDate([this.worker], date)[0];
        return workerShiftInfo?.isScheduled ? 'working' : 'free';
      default:
        return 'free';
    }
  }

  getShiftInfoFromTurno(turno: string) {
    const shiftMappings: {[key: string]: {startTime: string, endTime: string, isNight: boolean}} = {
      '4to_turno_modificado': { startTime: '14:00', endTime: '22:00', isNight: false },
      '3er_turno': { startTime: '22:00', endTime: '06:00', isNight: true },
      '4to_turno': { startTime: '16:00', endTime: '00:00', isNight: true },
      'diurno_hospital': { startTime: '08:00', endTime: '16:00', isNight: false },
      'diurno_empresa': { startTime: '09:00', endTime: '17:00', isNight: false },
      'volante': { startTime: '00:00', endTime: '00:00', isNight: false }
    };

    return shiftMappings[turno] || { startTime: '08:00', endTime: '16:00', isNight: false };
  }

  onDayClick(day: DayShift) {
    this.selectedDay = day;
    this.showDayDetails = true;
  }

  closeDayDetails() {
    this.showDayDetails = false;
    this.selectedDay = null;
  }

  getDayOfWeek(dayIndex: number): string {
    const days = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
    return days[dayIndex];
  }

  isSameDate(date1: Date, date2: Date): boolean {
    if (!date1 || !date2) return false;
    
    // Convert to Date objects if they are strings
    const d1 = new Date(date1);
    const d2 = new Date(date2);
    
    return d1.getDate() === d2.getDate() &&
           d1.getMonth() === d2.getMonth() &&
           d1.getFullYear() === d2.getFullYear();
  }

  getDayClass(day: DayShift): string {
    const classes = ['calendar-day'];
    
    if (day.isToday) classes.push('today');
    if (!day.isCurrentMonth) classes.push('other-month');
    
    switch (day.status) {
      case 'working':
        classes.push('working');
        break;
      case 'vacation':
        classes.push('vacation');
        break;
      case 'sick':
        classes.push('sick');
        break;
      case 'absent':
        classes.push('absent');
        break;
      case 'swapped':
        classes.push('swapped');
        break;
      default:
        classes.push('free');
    }

    if (day.shifts.extra && day.shifts.extra.length > 0) {
      classes.push('has-extra');
    }

    return classes.join(' ');
  }

  getCurrentMonthName(): string {
    const today = new Date();
    return this.monthNames[today.getMonth()];
  }

  getNextMonthName(): string {
    const today = new Date();
    const nextMonth = today.getMonth() + 1;
    return this.monthNames[nextMonth % 12];
  }

  dismiss() {
    this.modalController.dismiss();
  }

  getStatusColor(estado: string): string {
    switch (estado) {
      case 'activo': return 'success';
      case 'inactivo': return 'danger';
      case 'licencia': return 'warning';
      case 'vacaciones': return 'primary';
      case 'suspendido': return 'dark';
      case 'activoextra': return 'tertiary';
      default: return 'medium';
    }
  }

  getShiftTypeText(type: string): string {
    return type === 'day' ? 'Diurno' : 'Nocturno';
  }

  getShiftIcon(type: string): string {
    return type === 'day' ? 'add-circle-outline' : 'moon';
  }

  getStatusChipColor(status: string): string {
    switch (status) {
      case 'working': return 'success';
      case 'vacation': return 'primary';
      case 'sick': return 'warning';
      case 'absent': return 'danger';
      default: return 'medium';
    }
  }

  getStatusIcon(status: string): string {
    switch (status) {
      case 'working': return 'briefcase';
      case 'vacation': return 'sunny';
      case 'sick': return 'medical';
      case 'absent': return 'person-remove';
      default: return 'moon';
    }
  }

  getStatusText(status: string): string {
    switch (status) {
      case 'working': return 'Trabajando';
      case 'vacation': return 'Vacaciones';
      case 'sick': return 'Licencia Médica';
      case 'absent': return 'Ausente';
      default: return 'Libre';
    }
  }

  getTurnoDisplayText(turno: string): string {
    return turno.replace(/_/g, ' ').split(' ').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    ).join(' ');
  }

  getNivelDisplayText(nivel: string): string {
    return nivel.charAt(0).toUpperCase() + nivel.slice(1).toLowerCase();
  }

  getEstadoDisplayText(estado: string): string {
    return estado.charAt(0).toUpperCase() + estado.slice(1).toLowerCase();
  }

  hasNoShifts(day: DayShift | null): boolean {
    if (!day) return true;
    return !day.shifts.morning && 
           !day.shifts.evening && 
           !day.shifts.night && 
           (!day.shifts.extra || day.shifts.extra.length === 0);
  }
}
