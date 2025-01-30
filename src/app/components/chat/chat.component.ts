import { AuthService } from './../../services/auth.service';
import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnInit,
  OnDestroy,
  ViewChild,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatIcon } from '@angular/material/icon';
import { SocketService } from '../../services/socket.service';
import { MessagesComponent } from '../messages/messages.component';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, MatIcon, MessagesComponent, SidebarComponent],
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
})
export class ChatComponent implements OnInit, OnDestroy {
  chatForm: FormGroup;
  messages: { sender: { _id: string, name: string }, receiver?: { _id: string, name: string }, message: string, room: string }[] = [];
  userId: string = '';
  userName: string = '';
  room: string = '';
  selectedUser: any=null;
  users: any[] = [];
  private subscriptions: Subscription = new Subscription();

  @ViewChild('messageContainer') private messageContainer!: ElementRef;

  constructor(
    private fb: FormBuilder,
    private socketService: SocketService,
    public authService: AuthService,
    private cdr: ChangeDetectorRef
  ) {
    this.chatForm = this.fb.group({
      message: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.initializeChat();
    this.loadUsers();
    
  }
  loadUsers(): void {
    this.subscriptions.add(
      this.socketService.getUsers().subscribe((users) => {
        this.users = users;
        this.cdr.detectChanges();
      })
    );
  }
  onUserSelected(user: any): void {
    this.selectedUser = user;
    this.room = this.createRoomId(this.userId, user._id);
    this.initializeChat();
  }

  createRoomId(userId1: string, userId2: string): string {
    return [userId1, userId2].sort().join('-');
  }

  initializeChat(): void {
    const user = this.authService.getUser();
    if (!user) {
      return;
    }
    this.userId = user._id;
    this.userName = user.name;
    if(this.selectedUser===null){
      this.socketService.joinRoom(this.userId, '678ba115130d3640b1cf1b1f-'+this.userId);
   }else{
     this.socketService.joinRoom(this.userId, this.room);
   }
    
    this.subscriptions.unsubscribe();
    this.subscriptions = new Subscription();
    if(this.selectedUser !==null){
      this.subscriptions.add(
        this.socketService.getChatHistory(this.room).subscribe((messages) => {
  
          this.messages = messages;
          this.scrollToBottom();
        })
      );
     }else{
      this.subscriptions.add(
        this.socketService.getChatHistory('678ba115130d3640b1cf1b1f-'+this.userId).subscribe((messages) => {
          this.messages = messages;
          this.scrollToBottom();
        })
      );
     }

    this.subscriptions.add(
      this.socketService.onMessage().subscribe((data: any) => {
       
        if(this.selectedUser==null){
          const nMessage = {
            sender: { _id: data.userId, name: data.userName },
            receiver: { _id: data.receiverId, name: 'wajid' },
            message: data.message,
            room: this.room
          };
          this.messages.push(nMessage);
        }else{
          const newMessage = {
            sender: { _id: data.userId, name: data.userName },
            receiver: { _id: data.receiverId, name: this.selectedUser ? this.selectedUser.name : 'wajid' },
            message: data.message,
            room: this.room
          };
          this.messages.push(newMessage);
        }
        this.scrollToBottom();
        this.cdr.detectChanges();
      })
    );
  }

  sendMessage(): void {
    if (this.chatForm.valid) {
      const message = this.chatForm.get('message')?.value;
      const receiverName = this.selectedUser ? this.selectedUser.name : 'wajid';
      const receiverId = this.selectedUser ? this.selectedUser._id : '678ba115130d3640b1cf1b1f';

      if (this.selectedUser === null) {
        this.socketService.sendMessage(this.userId, '678ba115130d3640b1cf1b1f-' + this.userId, message, '678ba115130d3640b1cf1b1f', this.userName);
      } else {
        this.socketService.sendMessage(this.userId, this.room, message, this.selectedUser?._id, this.userName);
      }

      // const newMessage = {
      //   sender: { _id: this.userId, name: this.userName },
      //   receiver: { _id: receiverId, name: receiverName },
      //   message: message,
      //   room: this.room
      // };
      // this.messages.push(newMessage);
      this.chatForm.reset();
      this.scrollToBottom();
      this.cdr.detectChanges();
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
    this.socketService.disconnect();
  }

  trackByMessageId(index: number, message: any): string {
    return `${message.sender?._id}-${message.message}-${index}`;
  }

  private scrollToBottom(): void {
    try {
      setTimeout(() => {
        const container = this.messageContainer.nativeElement;
        container.scrollTop = container.scrollHeight;
      }, 0);
    } catch (err) {
      console.error('Scroll error:', err);
    }
  }
}