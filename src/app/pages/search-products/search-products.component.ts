import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { debounceTime, Subject } from 'rxjs';
import { Product } from 'src/app/models/product.model';
import { CartService } from 'src/app/services/cart.service';
import { ProductService } from 'src/app/services/product.service';
import { SearchQueryService } from 'src/app/services/search-query.service';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'app-search-products',
  templateUrl: './search-products.component.html',
  styleUrls: ['./search-products.component.css'],
})
export class SearchProductsComponent implements OnInit {
  products: Product[] = [];
  categories: string[] = [];
  loading = true;
  error = '';

  // Pagination
  currentPage = 1;
  itemsPerPage = 9;
  totalPages = 0;

  // Filters
  searchQuery = '';
  selectedCategory = '';
  selectedRating = 0;
  priceRange = {
    min: 0,
    max: 1000,
  };
  maxPrice = 1000;

  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private searchQueryService: SearchQueryService,
    private toastService: ToastService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Subscribe to query parameters
    this.route.queryParams.subscribe(params => {
      if (params['q']) {
        this.searchQuery = params['q'];
        this.searchQueryService.updateFilters({ query: params['q'] });
      }
    });


    this.loadCategories();
    this.initializeSearchResults();

    // Subscribe to filtered products
    this.searchQueryService.getFilteredProducts().subscribe({
      next: (products) => {
        this.products = products;
        this.totalPages = Math.ceil(products.length / this.itemsPerPage);
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Failed to load products. Please try again.';
        this.loading = false;
      },
    });

    // Get initial price range
    this.searchQueryService.getPriceRange().subscribe((range) => {
      this.priceRange = range;
      this.maxPrice = range.max;
    });
  }

  private loadCategories(): void {
    this.productService.getCategories().subscribe({
      next: (categories) => {
        this.categories = categories;
      },
      error: (error) => {
        console.error('Failed to load categories:', error);
      },
    });
  }

  private initializeSearchResults(): void {
    this.searchQueryService.getCurrentFilters().subscribe((filters) => {
      this.searchQuery = filters.query;
      this.selectedCategory = filters.category;
      this.selectedRating = filters.minRating;
      this.priceRange = {
        min: filters.minPrice,
        max: filters.maxPrice,
      };
    });
  }


  onCategorySelect(category: string): void {
    this.selectedCategory = category;
    this.searchQueryService.updateFilters({ category });
    this.resetPagination();
  }

  onPriceChange(range: { min: number; max: number }): void {
    this.searchQueryService.updateFilters({
      minPrice: range.min,
      maxPrice: range.max,
    });
    this.resetPagination();
  }

  onRatingSelect(rating: number): void {
    this.selectedRating = this.selectedRating === rating ? 0 : rating;
    this.searchQueryService.updateFilters({ minRating: this.selectedRating });
    this.resetPagination();
  }

  resetFilters(): void {
    this.searchQueryService.resetFilters();
    this.resetPagination();
  }

  addToCart(product: Product): void {
    this.cartService.addToCart(product);
    this.toastService.show('Item added to cart!', 'success');
  }

  // Pagination methods
  getCurrentPageItems(): Product[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.products.slice(startIndex, startIndex + this.itemsPerPage);
  }

  onPageChange(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  private resetPagination(): void {
    this.currentPage = 1;
  }

  navigateToDetails(productId: number): void {
    this.router.navigate(['/product-details', productId]);
  }

  // Helper methods
  generateStarArray(rating: number): number[] {
    return Array(5)
      .fill(0)
      .map((_, index) => (index < Math.floor(rating) ? 1 : 0));
  }

  getPaginationArray(): number[] {
    return Array(this.totalPages)
      .fill(0)
      .map((_, index) => index + 1);
  }
}
