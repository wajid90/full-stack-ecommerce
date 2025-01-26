import { Component, inject } from '@angular/core';
import { Product } from '../../Types/product';
import { CustomerService } from '../../services/customer.service';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../services/product.service';
import { ProductCardComponent } from '../product-card/product-card.component';
import { WishListService } from '../../services/wish-list.service';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CartDetaileService } from '../../services/cart-detaile.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [FormsModule, CommonModule, ProductCardComponent, MatButtonModule, MatIconModule, MatSnackBarModule],
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.scss'
})
export class ProductDetailComponent {
  product: Product | undefined;
  similarProducts:Product[]=[];
  productId: string = '';
  categoryId: string = '';
  loading: boolean = true;
  selectedImage: string = ''; 
  quantity: number = 1;
  snackBar = inject(MatSnackBar);
  authService = inject(AuthService);
  wishListService=inject(WishListService)
  cartService=inject(CartDetaileService)

  isInWishList(product: Product): boolean {
    const wishListArray = this.wishListService.wishLists;
    return wishListArray.some((item: any) => item.productId === product._id);
  }

  addToWishList(prod: Product) {
    if (!this.authService.isLoggedIn) {
      this.snackBar.open('Please log in to add products to your wishlist.', 'Close', {
        duration: 3000,
      });
      return;
    }

    if (this.isInWishList(prod)) {
      this.wishListService.removeFromWishList(prod._id).subscribe({
        next: (response: any) => {
          this.snackBar.open('Product removed from wishlist!', 'Close', {
            duration: 3000,
          });
          this.wishListService.init();
        },
        error: (error) => {
          this.snackBar.open(error.message, 'Close', {
            duration: 3000,
          });
        }
      });
    } else {
      this.wishListService.addToWishList(prod._id).subscribe({
        next: (response: any) => {
          this.snackBar.open('Product added to wishlist!', 'Close', {
            duration: 3000,
          });
          this.wishListService.init();
        },
        error: (error) => {
          this.snackBar.open( error.message, 'Close', {
            duration: 3000,
          });
        }
      });
    }
  }

  isProductInCart(product: Product): boolean {
    return this.cartService.items.find(x => x.product._id === product._id) ? true : false;
  }

  addToCartOrRemove(prod: Product) {
    if (!this.authService.isLoggedIn) {
      this.snackBar.open('Please log in to add products to your cart.', 'Close', {
        duration: 3000,
      });
      return;
    }

    if (this.isProductInCart(prod)) {
      this.cartService.removeCartItem(prod._id!).subscribe({
        next: (response: any) => {
          this.snackBar.open('Product removed from cart!', 'Close', {
            duration: 3000,
          });
          this.cartService.init();
        },
        error: (error) => {
          this.snackBar.open(error.message, 'Close', {
            duration: 3000,
          });
        }
      });
    } else {
      this.cartService.addToCart(prod._id!).subscribe({
        next: (response: any) => {
          this.snackBar.open('Product added to cart!', 'Close', {
            duration: 3000,
          });
          this.cartService.init();
        },
        error: (error) => {
          this.snackBar.open(error.message, 'Close', {
            duration: 3000,
          });
        }
      });
    }
  }

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private customerService: CustomerService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.productId = params.get('id')!;
      this.getProductDetails();
    });
  }

  getProductDetails(): void {
    this.productService.getProductById(this.productId).subscribe({
      next: (data: any) => {
        this.product = data;
        this.selectedImage = data.images[0];
        this.categoryId = data.categoryId[0];
        this.loading = false;

        this.customerService.getFilteredProducts({
          categoryId: this.categoryId,
          brandId: '',
          search: '',
          sort: 'priceAsc',
          page: 1,
          pageSize: 4,
        }).subscribe({
          next: (response: any) => {
            this.similarProducts = response.products;
          },
          error: (error) => {
            this.snackBar.open('Failed to load similar products: ' + error.message, 'Close', {
              duration: 3000,
            });
          }
        });
      },
      error: (error) => {
        // this.snackBar.open('Failed to load product details: ' + error.message, 'Close', {
        //   duration: 3000,
        // });
        this.loading = false;
      }
    });
  }

  changeImage(image: string): void {
    this.selectedImage = image; // Update the selected image when a thumbnail is clicked
  }

  addToCart(): void {
    console.log('Added to cart', this.product, this.quantity);
  }

  buyNow(): void {
    console.log('Buying now', this.product);
  }
}
