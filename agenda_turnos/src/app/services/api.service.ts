import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { retry, catchError } from 'rxjs';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  httpOptions = {
    Headers: new HttpHeaders({
      'content-type': 'application/json',
      'Access-Control-Allow-Origin':'*'
    })
  }

  //fake apiREST
  apiURL = 'http://192.168.1.1:3000';
  constructor(private http:HttpClient) { }
}

//estructura general
//createpost(post:any):Observable<any>{
//return this.http.post(this.apiURL+'/post',post//body//,this.httpOptions).pipe(
//retry(3)
//);
//
//} en put hay que agregar el id a modificar, en get solo que marcar la id y eso sería
//el ts de la pagina importa el apiservice e instancia el metodo 
//xxxpost(){
//this.api.xxxPosts().suscribe((data)=>{
///this.post=data;
//this.post.reverse();
//},error stuff)}