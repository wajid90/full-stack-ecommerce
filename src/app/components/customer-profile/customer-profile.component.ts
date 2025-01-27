import { Component, inject } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialog, MatDialogModule } from '@angular/material/dialog'; 
import { ChangePasswordDialogComponent } from '../change-password-dialog/change-password-dialog.component';

@Component({
  selector: 'app-customer-profile',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule,MatSnackBarModule,MatFormFieldModule,MatInputModule,MatButtonModule,MatProgressSpinnerModule,MatDialogModule],
  templateUrl: './customer-profile.component.html',
  styleUrl: './customer-profile.component.scss'
})
export class CustomerProfileComponent {
  changePasswordForm: FormGroup;
  isChangePasswordFormVisible: boolean = false;
  isLoading: boolean = false;
  authService=inject(AuthService);
  
  constructor(
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private router: Router,
    private dialog: MatDialog
  ) {
    this.changePasswordForm = this.fb.group({
      currentPassword: [null, [Validators.required]],
      newPassword: [null, [Validators.required, Validators.minLength(6)]],
      confirmNewPassword: [null, [Validators.required]]
    }, { validator: this.mustMatch('newPassword', 'confirmNewPassword') });
  }

  ngOnInit(): void {}

  openChangePasswordForm() {
    const dialogRef = this.dialog.open(ChangePasswordDialogComponent, {
      width: '400px',
      data: { form: this.changePasswordForm }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.changePassword();
      }
    });
  }

  mustMatch(controlName: string, matchingControlName: string) {
    return (formGroup: FormGroup) => {
      const control = formGroup.controls[controlName];
      const matchingControl = formGroup.controls[matchingControlName];

      if (matchingControl.errors && !matchingControl.errors['mustMatch']) {
        return;
      }

      if (control.value !== matchingControl.value) {
        matchingControl.setErrors({ mustMatch: true });
      } else {
        matchingControl.setErrors(null);
      }
    };
  }

  changePassword() {
    if (this.changePasswordForm.valid) {
      this.isLoading = true;
      const { currentPassword, newPassword } = this.changePasswordForm.value;
      this.authService.changePassword({ currentPassword, newPassword }).subscribe({
        next: (response: any) => {
          this.snackBar.open('Password changed successfully.', 'Close', {
            duration: 3000,
          });
          this.isLoading = false;
          this.isChangePasswordFormVisible = false;
          this.changePasswordForm.reset();
        },
        error: (error: any) => {
          this.snackBar.open('Failed to change password: ' + error.message, 'Close', {
            duration: 3000,
          });
          this.isLoading = false;
        }
      });
    }
  }

  logout() {
    this.authService.logout();
    this.router.navigateByUrl('/login');
    this.snackBar.open('Logged out successfully', 'Close', {
      duration: 3000,
    });
  }
}
