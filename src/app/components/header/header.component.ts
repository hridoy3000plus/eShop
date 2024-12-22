import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  constructor(
    private authService: AuthService,
    private toastService: ToastService,
    private router: Router
  ) {}

  isLoginMode:any;
  isMenuOpen = false;
  isProfileDropdownOpen = false;
  authRoute: string = '';

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
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd)) // Only respond to NavigationEnd events
      .subscribe((event: NavigationEnd) => {
        // Update the current route whenever the navigation ends
        this.authRoute = event.urlAfterRedirects; // This gives the correct route after redirects
        console.log('Current Route:', this.authRoute);  // Log or use the route
      });
  }
}
