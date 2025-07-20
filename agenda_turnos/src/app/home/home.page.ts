import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { AlertController, ToastController, LoadingController } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false,
})
export class HomePage implements OnInit {
  loginForm: FormGroup;
  showPassword = false;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private loadingController: LoadingController,
    private alertController: AlertController
  ) {
    this.loginForm = this.formBuilder.group({
      username: ['', [Validators.required, Validators.minLength(5)]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  ngOnInit() {
    // Si ya está logueado redirige
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/main']);
    }
  }

  async onLogin() {
    if (this.loginForm.valid) {
      const loading = await this.loadingController.create({
        message: 'Ingrsando...'
      });
      await loading.present();

      const { username, password } = this.loginForm.value;
      const result = await this.authService.login(username, password);

      await loading.dismiss();

      if (result.success) {
        this.router.navigate(['/main']);
      } else {
        const alert = await this.alertController.create({
          header: 'Falla en el ingreso',
          message: result.message,
          buttons: ['OK']
        });
        await alert.present();
      }
    }
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  goToRegister() {
    this.router.navigate(['/registro']);
  }
}