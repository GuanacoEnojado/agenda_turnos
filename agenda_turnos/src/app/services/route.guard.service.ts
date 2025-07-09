import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class RouteGuardService implements CanActivate {

  constructor(
    private AuthService : AuthService, private router: Router
  ) { }
  canActivate(): boolean{
    if(this.AuthService.isAuthenticated()){
      return true;
    }
    else {
      this.router.navigate(['/home'])
      return false;
    }
  }
}
