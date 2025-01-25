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

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [FormsModule,CommonModule,ProductCardComponent,MatButtonModule,MatIconModule],
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
      wishListService=inject(WishListService)
      cartService=inject(CartDetaileService)
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
  constructor(
    private route: ActivatedRoute,
    private productService: ProductService, private customerService: CustomerService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.productId = params.get('id')!;
      this.getProductDetails();
    });
   
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
  getProductDetails(): void {
    this.productService.getProductById(this.productId).subscribe((data: any) => {
      this.product = data;
      this.selectedImage = data.images[0]; 
      this.categoryId=data.categoryId[0];
      this.loading = false;

      this.customerService.getFilteredProducts({
        categoryId: this.categoryId,
        brandId: '',
        search: '',
        sort: 'priceAsc',
        page: 1,
        pageSize: 4,
      })
      .subscribe((response: any) => {
        this.similarProducts = response.products;
      });
    });
  }
  changeImage(image: string): void {
    this.selectedImage = image; // Update the selected image when a thumbnail is clicked
  }

  addToCart(): void {
    console.log('Added to cart', this.product, this.quantity);
    // Logic for adding product to cart
  }

  buyNow(): void {
    console.log('Buying now', this.product);
    // Logic for immediate purchase
  }
}
