import { MainPage } from './../pages/main/main.page';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false,
})
export class HomePage {
  contrasena: string = "";
  emailregistro: string= "";


  constructor(private toastController: ToastController, private router: Router) {}
  
  iniciosesion(){
    if(this.contrasena == "cocodrilo" && this.emailregistro == "cocodrilo@gmail.com"){
      this.presentToast("bottom", "Ingreso con éxito.")
      this.router.navigate(['/main']);
    }
    else{
      return;
    }
  }
  cancelar(){
    return;
  }
async presentToast(position: 'bottom', msj: string) {
    const toast = await this.toastController.create({
      message: msj,
      duration: 1500,
      position: position,
    });

    await toast.present();
  }
}

