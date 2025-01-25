import { Component, inject, OnInit } from '@angular/core';
import { FormArray, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Brand } from '../../../Types/brand';
import { Category } from '../../../Types/category';
import { ProductService } from '../../../services/product.service';
import { BrandService } from '../../../services/brand.service';
import { CategoryService } from '../../../services/category.service';
import { ActivatedRoute, Router } from '@angular/router';
import {MatCheckboxModule} from '@angular/material/checkbox';
@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [ReactiveFormsModule,MatInputModule,MatButtonModule,MatFormFieldModule, MatSelectModule,MatCheckboxModule],
  templateUrl: './product-form.component.html',
  styleUrl: './product-form.component.scss'
})
export class ProductFormComponent implements OnInit{
  formBuilder=inject(FormBuilder);
  categories:Category[]=[];
  isEdit:boolean=false;
  brands:Brand[]=[];
  productService=inject(ProductService);
  brandService=inject(BrandService);
  categoryService=inject(CategoryService);
  routes=inject(Router);
  route=inject(ActivatedRoute);
  id:string="";
  productForm=this.formBuilder.group({
    name:[null,[Validators.required,Validators.minLength(5)]],
    shortDesription:[null,[Validators.required,Validators.minLength(10)]],
    description: [null,[Validators.required,Validators.minLength(50)]],
    price: [null,[Validators.required]],
    discount: [],
    images:this.formBuilder.array([]),
    categoryId: [null,[Validators.required]],
    brandId: [null,[Validators.required]],
    isFeatured: [false],
    isNew: [false],

  })
  get images(){
    return this.productForm.get('images') as FormArray;
  }
  Categories(){
    this.categoryService.getCategories().subscribe((result:any)=>{
      this.categories=result;

    });

  }
  getProduct(Id:string){
    this.productService.getProductById(Id).subscribe((result:any)=>{
        this.productForm.patchValue(result as any)
    });

  }
  Brands(){
    this.brandService.getBrands().subscribe((result:any)=>{
      this.brands=result;
    });

  }
  addImage(){
    this.images.push(this.formBuilder.control(null))
  }
  removeImage(){
    this.images.removeAt(this.images.length-1);
  }
  add(){
    let value=this.productForm.value;
    this.productService.AddProduct(value as any).subscribe((result:any)=>{
      if(result.status){
         this.routes.navigateByUrl("/admin/products");
      }
    })
  }
  update(){
    let value=this.productForm.value;
    this.productService.UpdateProduct(this.id,value as any).subscribe((result:any)=>{
      if(result.status){
         this.routes.navigateByUrl("/admin/products");
      }
    })
  }
     ngOnInit(){
    this.addImage();
    this.Brands();
    this.Categories();
    this.id=this.route.snapshot.params["id"];
    if(this.id){
      this.isEdit=true;
      this.getProduct(this.id);
    }
  
   }
}
