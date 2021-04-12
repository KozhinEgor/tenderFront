import {Component, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';

import {VendorCodeAutocompleatComponent} from '../vendor-code-autocompleat/vendor-code-autocompleat.component';
import {Orders, OrdersDB, Post, Product, ProductCategory, Vendor} from '../classes';
import {MatTableDataSource} from "@angular/material/table";
import {SelectionModel} from "@angular/cdk/collections";
import {ProductCategoryAutocompletComponent} from "../product-category-autocomplet/product-category-autocomplet.component";



@Component({
  selector: 'app-page-home',
  templateUrl: './page-home.component.html',
  styleUrls: ['./page-home.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class PageHomeComponent implements OnInit {
  constructor() {}
  ngOnInit(): void {
  }
}
