import { Component, inject } from '@angular/core';
import { CustomerService } from '../../services/customer.service';
import { Product } from '../../Types/product';
import { CommonModule } from '@angular/common';
import { ProductCardComponent } from '../product-card/product-card.component';
import { CarouselModule, OwlOptions } from 'ngx-owl-carousel-o';
import { HeaderComponent } from '../header/header.component';
import { AuthService } from '../../services/auth.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, ProductCardComponent, CarouselModule, HeaderComponent, MatSnackBarModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
 customerService=inject(CustomerService);
 authService=inject(AuthService);
 snackBar = inject(MatSnackBar);
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
ngOnInit() {
  if (!this.authService.isLoggedIn) {
    this.snackBar.open('Please log in to view products.', 'Close', {
      duration: 3000,
    });
    return;
  }
    this.customerService.getNewFeaturedProducts().subscribe({
      next: (result: Product[]) => {
        this.featuredProducts = result;
        this.bannerImages = result;
      },
      error: (error) => {
        // this.snackBar.open('Failed to load featured products: ' + error.message, 'Close', {
        //   duration: 3000,
        // });
      }
    });

    this.customerService.getNewProducts().subscribe({
      next: (result: Product[]) => {
        this.newProducts = result;
        this.bannerImages = result;
      },
      error: (error) => {
        // this.snackBar.open('Failed to load new products: ' + error.message, 'Close', {
        //   duration: 3000,
        // });
      }
    });

}
}
