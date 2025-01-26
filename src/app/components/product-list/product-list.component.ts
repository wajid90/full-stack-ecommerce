import { Component, inject, OnInit } from '@angular/core';
import { CustomerService } from '../../services/customer.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Category } from '../../Types/category';
import { Brand } from '../../Types/brand';
import { Product } from '../../Types/product';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ProductCardComponent } from '../product-card/product-card.component';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [FormsModule, CommonModule, ProductCardComponent, MatSnackBarModule],
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent implements OnInit {
  customerService = inject(CustomerService);
  router = inject(Router);
  route = inject(ActivatedRoute);
  snackBar = inject(MatSnackBar);
  authService = inject(AuthService);
  categories: Category[] = [];
  brands: Brand[] = [];
  sortBy: string = 'priceAsc';
  selectedCategoryId: string = '';
  selectedBrandId: string = '';
  search: string = '';
  filteredProducts: Product[] = [];
  totalProducts: number = 0;
  currentPage: number = 1;
  pageSize: number = 8;
  totalPages: number = 1;

  ngOnInit() {
    if (!this.authService.isLoggedIn) {
      this.snackBar.open('Please log in to view products.', 'Close', {
        duration: 3000,
      });
      this.router.navigateByUrl('/login');
      return;
    }

    this.customerService.getCategories().subscribe({
      next: (result: Category[]) => {
        this.categories = [...result];
      },
      error: (error) => {
        // this.snackBar.open('Failed to load categories: ' + error.message, 'Close', {
        //   duration: 3000,
        // });
      }
    });

    this.customerService.getBrands().subscribe({
      next: (result: Brand[]) => {
        this.brands = [...result];
      },
      error: (error) => {
        // this.snackBar.open('Failed to load brands: ' + error.message, 'Close', {
        //   duration: 3000,
        // });
      }
    });

    this.route.queryParams.subscribe((params: any) => {
      this.search = params.search || '';
      this.selectedCategoryId = params.categoryId || '';
      this.filterProducts();
    });
  }

  filterProducts() {
    if (!this.authService.isLoggedIn) {
      this.snackBar.open('Please log in to view products.', 'Close', {
        duration: 3000,
      });
      return;
    }
    this.customerService.getFilteredProducts({
      categoryId: this.selectedCategoryId,
      brandId: this.selectedBrandId,
      search: this.search,
      sort: this.sortBy,
      page: this.currentPage,
      pageSize: this.pageSize,
    }).subscribe({
      next: (response: any) => {
        this.filteredProducts = response.products;
        this.totalProducts = response.total;
        this.totalPages = Math.ceil(this.totalProducts / this.pageSize);
      },
      error: (error) => {
        // this.snackBar.open('Failed to load products: ' + error.message, 'Close', {
        //   duration: 3000,
        // });
      }
    });
  }

  changePage(page: number) {
    if (!this.authService.isLoggedIn) {
      this.snackBar.open('Please log in to view products.', 'Close', {
        duration: 3000,
      });
      return;
    }
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.filterProducts();
    }
  }

  resetFilters() {
    this.selectedCategoryId = '';
    this.selectedBrandId = '';
    this.search = '';
    this.sortBy = 'priceAsc';
    this.currentPage = 1;
    this.filterProducts();
  }
}