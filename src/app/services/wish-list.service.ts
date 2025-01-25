import { pluck } from 'rxjs';
import { inject, Injectable, OnInit } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Product, WishListItem } from '../Types/product';

@Injectable({
  providedIn: 'root'
})
export class WishListService {
  http=inject(HttpClient);
  wishLists:Product[]=[];
  constructor() { }

  init(){
    this.getWishList().subscribe((result:Product[])=>{
      this.wishLists=result;
    })
  }

  addToWishList(productId:any){
    return this.http.post(environment.apiUrl+"/wishList/add",{productId:productId});
  }
  removeFromWishList(productId:any){
    return this.http.delete(environment.apiUrl+"/wishList/"+productId);
  }
  getWishList(){
    return this.http.get<any>(environment.apiUrl+"/wishList").pipe(pluck("wishList"));
  }
  getWishLists() {
    return this.http.get<{ wishList: WishListItem[] }>(`${environment.apiUrl}/customer/wishLists`);
  }
}
