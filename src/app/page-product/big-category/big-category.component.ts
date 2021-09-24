import {Component, OnInit, ViewChild} from '@angular/core';
import {ProductCategoryAutocompletComponent} from "../../product-category-autocomplet/product-category-autocomplet.component";
import {MatSort} from "@angular/material/sort";
import {MatTableDataSource} from "@angular/material/table";
import {BigCategory, ProductCategory, ProductReceived, SynonymsProduct, User} from "../../classes";
import {ApiService} from "../../api.service";
import {AuthenticationService} from "../../service/authentication.service";
import {MatDialog} from "@angular/material/dialog";
import {ErrorDialogComponent} from "../../error-dialog/error-dialog.component";

@Component({
  selector: 'app-big-category',
  templateUrl: './big-category.component.html',
  styleUrls: ['./big-category.component.css']
})
export class BigCategoryComponent implements OnInit {

  @ViewChild(ProductCategoryAutocompletComponent) productCategoryAutocompletComponent:ProductCategoryAutocompletComponent;
  @ViewChild(MatSort) sort: MatSort;
  dataSource = new MatTableDataSource<BigCategory>();
  columns: string[] = ['id','big_category','product_category','edit'];
  user:User;
  selectable = true;
  removable = true;
  constructor(private api: ApiService, private authenticationService: AuthenticationService, public dialog: MatDialog) {
    this.user = this.authenticationService.userValue;
  }
  ngOnInit(): void {
    this.default();
    this.showTables();
  }
  bigCategory: BigCategory;

  default(){
    this.bigCategory ={
      big_category:null,
      big_category_id:null,
      category:[],
      productCategory:null
    }
    if(this.productCategoryAutocompletComponent !== undefined){
      this.productCategoryAutocompletComponent.myControl.setValue('')
    }
    this.columns = ['id','big_category','product_category','edit'];
  }
  showTables(){
    this.api.getBigCategory().subscribe(data => {
        if(data.length == 0){
          this.dataSource = new MatTableDataSource();
          this.dialog.open(ErrorDialogComponent, {data: "Нет больших категорий"});
        }
        else {

          this.dataSource = new MatTableDataSource(data);
          this.dataSource.sort = this.sort
          this.default();
          if(this.user.role === "ROLE_USER"){
            this.columns.splice(this.columns.length-1, 1);

          }

        }
      },
      error =>{
        this.dialog.open(ErrorDialogComponent, {data: "Ошибка" + error});
        this.dataSource = new MatTableDataSource();
      });

  }
  editSynonyms(element){
  this.bigCategory = element;

  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  saveBigCategory(){
    this.api.saveBigCategory(this.bigCategory).subscribe(data => {
        if(data.length == 0){
          this.dataSource = new MatTableDataSource();
          this.dialog.open(ErrorDialogComponent, {data: "Нет больших категорий"});
        }
        else {

          this.dataSource = new MatTableDataSource(data);
          this.dataSource.sort = this.sort
          this.default();
        }
      },
      error =>{
        this.dialog.open(ErrorDialogComponent, {data: "Ошибка" + error});
        this.dataSource = new MatTableDataSource();
      });
  }
  onChangeCategory(t: any) {
    if (t !== null && typeof t !== 'string') {
     this.bigCategory.category.push(t);
     this.productCategoryAutocompletComponent.myControl.setValue('');
    }
  }
  removeCategory(category: ProductCategory){
    const index = this.bigCategory.category.indexOf(category);

    if (index >= 0) {
      this.bigCategory.category.splice(index, 1);
    }
  }

}
