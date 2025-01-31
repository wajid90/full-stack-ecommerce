import { Component, ViewChild } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { CommonModule } from '@angular/common';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule,  MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatButtonModule,
    HttpClientModule],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.scss'
})
export class UserListComponent {
  displayedColumns: string[] = ['avatar', 'name', 'status', 'actions'];
  dataSource = new MatTableDataSource<any>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.authService.getUsers().subscribe(
      (users) => {
        this.dataSource.data = users.filter(user => !user.isAdmin);;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      (error) => {
        console.error('Error fetching users:', error);
      }
    );
  }

  blockUser(userId: string) {
    this.authService.blockUser(userId).subscribe(
      () => {
        this.loadUsers(); // Reload users to update the UI
      },
      (error) => {
        console.error('Error blocking user:', error);
      }
    );
  }

  unblockUser(userId: string) {
    this.authService.unblockUser(userId).subscribe(
      () => {
        this.loadUsers(); // Reload users to update the UI
      },
      (error) => {
        console.error('Error unblocking user:', error);
      }
    );
  }
}
