import { Component, inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { WishListService } from './services/wish-list.service';
import { CartDetaileService } from './services/cart-detaile.service';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,MatButtonModule,HeaderComponent,FooterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'ecommerce';
   wishListService=inject(WishListService);
   cartService=inject(CartDetaileService);
   authService=inject(AuthService);
   ngOnInit(){
    if(this.authService.isLoggedIn){
       this.wishListService.init();
       this.cartService.init();
    }
  }
}
