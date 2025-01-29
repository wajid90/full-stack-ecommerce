import { Component, EventEmitter, Output } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { SocketService } from '../../services/socket.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {
  users: any[] = [];
  searchQuery: string = '';
  selectedUser: any;

  @Output() userSelected = new EventEmitter<any>();

  constructor(private socketService: SocketService, private authService: AuthService) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.socketService.getUsers().subscribe((users: any[]) => {
      this.users = users.filter(user => !user.isAdmin); // Exclude admins
    });
  }

  filteredUsers(): any[] {
    return this.users.filter(user => user.name.toLowerCase().includes(this.searchQuery.toLowerCase()));
  }

  selectUser(user: any): void {
    this.selectedUser = user;
    this.userSelected.emit(user);
  }
}
