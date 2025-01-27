import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-contact-us',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule,MatSnackBarModule,MatFormFieldModule,MatInputModule,MatButtonModule,MatProgressSpinnerModule],
  templateUrl: './contact-us.component.html',
  styleUrl: './contact-us.component.scss'
})
export class ContactUsComponent {
  contactForm: FormGroup;
  isLoading: boolean = false;
  authService=inject(AuthService);
  router=inject(Router);
  constructor(private fb: FormBuilder, private snackBar: MatSnackBar,   private http: HttpClient) {
    this.contactForm = this.fb.group({
      name: [null, [Validators.required]],
      email: [null, [Validators.required, Validators.email]],
      message: [null, [Validators.required, Validators.minLength(10)]]
    });
  }

  onSubmit() {
    console.log(this.contactForm.valid);
    if (this.contactForm.valid) {
      this.isLoading = true;
      if (this.authService.isLoggedIn) {
      this.authService.contactUs(this.contactForm.value).subscribe({
        next: () => {
          this.snackBar.open('Message sent successfully!', 'Close', {
            duration: 3000,
          });
          this.isLoading = false;
          this.contactForm.reset();
        },
        error: () => {
          this.snackBar.open('Failed to send message. Please try again later.', 'Close', {
            duration: 3000,
          });
          this.isLoading = false;
        }
      });
    } else {
      this.snackBar.open('Please fill out the form correctly.', 'Close', {
        duration: 3000,
      });
      this.isLoading = false;
    }
  }else{
    this.snackBar.open('please sign In first ..', 'Close', {
      duration: 3000,
    });
    this.router.navigateByUrl("/login");
    this.isLoading = false;
  }
  }

}
