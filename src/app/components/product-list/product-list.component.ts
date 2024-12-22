// import { Component, OnInit } from '@angular/core';
// import { Product } from 'src/app/models/product.model';
// import { ProductService } from 'src/app/services/product.service';

// @Component({
//   selector: 'app-product-list',
//   templateUrl: './product-list.component.html',
//   styleUrls: ['./product-list.component.css'],
// })
// export class ProductListComponent implements OnInit {
//   constructor(private productService: ProductService) {}

//   products: Product[] = [];
//   errorMessage: string = '';
//   currentPosition = 0;
//   ngOnInit(): void {
//     this.loadProducts();
//   }

//   loadProducts(): void {
//     this.productService.getProducts().subscribe({
//       next: (data: Product[]) => {
//         this.products = data;
//       },
//       error: (error) => {
//         this.errorMessage = 'There was an error fetching the products.';
//         console.error(error);
//       },
//     });
//   }
//   scroll(direction: 'left' | 'right') {
//     const scrollAmount = direction === 'left' ? -1 : 1;
//     const totalProducts = this.products.length;
//     this.currentPosition =
//       (this.currentPosition + scrollAmount + totalProducts) % totalProducts;
//   }

//   generateStarArray(rating: number): number[] {
//     return Array(5)
//       .fill(0)
//       .map((_, index) => (index < Math.floor(rating) ? 1 : 0));
//   }

//   addToCart(product: Product) {
//     console.log('Added to cart:', product);
//     // Implement your cart logic here
//   }
// }


// product-list.component.ts
import { Component, OnInit } from '@angular/core';
import { Product } from 'src/app/models/product.model';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  errorMessage: string = '';
  currentPosition = 0;

  constructor(private productService: ProductService) { }

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
    console.log('Added to cart:', product);
    // Implement your cart logic here
  }
}
