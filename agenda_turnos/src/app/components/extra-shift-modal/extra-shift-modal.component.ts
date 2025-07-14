import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ModalController, ToastController } from '@ionic/angular';
import { trabajador } from '../../services/datos';
import { ExtraShiftService } from '../../services/extra-shift.service';

interface ExtraShiftFormData {
  fecha: string;
  tipo: 'day' | 'night' | '';
  horas: number;
  detalles: string;
}

@Component({
  selector: 'app-extra-shift-modal',
  templateUrl: './extra-shift-modal.component.html',
  styleUrls: ['./extra-shift-modal.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule]
})
export class ExtraShiftModalComponent implements OnInit {

  @Input() worker!: trabajador;
  @Input() preselectedDate?: Date;

  formData: ExtraShiftFormData = {
    fecha: '',
    tipo: '',
    horas: 8,
    detalles: ''
  };

  isLoading = false;
  minDate: string;
  maxDate: string;

  constructor(
    private modalController: ModalController,
    private toastController: ToastController,
    private extraShiftService: ExtraShiftService
  ) {
    // Set date limits - from today to 6 months in the future
    const today = new Date();
    const maxDate = new Date();
    maxDate.setMonth(today.getMonth() + 6);
    
    this.minDate = today.toISOString().split('T')[0];
    this.maxDate = maxDate.toISOString().split('T')[0];
  }

  ngOnInit() {
    // If we have a preselected date, use it
    if (this.preselectedDate) {
      this.formData.fecha = this.preselectedDate.toISOString().split('T')[0];
    } else {
      // Default to tomorrow
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      this.formData.fecha = tomorrow.toISOString().split('T')[0];
    }
  }

  async onSubmit(form: any) {
    if (!form.valid) {
      await this.showToast('Por favor complete todos los campos requeridos', 'warning');
      return;
    }

    if (!this.worker.id) {
      await this.showToast('Error: ID del trabajador no encontrado', 'danger');
      return;
    }

    this.isLoading = true;

    try {
      // Use the assignExtraShift method from the service
      const result = await this.extraShiftService.assignExtraShift(
        this.worker,
        new Date(this.formData.fecha + 'T12:00:00'),
        this.formData.horas,
        this.formData.tipo as 'day' | 'night',
        this.formData.detalles || `Turno extra asignado a ${this.worker.Name1} ${this.worker.Name2}`
      );
      
      if (result) {
        await this.showToast('Turno extra asignado exitosamente', 'success');
        this.modalController.dismiss(result, 'created');
      } else {
        await this.showToast('Error al asignar el turno extra', 'danger');
      }
    } catch (error) {
      console.error('Error creating extra shift:', error);
      await this.showToast('Error al asignar el turno extra', 'danger');
    } finally {
      this.isLoading = false;
    }
  }

  dismiss() {
    this.modalController.dismiss(null, 'cancel');
  }

  formatTurno(turno: string): string {
    return turno.replace(/_/g, ' ').split(' ').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    ).join(' ');
  }

  getEstadoColor(estado: string): string {
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

  private async showToast(message: string, color: string) {
    const toast = await this.toastController.create({
      message,
      duration: 3000,
      color,
      position: 'top'
    });
    await toast.present();
  }
}
