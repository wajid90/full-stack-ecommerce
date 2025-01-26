import { pluck } from 'rxjs';
import { AfterViewInit, Component, inject, ViewChild, OnInit } from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CategoryService } from '../../../services/category.service';
import { MatButtonModule } from '@angular/material/button';
import { Router, RouterLink } from '@angular/router';
import { Category } from '../../../Types/category';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [MatFormFieldModule, MatInputModule, MatTableModule, MatSortModule, MatPaginatorModule, MatButtonModule, RouterLink, MatSnackBarModule],
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss']
})
export class CategoriesComponent implements AfterViewInit, OnInit {
  displayedColumns: string[] = ['id', 'name', 'action'];
  dataSource: MatTableDataSource<Category>;
  router = inject(Router);
  categoryService = inject(CategoryService);
  snackBar = inject(MatSnackBar);
  authService = inject(AuthService);

  constructor() {
    this.dataSource = new MatTableDataSource([] as any);
  }

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  GetAllCategory() {
    this.categoryService.getCategories().subscribe({
      next: (result: any) => {
        this.dataSource.data = result;
      },
      error: (error) => {
        // this.snackBar.open('Failed to load categories: ' + error.message, 'Close', {
        //   duration: 3000,
        // });
      }
    });
  }

  ngOnInit() {
    if (!this.authService.isLoggedIn || !this.authService.isAdmin) {
      this.snackBar.open('Access denied. Admins only.', 'Close', {
        duration: 3000,
      });
      this.router.navigateByUrl('/login');
      return;
    }
    this.GetAllCategory();
  }

  delete(Id: string) {
    if (!this.authService.isLoggedIn || !this.authService.isAdmin) {
      this.snackBar.open('Access denied. Admins only.', 'Close', {
        duration: 3000,
      });
      this.router.navigateByUrl('/login');
      return;
    }
    this.categoryService.DeleteCategory(Id).subscribe({
      next: (result: any) => {
        if (result.status) {
          this.snackBar.open('Category deleted successfully.', 'Close', {
            duration: 3000,
          });
          this.GetAllCategory();
        } else {
          this.snackBar.open('Failed to delete category.', 'Close', {
            duration: 3000,
          });
        }
      },
      error: (error) => {
        // this.snackBar.open('Failed to delete category: ' + error.message, 'Close', {
        //   duration: 3000,
        // });
      }
    });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}