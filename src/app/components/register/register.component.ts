import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { RouterLink,Router } from '@angular/router';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';


@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule,CommonModule,RouterLink,MatSnackBarModule,MatSnackBarModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  formBuilder=inject(FormBuilder);
  authService=inject(AuthService);
  snackBar = inject(MatSnackBar);
  router = inject(Router);
  registerForm: FormGroup = this.formBuilder.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    confirmPassword: ['', [Validators.required]]
  }, { validators: this.passwordMatchValidator });

  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password');
    const confirmPassword = form.get('confirmPassword');
    if (password && confirmPassword && password.value !== confirmPassword.value) {
      confirmPassword.setErrors({ mismatch: true });
    } else {
      confirmPassword?.setErrors(null);
    }
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      const value = this.registerForm.value;
      const name = value.name ?? '';
      const email = value.email ?? '';
      const password = value.password ?? '';
      this.authService.register(name, email, password).subscribe({
        next: (result:any) => {
          
          if(result!= null && result!=undefined && result.status){
          this.snackBar.open('User registered successfully', 'Close', {
            duration: 3000,
          });
          this.router.navigateByUrl('/login');
        }else{
          this.snackBar.open(result.message, 'Close', {
            duration: 3000,
          });
        }
        },
        error: (error) => {
          this.snackBar.open('Registration failed: ' + error.message, 'Close', {
            duration: 3000,
          });
        }
      });
    } else {
      this.snackBar.open('Form is invalid. Please check the fields.', 'Close', {
        duration: 3000,
      });
    }
  }
}
