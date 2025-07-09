import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuController } from '@ionic/angular';
import { AuthService } from '../../services/auth.service';
import { User } from '../../services/datos';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-main',
  templateUrl: './main.page.html',
  styleUrls: ['./main.page.scss'],
  standalone: false,
})
export class MainPage implements OnInit {
  currentUser$: Observable<User | null>;
  currentUser: User | null = null;

  constructor(
    private router: Router, 
    private menuCtrl: MenuController,
    private authService: AuthService
  ) { 
    this.currentUser$ = this.authService.currentUser$;
  }
  
  ngOnInit() {
    // current user como observable
    this.currentUser$.subscribe(user => {
      this.currentUser = user;
      console.log('Current user in main page:', user);
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
  
  async logout() {
    this.authService.logout();
    await this.menuCtrl.close();
    this.router.navigate(['/home']);
  }

  goToLogin() {
    this.router.navigate(['/home']);
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