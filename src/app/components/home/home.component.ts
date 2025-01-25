import { CartDetaileService } from './../../services/cart-detaile.service';
import { Component, inject } from '@angular/core';
import { CustomerService } from '../../services/customer.service';
import { Product } from '../../Types/product';
import { CommonModule } from '@angular/common';
import { ProductCardComponent } from '../product-card/product-card.component';
import { CarouselModule, OwlOptions } from 'ngx-owl-carousel-o';
import { HeaderComponent } from '../header/header.component';
import { WishListService } from '../../services/wish-list.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule,ProductCardComponent,CarouselModule,CommonModule,HeaderComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
 customerService=inject(CustomerService);
 wishListService=inject(WishListService);
 cartService=inject(CartDetaileService);
 newProducts:Product[]=[];
 featuredProducts:Product[]=[]
 wishListProducts:Product[]=[]
 bannerImages:Product[]=[]
 customOptions: OwlOptions = {
  loop: true,
  mouseDrag: false,
  touchDrag: false,
  pullDrag: false,
  dots: false,
  autoplay: true,
  autoplayTimeout: 3000, 
  items: 1 ,
  navSpeed: 700,
  navText: ['', ''],
  nav: true
}
trackByIndex(index: number, item: any): number {
  return index; 
}
 ngOnInit(){
  this.customerService.getNewFeaturedProducts().subscribe((result:Product[])=>{
    this.featuredProducts=result;
    this.bannerImages=result;
  })
  this.customerService.getNewProducts().subscribe((result:Product[])=>{
    this.newProducts=result;
    this.bannerImages=result;
  })
  this.wishListService.init();
  this.cartService.init();
 }
}
