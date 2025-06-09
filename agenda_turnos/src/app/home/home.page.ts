import { Component } from '@angular/core';
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


  constructor(private toastController: ToastController) {}
  
  iniciosesion(){
    if(this.contrasena == "cocodrilo" && this.emailregistro == "cocodrilo@gmail.com"){
      return;
    }
    else{
      return;
    }
  }
  cancelar(){
    return;
  }
async presentToast(position: 'bottom') {
    const toast = await this.toastController.create({
      message: '',
      duration: 1500,
      position: position,
    });

    await toast.present();
  }
}

}
