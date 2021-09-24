import {Component, OnInit, ViewChild} from '@angular/core';
import {MatSort} from "@angular/material/sort";
import {MatTableDataSource} from "@angular/material/table";
import {SynonymsProduct, User} from "../../classes";
import {ApiService} from "../../api.service";
import {AuthenticationService} from "../../service/authentication.service";
import {MatDialog} from "@angular/material/dialog";
import {ErrorDialogComponent} from "../../error-dialog/error-dialog.component";
import {ProductCategoryAutocompletComponent} from "../../product-category-autocomplet/product-category-autocomplet.component";

@Component({
  selector: 'app-synonyms',
  templateUrl: './synonyms.component.html',
  styleUrls: ['./synonyms.component.css']
})
export class SynonymsComponent implements OnInit {
  @ViewChild(ProductCategoryAutocompletComponent) productCategoryAutocompletComponent:ProductCategoryAutocompletComponent;
  @ViewChild(MatSort) sort: MatSort;
  dataSource = new MatTableDataSource<SynonymsProduct>();
  columns: string[] = ['id','product_category','synonyms','edit'];
  user:User;
  constructor(private api: ApiService, private authenticationService: AuthenticationService, public dialog: MatDialog) {
    this.user = this.authenticationService.userValue;
  }
  ngOnInit(): void {
    this.default();
    this.showTables();
  }
  syn: SynonymsProduct;
  default(){
    this.syn = {
      id:null,
      id_category:null,
      product_category:null,
      synonyms:null
    }
   if(this.productCategoryAutocompletComponent !== undefined){
     this.productCategoryAutocompletComponent.myControl.setValue('')
    }
    this.columns= ['id','product_category','synonyms','edit'];
  }
  showTables(){
    this.api.getSynonymsProduct().subscribe(data => {
        if(data.length == 0){
          this.dataSource = new MatTableDataSource();
          this.dialog.open(ErrorDialogComponent, {data: "Нет синонимомов"});
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
    this.syn = element;
    this.productCategoryAutocompletComponent.setCategory(this.syn.product_category);
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  saveSynonyms(){
    if(this.syn.id_category !== null && this.syn.synonyms !== null){
      this.api.saveSynonymsProduct(this.syn).subscribe(data => {
          if(data.length == 0){
            this.dataSource = new MatTableDataSource();
            this.dialog.open(ErrorDialogComponent, {data: "Нет синонимомов"});
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
    else{
      this.dialog.open(ErrorDialogComponent, {data: "Вы не ввели категорию или синонимы"});
    }
  }
  onChangeCategory(t: any) {
    if (t != null && typeof t !== 'string') {
      this.syn.id_category = t.id;
    }
  }
}
