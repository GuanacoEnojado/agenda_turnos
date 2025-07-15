import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { trabajador } from '../../services/datos';
import { ShiftchangeService, ShiftChangeRequest, MonthlyShiftInfo, EligibleWorker } from '../../services/shiftchange.service';
import { ShiftCalculatorService, ShiftType } from '../../services/shift-calculator.service';
import { TrabajadoresService } from '../../services/trabajadores.service';
import { AlertController, ToastController, MenuController } from '@ionic/angular';

@Component({
  selector: 'app-cambiodeturno',
  templateUrl: './cambiodeturno.page.html',
  styleUrls: ['./cambiodeturno.page.scss'],
  standalone: false,
})
export class CambiodeturnoPage implements OnInit {

  // Estados principales del flujo de trabajo
  selectedOriginalWorker: trabajador | null = null;
  originalWorkerShifts: MonthlyShiftInfo[] = [];
  selectedShiftDate: Date | null = null;
  selectedShiftInfo: MonthlyShiftInfo | null = null;
  
  // Trabajadores elegibles para cambio de turno
  eligibleWorkers: EligibleWorker[] = [];
  selectedTargetWorker: trabajador | null = null;
  targetWorkerShifts: MonthlyShiftInfo[] = [];
  selectedTargetDate: Date | null = null;
  selectedTargetShiftInfo: MonthlyShiftInfo | null = null;

  // Todos los trabajadores para selección inicial
  allWorkers$: Observable<trabajador[]>;
  
  // Solicitud actual de cambio de turno
  currentShiftChangeRequest: ShiftChangeRequest | null = null;

  // Estado de la interfaz de usuario
  currentStep: 'select-worker' | 'select-original-shift' | 'select-target-worker' | 'select-target-shift' | 'confirm-change' = 'select-worker';

  constructor(
    private router: Router,
    private menuCtrl: MenuController,
    private shiftChangeService: ShiftchangeService,
    private shiftCalculator: ShiftCalculatorService,
    private trabajadoresService: TrabajadoresService,
    private alertController: AlertController,
    private toastController: ToastController
  ) {
    this.allWorkers$ = this.trabajadoresService.getTrabajadores();
  }

  ngOnInit() {
    // Suscribirse a las actualizaciones de solicitud de cambio de turno actual
    this.shiftChangeService.getCurrentShiftChangeRequest().subscribe(request => {
      this.currentShiftChangeRequest = request;
    });
  }

  /**
   * Paso 1: Seleccionar el trabajador original que quiere cambiar turno
   */
  selectOriginalWorker(worker: trabajador) {
    this.selectedOriginalWorker = worker;
    this.originalWorkerShifts = this.shiftChangeService.getWorkerMonthlyShifts(worker);
    this.currentStep = 'select-original-shift';
    this.resetSubsequentSteps();
  }

  /**
   * Paso 2: Seleccionar la fecha del turno del cronograma del trabajador original
   */
  selectOriginalShift(shiftInfo: MonthlyShiftInfo) {
    if (!shiftInfo.isSelectable) {
      this.showToast('Este turno no se puede cambiar: ' + (shiftInfo.conflictReason || 'No disponible'), 'warning');
      return;
    }

    this.selectedShiftDate = shiftInfo.date;
    this.selectedShiftInfo = shiftInfo;
    this.loadEligibleWorkers();
    this.currentStep = 'select-target-worker';
  }

  /**
   * Paso 3: Cargar y mostrar trabajadores elegibles para cambio de turno
   */
  private loadEligibleWorkers() {
    if (!this.selectedOriginalWorker) return;

    this.shiftChangeService.getEligibleWorkersForShiftChange(this.selectedOriginalWorker)
      .subscribe(workers => {
        this.eligibleWorkers = workers;
      });
  }

  /**
   * Paso 3: Seleccionar trabajador objetivo para el cambio de turno
   */
  selectTargetWorker(eligibleWorker: EligibleWorker) {
    this.selectedTargetWorker = eligibleWorker.trabajador;
    this.targetWorkerShifts = eligibleWorker.monthlyShifts;
    this.currentStep = 'select-target-shift';
  }

  /**
   * Paso 4: Seleccionar fecha del turno del trabajador objetivo
   */
  selectTargetShift(shiftInfo: MonthlyShiftInfo) {
    if (!shiftInfo.isSelectable) {
      this.showToast('Esta fecha no está disponible: ' + (shiftInfo.conflictReason || 'No disponible'), 'warning');
      return;
    }

    this.selectedTargetDate = shiftInfo.date;
    this.selectedTargetShiftInfo = shiftInfo;
    this.validateShiftChange();
  }

  /**
   * Paso 5: Validar el cambio de turno y mostrar confirmación
   */
  private validateShiftChange() {
    if (!this.selectedOriginalWorker || !this.selectedTargetWorker || !this.selectedShiftDate) {
      return;
    }

    const request = this.shiftChangeService.validateShiftChange(
      this.selectedOriginalWorker,
      this.selectedTargetWorker, 
      this.selectedShiftDate
    );

    this.shiftChangeService.setCurrentShiftChangeRequest(request);
    this.currentStep = 'confirm-change';
  }

  /**
   * Ejecutar el cambio de turno confirmado
   */
  async confirmShiftChange() {
    if (!this.currentShiftChangeRequest || !this.currentShiftChangeRequest.isValidChange) {
      await this.showAlert('Error', 'El cambio de turno no es válido: ' + (this.currentShiftChangeRequest?.conflictReason || 'Error desconocido'));
      return;
    }

    try {
      const success = await this.shiftChangeService.executeShiftChange(this.currentShiftChangeRequest).toPromise();
      
      if (success) {
        await this.showToast('Cambio de turno ejecutado exitosamente', 'success');
        this.resetWorkflow();
      } else {
        await this.showAlert('Error', 'No se pudo ejecutar el cambio de turno. Inténtalo de nuevo.');
      }
    } catch (error: any) {
      await this.showAlert('Error', error.message || 'Error al ejecutar el cambio de turno');
    }
  }

  /**
   * Cancel current shift change and reset workflow
   */
  cancelShiftChange() {
    this.shiftChangeService.setCurrentShiftChangeRequest(null);
    this.resetWorkflow();
  }

  /**
   * Go back to previous step
   */
  goBack() {
    switch (this.currentStep) {
      case 'select-original-shift':
        this.currentStep = 'select-worker';
        this.selectedOriginalWorker = null;
        break;
      case 'select-target-worker':
        this.currentStep = 'select-original-shift';
        this.resetSubsequentSteps();
        break;
      case 'select-target-shift':
        this.currentStep = 'select-target-worker';
        this.selectedTargetWorker = null;
        this.targetWorkerShifts = [];
        break;
      case 'confirm-change':
        this.currentStep = 'select-target-shift';
        this.currentShiftChangeRequest = null;
        break;
    }
  }

  /**
   * Reset workflow to initial state
   */
  private resetWorkflow() {
    this.selectedOriginalWorker = null;
    this.originalWorkerShifts = [];
    this.selectedShiftDate = null;
    this.selectedShiftInfo = null;
    this.eligibleWorkers = [];
    this.selectedTargetWorker = null;
    this.targetWorkerShifts = [];
    this.selectedTargetDate = null;
    this.selectedTargetShiftInfo = null;
    this.currentShiftChangeRequest = null;
    this.currentStep = 'select-worker';
  }

  /**
   * Reset steps after changing original worker or shift
   */
  private resetSubsequentSteps() {
    this.selectedShiftDate = null;
    this.selectedShiftInfo = null;
    this.eligibleWorkers = [];
    this.selectedTargetWorker = null;
    this.targetWorkerShifts = [];
    this.selectedTargetDate = null;
    this.selectedTargetShiftInfo = null;
    this.currentShiftChangeRequest = null;
  }

  /**
   * Get display information for shift type
   */
  getShiftDisplayInfo(shiftType: ShiftType) {
    return this.shiftChangeService.getShiftDisplayInfo(shiftType);
  }

  /**
   * Get display name for shift
   */
  getShiftDisplayName(shiftInfo: MonthlyShiftInfo): string {
    return this.shiftCalculator.getShiftDisplayName(
      shiftInfo.shiftInfo.shiftStatus,
      shiftInfo.shiftInfo.isExtra,
      shiftInfo.shiftInfo.isShifted
    );
  }

  /**
   * Get color for shift display
   */
  getShiftColor(shiftInfo: MonthlyShiftInfo): string {
    return this.shiftCalculator.getShiftColor(
      shiftInfo.shiftInfo.shiftStatus,
      shiftInfo.shiftInfo.isExtra,
      shiftInfo.shiftInfo.isShifted
    );
  }

  /**
   * Format date for display
   */
  formatDate(date: Date): string {
    return date.toLocaleDateString('es-ES', { 
      weekday: 'short', 
      day: 'numeric', 
      month: 'short' 
    });
  }

  /**
   * Show toast message
   */
  private async showToast(message: string, color: 'success' | 'warning' | 'danger' = 'success') {
    const toast = await this.toastController.create({
      message,
      duration: 3000,
      color,
      position: 'top'
    });
    await toast.present();
  }

  /**
   * Show alert dialog
   */
  private async showAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK']
    });
    await alert.present();
  }

  // Navigation methods for menu integration
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

  async calendarioTurnos(){
    await this.menuCtrl.close();
    this.router.navigate(['/calendario-turnos']);
  }

  async busquedadia(){
    await this.menuCtrl.close();
    this.router.navigate(['/busquedadia']);
  }

  async registroUsuario(){
    await this.menuCtrl.close();
    this.router.navigate(['/registro']);
  }

  async cambiodeturno(){
    await this.menuCtrl.close();
    this.router.navigate(['/cambiodeturno']);
  }
}
