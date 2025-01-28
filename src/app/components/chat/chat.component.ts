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
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, MatIcon],
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
})
export class ChatComponent implements OnInit, OnDestroy {
  chatForm: FormGroup;
  messages: {
    sender: { _id: string; name: string };
    receiver?: { _id: string; name: string };
    message: string;
    room: string;
  }[] = [];
  userId: string = '';
  userName: string = '';
  room: string = 'watch-ecommerce-shop';
  receiverId: string = '678ba115130d3640b1cf1b1f';

  @ViewChild('messageContainer') private messageContainer!: ElementRef;

  constructor(
    private fb: FormBuilder,
    private socketService: SocketService,
    public authService: AuthService,
    private cdr: ChangeDetectorRef
  ) {
    this.chatForm = this.fb.group({
      message: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    const user = this.authService.getUser();
    if (!user) {
      return;
    }

    this.userId = user._id;
    this.userName = user.name;

    // Join the chat room
    this.socketService.joinRoom(this.userId, this.room);

    // Fetch chat history
    this.socketService.getChatHistory(this.room).subscribe((messages) => {
      this.messages = messages;
      this.scrollToBottom();
    });

    // Listen for new messages
    this.socketService.onMessage((data: any) => {
      this.messages = [...this.messages, data]; // Add new message to the array
      this.scrollToBottom();
      this.cdr.detectChanges(); // Trigger UI update
    });
  }

  sendMessage(): void {
    if (this.chatForm.valid) {
      const message = this.chatForm.get('message')?.value;

      // Send the message to the server
      this.socketService.sendMessage(
        this.userId,
        this.room,
        message,
        this.receiverId,
        this.userName
      );

      // Reset the input field
      this.chatForm.reset();

      // Let WebSocket handle adding the message to the `messages` array
      this.scrollToBottom();
    }
  }

  private scrollToBottom(): void {
    try {
      const container = this.messageContainer.nativeElement;
      container.scrollTop = container.scrollHeight+10;
    } catch (err) {
      console.error('Scroll error:', err);
    }
  }

  ngOnDestroy(): void {
    this.socketService.disconnect();
  }

  trackByMessageId(index: number, message: any): string {
    return `${message.sender?._id}-${message.message}-${index}`;
  }
}
