import {Component, Input, OnInit, Output, EventEmitter} from '@angular/core';
import {FormControl} from "@angular/forms";
import {ProductCategory, Type} from "../classes";
import {Observable} from "rxjs";
import {ApiService} from "../api.service";
import {map, startWith} from "rxjs/operators";
import {MatAutocomplete} from "@angular/material/autocomplete";
import {isElementScrolledOutsideView} from "@angular/cdk/overlay/position/scroll-clip";



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
  constructor(private api: ApiService) {
  }
  ngOnInit() {
    this.myControl.setValue('') ;
   console.log(this.myControl);
    this.options = [];
    this.api.getAllProductCategory().subscribe( productCategories => {
      this.options = productCategories;
      this.filteredOptions = this.myControl.valueChanges
        .pipe(
          startWith(''),
          map(value => typeof value === 'string' ? value : value.category),
          map(productCategory => productCategory ? this._filter(productCategory) : this.options.slice())
        );
    });
  }
  public start(): void{
  }
  displayFn(productCategory: ProductCategory): string {
    return productCategory && productCategory.category ? productCategory.category : '';
  }
  public changeValue(category: string): void{
    this.myControl.setValue(this._filter(category));
  }
  public _filter(category: string): ProductCategory[] {
    const filterValue = category.toLowerCase();

    return this.options.filter(option => option.category.toLowerCase().indexOf(filterValue) === 0);
  }
}
