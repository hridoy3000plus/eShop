// product-list.component.ts
import { Component, OnInit } from '@angular/core';
import { Product } from 'src/app/models/product.model';
import { CartService } from 'src/app/services/cart.service';
import { ProductService } from 'src/app/services/product.service';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  errorMessage: string = '';
  currentPosition = 0;

  constructor(private productService: ProductService, private cartService: CartService, private toastService: ToastService) { }

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.productService.getProducts().subscribe({
      next: (data: Product[]) => {
        this.products = data;
      },
      error: (error) => {
        this.errorMessage = 'There was an error fetching the products.';
        console.error(error);
      }
    });
  }

  scroll(direction: 'left' | 'right'): void {
    if (direction === 'left' && this.currentPosition > 0) {
      this.currentPosition--;
    } else if (direction === 'right' && this.currentPosition < this.products.length - 4) {
      this.currentPosition++;
    }
  }

  generateStarArray(rating: number): number[] {
    return Array(5).fill(0).map((_, index) => index < Math.floor(rating) ? 1 : 0);
  }

  addToCart(product: Product): void {
    this.cartService.addToCart(product);
    this.toastService.show('Item added to cart!', 'success');
  }
}
