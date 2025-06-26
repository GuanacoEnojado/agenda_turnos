import { Injectable } from '@angular/core';
import { DbService, User } from './db.service';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {  
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();


  constructor(private dbservice: DbService) {
    this.loadStoredUser();
   }
  private loadStoredUser(){
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser){
      this.currentUserSubject.next(JSON.parse(storedUser));
    }
  }
  async login(username: string, password:string): Promise<{success: boolean; message:string}> {
    try {
      const user = await this.dbservice.loginUser(username, password);

      if (user) {
        localStorage.setItem('currentUser', JSON.stringify(user));
        this.currentUserSubject.next(user);
        return { success:true, message: 'Ingreso exitoso'};

      }
      else {
        return {success:false, message:' Usuario o Contraseña incorrectas'}
      }
    }
    catch (error) {
      return { success:false, message: 'ingreso fallido, intenta denuevo.'};
    }

  }
  async register(userData: User): Promise<{success:boolean; message:string}>{
    try {
      const userExist = await this.dbservice.checkUserExists(userData.username, userData.email);

      if (userExist){
        return{ success:false, message: 'Usuario o email ya están registrados'};
      }
      const success = await this.dbservice.registerUser(userData);

      if (success) {
        return { success:true, message:'Registro exitoso'};
      }
      else {
        return { success:false, message:'Registro faillido'}
      }
    }
    catch (error){
      return { success:false, message: 'Registro fallido, favor intentar denuevo'};
    }
  }
  logout(): void{
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
    //cambia current user por null
  }
  isAuthenticated():boolean {
    return this.currentUserSubject.value !==null;
//retorna si esta logueado o no
  }
  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }
  //retorna usuario o null
  
}
