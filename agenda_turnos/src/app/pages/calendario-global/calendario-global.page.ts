import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { IonDatetime, MenuController, LoadingController, AlertController, ModalController } from '@ionic/angular';
import { TrabajadoresService } from '../../services/trabajadores.service';
import { ShiftCalculatorService, WorkerShiftInfo, ShiftType } from '../../services/shift-calculator.service';
import { ExtraShiftService } from '../../services/extra-shift.service';
import { trabajador } from '../../services/datos';

@Component({
  selector: 'app-calendario-global',
  templateUrl: './calendario-global.page.html',
  styleUrls: ['./calendario-global.page.scss'],
  standalone: false,
})
export class CalendarioGlobalPage implements OnInit {

  @ViewChild('datetime', {static : false}) datetime!: IonDatetime;
  
  selectedDate: Date | null = null;
  selectedDatetime: string | null = null;
  workersOnShift: WorkerShiftInfo[] = [];
  absentWorkers: WorkerShiftInfo[] = [];
  freeWorkers: WorkerShiftInfo[] = [];
  extraworkers: WorkerShiftInfo[] = [];
  shiftedworkers: WorkerShiftInfo[] = [];
  allWorkers: trabajador[] = [];
  showResults: boolean = false;

  constructor(
    private router: Router, 
    private menuCtrl: MenuController,
    private trabajadoresService: TrabajadoresService,
    private shiftCalculatorService: ShiftCalculatorService,
    private loadingController: LoadingController,
    private alertController: AlertController,
    private modalController: ModalController,
    private extraShiftService: ExtraShiftService
  ) { }
  
  async ngOnInit() {
    await this.loadWorkers();
  }

  async loadWorkers() {
    try {
      this.trabajadoresService.getTrabajadores().subscribe({
        next: (trabajadores) => {
          this.allWorkers = trabajadores;
          console.log('Workers loaded:', this.allWorkers.length);
        },
        error: (error) => {
          console.error('Error loading workers:', error);
          this.showAlert('Error', 'No se pudieron cargar los funcionarios');
        }
      });
    } catch (error) {
      console.error('Error loading workers:', error);
      this.showAlert('Error', 'No se pudieron cargar los funcionarios');
    }
  }

  async onDateChange(event: any) {
    if (event.detail.value) {
      const loading = await this.loadingController.create({
        message: 'Calculando turnos...'
      });
      await loading.present();

      try {
        // Analizar la fecha seleccionada
        const fechaString = event.detail.value.toString().split('T')[0];
        this.selectedDate = new Date(fechaString + 'T00:00:00');
        this.selectedDatetime = event.detail.value;
        
        console.log('Selected date:', this.selectedDate);
        
        // Calcular turnos para todos los trabajadores
        const allWorkerShifts = this.shiftCalculatorService.calculateWorkersForDate(this.allWorkers, this.selectedDate);
        
        // Separar trabajadores por estado
        this.workersOnShift = allWorkerShifts.filter(worker => 
          worker.isScheduled && !worker.isAbsent
        );
        
        this.absentWorkers = allWorkerShifts.filter(worker => 
          worker.isScheduled && worker.isAbsent
        );

        this.freeWorkers = allWorkerShifts.filter(worker => 
          !worker.isScheduled && !worker.isAbsent
        );
        
        this.extraworkers = allWorkerShifts.filter(worker => 
          !worker.isScheduled && !worker.isAbsent && worker.isExtra
        );

        this.shiftedworkers = allWorkerShifts.filter(worker => 
          !worker.isScheduled && !worker.isAbsent && worker.isShifted
        );

        this.showResults = true;
        loading.dismiss();

        console.log('Workers on shift:', this.workersOnShift.length);
        console.log('Absent workers:', this.absentWorkers.length);
        console.log('Free workers:', this.freeWorkers.length);
        console.log('Extra workers:', this.extraworkers.length);
        console.log('Shifted workers:', this.shiftedworkers.length);
        
      } catch (error) {
        loading.dismiss();
        console.error('Error calculating shifts:', error);
        this.showAlert('Error', 'Error al calcular los turnos');
      }
    }
  }

  async botonfecha() {
    if (this.selectedDatetime) {
      const loading = await this.loadingController.create({
        message: 'Calculando turnos...'
      });
      await loading.present();

      try {
        // Analizar la fecha seleccionada
        const fechaString = this.selectedDatetime.toString().split('T')[0];
        this.selectedDate = new Date(fechaString + 'T00:00:00');
        
        console.log('Selected date:', this.selectedDate);
        
        // Calcular turnos para todos los trabajadores
        const allWorkerShifts = this.shiftCalculatorService.calculateWorkersForDate(this.allWorkers, this.selectedDate);
        
        // Separar trabajadores por estado
        this.workersOnShift = allWorkerShifts.filter(worker => 
          worker.isScheduled && !worker.isAbsent
        );
        
        this.absentWorkers = allWorkerShifts.filter(worker => 
          worker.isScheduled && worker.isAbsent
        );

        this.freeWorkers = allWorkerShifts.filter(worker => 
          !worker.isScheduled && !worker.isAbsent
        );

        this.extraworkers = allWorkerShifts.filter(worker => 
          !worker.isScheduled && !worker.isAbsent && worker.isExtra
        );

        this.shiftedworkers = allWorkerShifts.filter(worker => 
          !worker.isScheduled && !worker.isAbsent && worker.isShifted
        );

        this.showResults = true;
        loading.dismiss();

        console.log('Workers on shift:', this.workersOnShift.length);
        console.log('Absent workers:', this.absentWorkers.length);
        console.log('Extra workers:', this.extraworkers.length);
        console.log('shifted workers:', this.shiftedworkers.length);
        
      } catch (error) {
        loading.dismiss();
        console.error('Error calculating shifts:', error);
        this.showAlert('Error', 'Error al calcular los turnos');
      }
    } else {
      this.showAlert('Fecha requerida', 'Por favor seleccione una fecha');
    }
  }

  getShiftDisplayName(shiftType: ShiftType): string {
    return this.shiftCalculatorService.getShiftDisplayName(shiftType, false, false);
  }

  getShiftColor(shiftType: ShiftType): string {
    return this.shiftCalculatorService.getShiftColor(shiftType, false, false);
  }

  formatTurno(turno: string): string {
    return turno.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  }

  async showAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK']
    });
    await alert.present();
  }
  
  // Métodos de navegación del menú
  async calendarioglobal(){
    await this.menuCtrl.close();
    this.router.navigate(['/calendario-global']);
  }
  
  async main(){
    await this.menuCtrl.close();
    this.router.navigate(['/main']);
  }
  
  async preferencias(){
    await this.menuCtrl.close();
    this.router.navigate(['/preferencias']);
  }
  
  async eliminarfuncionario(){
    await this.menuCtrl.close();
    this.router.navigate(['/eliminacion']);
  }
  
  async registrofuncionario(){
    await this.menuCtrl.close();
    this.router.navigate(['/registrofuncionario']);
  }
  
  async listafuncionario(){
    await this.menuCtrl.close();
    this.router.navigate(['/lista-funcionarios']);
  }

  // Extra shift assignment methods
  async assignExtraShift(worker: trabajador) {
    if (!this.selectedDate) {
      await this.showAlert('Error', 'Debe seleccionar una fecha primero.');
      return;
    }

    if (worker.estado === 'activo') {
      await this.showAlert('Error', 'No se puede asignar turno extra a un trabajador que ya está activo.');
      return;
    }

    await this.openExtraShiftModal(worker);
  }

  async openExtraShiftModal(worker: trabajador) {
    const alert = await this.alertController.create({
      header: 'Asignar Turno Extra',
      message: `¿Asignar turno extra a ${worker.Name1} ${worker.Name2} para el ${this.selectedDate?.toDateString()}?`,
      inputs: [
        {
          name: 'tipo',
          type: 'radio',
          label: 'Día',
          value: 'dia',
          checked: true
        },
        {
          name: 'tipo',
          type: 'radio',
          label: 'Noche',
          value: 'noche'
        },
        {
          name: 'horas',
          type: 'number',
          placeholder: 'Número de horas (ej: 8)',
          min: 1,
          max: 24,
          value: 8
        },
        {
          name: 'detalles',
          type: 'textarea',
          placeholder: 'Detalles adicionales (opcional)'
        }
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Asignar',
          handler: async (data) => {
            if (!data.horas || data.horas < 1) {
              await this.showAlert('Error', 'Debe especificar el número de horas.');
              return false;
            }
            await this.processExtraShiftAssignment(worker, data);
            return true;
          }
        }
      ]
    });

    await alert.present();
  }

  async processExtraShiftAssignment(worker: trabajador, data: any) {
    const loading = await this.loadingController.create({
      message: 'Asignando turno extra...'
    });
    await loading.present();

    try {
      // Map 'dia'/'noche' to 'day'/'night'
      const tipoTurno = data.tipo === 'dia' ? 'day' : 'night';
      
      // Assign extra shift through service
      const success = await this.extraShiftService.assignExtraShift(
        worker,
        this.selectedDate!,
        parseInt(data.horas),
        tipoTurno,
        data.detalles || ''
      );

      if (success) {
        await this.showAlert('Éxito', 
          `Turno extra asignado correctamente a ${worker.Name1} ${worker.Name2}`);
        
        // Refresh the workers list to show updated state
        await this.refreshWorkersForSelectedDate();
      } else {
        await this.showAlert('Error', 'No se pudo asignar el turno extra.');
      }

    } catch (error) {
      console.error('Error assigning extra shift:', error);
      await this.showAlert('Error', 'No se pudo asignar el turno extra. Intente nuevamente.');
    } finally {
      await loading.dismiss();
    }
  }

  async refreshWorkersForSelectedDate() {
    if (this.selectedDate) {
      // Reload workers and recalculate for the selected date
      await this.loadWorkers();
      // Simulate date change to refresh the display
      const event = { detail: { value: this.selectedDatetime } };
      await this.onDateChange(event);
    }
  }

  canAssignExtraShift(worker: trabajador): boolean {
    return worker.estado !== 'activo';
  }
}
