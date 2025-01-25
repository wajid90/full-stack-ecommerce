import { pluck } from 'rxjs';
import {AfterViewInit, Component, inject, ViewChild} from '@angular/core';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import {MatSort, MatSortModule} from '@angular/material/sort';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import { BrandService } from '../../../services/brand.service';
import { MatButton } from '@angular/material/button';
import { Router, RouterLink } from '@angular/router';
import { Brand } from '../../../Types/brand';

@Component({
  selector: 'app-brands',
  standalone: true,
  imports: [MatFormFieldModule, MatInputModule, MatTableModule, MatSortModule, MatPaginatorModule,MatButton,RouterLink],
  templateUrl: './brands.component.html',
  styleUrl: './brands.component.scss'
})
export class BrandsComponent implements AfterViewInit{
  displayedColumns: string[] = ['id', 'name','action'];
  dataSource: MatTableDataSource<Brand>;
  router=inject(Router);
  constructor() {
    this.dataSource=new MatTableDataSource([] as any);
  }
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  brandService=inject(BrandService);

  GetAllBrands(){
    this.brandService.getBrands().subscribe((result:any)=>{
      this.dataSource.data =result;
    });
  }
  ngOnInit() {
    this.GetAllBrands();
  }
  delete(Id:string){

    this.brandService.DeleteBrand(Id).subscribe((result:any)=>{

      if(result.status){
        console.log("category deleted successfully ...")
        this.GetAllBrands();
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
