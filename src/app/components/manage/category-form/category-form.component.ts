import { ActivatedRoute, Router } from '@angular/router';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { CategoryService } from '../../../services/category.service';
import { pluck } from 'rxjs';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-category-form',
  standalone: true,
  imports: [FormsModule, MatInputModule, MatButtonModule, MatSnackBarModule],
  templateUrl: './category-form.component.html',
  styleUrls: ['./category-form.component.scss']
})
export class CategoryFormComponent implements OnInit {
  name: string = "";
  categoryService = inject(CategoryService);
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
      this.categoryService.getCategoryById(id).pipe(pluck("category")).subscribe({
        next: (result: any) => {
          this.name = result.name;
        },
        error: (error) => {
          // this.snackBar.open('Failed to load category details: ' + error.message, 'Close', {
          //   duration: 3000,
          // });
        }
      });
    }
  }

  add() {
    if (!this.name) {
      this.snackBar.open('Category name is required.', 'Close', {
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
    this.categoryService.AddCategory(this.name).subscribe({
      next: (result: any) => {
        this.router.navigateByUrl("/admin/categories");
      },
      error: (error) => {
        // this.snackBar.open('Failed to add category: ' + error.message, 'Close', {
        //   duration: 3000,
        // });
      }
    });
  }

  update() {
    if (!this.name) {
      this.snackBar.open('Category name is required.', 'Close', {
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
    this.categoryService.UpdateCategory(paramId, this.name).subscribe({
      next: (result: any) => {
        if (result.status) {
          this.router.navigateByUrl("/admin/categories");
        } else {
          this.snackBar.open('Failed to update category.', 'Close', {
            duration: 3000,
          });
        }
      },
      error: (error) => {
        // this.snackBar.open('Failed to update category: ' + error.message, 'Close', {
        //   duration: 3000,
        // });
      }
    });
  }
}