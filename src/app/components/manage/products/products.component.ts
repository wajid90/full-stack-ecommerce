import { pluck } from 'rxjs';
import {AfterViewInit, Component, inject, ViewChild} from '@angular/core';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import {MatSort, MatSortModule} from '@angular/material/sort';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import { ProductService } from '../../../services/product.service';
import { MatButton } from '@angular/material/button';
import { Router, RouterLink } from '@angular/router';
import { Product } from '../../../Types/product';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [MatFormFieldModule, MatInputModule, MatTableModule, MatSortModule, MatPaginatorModule,MatButton,RouterLink],
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss'
})
export class ProductsComponent implements AfterViewInit{
displayedColumns: string[] = ['id', 'name','shortDesription',
  'description',
  'price',
  'discount','action'];
  dataSource: MatTableDataSource<Product>;
  router=inject(Router);
  constructor() {
    this.dataSource=new MatTableDataSource([] as any);
  }

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  productService=inject(ProductService);
  GetAllProduct(){
    this.productService.getProducts().subscribe((result:any)=>{
      this.dataSource.data =result;
    });
  }

  ngOnInit() {
    this.GetAllProduct();
  }
  delete(Id:string){

    this.productService.DeleteProduct(Id).subscribe((result:any)=>{

      if(result.status){
        console.log("product deleted successfully ...")
        this.GetAllProduct();
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
