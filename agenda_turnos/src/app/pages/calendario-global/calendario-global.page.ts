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
    console.log('Loading workers...');
    try {
      this.trabajadoresService.getTrabajadores().subscribe({
        next: (trabajadores) => {
          this.allWorkers = trabajadores || [];
          console.log('Workers loaded successfully:', this.allWorkers.length);
        },
        error: (error) => {
          console.error('Error loading workers:', error);
          this.allWorkers = []; // Asegurar que sea un arreglo vacío, no undefined
          this.showAlert('Error', 'No se pudieron cargar los funcionarios: ' + (error?.message || 'Error desconocido'));
        }
      });
    } catch (error) {
      console.error('Error in loadWorkers:', error);
      this.allWorkers = []; // Asegurar que sea un arreglo vacío
      this.showAlert('Error', 'No se pudieron cargar los funcionarios');
    }
  }

  async onDateChange(event: any) {
    if (event.detail.value) {
      console.log('Date change event received:', event.detail.value);
      
      const loading = await this.loadingController.create({
        message: 'Calculando turnos...'
      });
      await loading.present();

      try {
        // Corregir análisis de fecha para evitar problemas de zona horaria
        const fechaString = event.detail.value.toString().split('T')[0];
        // Usar construcción de fecha local para evitar problemas de desplazamiento de zona horaria
        const [year, month, day] = fechaString.split('-').map(Number);
        this.selectedDate = new Date(year, month - 1, day); // mes es base 0
        this.selectedDatetime = event.detail.value;
        
        console.log('Selected date parsed:', this.selectedDate);
        
        // Verificar si tenemos trabajadores cargados
        if (this.allWorkers.length === 0) {
          console.warn('No workers loaded yet');
          loading.dismiss();
          this.showAlert('Advertencia', 'Aún no se han cargado los funcionarios. Intente nuevamente.');
          return;
        }
        
        // Calcular turnos para todos los trabajadores
        const allWorkerShifts = this.shiftCalculatorService.calculateWorkersForDate(this.allWorkers, this.selectedDate);
        console.log('Worker shifts calculated:', allWorkerShifts.length);
        
        // Por ahora, omitir lógica de turnos extra para probar funcionalidad básica
        this.workersOnShift = allWorkerShifts.filter(worker => 
          worker.isScheduled && !worker.isAbsent
        );
        
        this.absentWorkers = allWorkerShifts.filter(worker => 
          worker.isScheduled && worker.isAbsent
        );

        this.freeWorkers = allWorkerShifts.filter(worker => 
          !worker.isScheduled && !worker.isAbsent
        );
        
        // Obtener trabajadores con turnos extra para esta fecha
        await this.loadExtraWorkersForDate();
        
        this.shiftedworkers = allWorkerShifts.filter(worker => 
          !worker.isScheduled && !worker.isAbsent && worker.isShifted
        );

        this.showResults = true;
        loading.dismiss();

        console.log('Results:', {
          workersOnShift: this.workersOnShift.length,
          absentWorkers: this.absentWorkers.length,
          freeWorkers: this.freeWorkers.length,
          extraworkers: this.extraworkers.length,
          shiftedworkers: this.shiftedworkers.length
        });
        
      } catch (error) {
        loading.dismiss();
        console.error('Error calculating shifts:', error);
        this.showAlert('Error', 'Error al calcular los turnos: ' + (error as any)?.message);
      }
    }
  }

  async botonfecha() {
    if (this.selectedDatetime) {
      console.log('Button fecha clicked with:', this.selectedDatetime);
      
      const loading = await this.loadingController.create({
        message: 'Calculando turnos...'
      });
      await loading.present();

      try {
        // Fix date parsing to avoid timezone issues
        const fechaString = this.selectedDatetime.toString().split('T')[0];
        // Use local date construction to avoid timezone offset issues
        const [year, month, day] = fechaString.split('-').map(Number);
        this.selectedDate = new Date(year, month - 1, day); // month is 0-based
        
        console.log('Selected date parsed:', this.selectedDate);
        
        // Check if we have workers loaded
        if (this.allWorkers.length === 0) {
          console.warn('No workers loaded yet');
          loading.dismiss();
          this.showAlert('Advertencia', 'Aún no se han cargado los funcionarios. Intente nuevamente.');
          return;
        }
        
        // Calcular turnos para todos los trabajadores
        const allWorkerShifts = this.shiftCalculatorService.calculateWorkersForDate(this.allWorkers, this.selectedDate);
        console.log('Worker shifts calculated:', allWorkerShifts.length);
        
        // For now, skip extra shift logic to test basic functionality
        this.workersOnShift = allWorkerShifts.filter(worker => 
          worker.isScheduled && !worker.isAbsent
        );
        
        this.absentWorkers = allWorkerShifts.filter(worker => 
          worker.isScheduled && worker.isAbsent
        );

        this.freeWorkers = allWorkerShifts.filter(worker => 
          !worker.isScheduled && !worker.isAbsent
        );
        
        // Obtener trabajadores con turnos extra para esta fecha
        await this.loadExtraWorkersForDate();
        
        this.shiftedworkers = allWorkerShifts.filter(worker => 
          !worker.isScheduled && !worker.isAbsent && worker.isShifted
        );

        this.showResults = true;
        loading.dismiss();

        console.log('Results:', {
          workersOnShift: this.workersOnShift.length,
          absentWorkers: this.absentWorkers.length,
          freeWorkers: this.freeWorkers.length,
          extraworkers: this.extraworkers.length,
          shiftedworkers: this.shiftedworkers.length
        });
        
      } catch (error) {
        loading.dismiss();
        console.error('Error calculating shifts:', error);
        this.showAlert('Error', 'Error al calcular los turnos: ' + (error as any)?.message);
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

  formatTurno(turno: any): string {
    if (!turno || typeof turno !== 'string') return 'Sin especificar';
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
    // Check if worker is eligible for extra shifts using the service
    const eligibilityCheck = this.extraShiftService.canAssignExtraShift(worker);
    
    if (!eligibilityCheck.canAssign) {
      await this.showAlert('Error', eligibilityCheck.reason || 'No se puede asignar turno extra a este trabajador');
      return;
    }

    await this.openExtraShiftModal(worker);
  }

  async openExtraShiftModal(worker: trabajador) {
    // First, let user select shift type
    const typeAlert = await this.alertController.create({
      header: 'Tipo de Turno Extra',
      message: 'Seleccione el tipo de turno extra:',
      inputs: [
        {
          type: 'radio',
          label: 'Turno de Día',
          value: 'dia',
          checked: true
        },
        {
          type: 'radio',
          label: 'Turno de Noche',
          value: 'noche',
          checked: false
        }
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Continuar',
          handler: async (selectedType) => {
            // Now show the rest of the form with the selected type
            await this.showExtraShiftDetailsModal(worker, selectedType);
          }
        }
      ]
    });

    await typeAlert.present();
  }

  async showExtraShiftDetailsModal(worker: trabajador, tipoTurno: string) {
    const alert = await this.alertController.create({
      header: 'Detalles del Turno Extra',
      message: `Turno ${tipoTurno === 'dia' ? 'de Día' : 'de Noche'} para ${worker.Name1} ${worker.Name2} el ${this.selectedDate?.toDateString()}`,
      inputs: [
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
            
            // Add the shift type to the data
            const processData = {
              ...data,
              tipo: tipoTurno
            };
            
            await this.processExtraShiftAssignment(worker, processData);
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
    // Use the service to check eligibility
    const eligibilityCheck = this.extraShiftService.canAssignExtraShift(worker);
    return eligibilityCheck.canAssign;
  }

  /**
   * Check worker availability for the selected date
   */
  async getWorkerStatusForSelectedDate(worker: trabajador): Promise<string> {
    if (!this.selectedDate) {
      return worker.estado;
    }

    try {
      const statusInfo = await this.extraShiftService.getWorkerStatusOnDate(worker, this.selectedDate).toPromise();
      return statusInfo?.effectiveEstado || worker.estado;
    } catch (error) {
      console.error('Error getting worker status for date:', error);
      return worker.estado;
    }
  }

  /**
   * Check if worker can be assigned extra shift on the selected date
   */
  async canAssignExtraShiftOnDate(worker: trabajador): Promise<boolean> {
    if (!this.selectedDate) {
      return this.extraShiftService.canAssignExtraShift(worker).canAssign;
    }

    try {
      const availability = await this.extraShiftService.isWorkerAvailableOnDate(worker, this.selectedDate).toPromise();
      return availability?.isAvailable || false;
    } catch (error) {
      console.error('Error checking worker availability:', error);
      return false;
    }
  }

  /**
   * Show extra shifts for a worker on the selected date
   */
  async showExtraShiftsForWorker(worker: trabajador) {
    if (!this.selectedDate) {
      await this.showAlert('Error', 'Por favor seleccione una fecha primero');
      return;
    }

    try {
      const extraShifts = await this.extraShiftService.getAllExtraShiftsForWorkerOnDate(worker.id!, this.selectedDate).toPromise();
      
      if (!extraShifts || extraShifts.length === 0) {
        await this.showAlert('Sin turnos extra', `${worker.Name1} ${worker.Name2} no tiene turnos extra para ${this.selectedDate.toDateString()}`);
        return;
      }

      // Create buttons for each extra shift
      const buttons: any[] = extraShifts.map(shift => ({
        text: `${shift.tipoTurno === 'day' ? 'Día' : 'Noche'}: ${shift.horasExtras}h - ${shift.detalles || 'Sin detalles'}`,
        handler: () => this.manageExtraShift(shift, worker)
      }));

      buttons.push({
        text: 'Cerrar',
        role: 'cancel'
      });

      const alert = await this.alertController.create({
        header: 'Turnos Extra',
        subHeader: `${worker.Name1} ${worker.Name2} - ${this.selectedDate.toDateString()}`,
        buttons
      });

      await alert.present();

    } catch (error) {
      console.error('Error getting extra shifts:', error);
      await this.showAlert('Error', 'No se pudieron cargar los turnos extra');
    }
  }

  /**
   * Manage a specific extra shift (edit or delete)
   */
  async manageExtraShift(shift: any, worker: trabajador) {
    const alert = await this.alertController.create({
      header: 'Gestionar Turno Extra',
      subHeader: `${shift.tipoTurno === 'day' ? 'Turno de Día' : 'Turno de Noche'} - ${shift.horasExtras} horas`,
      message: `Trabajador: ${worker.Name1} ${worker.Name2}\nFecha: ${new Date(shift.fechaTurnoExtra).toDateString()}\nDetalles: ${shift.detalles || 'Sin detalles'}`,
      buttons: [
        {
          text: 'Eliminar',
          role: 'destructive',
          handler: () => this.deleteExtraShift(shift.id, worker)
        },
        {
          text: 'Cancelar',
          role: 'cancel'
        }
      ]
    });

    await alert.present();
  }

  /**
   * Delete an extra shift
   */
  async deleteExtraShift(shiftId: number, worker: trabajador) {
    const confirmAlert = await this.alertController.create({
      header: 'Confirmar Eliminación',
      message: `¿Está seguro de que desea eliminar este turno extra para ${worker.Name1} ${worker.Name2}?`,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Eliminar',
          role: 'destructive',
          handler: async () => {
            const loading = await this.loadingController.create({
              message: 'Eliminando turno extra...'
            });
            await loading.present();

            try {
              const success = await this.extraShiftService.deleteExtraShift(shiftId);
              
              if (success) {
                await this.showAlert('Éxito', 'Turno extra eliminado correctamente');
                await this.refreshWorkersForSelectedDate();
              } else {
                await this.showAlert('Error', 'No se pudo eliminar el turno extra');
              }
            } catch (error) {
              console.error('Error deleting extra shift:', error);
              await this.showAlert('Error', 'No se pudo eliminar el turno extra');
            } finally {
              await loading.dismiss();
            }
          }
        }
      ]
    });

    await confirmAlert.present();
  }

  /**
   * Cargar trabajadores con turnos extra para la fecha seleccionada
   */
  private async loadExtraWorkersForDate(): Promise<void> {
    if (!this.selectedDate) {
      this.extraworkers = [];
      return;
    }

    try {
      // Obtener turnos extra para la fecha seleccionada
      const extraShifts = await this.extraShiftService.getExtraShiftsForDate(this.selectedDate).toPromise();
      
      if (!extraShifts) {
        this.extraworkers = [];
        return;
      }
      
      // Crear WorkerShiftInfo para cada trabajador con turno extra
      this.extraworkers = extraShifts.map(extraShift => {
        // Buscar el trabajador correspondiente
        const trabajador = this.allWorkers.find(w => w.id === extraShift.trabajadorId);
        
        if (!trabajador) {
          console.warn(`Worker not found for extra shift: ${extraShift.trabajadorId}`);
          return null;
        }

        // Determinar el tipo de turno según el ShiftType esperado
        let shiftStatus: ShiftType;
        if (extraShift.tipoTurno === 'day') {
          shiftStatus = 'morning' as ShiftType;
        } else {
          shiftStatus = 'night' as ShiftType;
        }

        // Crear el objeto WorkerShiftInfo
        const workerShiftInfo: WorkerShiftInfo = {
          trabajador: trabajador,
          shiftStatus: shiftStatus,
          isScheduled: true,
          isAbsent: false,
          isExtra: true,
          isShifted: false,
          absenceReason: undefined
        };

        return workerShiftInfo;
      }).filter((worker): worker is WorkerShiftInfo => worker !== null);

      console.log('Extra workers loaded for date:', this.extraworkers.length);
      
    } catch (error) {
      console.error('Error loading extra workers for date:', error);
      this.extraworkers = [];
    }
  }

  // Debug methods
  testButton() {
    console.log('Test button clicked');
    console.log('Selected datetime:', this.selectedDatetime);
    console.log('All workers:', this.allWorkers.length);
    this.showAlert('Debug', `Selected: ${this.selectedDatetime}, Workers: ${this.allWorkers.length}`);
  }
}
