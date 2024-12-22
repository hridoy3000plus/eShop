import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter, Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  constructor(
    private authService: AuthService,
    private toastService: ToastService,
    private router: Router,
  ) {}

  isLoginMode: any;
  isMenuOpen = false;
  isProfileDropdownOpen = false;
  currentUrl: string = '';
  private routerSubscription: Subscription | undefined;

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  toggleProfileDropdown() {
    this.isProfileDropdownOpen = !this.isProfileDropdownOpen;
  }

  closeMenu() {
    this.isMenuOpen = false;
  }

  onLogout() {
    this.authService.logout();
    this.toastService.show('Logged out successful!', 'success');
  }

  ngOnInit(): void {
    this.authService.currentUser$.subscribe((user) => {
      this.isLoginMode = user; // Update the currentUser variable in the component
    });
    // Subscribing to the Router's events and filtering for NavigationEnd
    this.routerSubscription = this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd) // Only pass NavigationEnd events
      )
      .subscribe((event) => {
        // Explicitly cast the event to NavigationEnd
        const navigationEndEvent = event as NavigationEnd;
        this.currentUrl = navigationEndEvent.urlAfterRedirects;
        // console.log('Current Route URL:', this.currentUrl);
      });
  }

  ngOnDestroy(): void {
    // Clean up the subscription to avoid memory leaks
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }
}
