import { ActivatedRoute, Router } from '@angular/router';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { BrandService } from '../../../services/brand.service';
import { pluck } from 'rxjs';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-brand-form',
  standalone: true,
  imports: [FormsModule, MatInputModule, MatButtonModule, MatSnackBarModule],
  templateUrl: './brand-form.component.html',
  styleUrls: ['./brand-form.component.scss']
})
export class BrandFormComponent implements OnInit {
  name: string = "";
  brandService = inject(BrandService);
  router = inject(Router);
  route = inject(ActivatedRoute);
  snackBar = inject(MatSnackBar);
  authService = inject(AuthService);
  isEdit: boolean = false;

  ngOnInit() {
    if (!this.authService.isLoggedIn || !this.authService.isAdmin) {
      this.snackBar.open('Access denied. Admins only.', 'Close', {
        duration: 3000,
      });
      this.router.navigateByUrl('/login');
      return;
    }

    let id = this.route.snapshot.params["id"];
    if (id) {
      this.isEdit = true;
      this.brandService.getBrandById(id).pipe(pluck("brand")).subscribe({
        next: (result: any) => {
          this.name = result.name;
        },
        error: (error) => {
          // this.snackBar.open('Failed to load brand details: ' + error.message, 'Close', {
          //   duration: 3000,
          // });
        }
      });
    }
  }

  add() {
    if (!this.name) {
      this.snackBar.open('Brand name is required.', 'Close', {
        duration: 3000,
      });
      return;
    }
    if (!this.authService.isLoggedIn || !this.authService.isAdmin) {
      this.snackBar.open('Access denied. Admins only.', 'Close', {
        duration: 3000,
      });
      this.router.navigateByUrl('/login');
      return;
    }
    this.brandService.AddBrand(this.name).subscribe({
      next: (result: any) => {
        this.router.navigateByUrl("/admin/brands");
      },
      error: (error) => {
        // this.snackBar.open('Failed to add brand: ' + error.message, 'Close', {
        //   duration: 3000,
        // });
      }
    });
  }

  update() {
    if (!this.name) {
      this.snackBar.open('Brand name is required.', 'Close', {
        duration: 3000,
      });
      return;
    }
    if (!this.authService.isLoggedIn || !this.authService.isAdmin) {
      this.snackBar.open('Access denied. Admins only.', 'Close', {
        duration: 3000,
      });
      this.router.navigateByUrl('/login');
      return;
    }
    let paramId = this.route.snapshot.params["id"];
    this.brandService.UpdateBrand(paramId, this.name).subscribe({
      next: (result: any) => {
        if (result.status) {
          this.router.navigateByUrl("/admin/brands");
        } else {
          this.snackBar.open('Failed to update brand.', 'Close', {
            duration: 3000,
          });
        }
      },
      error: (error) => {
        // this.snackBar.open('Failed to update brand: ' + error.message, 'Close', {
        //   duration: 3000,
        // });
      }
    });
  }
}