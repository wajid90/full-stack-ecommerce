import { Component, inject } from '@angular/core';
import { Order } from '../../Types/orders';
import { OrderService } from '../../services/order.service';
import { CustomerService } from '../../services/customer.service';
import { CommonModule } from '@angular/common';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule, MatSnackBarModule],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.scss'
})
export class OrdersComponent {
  snackBar = inject(MatSnackBar);
  authService = inject(AuthService);
  orders: Order[] = [];

  constructor(private customerService: CustomerService) {}

  ngOnInit(): void {
    if(this.authService.isLoggedIn){
    this.customerService.getOrder().subscribe(
      (orders: any) => {
        this.orders = orders;
      },
      (error) => {
        this.orders=[];
        this.snackBar.open('Failed to load orders: ' + error.message, 'Close', {
          duration: 3000,
        });
      }
    );
  }
}

}
