import { CartItem } from './cart.model';

export interface Order {
  id: number;
  userId: number;
  items: CartItem[];
  total: number;
  date: Date;
  status: 'pending' | 'completed' | 'cancelled';
}
