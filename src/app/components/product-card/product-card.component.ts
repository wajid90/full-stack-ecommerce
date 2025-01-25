import { WishListService } from './../../services/wish-list.service';
import { Component, inject, Input } from '@angular/core';
import { Product } from '../../Types/product';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import { CartDetaileService } from '../../services/cart-detaile.service';
@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [RouterLink,CommonModule,MatButtonModule,MatIconModule],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.scss'
})
export class ProductCardComponent {
  @Input() product!:Product;
    route= inject(ActivatedRoute)
    wishListService=inject(WishListService)
    cartService=inject(CartDetaileService);
    isInWishList(product: Product): boolean {
      const wishListArray = (this.wishListService.wishLists && this.wishListService.wishLists);
      return wishListArray.some((item:any) => item.productId === product._id);
   
    }

  addToWishList(prod: Product) {
   if(this.isInWishList(prod)){
      this.wishListService.removeFromWishList(prod._id).subscribe((response:any) => {
        alert('Product remove from wishlist!');
        this.wishListService.init();
      });
   }else{
    this.wishListService.addToWishList(prod._id).subscribe((response:any) => {
      alert('Product add from wishlist!');
      this.wishListService.init();
    });
   }
  }
  isProductInCart(product:Product){
    
    if(this.cartService.items.find(x=>x.product._id==product._id)){
      return true;
    }else{
      return false;
    }
  }
  addToCartOrRemove(prod: Product) {
    if(this.isProductInCart(prod)){
      this.cartService.removeCartItem(prod._id!).subscribe((response:any) => {
        alert('Product remove from cart!');
        this.cartService.init();
      });
   }else{
    this.cartService.addToCart(prod._id!).subscribe((response:any) => {
      alert('Product added to cart!');
      this.cartService.init();
    });
   }
  }
}
