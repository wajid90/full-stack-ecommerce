import { Component, inject, OnInit } from '@angular/core';
import { FormArray, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Brand } from '../../../Types/brand';
import { Category } from '../../../Types/category';
import { ProductService } from '../../../services/product.service';
import { BrandService } from '../../../services/brand.service';
import { CategoryService } from '../../../services/category.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [ReactiveFormsModule, MatInputModule, MatButtonModule, MatFormFieldModule, MatSelectModule, MatCheckboxModule, MatSnackBarModule],
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.scss']
})
export class ProductFormComponent implements OnInit {
  formBuilder = inject(FormBuilder);
  categories: Category[] = [];
  isEdit: boolean = false;
  brands: Brand[] = [];
  productService = inject(ProductService);
  brandService = inject(BrandService);
  categoryService = inject(CategoryService);
  router = inject(Router);
  route = inject(ActivatedRoute);
  snackBar = inject(MatSnackBar);
  authService = inject(AuthService);
  id: string = "";
  productForm = this.formBuilder.group({
    name: [null, [Validators.required, Validators.minLength(5)]],
    shortDesription: [null, [Validators.required, Validators.minLength(10)]],
    description: [null, [Validators.required, Validators.minLength(50)]],
    price: [null, [Validators.required]],
    discount: [],
    images: this.formBuilder.array([]),
    categoryId: [null, [Validators.required]],
    brandId: [null, [Validators.required]],
    isFeatured: [false],
    isNew: [false],
  });

  get images() {
    return this.productForm.get('images') as FormArray;
  }

  Categories() {
    if (!this.authService.isLoggedIn || !this.authService.isAdmin) {
      this.snackBar.open('Access denied. Admins only.', 'Close', {
        duration: 3000,
      });
      this.router.navigateByUrl('/login');
      return;
    }
    this.categoryService.getCategories().subscribe({
      next: (result: any) => {
        this.categories = result;
      },
      error: (error) => {
        this.snackBar.open('Failed to load categories: ' + error.message, 'Close', {
          duration: 3000,
        });
      }
    });
  }

  getProduct(Id: string) {
    if (!this.authService.isLoggedIn || !this.authService.isAdmin) {
      this.snackBar.open('Access denied. Admins only.', 'Close', {
        duration: 3000,
      });
      this.router.navigateByUrl('/login');
      return;
    }
    this.productService.getProductById(Id).subscribe({
      next: (result: any) => {
        this.productForm.patchValue(result as any);
      },
      error: (error) => {
        this.snackBar.open('Failed to load product details: ' + error.message, 'Close', {
          duration: 3000,
        });
      }
    });
  }

  Brands() {
    if (!this.authService.isLoggedIn || !this.authService.isAdmin) {
      this.snackBar.open('Access denied. Admins only.', 'Close', {
        duration: 3000,
      });
      this.router.navigateByUrl('/login');
      return;
    }
    this.brandService.getBrands().subscribe({
      next: (result: any) => {
        this.brands = result;
      },
      error: (error) => {
        this.snackBar.open('Failed to load brands: ' + error.message, 'Close', {
          duration: 3000,
        });
      }
    });
  }

  addImage() {
    this.images.push(this.formBuilder.control(null));
  }

  removeImage() {
    this.images.removeAt(this.images.length - 1);
  }

  add() {
    if (!this.productForm.valid) {
      this.snackBar.open('Please fill out the form correctly.', 'Close', {
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
    let value = this.productForm.value;
    this.productService.AddProduct(value as any).subscribe({
      next: (result: any) => {
        if (result.status) {
          this.router.navigateByUrl("/admin/products");
        }
      },
      error: (error) => {
        // this.snackBar.open('Failed to add product: ' + error.message, 'Close', {
        //   duration: 3000,
        // });
      }
    });
  }

  update() {
    if (!this.productForm.valid) {
      this.snackBar.open('Please fill out the form correctly.', 'Close', {
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
    let value = this.productForm.value;
    this.productService.UpdateProduct(this.id, value as any).subscribe({
      next: (result: any) => {
        if (result.status) {
          this.router.navigateByUrl("/admin/products");
        }
      },
      error: (error) => {
        // this.snackBar.open('Failed to update product: ' + error.message, 'Close', {
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

    this.addImage();
    this.Brands();
    this.Categories();
    this.id = this.route.snapshot.params["id"];
    if (this.id) {
      this.isEdit = true;
      this.getProduct(this.id);
    }
  }
}