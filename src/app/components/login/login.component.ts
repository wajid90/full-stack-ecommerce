import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ CommonModule,
    ReactiveFormsModule,
    RouterLink,
    MatSnackBarModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
 formBuilder=inject(FormBuilder);
  authService=inject(AuthService);
  router = inject(Router);
  snackBar = inject(MatSnackBar);
  loginForm = this.formBuilder.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  onSubmit(): void {
    if (this.loginForm.valid) {
      const value = this.loginForm.value;
      const email = value.email ?? '';
      const password = value.password ?? '';
      this.authService.login(email, password).subscribe({
        next: (result: any) => {
          if (result.accessToken && result.refreshToken && result.user) {
            localStorage.setItem('accessToken', result.accessToken);
            localStorage.setItem('refreshToken', result.refreshToken);
            localStorage.setItem('user', JSON.stringify(result.user));
            this.snackBar.open('Login successful', 'Close', {
              duration: 3000,
            });
            this.router.navigateByUrl("/");
          } else {
            this.snackBar.open(result.message, 'Close', {
              duration: 3000,
            });
          }
        },
        error: (error) => {
          this.snackBar.open('Error during login: ' + error.message, 'Close', {
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
