import { Component, OnInit } from '@angular/core';
import { MenuController, LoadingController, AlertController } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TrabajadoresService } from '../../services/trabajadores.service';
import { turno, contrato, estado, nivel } from '../../services/datos';

@Component({
  selector: 'app-registrofuncionario',
  templateUrl: './registrofuncionario.page.html',
  styleUrls: ['./registrofuncionario.page.scss'],
  standalone: false,
})
export class RegistroFuncionarioPage implements OnInit {

  registroForm: FormGroup;

  // Opciones para campos de selección
  turnoOptions: turno[] = ['4to_turno_modificado', '3er_turno', '4to_turno', 'diurno_hospital', 'diurno_empresa', 'volante'];
  contratoOptions: contrato[] = ['contrato_indefinido', 'contrato_fijo', 'planta', 'contrata', 'volante'];
  estadoOptions: estado[] = ['activo', 'inactivo', 'licencia', 'vacaciones', 'suspendido'];
  nivelOptions: nivel[] = ['tecnico', 'manipulador', 'auxiliar', 'profesional'];

  constructor(
    private formBuilder: FormBuilder, 
    private trabajadoresService: TrabajadoresService, 
    private loadingController: LoadingController, 
    private alertController: AlertController, 
    private router: Router, 
    private menuCtrl: MenuController
  ) { 
    this.registroForm = this.formBuilder.group({
      Name1: ['', [Validators.required, Validators.minLength(2)]], 
      Name2: ['', [Validators.required, Validators.minLength(2)]], 
      fecha_nacimiento: ['', [Validators.required]],
      fecha_ingreso: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      turno: ['', [Validators.required]],
      fechainicioturno: ['', [Validators.required]],
      contrato: ['', [Validators.required]],
      estado: ['activo', [Validators.required]], // Por defecto 'activo'
      nivel: ['', [Validators.required]], // Agregar campo nivel
      avatarUrl: [''] // Opcional
    });
  }
  ngOnInit() {
  }
  
  async onRegister() {
    if (this.registroForm.valid) {
      console.log('Starting trabajador registration...'); // Log de depuración
      
      const formData = this.registroForm.value;
      
      // Convertir fechas al formato apropiado
      const trabajadorData = {
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
      
      console.log('Trabajador data:', trabajadorData); // Log de depuración
      
      try {
        const result = await this.trabajadoresService.createTrabajador(trabajadorData).toPromise();
        console.log('Trabajador creation result:', result); // Log de depuración

        if (result) {
          await this.showAlert('Éxito', 'Funcionario registrado exitosamente', () => {
            this.router.navigate(['/main']);
          });
        } else {
          await this.showAlert('Error en el registro', 'No se pudo registrar el funcionario');
        }
      } catch (error) {
        console.error('Error registering trabajador:', error);
        await this.showAlert('Error en el registro', 'Error al registrar funcionario, intenta de nuevo');
      }
    } else {
      console.log('Form is invalid:', this.registroForm.errors); // Log de depuración
      console.log('Form values:', this.registroForm.value); // Log de depuración
      console.log('Form status:', this.registroForm.status); // Log de depuración
      
      await this.showAlert('Formulario inválido', 'Por favor complete todos los campos correctamente');
    }
  }

  goToMain() {
    this.router.navigate(['/main']);
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
    this.router.navigate(['/eliminar']);
  }
  
  async registrofuncionario(){
    await this.menuCtrl.close();
    this.router.navigate(['/registro']);
  }
  
  async listafuncionario(){
    await this.menuCtrl.close();
    this.router.navigate(['/lista-funcionarios']);
  }

  async showAlert(header: string, message: string, handler?: () => void) {
    // Determinar el tipo de alerta basado en el header
    let cssClass = 'alert-wrapper';
    let headerColor = 'var(--ion-color-primary)';
    
    if (header.toLowerCase().includes('éxito') || header.toLowerCase().includes('success')) {
      cssClass += ' alert-success';
      headerColor = 'var(--ion-color-success)';
    } else if (header.toLowerCase().includes('error')) {
      cssClass += ' alert-error';
      headerColor = 'var(--ion-color-danger)';
    } else if (header.toLowerCase().includes('advertencia') || header.toLowerCase().includes('warning') || header.toLowerCase().includes('inválido')) {
      cssClass += ' alert-warning';
      headerColor = 'var(--ion-color-warning)';
    }

    const alert = await this.alertController.create({
      header,
      message,
      cssClass: cssClass,
      mode: 'md', // Forzar modo Material Design para mejor consistencia
      buttons: [{
        text: 'OK',
        cssClass: 'alert-button-confirm',
        handler: handler
      }]
    });

    // Aplicar estilos directamente después de crear la alerta
    await alert.present();
    
    // Aplicar estilos adicionales después de que se renderice
    setTimeout(() => {
      const alertElement = document.querySelector('ion-alert');
      if (alertElement) {
        alertElement.style.setProperty('--background', '#ffffff');
        alertElement.style.setProperty('--color', '#2d3748');
        
        const messageElement = alertElement.querySelector('.alert-message');
        if (messageElement) {
          (messageElement as HTMLElement).style.color = '#2d3748';
          (messageElement as HTMLElement).style.backgroundColor = '#ffffff';
          (messageElement as HTMLElement).style.fontSize = '1rem';
        }
        
        const headerElement = alertElement.querySelector('.alert-head');
        if (headerElement) {
          (headerElement as HTMLElement).style.backgroundColor = headerColor;
          (headerElement as HTMLElement).style.color = 'white';
        }
      }
    }, 50);
  }
}