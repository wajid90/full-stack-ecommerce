import { Component, inject } from '@angular/core';
import { CustomerService } from '../../services/customer.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Category } from '../../Types/category';
import { Brand } from '../../Types/brand';
import { Product } from '../../Types/product';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ProductCardComponent } from '../product-card/product-card.component';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [FormsModule,CommonModule,ProductCardComponent],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.scss'
})
export class ProductListComponent {
  customerService = inject(CustomerService);
  router = inject(Router);
  route=inject(ActivatedRoute);
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
    this.customerService.getCategories().subscribe((result: Category[]) => {
      this.categories = [...result];
    });

    this.customerService.getBrands().subscribe((result: Brand[]) => {
      this.brands = [...result];
    });
    this.route.queryParams.subscribe((x:any)=>{
     
       this.search=x.search || '';
       this.selectedCategoryId=x.categoryId || '';
       this.filterProducts();
    })

  }

  filterProducts() {
    this.customerService.getFilteredProducts({
        categoryId: this.selectedCategoryId,
        brandId: this.selectedBrandId,
        search: this.search,
        sort: this.sortBy,
        page: this.currentPage,
        pageSize: this.pageSize,
      })
      .subscribe((response: any) => {
        this.filteredProducts = response.products;
        this.totalProducts = response.total;
        this.totalPages = Math.ceil(this.totalProducts / this.pageSize);
      });
  }

  changePage(page: number) {
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
