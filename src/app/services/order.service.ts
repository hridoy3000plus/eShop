import { Injectable } from '@angular/core';
import { CartService } from './cart.service';
import { Order } from '../models/order.model';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  constructor(private cartService: CartService) {}

  createOrder(userId: number): Order {
    // const cartItems = this.cartService.cartItems$.value;
    const total = this.cartService.getTotal();

    const order: Order = {
      id: Date.now(),
      userId,
      items: [],
      total,
      date: new Date(),
      status: 'pending',
    };

    this.saveOrder(order);
    this.cartService.clearCart();
    return order;
  }

  private saveOrder(order: Order) {
    const orders = this.getOrders(order.userId);
    orders.push(order);
    localStorage.setItem(`orders_${order.userId}`, JSON.stringify(orders));
  }

  getOrders(userId: number): Order[] {
    const orders = localStorage.getItem(`orders_${userId}`);
    return orders ? JSON.parse(orders) : [];
  }
}
