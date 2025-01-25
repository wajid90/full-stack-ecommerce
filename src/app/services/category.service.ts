import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Category } from '../Types/category';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  http=inject(HttpClient);
  constructor() { }

  getCategories():Observable<Category[]>{
    return this.http.get<Category[]>(environment.apiUrl+"/category").pipe(
      map((result: Category[]) => 
        result.map(({...category }) => category)
      )
    );;
  }
  getCategoryById(id:string){
    return this.http.get(environment.apiUrl+`/category/${id}`);
  }
  AddCategory(name:string){
    return this.http.post(environment.apiUrl+"/category/add",{name:name});
  }
  UpdateCategory(id:string,name:string){
    return this.http.put(environment.apiUrl+`/category/${id}`,{name:name});
  }
  DeleteCategory(id:string){
    return this.http.delete(environment.apiUrl+`/category/${id}`);
  }
}
