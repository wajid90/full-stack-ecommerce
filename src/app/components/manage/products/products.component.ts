import { pluck } from 'rxjs';
import { AfterViewInit, Component, inject, ViewChild, OnInit } from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ProductService } from '../../../services/product.service';
import { MatButtonModule } from '@angular/material/button';
import { Router, RouterLink } from '@angular/router';
import { Product } from '../../../Types/product';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [MatFormFieldModule, MatInputModule, MatTableModule, MatSortModule, MatPaginatorModule, MatButtonModule, RouterLink, MatSnackBarModule],
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements AfterViewInit, OnInit {
  displayedColumns: string[] = ['id', 'name', 'shortDesription', 'description', 'price', 'discount', 'action'];
  dataSource: MatTableDataSource<Product>;
  router = inject(Router);
  productService = inject(ProductService);
  snackBar = inject(MatSnackBar);
  authService = inject(AuthService);

  constructor() {
    this.dataSource = new MatTableDataSource([] as any);
  }

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  GetAllProduct() {
    if (!this.authService.isLoggedIn || !this.authService.isAdmin) {
      this.snackBar.open('Access denied. Admins only.', 'Close', {
        duration: 3000,
      });
      this.router.navigateByUrl('/login');
      return;
    }
    this.productService.getProducts().subscribe({
      next: (result: any) => {
        this.dataSource.data = result;
      },
      error: (error) => {
        // this.snackBar.open('Failed to load products: ' + error.message, 'Close', {
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
    this.GetAllProduct();
  }

  delete(Id: string) {
    if (!this.authService.isLoggedIn || !this.authService.isAdmin) {
      this.snackBar.open('Access denied. Admins only.', 'Close', {
        duration: 3000,
      });
      this.router.navigateByUrl('/login');
      return;
    }
    this.productService.DeleteProduct(Id).subscribe({
      next: (result: any) => {
        if (result.status) {
          this.snackBar.open('Product deleted successfully.', 'Close', {
            duration: 3000,
          });
          this.GetAllProduct();
        } else {
          this.snackBar.open('Failed to delete product.', 'Close', {
            duration: 3000,
          });
        }
      },
      error: (error) => {
        // this.snackBar.open('Failed to delete product: ' + error.message, 'Close', {
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