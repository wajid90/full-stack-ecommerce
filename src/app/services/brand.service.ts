import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BrandService {
  http=inject(HttpClient);
  constructor() { }

  getBrands(){
    return this.http.get(environment.apiUrl+"/brand");
  }
  getBrandById(id:string){
    return this.http.get(environment.apiUrl+`/brand/${id}`);
  }
  AddBrand(name:string){
    return this.http.post(environment.apiUrl+"/brand/add",{name:name});
  }
  UpdateBrand(id:string,name:string){
    return this.http.put(environment.apiUrl+`/brand/${id}`,{name:name});
  }
  DeleteBrand(id:string){
    return this.http.delete(environment.apiUrl+`/brand/${id}`);
  }
}
