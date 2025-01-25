import { pluck } from 'rxjs';
import {AfterViewInit, Component, inject, ViewChild} from '@angular/core';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import {MatSort, MatSortModule} from '@angular/material/sort';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import { CategoryService } from '../../../services/category.service';
import { MatButton } from '@angular/material/button';
import { Router, RouterLink } from '@angular/router';
import { Category } from '../../../Types/category';
@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [MatFormFieldModule, MatInputModule, MatTableModule, MatSortModule, MatPaginatorModule,MatButton,RouterLink],
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.scss'
})
export class CategoriesComponent  implements AfterViewInit{
  displayedColumns: string[] = ['id', 'name','action'];
  dataSource: MatTableDataSource<Category>;
  router=inject(Router);
  constructor() {
    this.dataSource=new MatTableDataSource([] as any);
  }

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  categoryService=inject(CategoryService);
  GetAllCategory(){
    this.categoryService.getCategories().subscribe((result:any)=>{
      this.dataSource.data =result;
    });
  }
  ngOnInit() {
    this.GetAllCategory();
  }
  delete(Id:string){

    this.categoryService.DeleteCategory(Id).subscribe((result:any)=>{

      if(result.status){
        console.log("category deleted successfully ...")
        this.GetAllCategory();
      }else{
        
      }
    });
  }
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
