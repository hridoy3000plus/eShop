import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { CartItem } from '../models/cart.model';
import { Product } from '../models/product.model';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private cartItems = new BehaviorSubject<CartItem[]>([]);
  cartItems$ = this.cartItems.asObservable();

  constructor() {
    this.loadCart();
  }

  private loadCart() {
    const userId = JSON.parse(localStorage.getItem('currentUser') || '{}')?.id;
    if (userId) {
      const cartData = localStorage.getItem(`cart_${userId}`);
      if (cartData) {
        this.cartItems.next(JSON.parse(cartData));
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
    this.saveCart();
  }

  updateQuantity(productId: number, quantity: number) {
    const currentItems = this.cartItems.value;
    const item = currentItems.find((item) => item.product.id === productId);

    if (item) {
      item.quantity = quantity;
      this.cartItems.next(currentItems);
      this.saveCart();
    }
  }

  removeFromCart(productId: number) {
    const currentItems = this.cartItems.value;
    const updatedItems = currentItems.filter(
      (item) => item.product.id !== productId
    );
    this.cartItems.next(updatedItems);
    this.saveCart();
  }

  clearCart() {
    this.cartItems.next([]);
    this.saveCart();
  }

  getTotal(): number {
    return this.cartItems.value.reduce(
      (total, item) => total + item.product.price * item.quantity,
      0
    );
  }
}
