
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Order } from '../Types/orders';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
http=inject(HttpClient);
private apiUrl = `${environment.apiUrl}/orders`;
  constructor() { }
  getAllOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(this.apiUrl);
  }

  deleteOrder(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
  updateOrderStatus(id: string, status: string): Observable<Order> {
    return this.http.put<Order>(`${this.apiUrl}/${id}`, { status });
  }
}
