import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-calendario-global',
  templateUrl: './calendario-global.page.html',
  styleUrls: ['./calendario-global.page.scss'],
  standalone: false,
})
export class CalendarioGlobalPage implements OnInit {

  constructor(private router:Router) { }

  ngOnInit() {
  }
  calendarioglobal(){
    this.router.navigate(['/calendario-global'])
  }
  main(){
    this.router.navigate(['/main'])
  }
  preferencias(){
    this.router.navigate(['/preferencias'])
  }
  eliminarfuncionario(){
    this.router.navigate(['/eliminar'])
  }
  registrofuncionario(){
    this.router.navigate(['/registro'])
  }
  listafuncionario(){
    this.router.navigate(['/lista-funcionario'])
  }
}