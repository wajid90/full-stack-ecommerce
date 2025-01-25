import { ActivatedRoute, Router, Routes } from '@angular/router';
import { Component, Inject, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { BrandService } from '../../../services/brand.service';
import { pluck } from 'rxjs';

@Component({
  selector: 'app-brand-form',
  standalone: true,
  imports: [FormsModule,MatInputModule,MatButtonModule],
  templateUrl: './brand-form.component.html',
  styleUrl: './brand-form.component.scss'
})
export class BrandFormComponent {
  name:string=""
  brandService=inject(BrandService);
  routes=inject(Router);
  route=inject(ActivatedRoute);
  isEdit:boolean=false;
  add(){
    if(!this.name){
      console.log("band Name is required..");

    }
    this.brandService.AddBrand(this.name).subscribe((result:any)=>{
     this.routes.navigateByUrl("/admin/brands");
    });
  }
  update(){
    if(!this.name){
      console.log("brand Name is required..");

    }
    let paramId=this.route.snapshot.params["id"];
    this.brandService.UpdateBrand(paramId,this.name).subscribe((result:any)=>{

      if(result.status){
        this.routes.navigateByUrl("/admin/brands");
      }else{

      }
    });
  }


  ngOnInit(){
    let id=this.route.snapshot.params["id"];
    if(id){
      this.isEdit=true;
        this.brandService.getBrandById(id).pipe(pluck("brand")).subscribe((result:any)=>{
      this.name=result.name;
    })
  }
  }
}
