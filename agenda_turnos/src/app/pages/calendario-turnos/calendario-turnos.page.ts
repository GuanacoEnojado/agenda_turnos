import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuController } from '@ionic/angular';

@Component({
  selector: 'app-calendario-turnos',
  templateUrl: './calendario-turnos.page.html',
  styleUrls: ['./calendario-turnos.page.scss'],
  standalone: false,
  
})
export class CalendarioTurnosPage implements OnInit {

  constructor(
    private router: Router,
    private menuCtrl: MenuController
  ) { }

  ngOnInit() {
  }

  // Navigation methods
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

  async calendarioTurnos(){
    await this.menuCtrl.close();
    this.router.navigate(['/calendario-turnos']);
  }

  async busquedadia(){
    await this.menuCtrl.close();
    this.router.navigate(['/busquedadia']);
  }

  async registroUsuario(){
    await this.menuCtrl.close();
    this.router.navigate(['/registro']);
  }

  async cambiodeturno(){
    await this.menuCtrl.close();
    this.router.navigate(['/cambiodeturno']);
  }
}
