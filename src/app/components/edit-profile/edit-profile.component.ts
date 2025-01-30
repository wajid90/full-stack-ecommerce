import { pluck } from 'rxjs';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-edit-profile',
  standalone: true,
  imports: [ReactiveFormsModule,CommonModule,MatProgressSpinnerModule],
  templateUrl: './edit-profile.component.html',
  styleUrl: './edit-profile.component.scss'
})
export class EditProfileComponent {
  editProfileForm: FormGroup;
  selectedImage: string | ArrayBuffer | null = null;
  isLoading = false;
  constructor(private fb: FormBuilder, private authService: AuthService,private snackBar: MatSnackBar) {
    this.editProfileForm = this.fb.group({
      userName: [this.authService.userName, Validators.required],
      userEmail: [this.authService.userEmail, [Validators.required, Validators.email]],
      profileImage: [null]
    });
  }
  onFileChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.selectedImage = reader.result;
        this.editProfileForm.patchValue({
          profileImage: file
        });
      };
      reader.readAsDataURL(file);
    }
  }
  onSubmit(): void {
    if (this.editProfileForm.valid) {
      this.isLoading = true;
      const formData = new FormData();
      formData.append('userName', this.editProfileForm.get('userName')?.value);
      formData.append('userEmail', this.editProfileForm.get('userEmail')?.value);
      if (this.editProfileForm.get('profileImage')?.value) {
        formData.append('profileImage', this.editProfileForm.get('profileImage')?.value);
      }

      this.authService.editProfile(formData).pipe(pluck("user")).subscribe(response => {
        this.isLoading = false;
        this.snackBar.open('Profile updated successfully', 'Close', {
          duration: 3000,
        });
        localStorage.setItem("user",JSON.stringify(response))
      }, error => {
        this.isLoading = false;
        this.handleError(error);
      });
    }
  }
  private handleError(error: any): void {
    console.error('Error updating profile', error);
    this.snackBar.open('Error updating profile', 'Close', {
      duration: 3000,
    });
  }
}
