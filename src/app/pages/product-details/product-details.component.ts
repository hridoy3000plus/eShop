import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Product } from 'src/app/models/product.model';
import { CartService } from 'src/app/services/cart.service';
import { ProductService } from 'src/app/services/product.service';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css']
})
export class ProductDetailsComponent implements OnInit, AfterViewInit {
  product: Product | undefined;
  quantity: number = 1;
  addedToCart: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private cartService: CartService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.productService.getProduct(id).subscribe(
      product => this.product = product
    );
  }

  ngAfterViewInit() {
    const imageWrapper = document.querySelector('.image-wrapper') as HTMLElement;
    const image = document.querySelector('.product-image') as HTMLElement;

    imageWrapper.addEventListener('mousemove', (e) => {
      const rect = imageWrapper.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;

      image.style.setProperty('--x', `${x}%`);
      image.style.setProperty('--y', `${y}%`);
    });
  }

  increaseQuantity(productId: number): void {
    if (this.quantity < 99) {
      this.quantity++;
    }
  }

  decreaseQuantity(productId: number): void {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  addToCart(): void {
    if (this.product) {
      this.cartService.addToCart(this.product, this.quantity);
      this.addedToCart = false;
    }
  }
}