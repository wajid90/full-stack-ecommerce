import { Component, inject } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-customer-profile',
  standalone: true,
  imports: [],
  templateUrl: './customer-profile.component.html',
  styleUrl: './customer-profile.component.scss'
})
export class CustomerProfileComponent {
   authService=inject(AuthService);
   router=inject(Router);
   logout(){
    this.authService.logout();
    this.router.navigateByUrl("/login");
  }
}
