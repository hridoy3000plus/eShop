import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { CartItem } from '../models/cart.model';
import { Product } from '../models/product.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private cartItems = new BehaviorSubject<CartItem[]>([]);
  private cartItemCount = new BehaviorSubject<number>(0);
  cartItems$ = this.cartItems.asObservable();
  cartItemCount$ = this.cartItemCount.asObservable();

  constructor(private authService: AuthService) {
    this.loadCart();
    // Listen to login/logout events
    this.authService.currentUser$.subscribe((user) => {
      if (user) {
        // Load the user's cart after login
        this.loadCart();
      } else {
        // Clear the cart after logout
        this.clearCart();
      }
    });
  }

  private loadCart() {
    const userId = JSON.parse(localStorage.getItem('currentUser') || '{}')?.id;
    if (userId) {
      const cartData = localStorage.getItem(`cart_${userId}`);
      if (cartData) {
        this.cartItems.next(JSON.parse(cartData));
        this.updateCartItemCount();
      }
    }
  }

  private saveCart() {
    const userId = JSON.parse(localStorage.getItem('currentUser') || '{}')?.id;
    if (userId) {
      localStorage.setItem(
        `cart_${userId}`,
        JSON.stringify(this.cartItems.value)
      );
    }
  }

  private updateCartItemCount() {
    const totalItems = this.cartItems.value.reduce(
      (total, item) => total + item.quantity,
      0
    );
    this.cartItemCount.next(totalItems); // Emit the new cart item count
  }

  addToCart(product: Product, quantity: number = 1) {
    const currentItems = this.cartItems.value;
    const existingItem = currentItems.find(
      (item) => item.product.id === product.id
    );

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      currentItems.push({ product, quantity });
    }

    this.cartItems.next(currentItems);
    this.updateCartItemCount();
    this.saveCart();
  }

  updateQuantity(productId: number, quantity: number) {
    const currentItems = this.cartItems.value;
    const item = currentItems.find((item) => item.product.id === productId);

    if (item) {
      item.quantity = quantity;
      this.cartItems.next(currentItems);
      this.updateCartItemCount();
      this.saveCart();
    }
  }

  removeFromCart(productId: number) {
    const currentItems = this.cartItems.value;
    const updatedItems = currentItems.filter(
      (item) => item.product.id !== productId
    );
    this.cartItems.next(updatedItems);
    this.updateCartItemCount();
    this.saveCart();
  }

  clearCart() {
    this.cartItems.next([]);
    this.updateCartItemCount();
    this.saveCart();
  }

  getTotal(): number {
    return this.cartItems.value.reduce(
      (total, item) => total + item.product.price * item.quantity,
      0
    );
  }
}
