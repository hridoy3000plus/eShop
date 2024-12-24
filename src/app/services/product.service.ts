

import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, catchError, map } from 'rxjs';
import { Product } from '../models/product.model';
import { products } from '../utils/products';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private apiUrl = 'https://fakestoreapi.com/products';
  private fallbackProducts: Product[] = products;

  constructor(private http: HttpClient) {}

  private handleError<T>(fallbackValue: T) {
    return (error: HttpErrorResponse): Observable<T> => {
      console.warn('API call failed, using fallback data:', error);
      return of(fallbackValue);
    };
  }

  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.apiUrl).pipe(
      catchError(this.handleError(this.fallbackProducts))
    );
  }

  getProduct(id: number): Observable<Product | undefined> {
    return this.http.get<Product>(`${this.apiUrl}/${id}`).pipe(
      catchError(() => {
        const product = this.fallbackProducts.find(p => p.id === id);
        return of(product);
      })
    );
  }

  getCategories(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/categories`).pipe(
      catchError(() => {
        const categories = [...new Set(this.fallbackProducts.map(p => p.category))];
        return of(categories);
      })
    );
  }

  getProductsByCategory(category: string): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/category/${category}`).pipe(
      catchError(() => {
        const products = this.fallbackProducts.filter(p => p.category === category);
        return of(products);
      })
    );
  }

  searchProducts(query: string): Observable<Product[]> {
    return this.getProducts().pipe(
      map((products) =>
        products.filter(
          (product) =>
            product.title.toLowerCase().includes(query.toLowerCase()) ||
            product.description.toLowerCase().includes(query.toLowerCase())
        )
      )
    );
  }

  getProductsByPriceRange(min: number, max: number): Observable<Product[]> {
    return this.getProducts().pipe(
      map((products) =>
        products.filter(
          (product) => product.price >= min && product.price <= max
        )
      )
    );
  }

  getProductsByRating(minRating: number): Observable<Product[]> {
    return this.getProducts().pipe(
      map((products) =>
        products.filter((product) => product.rating.rate >= minRating)
      )
    );
  }

  // New helper methods for sorting and advanced filtering
  sortProductsByPrice(ascending: boolean = true): Observable<Product[]> {
    return this.getProducts().pipe(
      map((products) =>
        [...products].sort((a, b) =>
          ascending ? a.price - b.price : b.price - a.price
        )
      )
    );
  }

  sortProductsByRating(ascending: boolean = false): Observable<Product[]> {
    return this.getProducts().pipe(
      map((products) =>
        [...products].sort((a, b) =>
          ascending ? a.rating.rate - b.rating.rate : b.rating.rate - a.rating.rate
        )
      )
    );
  }

  getProductsByPriceRangeAndRating(
    minPrice: number,
    maxPrice: number,
    minRating: number
  ): Observable<Product[]> {
    return this.getProducts().pipe(
      map((products) =>
        products.filter(
          (product) =>
            product.price >= minPrice &&
            product.price <= maxPrice &&
            product.rating.rate >= minRating
        )
      )
    );
  }
}