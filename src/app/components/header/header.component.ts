import { Component, inject } from '@angular/core';
import { CategoryService } from '../../services/category.service';
import { Category } from '../../Types/category';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CustomerService } from '../../services/customer.service';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink,MatIconModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  categoryService=inject(CategoryService);
  customerService=inject(CustomerService);
  authService=inject(AuthService);
  categoryList:Category[]=[];
  router=inject(Router);
  onSearch(e:any){
    if(e.target.value){
      this.router.navigateByUrl("/products?search="+e.target.value);
    }
  }
  SearchCategory(id:string){
    this.router.navigateByUrl("/products?categoryId="+id);
  }
  logout(){
    this.authService.logout();

    this.router.navigateByUrl("/login");
  }
  ngOnInit(){
    this.customerService.getCategories().subscribe((result:Category[])=>{
      this.categoryList=result
    })
  }
}
