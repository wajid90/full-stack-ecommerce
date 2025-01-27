import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ CommonModule,
    ReactiveFormsModule,
    RouterLink,
    MatSnackBarModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule, MatProgressSpinnerModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
 formBuilder=inject(FormBuilder);
  authService=inject(AuthService);
  router = inject(Router);
  snackBar = inject(MatSnackBar);
  isLoading: boolean = false;
  loginForm = this.formBuilder.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.isLoading = true;
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
            this.isLoading = false;
            this.router.navigateByUrl("/");
          } else {
            this.snackBar.open(result.message, 'Close', {
              duration: 3000,
            });
            this.isLoading = false;
          }
        },
        error: (error) => {
          this.snackBar.open('Error during login: ' + error.message, 'Close', {
            duration: 3000,
          });
          this.isLoading = false;
        }
      });
    } else {
      this.snackBar.open('Form is invalid. Please check the fields.', 'Close', {
        duration: 3000,
      });
    }
  }
}
