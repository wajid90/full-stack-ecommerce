import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { io, Socket } from 'socket.io-client';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  private socket: Socket;

  constructor(private http: HttpClient) {
    this.socket = io('http://localhost:3000');
  }

  joinRoom(userId: string, room: string) {
    this.socket.emit('join', { userId, room });
  }

  sendMessage(userId: string, room: string, message: string, receiverId: string, userName: string) {
    this.socket.emit('message', { userId, room, message, receiverId, userName });
  }
  getUsers(): Observable<any[]> {
    return new Observable(observer => {
      this.socket.emit('getUsers');
      this.socket.on('users', (users) => {
        observer.next(users);
      });
    });
  }
  onMessage(): Observable<any> {
    return new Observable(observer => {
      this.socket.on('message', (data) => {
        observer.next(data);
      });
    });
  }

  disconnect() {
    this.socket.disconnect();
  }
  getChatHistory(room: string): Observable<any> {
    return this.http.get(`${environment.apiUrl}/history/${room}`);
  }
  onBlocked(): Observable<any> {
    return new Observable(observer => {
      this.socket.on('blocked', (data) => {
        observer.next(data);
      });
    });
  }

}
