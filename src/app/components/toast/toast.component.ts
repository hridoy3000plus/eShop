import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { Toast, ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'app-toast',
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.css'],
})
export class ToastComponent implements OnInit, OnDestroy {
  toast: Toast | null = null;
  private toastSubscription: Subscription;

  constructor(private toastService: ToastService) {
    this.toastSubscription = this.toastService.toast$.subscribe((toast) => {
      this.toast = toast;
      setTimeout(() => {
        this.toast = null; 
      }, 2000);
    });
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {
    if (this.toastSubscription) {
      this.toastSubscription.unsubscribe();
    }
  }
}
