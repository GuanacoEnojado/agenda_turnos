import { Component, OnInit } from '@angular/core';
import { MenuController, LoadingController, AlertController } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';


@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
  standalone:false,
})
export class RegistroPage implements OnInit {

  registroForm: FormGroup;
  showPassword = false;
  showConfirmPassword = false;

  constructor(private formBuilder: FormBuilder, private authService: AuthService, private loadingController:LoadingController, private alertController:AlertController, private router: Router, private menuCtrl: MenuController) { 
  this.registroForm = this.formBuilder.group({
    name: ['', [Validators.required, Validators.minLength(5)]], 
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]], 
    confirmPassword: ['', [Validators.required, Validators.minLength(6)]], 
  }, {validators: this.passwordMatchValidator});
  }
  ngOnInit() {
  }
  
passwordMatchValidator(form: FormGroup) {
  const password = form.get('password');
  const confirmPassword = form.get('confirmPassword');
  if (password && confirmPassword && password.value !== confirmPassword.value) {
    confirmPassword.setErrors({ passwordMismatch: true });
    return { passwordMismatch: true };
  } else {
    if (confirmPassword?.hasError('passwordMismatch')) {
      confirmPassword.setErrors(null);
    }
    return null;
  }
}
async onRegister() {
  if (this.registroForm.valid) {    // Omitir controlador de carga para evitar error de chunk
    // const loading = await this.loadingController.create({message: 'creando cuenta...'});
    // await loading.present();

    console.log('Starting registration...'); // Log de depuración
    
    const { name, email, password } = this.registroForm.value;
    console.log('Registration data:', { name, email, password }); // Log de depuración
    
    const result = await this.authService.register({name, email, password});
    console.log('Registration result:', result); // Log de depuración

    // await loading.dismiss();

    if (result.success) {
      await this.showAlert('Éxito', 'Cuenta de administrador creada exitosamente', () => {
        this.router.navigate(['/home']);
      });
    } else {
      await this.showAlert('Error en el registro', result.message);
    }
  } else {
    console.log('Form is invalid:', this.registroForm.errors); // Log de depuración
    console.log('Form values:', this.registroForm.value); // Log de depuración
    console.log('Form status:', this.registroForm.status); // Log de depuración
    
    await this.showAlert('Formulario inválido', 'Por favor complete todos los campos correctamente');
  }
}
    
  

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPasswordVisibility() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  goToLogin() {
    this.router.navigate(['/home']);
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
    if (header.toLowerCase().includes('éxito') || header.toLowerCase().includes('success')) {
      cssClass += ' alert-success';
    } else if (header.toLowerCase().includes('error')) {
      cssClass += ' alert-error';
    } else if (header.toLowerCase().includes('advertencia') || header.toLowerCase().includes('warning') || header.toLowerCase().includes('inválido')) {
      cssClass += ' alert-warning';
    }

    const alert = await this.alertController.create({
      header,
      message,
      cssClass: cssClass,
      buttons: [{
        text: 'OK',
        cssClass: 'alert-button-confirm',
        handler: handler
      }]
    });
    await alert.present();
  }

}