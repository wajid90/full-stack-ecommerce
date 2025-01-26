import { Component, ViewChild, OnInit, AfterViewInit, inject } from '@angular/core';
import { Order } from '../../../Types/orders';
import { OrderService } from '../../../services/order.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { CartItem } from '../../../Types/cartItem';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule, MatFormFieldModule, MatInputModule, MatTableModule, MatSortModule, MatPaginatorModule, MatButtonModule, RouterLink, MatSelectModule, MatSnackBarModule],
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss']
})
export class OrdersComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['orderId', 'date', 'status', 'paymentType', 'totalAmount', 'actions'];
  dataSource: MatTableDataSource<Order>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  orderService = inject(OrderService);
  router = inject(Router);
  snackBar = inject(MatSnackBar);
  authService = inject(AuthService);

  constructor() {
    this.dataSource = new MatTableDataSource<Order>([]);
  }

  ngOnInit(): void {
    if (!this.authService.isLoggedIn || !this.authService.isAdmin) {
      this.snackBar.open('Access denied. Admins only.', 'Close', {
        duration: 3000,
      });
      this.router.navigateByUrl('/login');
      return;
    }
    this.getAllOrders();
  }

  getAllOrders() {
    this.orderService.getAllOrders().subscribe({
      next: (orders: Order[]) => {
        orders.forEach(order => {
          order["totalAmmount"] = this.calculateTotalAmount(order.items);
        });
        this.dataSource.data = orders;
      },
      error: (error) => {
        // this.snackBar.open('Error fetching orders: ' + error.message, 'Close', {
        //   duration: 3000,
        // });
      }
    });
  }

  calculateTotalAmount(items: CartItem[]): number {
    return items.reduce((total, item) => total + item.product.price * item.quantity, 0);
  }

  deleteOrder(orderId: string) {
    if (!this.authService.isLoggedIn || !this.authService.isAdmin) {
      this.snackBar.open('Access denied. Admins only.', 'Close', {
        duration: 3000,
      });
      this.router.navigateByUrl('/login');
      return;
    }
    this.orderService.deleteOrder(orderId).subscribe({
      next: (result: any) => {
        if (result.status) {
          this.snackBar.open('Order deleted successfully.', 'Close', {
            duration: 3000,
          });
          this.getAllOrders();
        } else {
          this.snackBar.open('Failed to delete order.', 'Close', {
            duration: 3000,
          });
        }
      },
      error: (error) => {
        this.snackBar.open(error.message, 'Close', {
          duration: 3000,
        });
      }
    });
  }

  updateOrderStatus(orderId: string, status: string) {
    if (!this.authService.isLoggedIn) {
      this.snackBar.open('Please log in to view products.', 'Close', {
        duration: 3000,
      });
      return;
    }
    if (!this.authService.isLoggedIn || !this.authService.isAdmin) {
      this.snackBar.open('Access denied. Admins only.', 'Close', {
        duration: 3000,
      });
      this.router.navigateByUrl('/login');
      return;
    }
    this.orderService.updateOrderStatus(orderId, status).subscribe({
      next: (updatedOrder: Order) => {
        this.snackBar.open('Order status updated successfully.', 'Close', {
          duration: 3000,
        });
        this.getAllOrders();
      },
      error: (error) => {
        // this.snackBar.open('Failed to update order status: ' + error.message, 'Close', {
        //   duration: 3000,
        // });
      }
    });
  }

  viewOrder(orderId: string) {
    this.router.navigate(['/admin/orders', orderId]);
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}