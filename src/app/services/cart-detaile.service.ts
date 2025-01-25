import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, of, pluck } from 'rxjs';
import { environment } from '../../environments/environment';
import { CartItem } from '../Types/cartItem';

@Injectable({
  providedIn: 'root'
})
export class CartDetaileService {
  items:CartItem[]=[]
  private apiUrl = `${environment.apiUrl}/cart`;

  constructor(private http: HttpClient) {}

  init() {
    this.getCartItems().pipe(
      map((result: any) => {
        if (result && result.products) {
          return result.products.map((item: any) => {
            return {
              product: {
                _id: item.productId._id,
                name: item.productId.name,
                shortDescription: item.productId.shortDesription,  
                description: item.productId.description,
                price: item.productId.price,
                discount: item.productId.discount,
                images: item.productId.images,
                categoryId: item.productId.categoryId,
                brandId: item.productId.brandId,
                isFeatured: item.productId.isFeatured,
                isNew: item.productId.isNew
              },
              quantity: item.quantity
            } as CartItem;
          });
        } else {
          console.error('No products found in response.');
          return [];
        }
      })
    ).subscribe(
      (cartItems: CartItem[]) => {
        this.items = cartItems;
      },
      (error) => {
        console.error('Error fetching cart items:', error);
      }
    );
  }
  getCartItems(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}`).pipe(
      map((response: any) => {
        return response;
      }),
      catchError((error) => {
        console.error('Error in getCartItems:', error);
        return of([]); 
      })
    );
  }

  updateCartItem(productId: string, quantity: number): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/update`, { productId, quantity });
  }

  removeCartItem(productId: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/remove/${productId}`);
  }
  addToCart(productId: string, quantity: number = 1): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/add`, { productId, quantity });
  }
}
