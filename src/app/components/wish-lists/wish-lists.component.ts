import { Component } from '@angular/core';
import { Product, WishListItem } from '../../Types/product';
import { WishListService } from '../../services/wish-list.service';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-wish-lists',
  standalone: true,
  imports: [MatIconModule,CommonModule],
  templateUrl: './wish-lists.component.html',
  styleUrl: './wish-lists.component.scss'
})
export class WishListsComponent {
  wishList: WishListItem[] = [];  // Change the type to WishListItem[]

  constructor(private wishListService: WishListService) {}

  ngOnInit(): void {
    this.loadWishList();
  }

  loadWishList() {
    this.wishListService.getWishLists().subscribe((result: { wishList: WishListItem[] }) => {
      this.wishList = result.wishList;
    });
  }

  removeFromWishList(productId: string) {
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
