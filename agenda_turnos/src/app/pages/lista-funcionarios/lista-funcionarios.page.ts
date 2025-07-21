import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuController, AlertController, LoadingController, ModalController } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TrabajadoresService } from '../../services/trabajadores.service';
import { ExtraShiftService } from '../../services/extra-shift.service';
import { ShiftVisualizationModalComponent } from '../../components/shift-visualization-modal/shift-visualization-modal.component';
import { trabajador, turno, contrato, estado, nivel } from '../../services/datos';

@Component({
  selector: 'app-lista-funcionarios',
  templateUrl: './lista-funcionarios.page.html',
  styleUrls: ['./lista-funcionarios.page.scss'],
  standalone: false,
})
export class ListaFuncionariosPage implements OnInit {

  trabajadores: trabajador[] = [];
  filteredTrabajadores: trabajador[] = [];
  searchTerm: string = '';
  selectedTrabajador: trabajador | null = null;
  isEditModalOpen: boolean = false;
  editForm: FormGroup;

  // Opciones para formularios
  turnoOptions: turno[] = ['4to_turno_modificado', '3er_turno', '4to_turno', 'diurno_hospital', 'diurno_empresa', 'volante'];
  contratoOptions: contrato[] = ['contrato_indefinido', 'contrato_fijo', 'planta', 'contrata', 'volante'];
  estadoOptions: estado[] = ['activo', 'inactivo', 'licencia', 'vacaciones', 'suspendido'];
  nivelOptions: nivel[] = ['tecnico', 'manipulador', 'auxiliar', 'profesional'];

  constructor(
    private router: Router, 
    private menuCtrl: MenuController,
    private trabajadoresService: TrabajadoresService,
    private alertController: AlertController,
    private loadingController: LoadingController,
    private modalController: ModalController,
    private formBuilder: FormBuilder,
    private extraShiftService: ExtraShiftService
  ) { 
    this.editForm = this.formBuilder.group({
      Name1: ['', [Validators.required, Validators.minLength(2)]], 
      Name2: ['', [Validators.required, Validators.minLength(2)]], 
      fecha_nacimiento: ['', [Validators.required]],
      fecha_ingreso: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      turno: ['', [Validators.required]],
      fechainicioturno: ['', [Validators.required]],
      contrato: ['', [Validators.required]],
      estado: ['', [Validators.required]],
      nivel: ['', [Validators.required]],
      avatarUrl: [''] // opcional, sin validación
    });
  }
  
  async ngOnInit() {
    await this.loadTrabajadores();
  }

  async loadTrabajadores() {
    const loading = await this.loadingController.create({
      message: 'Cargando funcionarios...'
    });
    await loading.present();

    try {
      this.trabajadoresService.getTrabajadores().subscribe({
        next: (trabajadores) => {
          this.trabajadores = trabajadores;
          this.sortTrabajadores();
          this.filterTrabajadores();
          loading.dismiss();
        },
        error: (error) => {
          console.error('Error cargando trabajadores:', error);
          loading.dismiss();
          this.showAlert('Error', 'No se pudieron cargar los funcionarios');
        }
      });
    } catch (error) {
      loading.dismiss();
      console.error('Error cargando trabajadores:', error);
      this.showAlert('Error', 'No se pudieron cargar los funcionarios');
    }
  }

  sortTrabajadores() {
    // Método para ordenar trabajadores por estado y luego por nombre
    this.trabajadores.sort((a, b) => {
      const statusOrder = { 'activo': 1, 'inactivo': 2, 'licencia': 3, 'vacaciones': 4, 'suspendido': 5 };
      const aOrder = statusOrder[a.estado as keyof typeof statusOrder] || 6;
      const bOrder = statusOrder[b.estado as keyof typeof statusOrder] || 6;
      
      if (aOrder !== bOrder) {
        return aOrder - bOrder;
      }
      
      // Retorna orden por nombre si son del mismo estado
      return a.Name1.localeCompare(b.Name1);
    });
  }

  filterTrabajadores() {
    if (this.searchTerm.trim() === '') {
      this.filteredTrabajadores = [...this.trabajadores];
    } else {
      const term = this.searchTerm.toLowerCase();
      this.filteredTrabajadores = this.trabajadores.filter(trabajador =>
        (trabajador.Name1 && trabajador.Name1.toLowerCase().includes(term)) ||
        (trabajador.Name2 && trabajador.Name2.toLowerCase().includes(term)) ||
        (trabajador.email && trabajador.email.toLowerCase().includes(term)) ||
        (trabajador.turno && trabajador.turno.toLowerCase().includes(term)) ||
        (trabajador.nivel && trabajador.nivel.toLowerCase().includes(term))
      );
    }
  }

  onSearchChange() {
    this.filterTrabajadores();
  }

  getStatusClass(estado: any): string {
    if (!estado || typeof estado !== 'string') return 'status-default';
    switch (estado) {
      case 'activo': return 'status-active';
      case 'inactivo': return 'status-inactive';
      case 'licencia': return 'status-medical';
      case 'vacaciones': return 'status-vacation';
      case 'suspendido': return 'status-suspended';
      default: return 'status-default';
    }
  }

  getStatusIcon(estado: any): string {
    if (!estado || typeof estado !== 'string') return 'help-circle';
    switch (estado) {
      case 'activo': return 'checkmark-circle';
      case 'inactivo': return 'close-circle';
      case 'licencia': return 'medical';
      case 'vacaciones': return 'airplane';
      case 'suspendido': return 'pause-circle';
      default: return 'help-circle';
    }
  }
//en revisión, resulta algo molesto con los colores por defecto, probablemente agregue colores para este propósito
  getStatusColor(estado: any): string {
    if (!estado || typeof estado !== 'string') return 'medium';
    switch (estado) {
      case 'activo': return 'success';
      case 'inactivo': return 'medium';
      case 'licencia': return 'warning';
      case 'vacaciones': return 'primary';
      case 'suspendido': return 'danger';
      default: return 'medium';
    }
  }

  formatTurno(turno: any): string {
    if (!turno || typeof turno !== 'string') return 'Sin especificar';
    return turno.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  }

  formatNivel(nivel: any): string {
    if (!nivel || typeof nivel !== 'string') return 'Sin especificar';
    return nivel.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  }
  formatContrato(contrato: any): string {
    if (!contrato || typeof contrato !== 'string') return 'Sin especificar';
    return contrato.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  }

  async openEditModal(trabajador: trabajador) {
    this.selectedTrabajador = trabajador;
    this.populateEditForm(trabajador);
    this.isEditModalOpen = true;
  }

  populateEditForm(trabajador: trabajador) {
    this.editForm.patchValue({
      Name1: trabajador.Name1,
      Name2: trabajador.Name2,
      fecha_nacimiento: new Date(trabajador.fecha_nacimiento).toISOString(),
      fecha_ingreso: new Date(trabajador.fecha_ingreso).toISOString(),
      email: trabajador.email,
      turno: trabajador.turno,
      fechainicioturno: new Date(trabajador.fechainicioturno).toISOString(),
      contrato: trabajador.contrato,
      estado: trabajador.estado,
      nivel: trabajador.nivel,
      avatarUrl: trabajador.avatarUrl || ''
    });
  }

  async saveChanges() {
    if (this.editForm.valid && this.selectedTrabajador) {
      const loading = await this.loadingController.create({
        message: 'Guardando cambios...'
      });
      await loading.present();

      const formData = this.editForm.value;
      const updatedData = {
        Name1: formData.Name1,
        Name2: formData.Name2,
        fecha_nacimiento: new Date(formData.fecha_nacimiento),
        fecha_ingreso: new Date(formData.fecha_ingreso),
        email: formData.email,
        turno: formData.turno,
        fechainicioturno: new Date(formData.fechainicioturno),
        contrato: formData.contrato,
        estado: formData.estado,
        nivel: formData.nivel,
        avatarUrl: formData.avatarUrl || null
      };

      try {
        this.trabajadoresService.updateTrabajador(this.selectedTrabajador.id, updatedData).subscribe({
          next: async (result) => {
            loading.dismiss();
            if (result) {
              this.isEditModalOpen = false;
              await this.showAlert('Éxito', 'Funcionario actualizado correctamente');
              await this.loadTrabajadores(); // invoca el metodo para cargar nuevamente los trabajadores
            } else {
              await this.showAlert('Error', 'No se pudo actualizar el funcionario');
            }
          },
          error: async (error) => {
            loading.dismiss();
            console.error('Error al actualizar al trabajador:', error);
            await this.showAlert('Error', 'Error al actualizar funcionario');
          }
        });
      } catch (error) {
        loading.dismiss();
        console.error('Error al actualizar trabajador:', error);
        await this.showAlert('Error', 'Error al actualizar funcionario');
      }
    } else {
      await this.showAlert('Formulario inválido', 'Por favor complete todos los campos correctamente');
    }
  }

  closeEditModal() {
    this.isEditModalOpen = false;
    this.selectedTrabajador = null;
    this.editForm.reset();
  }

  async showAlert(header: string, message: string) {
    // Determinar el tipo de alerta basado en el header
    let cssClass = 'alert-wrapper';
    if (header.toLowerCase().includes('éxito') || header.toLowerCase().includes('success')) {
      cssClass += ' alert-success';
    } else if (header.toLowerCase().includes('error')) {
      cssClass += ' alert-error';
    } else if (header.toLowerCase().includes('advertencia') || header.toLowerCase().includes('warning')) {
      cssClass += ' alert-warning';
    }

    const alert = await this.alertController.create({
      header,
      message,
      cssClass: cssClass,
      buttons: [{
        text: 'OK',
        cssClass: 'alert-button-confirm'
      }]
    });
    await alert.present();
  }


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
      message: `Turno ${tipoTurno === 'dia' ? 'de Día' : 'de Noche'} para ${worker.Name1} ${worker.Name2}`,
      inputs: [
        {
          name: 'fecha',
          type: 'date',
          min: new Date().toISOString().split('T')[0],
          max: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          value: new Date().toISOString().split('T')[0]
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
            if (!data.fecha || !data.horas || data.horas < 1) {
              await this.showAlert('Error', 'Debe completar todos los campos requeridos.');
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
      
      // Fix date parsing to avoid timezone issues
      // Parse the date string manually to ensure it's in local timezone
      const dateString = data.fecha;
      const [year, month, day] = dateString.split('-').map(Number);
      const shiftDate = new Date(year, month - 1, day); // month is 0-indexed
      
      // Assign extra shift through service
      const success = await this.extraShiftService.assignExtraShift(
        worker,
        shiftDate,
        parseInt(data.horas),
        tipoTurno,
        data.detalles || ''
      );

      if (success) {
        await this.showAlert('Éxito', 
          `Turno extra asignado correctamente a ${worker.Name1} ${worker.Name2} para el ${shiftDate.toDateString()}`);
        
        // Refresh the workers list to show updated state
        await this.loadTrabajadores();
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

  canAssignExtraShift(worker: trabajador): boolean {
    if (!worker) return false;
    const eligibilityCheck = this.extraShiftService.canAssignExtraShift(worker);
    return eligibilityCheck.canAssign;
  }

  // Shift visualization methods
  async openShiftVisualization(worker: trabajador) {
    const modal = await this.modalController.create({
      component: ShiftVisualizationModalComponent,
      componentProps: {
        worker: worker
      },
      cssClass: 'shift-visualization-modal'
    });

    await modal.present();
  }

  // ===== MÉTODOS DE ELIMINACIÓN =====
  
  // Método para eliminar trabajador
  async deleteTrabajador(trabajador: trabajador) {
    const alert = await this.alertController.create({
      header: 'Confirmar eliminación',
      message: `¿Está seguro de que desea eliminar a ${trabajador.Name1} ${trabajador.Name2}? Esta acción no se puede deshacer.`,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Eliminar',
          role: 'destructive',
          handler: async () => {
            await this.confirmDeleteTrabajador(trabajador);
          }
        }
      ]
    });

    await alert.present();
  }

  async confirmDeleteTrabajador(trabajador: trabajador) {
    const loading = await this.loadingController.create({
      message: 'Eliminando funcionario...'
    });
    await loading.present();

    try {
      this.trabajadoresService.deleteTrabajador(trabajador.id).subscribe({
        next: async (result) => {
          loading.dismiss();
          if (result) {
            await this.showAlert('Éxito', `${trabajador.Name1} ${trabajador.Name2} ha sido eliminado correctamente`);
            await this.loadTrabajadores(); // Recargar la lista
          } else {
            await this.showAlert('Error', 'No se pudo eliminar el funcionario');
          }
        },
        error: async (error) => {
          loading.dismiss();
          console.error('Error al eliminar trabajador:', error);
          await this.showAlert('Error', 'Error al eliminar funcionario. Intente nuevamente.');
        }
      });
    } catch (error) {
      loading.dismiss();
      console.error('Error al eliminar trabajador:', error);
      await this.showAlert('Error', 'Error al eliminar funcionario. Intente nuevamente.');
    }
  }
}