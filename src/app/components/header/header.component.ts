import { Component, inject } from '@angular/core';
import { CategoryService } from '../../services/category.service';
import { Category } from '../../Types/category';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CustomerService } from '../../services/customer.service';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs';
import { SocketService } from '../../services/socket.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, MatIconModule, MatSnackBarModule,CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  categoryService=inject(CategoryService);
  customerService=inject(CustomerService);
  authService=inject(AuthService);
  snackBar = inject(MatSnackBar);
  categoryList:Category[]=[];
  router=inject(Router);
  notificationCount: number = 0;

  constructor(private socketService: SocketService) {}

  incrementNotificationCount(): void {
    this.notificationCount++;
  }

  playNotificationSound(): void {
    const audio = new Audio('assets/notification-ring.mp3');
    audio.play();
  }


  onSearch(e:any){
    if (!this.authService.isLoggedIn) {
      this.snackBar.open('Please log in to search data.', 'Close', {
        duration: 3000,
      });
      return;
    }
    if(e.target.value){
      this.router.navigateByUrl("/products?search="+e.target.value);
    }
  }
  SearchCategory(id: string) {
    if (!this.authService.isLoggedIn) {
      this.snackBar.open('Please log in to search category.', 'Close', {
        duration: 3000,
      });
      return;
    }
    this.router.navigateByUrl("/products?categoryId=" + id);
  }
  logout() {
    this.authService.logout();
    this.router.navigateByUrl("/login");
    this.snackBar.open('Logged out successfully', 'Close', {
      duration: 3000,
    });
  }
  ngOnInit() {
    this.socketService.onMessage().subscribe((data: any) => {
      console.log(data);
      console.log(data.receiverId +"="+ this.authService.getUser()._id);
      
      if (data.receiverId === this.authService.getUser()._id) {
        this.incrementNotificationCount();
        this.playNotificationSound();
      }
    });

    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      if (this.authService.isLoggedIn) {
        this.loadCategories();
      }
    });

    if (this.authService.isLoggedIn) {
      this.loadCategories();
    }
  }

  loadCategories() {
    this.customerService.getCategories().subscribe({
      next: (result: Category[]) => {
        this.categoryList = result;
      },
      error: (error) => {
        this.categoryList = [];
        // this.snackBar.open('Failed to load categories: ' + error.message, 'Close', {
        //   duration: 3000,
        // });
      }
    });
  }
}
