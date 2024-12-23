// services/search-query.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import { Product } from '../models/product.model';
import { ProductService } from './product.service';

export interface SearchFilters {
  query: string;
  category: string;
  minPrice: number;
  maxPrice: number;
  minRating: number;
}

@Injectable({
  providedIn: 'root',
})
export class SearchQueryService {
  private searchFilters = new BehaviorSubject<SearchFilters>({
    query: '',
    category: '',
    minPrice: 0,
    maxPrice: 1000,
    minRating: 0,
  });

  private searchQuerySubject = new BehaviorSubject<string>('');

  private products$ = new BehaviorSubject<Product[]>([]);

  constructor(private productService: ProductService) {
    this.loadProducts();
  }

  private loadProducts() {
    this.productService
      .getProducts()
      .subscribe((products) => this.products$.next(products));
  }

  updateFilters(filters: Partial<SearchFilters>) {
    this.searchFilters.next({
      ...this.searchFilters.value,
      ...filters,
    });
  }

  getFilteredProducts(): Observable<Product[]> {
    return combineLatest([this.products$, this.searchFilters]).pipe(
      map(([products, filters]) => {
        return products.filter((product) => {
          // Text search
          if (
            filters.query &&
            !product.title.toLowerCase().includes(filters.query.toLowerCase())
          ) {
            return false;
          }

          // Category filter
          if (filters.category && product.category !== filters.category) {
            return false;
          }

          // Price range filter
          if (
            product.price < filters.minPrice ||
            product.price > filters.maxPrice
          ) {
            return false;
          }

          // Rating filter
          if (
            filters.minRating > 0 &&
            product.rating.rate < filters.minRating
          ) {
            return false;
          }

          return true;
        });
      })
    );
  }

  getCurrentFilters(): Observable<SearchFilters> {
    return this.searchFilters.asObservable();
  }

  resetFilters() {
    this.searchFilters.next({
      query: '',
      category: '',
      minPrice: 0,
      maxPrice: 1000,
      minRating: 0,
    });
    this.searchQuerySubject.next('');
  }

  getSearchQuery() {
    return this.searchQuerySubject.asObservable(); // Expose the search query observable
  }

  getPriceRange(): Observable<{ min: number; max: number }> {
    return this.products$.pipe(
      map((products) => ({
        min: Math.min(...products.map((p) => p.price)),
        max: Math.max(...products.map((p) => p.price)),
      }))
    );
  }
}
