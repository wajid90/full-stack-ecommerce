import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Product } from '../Types/product';
import { Category } from '../Types/category';
import { map, Observable } from 'rxjs';
import { Brand } from '../Types/brand';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  http=inject(HttpClient);
  constructor() { }
  getCategories():Observable<Category[]>{
    return this.http.get<Category[]>(environment.apiUrl+"/customer/categories").pipe(
      map((result: Category[]) => 
        result.map(({...category }) => category)
      )
    );;
  }
  getBrands():Observable<Brand[]>{
    return this.http.get<Brand[]>(environment.apiUrl+"/customer/brands").pipe(
      map((result: Brand[]) => 
        result.map(({...brand }) => brand)
      )
    );;
  }
  getNewFeaturedProducts(){
    return this.http.get<Product[]>(environment.apiUrl+"/customer/featured-products")
  }
  getNewProducts(){
    return this.http.get<Product[]>(environment.apiUrl+"/customer/new-products")
  }
  getProductDetails(id:string){
    return this.http.get(environment.apiUrl+`/customer/product/${id}`);
  }
  getFilteredProducts(filters: {
    categoryId: string;
    brandId: string;
    search: string;
    sort: string;
    page: number;
    pageSize: number;
  }): Observable<Product[]> {
    let params = new HttpParams();

    if (filters.categoryId) params = params.set('categoryId', filters.categoryId);
    if (filters.brandId) params = params.set('brandId', filters.brandId);
    if (filters.search) params = params.set('search', filters.search);
    if (filters.sort) params = params.set('sort', filters.sort);
    params = params.set('page', filters.page.toString());
    params = params.set('pageSize', filters.pageSize.toString());

    return this.http.get<any>(environment.apiUrl+"/customer/filter-products", { params });
  }
}
