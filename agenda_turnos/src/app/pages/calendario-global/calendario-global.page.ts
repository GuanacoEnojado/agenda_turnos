import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { IonDatetime, MenuController } from '@ionic/angular';

@Component({
  selector: 'app-calendario-global',
  templateUrl: './calendario-global.page.html',
  styleUrls: ['./calendario-global.page.scss'],
  standalone: false,
})
export class CalendarioGlobalPage implements OnInit {

  @ViewChild('datetime', {static : false}) datetime!:IonDatetime;
  
  constructor(private router: Router, private menuCtrl: MenuController) { }
  
  ngOnInit() {
  }
  ngOnChanges(){
    
    
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
  botonfecha(){
    if(this.datetime.value) {
    const fecha = this.datetime.value.toString().split('T')[0];
    console.log(fecha);
    }
    else
    {
      console.log("chickens pecking a few slices of bread")
    }
    
  }
  
}
