import { Component, inject } from '@angular/core';
import { Product, WishListItem } from '../../Types/product';
import { WishListService } from '../../services/wish-list.service';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-wish-lists',
  standalone: true,
  imports: [MatIconModule,CommonModule,MatSnackBarModule],
  templateUrl: './wish-lists.component.html',
  styleUrl: './wish-lists.component.scss'
})
export class WishListsComponent {
  wishList: WishListItem[] = []; 
 authService=inject(AuthService);
 snackBar=inject(MatSnackBar);
  constructor(private wishListService: WishListService) {}

  ngOnInit(): void {
    if (!this.authService.isLoggedIn) {
      this.snackBar.open('Please log in to view products.', 'Close', {
        duration: 3000,
      });
      return;
    }
    this.loadWishList();
  }

  loadWishList() {
    this.wishListService.getWishLists().subscribe((result: { wishList: WishListItem[] }) => {
      this.wishList = result.wishList;
    });
  }

  removeFromWishList(productId: string) {
    if (!this.authService.isLoggedIn) {
      this.snackBar.open('Please log in to view products.', 'Close', {
        duration: 3000,
      });
      return;
    }
    this.wishListService.removeFromWishList(productId).subscribe(() => {
      this.wishList = this.wishList.filter((item) => item.productId._id !== productId);
    });
  }

  addToCart(product: Product) {
    console.log("add to cart");
    // this.cartService.addToCart(product).subscribe(() => {
    //   alert(`${product.name} has been added to your cart.`);
    // });
  }
}
