import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FormControl} from "@angular/forms";
import {Product, ProductCategory} from "../classes";
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
  id: number = null;
  categoryProduct: string;
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
          map(productCategory => this._filter(productCategory?productCategory:'', this.categoryProduct?this.categoryProduct:''))
        );
      if(this.name !== null){
        this.setCategory(this.name);
        this.name = null;
      }
      if(this.id !== null){
        this.setCategoryByID(this.id);
        this.id = null;
      }
    },
      error => {
        if(error === 'Unknown Error'){this.dialog.open(ErrorDialogComponent, {data: "Ошибка загрузки \"категорий товаров\" : Обратитесь к администратору"});}
        else{this.dialog.open(ErrorDialogComponent, {data: "Ошибка загрузки \"категорий товаров\": " + error});}

      });


  }


  displayFn(productCategory: ProductCategory): string {
    return productCategory && productCategory.category ? productCategory.category : '';
  }
  setCategory(name: string){
    this.name = name;
      for( let cont of this.options){
        if(cont.category == name){
          this.myControl.setValue(cont);
          break;
        }
      }


  }

  setCategoryByID(id: number){
    this.id = id;
    for( let cont of this.options){
      if(cont.id == id){
        this.myControl.setValue(cont);
        break;
      }
    }


  }
  public ChangeCategoryProduct(categoryProduct: string){
    this.categoryProduct = categoryProduct;
    this.myControl.setValue(this.myControl.value? this.myControl.value:'');
  }

  public _filter(category: string, categoryProduct: string): ProductCategory[] {
    const filterValue = category.toLowerCase();
    const filterCategoryProduct = categoryProduct.toLowerCase();
    return this.options.filter(option => {
      let val: boolean = true;
      let cat:boolean = true;
        if(filterValue !== '' && option.category !== null && typeof option.category === "string"){
          val =  option.category.toLowerCase().includes(filterValue);

        }
        else if(filterValue !== '' && option.category === null && typeof option.category !== "string") {val = false;}

        if(filterCategoryProduct !== '' && option.category_product !== null && typeof option.category_product === "string"){
          cat =  option.category_product.toLowerCase().includes(filterCategoryProduct);

        }
        else if(filterCategoryProduct !== '' && option.category_product === null && typeof option.category_product !== "string") {cat = false;}
      return val && cat;
    }
    )
  }
}
