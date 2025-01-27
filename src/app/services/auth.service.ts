import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  http=inject(HttpClient);
  constructor() { }
  login(email: string, password: string): Observable<any> {
    return this.http.post<any>(environment.apiUrl+"/auth/login", { email, password });
  }
  logout(): void {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
  }
  register(name:string,email:string,password:string){
    return this.http.post(environment.apiUrl+"/auth/register",{
      name,
      email,
      password
    })
  }
  get isLoggedIn(){
    let token=localStorage.getItem("accessToken");
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
  refreshToken(token: string): Observable<any> {
    return this.http.post<any>(environment.apiUrl+"/auth/refresh-token", { token });
  }
  requestOtp(data:{ email:string}): Observable<any> {
  
    return this.http.post<any>(environment.apiUrl + "/auth/request-otp", data);
  }

  verifyOtp(data: { email: string, otp: string }): Observable<any> {
    return this.http.post<any>(environment.apiUrl + "/auth/verify-otp", data);
  }

  resetPassword(data: { email: string, otp: string, newPassword: string }): Observable<any> {
    return this.http.post<any>(environment.apiUrl + "/auth/reset-password", data);
  }
  changePassword(data: { currentPassword: string, newPassword: string }): Observable<any> {
    return this.http.post<any>(environment.apiUrl + "/customer/change-password", data);
  }
  contactUs(data: { name: string, email: string, password: string }): Observable<any> {
    
    return this.http.post<any>(environment.apiUrl + "/contact/add", data);
  }
}
