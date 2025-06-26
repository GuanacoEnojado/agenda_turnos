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
    username: ['', [Validators.required, Validators.minLength(5)]], 
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]], 
    Confirmpassword: ['', [Validators.required, Validators.minLength(6)]], 
  }, {Validators: this.passwordMatchValidator});
  }
  ngOnInit() {
  }
  
passwordMatchValidator(form:FormGroup){
  const password = form.get('password');
  const confirmpassword = form.get('confirmPassword');
  if (password && confirmpassword && password.value !== confirmpassword){
    confirmpassword.setErrors({ passwordMismatch: true});
    return{ passwordMismatch : true};
  }
  else {
    return null;
  }

}
async onRegister(){
  if (this.registroForm.valid){
    const loading = await this.loadingController.create({message: 'creando cuenta...'});
    await loading.present();
    
    const  {username, email, password } = this.registroForm.value;
    const result = await this.authService.register({username, email, password});

    await loading.dismiss();

    if (result.success){
      const alert = await this.alertController.create({ header:'success', message:'Cuenta de administrador creada exitosamente ', 
        buttons: [{
          text: 'Ok',
          handler: () => {
            this.router.navigate(['/home']);}}]
          });
          await alert.present();}
          else {
            const alert = await this.alertController.create({ header:'Fallo el registro, cuek', message: result.message, buttons:['Ok']});
            await alert.present();
          }
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

}