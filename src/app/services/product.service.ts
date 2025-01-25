import { Product } from './../Types/product';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

 http=inject(HttpClient);
  constructor() { }

  getProducts(){
    return this.http.get(environment.apiUrl+"/product");
  }
  getProductById(id:string){
    return this.http.get(environment.apiUrl+`/product/${id}`);
  }
  AddProduct(product:Product){
    return this.http.post(environment.apiUrl+"/product/add",product);
  }
  UpdateProduct(id:string,product:Product){
    return this.http.put(environment.apiUrl+`/product/${id}`,product);
  }
  DeleteProduct(id:string){
    return this.http.delete(environment.apiUrl+`/product/${id}`);
  }
}
