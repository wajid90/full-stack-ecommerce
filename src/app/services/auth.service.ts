import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  http=inject(HttpClient);
  public userId: string;
  public userProfileImage: string='';
  constructor() {
    const user = localStorage.getItem('user');
    if (user) {
      const parsedUser = JSON.parse(user);
      this.userId = parsedUser._id || 'defaultUserId';
      this.userProfileImage = environment.imgUrl + parsedUser.profileImage || '';
    } else {
      this.userId = 'defaultUserId';
    }
  }

  login(email: string, password: string): Observable<any> {
    return this.http.post<any>(environment.apiUrl+"/auth/login", { email, password });
  }
  getUserId(): string {
    return this.userId;
  }
  getUser(): { _id: string, name: string } {
    let user = localStorage.getItem('user');
    if (user) {

      return {
        _id: JSON.parse(user)._id,
        name: JSON.parse(user).name
      };
    }
    return { _id: 'defaultUserId', name: 'Guest' };
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
  getUsers(): Observable<any[]> {
    return this.http.get<any[]>(`${environment.apiUrl}/auth`);
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
  editProfile(formData: FormData): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/auth/profile`, formData);
  }
  getUserById(userId: string): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/auth/${userId}`);
  }
  blockUser(userId: string): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/auth/block/${userId}`, {});
  }

  unblockUser(userId: string): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/auth/unblock/${userId}`, {});
  }
}
