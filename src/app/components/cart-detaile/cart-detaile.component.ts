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
  userService=inject(AuthService);
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
             console.error('No products found in response.');
             return [];
           }
         })
       ).subscribe(
         (cartItems: CartItem[]) => {
           this.cartItems = cartItems;
         },
         (error) => {
           console.error('Error fetching cart items:', error);
         }
       );
  }

  updateQuantity(productId: string, newQuantity: number): void {
    if (newQuantity < 1) return;

    this.cartService.updateCartItem(productId, newQuantity).subscribe(() => {
      const item = this.cartItems.find((item) => item.product._id === productId);
      if (item) {
        item.quantity = newQuantity;
      }
    });
  }

  removeFromCart(productId: string): void {
    this.cartService.removeCartItem(productId).subscribe(() => {
      this.cartItems = this.cartItems.filter((item) => item.product._id !== productId);
    });
  }

  calculateTotal(): number {
    return this.cartItems.reduce(
      (total, item) => total + item.product.price * item.quantity,
      0
    );
  }

  proceedToCheckout(): void {
    this.checkOut=1;
  }
  submitShippingDetails() {
    if (this.shippingForm.valid) {
      this.checkOut = 2;
    } else {
      this.shippingForm.markAllAsTouched();
      console.error('Form is invalid');
    }
  }
  submitPaymentDetails() {
    if (this.paymentForm.valid) {
      this.initiateRazorpayPayment();
    } else {
      this.paymentForm.markAllAsTouched();
      console.error('Form is invalid');
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
      modal:{
        ondismiss: function(){
          console.log('Payment cancelled');
        }
      }
    };
    const successCallback = (response: any) => {
      console.log('Payment successful', response);
     
    };
    const failCallback = (response: any) => {
      console.log('Payment failed', response.error.description);
    }
    const cancelCallback = (response: any) => {
      console.log('Payment cancelled', response.error.description);
    };

    const rzp1 = new Razorpay(options,successCallback,failCallback,cancelCallback);
    rzp1.open();
  }
  
  submitCashPayment() {
   let order={
    items:this.cartItems,
    paymentType:'cash',
    address:this.shippingForm.value,
    date:new Date(),
    totalAmmount:this.calculateTotal()
   }
   this.customerService.createOrder(order).subscribe((response:any) => {

    alert('Order placed successfully!');
    this.cartItems = [];
    this.checkOut = 0;
    
   });
  }
}
