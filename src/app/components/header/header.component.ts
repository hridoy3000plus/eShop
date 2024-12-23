import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import {
  debounceTime,
  distinctUntilChanged,
  filter,
  Subject,
  Subscription,
  takeUntil,
} from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { CartService } from 'src/app/services/cart.service';
import { SearchQueryService } from 'src/app/services/search-query.service';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  private searchSubject = new Subject<string>();
  private destroy$ = new Subject<void>();
  searchTerm = '';
  constructor(
    private authService: AuthService,
    private toastService: ToastService,
    private router: Router,
    private searchQueryService: SearchQueryService,
    private cartService: CartService
  ) {
    // Handle debounced search
    this.searchSubject
      .pipe(debounceTime(300), distinctUntilChanged(), takeUntil(this.destroy$))
      .subscribe((term) => {
        this.searchTerm = term;
      });
  }

  isLoginMode: any;
  isMenuOpen = false;
  isProfileDropdownOpen = false;
  currentUrl: string = '';
  cartItemCount: number = 0;
  private routerSubscription: Subscription | undefined;

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  toggleProfileDropdown() {
    this.isProfileDropdownOpen = !this.isProfileDropdownOpen;
  }

  onSearch(event: Event): void {
    const term = (event.target as HTMLInputElement).value;
    this.searchSubject.next(term);

    // if (this.searchTerm.trim()) {
    // Update the search query in the service
    this.searchQueryService.updateFilters({ query: this.searchTerm });

    // Navigate to search results page with query param
    this.router.navigate(['/search-products'], {
      queryParams: { q: this.searchTerm },
    });
    // }
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
    // Listen to cart item count updates in real-time
    this.cartService.cartItemCount$.subscribe((count) => {
      this.cartItemCount = count; // Update cart item count
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
    // Subscribe to the search query observable
    this.searchQueryService.getSearchQuery().subscribe((searchQuery) => {
      this.searchTerm = searchQuery;
    });
    // Subscribe to cart items and update cartItemCount whenever the cart changes
    this.cartService.cartItems$.subscribe((items) => {
      this.cartItemCount = items.reduce(
        (total, item) => total + item.quantity,
        0
      );
    });
  }

  ngOnDestroy(): void {
    // Clean up the subscription to avoid memory leaks
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }

    this.destroy$.next();
    this.destroy$.complete();
  }
}
