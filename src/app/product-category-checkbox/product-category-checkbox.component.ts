import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {ApiService} from "../api.service";
import {map, startWith} from "rxjs/operators";
import {ErrorDialogComponent} from "../error-dialog/error-dialog.component";
import {ProductCategory} from "../classes";
import {MatDialog} from "@angular/material/dialog";
import {FormControl} from "@angular/forms";

@Component({
  selector: 'app-product-category-checkbox',
  templateUrl: './product-category-checkbox.component.html',
  styleUrls: ['./product-category-checkbox.component.css']
})
export class ProductCategoryCheckboxComponent implements OnInit {
  all_product_categories: ProductCategory[];
  product_categories: ProductCategory[];
  myControl= new FormControl();
  @Output() Change = new EventEmitter<string>();
  constructor(private api: ApiService, private dialog:MatDialog) { }

  ngOnInit(): void {
    this.api.getAllProductCategory().subscribe( productCategories => {
        this.all_product_categories = productCategories;
        this.product_categories = productCategories;

      },
      error => {
        if(error === 'Unknown Error'){this.dialog.open(ErrorDialogComponent, {data: "Ошибка загрузки \"категорий товаров\" : Обратитесь к администратору"});}
        else{this.dialog.open(ErrorDialogComponent, {data: "Ошибка загрузки \"категорий товаров\": " + error});}

      });

  }
  public ChangeCategoryProduct(categoryProduct: string){
    this.product_categories = this.all_product_categories;
    this.product_categories = this.product_categories.filter(category => {return category.category_product.includes(categoryProduct)});
  }
}
