import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuController } from '@ionic/angular';
import { AuthService } from './services/auth.service';
import { ThemeService } from './services/theme.service';
import { User } from './services/datos';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false,
})
export class AppComponent implements OnInit {
  currentUser$: Observable<User | null>;
  currentUser: User | null = null;

  constructor(
    private router: Router, 
    private menuCtrl: MenuController,
    private authService: AuthService,
    private themeService: ThemeService
  ) {
    this.currentUser$ = this.authService.currentUser$;
    // Inicializar servicio de tema - esto aplicará el tema guardado o el predeterminado
  }

  ngOnInit() {
    this.currentUser$.subscribe(user => {
      this.currentUser = user;
    });
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
  

  async registrofuncionario(){
    await this.menuCtrl.close();
    this.router.navigate(['/registrofuncionario']);
  }
  
  async registroUsuario(){
    await this.menuCtrl.close();
    this.router.navigate(['/registro']);
  }
  
  async listafuncionario(){
    await this.menuCtrl.close();
    this.router.navigate(['/lista-funcionarios']);
  }



  async cambiodeturno(){
    await this.menuCtrl.close();
    this.router.navigate(['/cambiodeturno']);
  }

  async logout(){
    this.authService.logout();
    await this.menuCtrl.close();
    this.router.navigate(['/home']);
  }
}