import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { MenuController, AlertController, ToastController } from '@ionic/angular';
import { ThemeService, ThemeMode } from '../../services/theme.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-preferencias',
  templateUrl: './preferencias.page.html',
  styleUrls: ['./preferencias.page.scss'],
  standalone: false,
})
export class PreferenciasPage implements OnInit, OnDestroy {
  currentTheme: ThemeMode = 'auto';
  private themeSubscription?: Subscription;

  themeOptions = [
    { value: 'auto', label: 'Automático (Sistema)' },
    { value: 'light', label: 'Claro' },
    { value: 'dark', label: 'Oscuro' }
  ];

  constructor(
    private router: Router, 
    private menuCtrl: MenuController,
    private themeService: ThemeService,
    private alertController: AlertController,
    private toastController: ToastController
  ) { }
  
  ngOnInit() {
    // Subscribe to theme changes
    this.themeSubscription = this.themeService.theme$.subscribe(theme => {
      this.currentTheme = theme;
    });
  }

  ngOnDestroy() {
    if (this.themeSubscription) {
      this.themeSubscription.unsubscribe();
    }
  }

  /**
   * Handle theme selection change
   */
  onThemeChange(event: any) {
    const selectedTheme = event.detail.value as ThemeMode;
    this.themeService.setTheme(selectedTheme);
    this.showThemeChangeToast(selectedTheme);
  }

  /**
   * Show toast confirmation when theme changes
   */
  private async showThemeChangeToast(theme: ThemeMode) {
    const toast = await this.toastController.create({
      message: `Tema cambiado a: ${this.themeService.getThemeDisplayName(theme)}`,
      duration: 2000,
      position: 'bottom',
      color: 'success'
    });
    toast.present();
  }

  /**
   * Toggle theme manually (for quick access)
   */
  toggleTheme() {
    this.themeService.toggleTheme();
  }

  /**
   * Show information about theme options
   */
  async showThemeInfo() {
    const alert = await this.alertController.create({
      header: 'Información sobre Temas',
      message: `
        <p><strong>Automático:</strong> Sigue la configuración del sistema operativo.</p>
        <p><strong>Claro:</strong> Usa siempre el tema claro, independientemente del sistema.</p>
        <p><strong>Oscuro:</strong> Usa siempre el tema oscuro, independientemente del sistema.</p>
      `,
      buttons: ['Entendido']
    });
    await alert.present();
  }

  /**
   * Reset all preferences to default
   */
  async resetPreferences() {
    const alert = await this.alertController.create({
      header: 'Restablecer Preferencias',
      message: '¿Estás seguro de que quieres restablecer todas las preferencias a sus valores predeterminados?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Restablecer',
          handler: () => {
            this.themeService.setTheme('auto');
            this.showResetToast();
          }
        }
      ]
    });
    await alert.present();
  }

  /**
   * Show reset confirmation toast
   */
  private async showResetToast() {
    const toast = await this.toastController.create({
      message: 'Preferencias restablecidas a valores predeterminados',
      duration: 3000,
      position: 'bottom',
      color: 'warning'
    });
    toast.present();
  }

  /**
   * Navigate back to main page
   */
  async goBack() {
    await this.menuCtrl.close();
    this.router.navigate(['/main']);
  }
}