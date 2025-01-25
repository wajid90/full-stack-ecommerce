import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  http=inject(HttpClient);
  constructor() { }
  login(email:string,password:string){
    return this.http.post(environment.apiUrl+"/auth/login",{
      email,
      password
    })
  }
  logout(){
    localStorage.removeItem("token");
    localStorage.removeItem("user");

  }
  register(name:string,email:string,password:string){
    return this.http.post(environment.apiUrl+"/auth/register",{
      name,
      email,
      password
    })
  }
  get isLoggedIn(){
    let token=localStorage.getItem("token");
    if(token && token!==undefined && token!==null){
      return true;
    }
    return false;
  }
  get isAdmin(){
    let userData=localStorage.getItem("user");
    if(userData){
      return JSON.parse(userData).isAdmin;
    }
    return false;
  }
  get userName(){
    let userData=localStorage.getItem("user");
    if(userData){
      return JSON.parse(userData).name;
    }
    return null;
  }
  get userEmail(){
    let userData=localStorage.getItem("user");
    if(userData !=null && userData!=undefined){
      return JSON.parse(userData).email;
    }
    return null;
  }
}
