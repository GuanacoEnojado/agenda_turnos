import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { IonDatetime, MenuController, LoadingController, AlertController } from '@ionic/angular';
import { TrabajadoresService } from '../../services/trabajadores.service';
import { ShiftCalculatorService, WorkerShiftInfo, ShiftType } from '../../services/shift-calculator.service';
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
  allWorkers: trabajador[] = [];
  showResults: boolean = false;

  constructor(
    private router: Router, 
    private menuCtrl: MenuController,
    private trabajadoresService: TrabajadoresService,
    private shiftCalculatorService: ShiftCalculatorService,
    private loadingController: LoadingController,
    private alertController: AlertController
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

        this.showResults = true;
        loading.dismiss();

        console.log('Workers on shift:', this.workersOnShift.length);
        console.log('Absent workers:', this.absentWorkers.length);
        console.log('Free workers:', this.freeWorkers.length);
        
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

        this.showResults = true;
        loading.dismiss();

        console.log('Workers on shift:', this.workersOnShift.length);
        console.log('Absent workers:', this.absentWorkers.length);
        
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
    return this.shiftCalculatorService.getShiftDisplayName(shiftType);
  }

  getShiftColor(shiftType: ShiftType): string {
    return this.shiftCalculatorService.getShiftColor(shiftType);
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
}
