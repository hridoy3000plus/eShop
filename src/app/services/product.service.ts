// import { HttpClient } from '@angular/common/http';
// import { Injectable } from '@angular/core';
// import { Observable } from 'rxjs';
// import { Product } from '../models/product.model';

// @Injectable({
//   providedIn: 'root',
// })
// export class ProductService {
//   private apiUrl = 'https://fakestoreapi.com/products';

//   constructor(private http: HttpClient) {}

//   getProducts(): Observable<Product[]> {
//     return this.http.get<Product[]>(this.apiUrl);
//   }

//   getProduct(id: number): Observable<Product> {
//     return this.http.get<Product>(`${this.apiUrl}/${id}`);
//   }

//   getCategories(): Observable<string[]> {
//     return this.http.get<string[]>(`${this.apiUrl}/categories`);
//   }

//   getProductsByCategory(category: string): Observable<Product[]> {
//     return this.http.get<Product[]>(`${this.apiUrl}/category/${category}`);
//   }

//   searchProducts(query: string): Observable<Product[]> {
//     return this.getProducts().pipe(
//       map(products => products.filter(product =>
//         product.title.toLowerCase().includes(query.toLowerCase()) ||
//         product.description.toLowerCase().includes(query.toLowerCase())
//       ))
//     );
//   }

//   getProductsByPriceRange(min: number, max: number): Observable<Product[]> {
//     return this.getProducts().pipe(
//       map(products => products.filter(product =>
//         product.price >= min && product.price <= max
//       ))
//     );
//   }

//   getProductsByRating(minRating: number): Observable<Product[]> {
//     return this.getProducts().pipe(
//       map(products => products.filter(product =>
//         product.rating.rate >= minRating
//       ))
//     );
//   }
// }

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { Product } from '../models/product.model';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private apiUrl = 'https://fakestoreapi.com/products';

  constructor(private http: HttpClient) {}

  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.apiUrl);
  }

  getProduct(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/${id}`);
  }

  getCategories(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/categories`);
  }

  getProductsByCategory(category: string): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/category/${category}`);
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
}
