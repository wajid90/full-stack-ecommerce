import { CustomerService } from './../../services/customer.service';
import { Component, inject } from '@angular/core';
import { CartDetaileService } from '../../services/cart-detaile.service';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { CartItem } from '../../Types/cartItem';
import { map } from 'rxjs';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { OrderService } from '../../services/order.service';
import { AuthService } from '../../services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';

declare var Razorpay: any;

@Component({
  selector: 'app-cart-detaile',
  standalone: true,
  imports: [CommonModule,MatIconModule,ReactiveFormsModule,FormsModule],
  templateUrl: './cart-detaile.component.html',
  styleUrl: './cart-detaile.component.scss'
})
export class CartDetaileComponent {
  constructor(){}
  cartItems: CartItem[] = []; 
  checkOut: number =0;
  formBuilder=inject(FormBuilder);
  cartService=inject(CartDetaileService);
  customerService=inject(CustomerService);
  orderService=inject(OrderService);
  authService = inject(AuthService);
  snackBar = inject(MatSnackBar);
  paymentMethod: string = 'cash';
  shippingForm = this.formBuilder.group({
    fullName: ['', Validators.required],
    email: ['', Validators.required],
    phone: ['', Validators.required],
    address: ['', Validators.required],
    city: ['', Validators.required],
    postalCode: ['', Validators.required],
    country: ['', Validators.required]
  });
  paymentForm = this.formBuilder.group({
    cardNumber: ['', Validators.required],
    expirationDate: ['', Validators.required],
    cvv: ['', Validators.required]
  });

  ngOnInit(): void {
    if (!this.authService.isLoggedIn) {
      this.snackBar.open('Please log in to view products.', 'Close', {
        duration: 3000,
      });
      return;
    }
      this.loadCartItems();
   
  }

  loadCartItems(): void {
    this.cartService.getCartItems().pipe(
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
          this.snackBar.open('No products found in cart.', 'Close', {
            duration: 3000,
          });
          return [];
        }
      })
    ).subscribe(
      (cartItems: CartItem[]) => {
        this.cartItems = cartItems;
      },
      (error) => {
        // this.snackBar.open('Error fetching cart items: ' + error.message, 'Close', {
        //   duration: 3000,
        // });
      }
    );
  }

  updateQuantity(productId: string, newQuantity: number): void {
    if (newQuantity < 1) return;

    this.cartService.updateCartItem(productId, newQuantity).subscribe({
      next: () => {
        const item = this.cartItems.find((item) => item.product._id === productId);
        if (item) {
          item.quantity = newQuantity;
        }
      },
      error: (error) => {
        // this.snackBar.open('Error updating quantity: ' + error.message, 'Close', {
        //   duration: 3000,
        // });
      }
    });
  }

  removeFromCart(productId: string): void {
    if (!this.authService.isLoggedIn) {
      this.snackBar.open('Please log in to remove cart.', 'Close', {
        duration: 3000,
      });
      return;
    }
    this.cartService.removeCartItem(productId).subscribe({
      next: () => {
        this.cartItems = this.cartItems.filter((item) => item.product._id !== productId);
      },
      error: (error) => {
        this.snackBar.open('Error removing item from cart: ' + error.message, 'Close', {
          duration: 3000,
        });
      }
    });
  }

  calculateTotal(): number {
    
    return this.cartItems.reduce(
      (total, item) => total + item.product.price * item.quantity,
      0
    );
  }

  proceedToCheckout(): void {
    this.checkOut = 1;
  }

  submitShippingDetails() {
    if (!this.authService.isLoggedIn) {
      this.snackBar.open('Please log in to view products.', 'Close', {
        duration: 3000,
      });
      return;
    }
    if (this.shippingForm.valid) {
      this.checkOut = 2;
    } else {
      this.shippingForm.markAllAsTouched();
      this.snackBar.open('Please fill in all required fields.', 'Close', {
        duration: 3000,
      });
    }
  }

  submitPaymentDetails() {
    if (this.paymentForm.valid) {
      this.initiateRazorpayPayment();
    } else {
      this.paymentForm.markAllAsTouched();
      this.snackBar.open('Please fill in all required fields.', 'Close', {
        duration: 3000,
      });
    }
  }

  initiateRazorpayPayment() {
    const options = {
      key: 'YOUR_RAZORPAY_KEY_ID',
      amount: this.calculateTotal() * 100,
      currency: 'INR',
      name: 'Ecommerce App',
      description: 'Test Transaction',
      image: 'https://example.com/your_logo',
      order_id: '',
      handler: (response: any) => {
        console.log('Payment successful', response);
      },
      prefill: {
        name: this.shippingForm.get('fullName')?.value,
        email: this.shippingForm.get('email')?.value,
        contact: this.shippingForm.get('phone')?.value
      },
      notes: {
        address: 'Razorpay Corporate Office'
      },
      theme: {
        color: '#3399cc'
      },
      modal: {
        ondismiss: function () {
          console.log('Payment cancelled');
        }
      }
    };

    const rzp1 = new Razorpay(options);
    rzp1.open();
  }

  submitCashPayment() {
    let order = {
      items: this.cartItems,
      paymentType: 'cash',
      address: this.shippingForm.value,
      date: new Date(),
      totalAmmount: this.calculateTotal()
    };

    this.customerService.createOrder(order).subscribe({
      next: (response: any) => {
        this.snackBar.open('Order placed successfully!', 'Close', {
          duration: 3000,
        });
        this.cartItems = [];
        this.checkOut = 0;
      },
      error: (error) => {
        this.snackBar.open('Error placing order: ' + error.message, 'Close', {
          duration: 3000,
        });
      }
    });
  }
}
