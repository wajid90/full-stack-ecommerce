import { WishListService } from './../../services/wish-list.service';
import { Component, inject, Input } from '@angular/core';
import { Product } from '../../Types/product';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import { CartDetaileService } from '../../services/cart-detaile.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AuthService } from '../../services/auth.service';
@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [RouterLink, CommonModule, MatButtonModule, MatIconModule, MatSnackBarModule],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.scss'
})
export class ProductCardComponent {
  @Input() product!:Product;
    route= inject(ActivatedRoute)
    wishListService=inject(WishListService)
    cartService=inject(CartDetaileService);
    authService=inject(AuthService);
    snackBar = inject(MatSnackBar);


    isInWishList(product: Product): boolean {
      const wishListArray = this.wishListService.wishLists;
      if (wishListArray) {
        return wishListArray.find((item: any) => item.productId === product._id) ? true : false;
      } else {
        return false;
      }
    }
  
    addToWishList(prod: Product) {
      if(this.authService.isLoggedIn){
      if (this.isInWishList(prod)) {
        this.wishListService.removeFromWishList(prod._id).subscribe({
          next: (response: any) => {
            this.snackBar.open('Product removed from wishlist!', 'Close', {
              duration: 3000,
            });
            this.wishListService.init();
          },
          error: (error) => {
            this.snackBar.open('Failed to remove product from wishlist: ' + error.message, 'Close', {
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
            this.snackBar.open('Failed to add product to wishlist: ' + error.message, 'Close', {
              duration: 3000,
            });
          }
        });
      }
    }else{
      this.snackBar.open('Please login to add product to wishlist!', 'Close', {
        duration: 3000,
      });
    }
    }
  
    isProductInCart(product: Product): boolean {
      
      return this.cartService.items.find(x => x.product._id === product._id) ? true : false;
    }
  
    addToCartOrRemove(prod: Product) {
      if(this.authService.isLoggedIn){
      if (this.isProductInCart(prod)) {
        this.cartService.removeCartItem(prod._id!).subscribe({
          next: (response: any) => {
            this.snackBar.open('Product removed from cart!', 'Close', {
              duration: 3000,
            });
            this.cartService.init();
          },
          error: (error) => {
            this.snackBar.open('Failed to remove product from cart: ' + error.message, 'Close', {
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
            this.snackBar.open('Failed to add product to cart: ' + error.message, 'Close', {
              duration: 3000,
            });
          }
        });
      }
    }else{
      this.snackBar.open('Please login to add product to wishlist!', 'Close', {
        duration: 3000,
      });
    }
    }
}
