import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule,RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
 formBuilder=inject(FormBuilder);
  authService=inject(AuthService);
  router=inject(Router);
  loginForm = this.formBuilder.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });
  onSubmit(): void {
    if (this.loginForm.valid) {
      let value=this.loginForm.value;
      const email = value.email ?? '';
      const password = value.password ?? '';
      this.authService.login(email,password).subscribe((result:any)=>{
        if(result.token!==undefined && result.user!=undefined){
        localStorage.setItem('token',result.token);
        localStorage.setItem('user',JSON.stringify(result.user));
        this.router.navigateByUrl("/");
        }
      })

    } else {
      console.log('Form is invalid');
    }
  }
}
