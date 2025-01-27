import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner'; // Import MatProgressSpinnerModule


@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [ CommonModule,
    ReactiveFormsModule,
    RouterLink,
    MatSnackBarModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule, MatProgressSpinnerModule],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.scss'
})
export class ForgotPasswordComponent {
  forgotPasswordForm: FormGroup;
  otpForm: FormGroup;
  resetPasswordForm: FormGroup;
  step: number = 1;
  isLoading: boolean = false; 
  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {
    this.forgotPasswordForm = this.fb.group({
      email: [null, [Validators.required, Validators.email]]
    });

    this.otpForm = this.fb.group({
      email: [null, [Validators.required, Validators.email]],
      otp: [null, [Validators.required, Validators.minLength(6)]]
    });

    this.resetPasswordForm = this.fb.group({
      email: [null, [Validators.required, Validators.email]],
      otp: [null, [Validators.required, Validators.minLength(6)]],
      newPassword: [null, [Validators.required, Validators.minLength(6)]]
    });
  }
  ngOnInit(): void {}

  requestOtp() {
    if (this.forgotPasswordForm.valid) {
      this.isLoading = true;
      this.authService.requestOtp(this.forgotPasswordForm.value).subscribe({
        next: (response: any) => {
          this.snackBar.open('OTP sent to your email.', 'Close', {
            duration: 3000,
          });
          this.step = 2;
          this.otpForm.patchValue({ email: this.forgotPasswordForm.value.email });
          this.isLoading = false; 
        },
        error: (error:any) => {
          this.snackBar.open('Failed to send OTP: ' + error.message, 'Close', {
            duration: 3000,
          });
          this.isLoading = false;
        }
      });
    }
  }

  verifyOtp() {
    if (this.otpForm.valid) {
      this.isLoading = true;
      this.authService.verifyOtp(this.otpForm.value).subscribe({
        next: (response: any) => {
          this.snackBar.open('OTP verified successfully.', 'Close', {
            duration: 3000,
          });
          this.step = 3;
          this.resetPasswordForm.patchValue({ email: this.otpForm.value.email, otp: this.otpForm.value.otp });
          this.isLoading = false; 
        },
        error: (error:any) => {
          this.snackBar.open('Failed to verify OTP: ' + error.message, 'Close', {
            duration: 3000,
          });
          this.isLoading = false;
        }
      });
    }
  }
  resetPassword() {
    if (this.resetPasswordForm.valid) {
      this.isLoading = true; 
      this.authService.resetPassword(this.resetPasswordForm.value).subscribe({
        next: (response: any) => {
          this.snackBar.open('Password reset successfully.', 'Close', {
            duration: 3000,
          });
          this.router.navigateByUrl('/login');
          this.isLoading = false; 
        },
        error: (error:any) => {
          this.snackBar.open('Failed to reset password: ' + error.message, 'Close', {
            duration: 3000,
          });
          this.isLoading = false;
        }
      });
    }
  }

}
