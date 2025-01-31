import { pluck } from 'rxjs';
import { CommonModule } from '@angular/common';
import { Component, Input, inject, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-messages',
  standalone: true,
  imports:[CommonModule],
  templateUrl: './messages.component.html',
  styleUrl: './messages.component.scss'
})
export class MessagesComponent {
  @Input() msg: any;
  @Input() userId!: string;
  @Input() selectedUser!: any;
   authService=inject(AuthService);
   user: any;

   ngOnInit() {
     this.getUserDetails();
   }
 
   getUserDetails() {
     this.authService.getUserById('678ba115130d3640b1cf1b1f').pipe(pluck("user")).subscribe(
     
       (user:any) => {
         this.user = user;
       },
       (error:any) => {
         console.error('Error fetching user details:', error);
       }
     );
   }
}
