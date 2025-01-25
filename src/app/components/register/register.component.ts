import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule,CommonModule,RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  formBuilder=inject(FormBuilder);
  authService=inject(AuthService);
  registerForm = this.formBuilder.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });
  onSubmit(): void {
    if (this.registerForm.valid) {
      let value=this.registerForm.value;
      const name = value.name ?? '';
      const email = value.email ?? '';
      const password = value.password ?? '';
      this.authService.register(name,email,password).subscribe((result)=>{
      alert("User Register");
      })

    } else {
      console.log('Form is invalid');
    }
  }
}
