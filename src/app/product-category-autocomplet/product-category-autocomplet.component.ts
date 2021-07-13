import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FormControl} from "@angular/forms";
import {ProductCategory} from "../classes";
import {Observable} from "rxjs";
import {ApiService} from "../api.service";
import {map, startWith} from "rxjs/operators";
import {MatDialog} from "@angular/material/dialog";
import {ErrorDialogComponent} from "../error-dialog/error-dialog.component";


@Component({
  selector: 'app-product-category-autocomplet',
  templateUrl: './product-category-autocomplet.component.html',
  styleUrls: ['./product-category-autocomplet.component.css']
})
export class ProductCategoryAutocompletComponent implements OnInit {

  // tslint:disable-next-line:no-output-on-prefix
  @Output() Change = new EventEmitter<number>();
  myControl = new FormControl();
  options: ProductCategory[] = [];
  filteredOptions: Observable<ProductCategory[]> | undefined;
  name: string = null;
  constructor(private api: ApiService, private dialog:MatDialog) {
  }
  ngOnInit() {
  this.request();
  }
  request(){
    this.api.getAllProductCategory().subscribe( productCategories => {
      this.options = productCategories;
      this.filteredOptions = this.myControl.valueChanges
        .pipe(
          startWith(''),
          map(value => typeof value === 'string' ? value : value.category),
          map(productCategory => productCategory ? this._filter(productCategory) : this.options.slice())
        );
      if(this.name !== null){
        this.setCategory(this.name);
        this.name = null;
      }
    },
      error => {
        if(error === 'Unknown Error'){this.dialog.open(ErrorDialogComponent, {data: "Ошибка загрузки \"категорий товаров\" : Обратитесь к администратору"});}
        else{this.dialog.open(ErrorDialogComponent, {data: "Ошибка загрузки \"категорий товаров\": " + error});}

      });


  }
  public start(): void{
  }
  displayFn(productCategory: ProductCategory): string {
    return productCategory && productCategory.category ? productCategory.category : '';
  }
  setCategory(name: string){
    this.name = name;
      for( let cont of this.options){
        if(cont.category == name){
          this.myControl.setValue(cont);
        }
      }


  }
  public _filter(category: string): ProductCategory[] {
    const filterValue = category.toLowerCase();

    return this.options.filter(option => option.category.toLowerCase().indexOf(filterValue) === 0);
  }
}
