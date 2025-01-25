import { ActivatedRoute, Router, Routes } from '@angular/router';
import { Component, Inject, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { CategoryService } from '../../../services/category.service';
import { Action } from 'rxjs/internal/scheduler/Action';
import { pluck } from 'rxjs';

@Component({
  selector: 'app-category-form',
  standalone: true,
  imports: [FormsModule,MatInputModule,MatButtonModule],
  templateUrl: './category-form.component.html',
  styleUrl: './category-form.component.scss'
})
export class CategoryFormComponent {
  name:string=""
  categoryService=inject(CategoryService);
  routes=inject(Router);
  route=inject(ActivatedRoute);
  isEdit:boolean=false;
  add(){
    if(!this.name){
      console.log("category Name is required..");

    }
    this.categoryService.AddCategory(this.name).subscribe((result:any)=>{
     this.routes.navigateByUrl("/admin/categories");
    });
   console.log(this.name);
  }
  update(){
    if(!this.name){
      console.log("category Name is required..");

    }
    let paramId=this.route.snapshot.params["id"];
    this.categoryService.UpdateCategory(paramId,this.name).subscribe((result:any)=>{

      if(result.status){
        this.routes.navigateByUrl("/admin/categories");
      }else{

      }
    
    });
  }


  ngOnInit(){
    let id=this.route.snapshot.params["id"];
    if(id){
      this.isEdit=true;
        this.categoryService.getCategoryById(id).pipe(pluck("category")).subscribe((result:any)=>{
      this.name=result.name;
    })
  }
  }
}
