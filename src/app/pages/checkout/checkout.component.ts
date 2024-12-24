import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CartItem } from 'src/app/models/cart.model';
import { CartService } from 'src/app/services/cart.service';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css'],
})
export class CheckoutComponent implements OnInit {
  shippingForm: FormGroup;
  cartItems: CartItem[] = [];
  showPaymentModal = false;

  constructor(
    private fb: FormBuilder,
    private cartService: CartService,
    private router: Router,
    private toastService: ToastService
  ) {
    this.shippingForm = this.fb.group({
      fullName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      address: ['', [Validators.required]],
      city: ['', [Validators.required]],
      state: ['', [Validators.required]],
      zipCode: ['', [Validators.required, Validators.pattern('^[0-9]{5,6}$')]],
    });
  }

  ngOnInit() {
    this.cartService.cartItems$.subscribe((items) => (this.cartItems = items));
  }

  getTotal(): number {
    return this.cartService.getTotal();
  }

  onSubmit() {
    if (this.shippingForm.valid) {
      this.showPaymentModal = true;
    } else {
      this.toastService.show('Please fill all required fields', 'error');
    }
  }

  completePayment() {
    this.cartService.clearCart();
    this.showPaymentModal = false;
    this.router.navigate(['/']);
  }
}
