import { Router, RouterModule } from '@angular/router';
import { Component } from '@angular/core';
import { AlertController, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false,
})
export class HomePage {
  contrasena: string = "";
  emailregistro: string= "";


  constructor(private toastController: ToastController, private alertcontroller: AlertController , private router: Router) {}
  
  iniciosesion(){
    if(this.contrasena == "cocodrilo" && this.emailregistro == "cocodrilo@gmail.com"){
      this.presentToast("bottom", "Ingreso Exitoso");
      this.router.navigate(['/main']);
    }
    else{
    }
  }
  cancelar(){
    return;
  }
async presentToast(position: 'bottom', msj:string) {
    const toast = await this.toastController.create({
      message: msj,
      duration: 1500,
      position: position,
    });

    await toast.present();
  }
async presentAlert(msj:string){
  const alert = await this.alertcontroller.create({
    header: "Datos incorrectos",
    message: msj,
    buttons: ['OK'],
  });
  await alert.present();
}
}


