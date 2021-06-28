import {Component, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';

import {VendorCodeAutocompleatComponent} from '../vendor-code-autocompleat/vendor-code-autocompleat.component';
import {Orders, OrdersDB, Post, Product, ProductCategory, User, Vendor} from '../classes';
import {MatTableDataSource} from "@angular/material/table";
import {SelectionModel} from "@angular/cdk/collections";
import {ProductCategoryAutocompletComponent} from "../product-category-autocomplet/product-category-autocomplet.component";
import {AuthenticationService} from "../service/authentication.service";



@Component({
  selector: 'app-page-home',
  templateUrl: './page-home.component.html',
  styleUrls: ['./page-home.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class PageHomeComponent implements OnInit {
  user:User
  constructor( private authenticationService: AuthenticationService) {
    this.user = this.authenticationService.userValue;
  }
  ngOnInit(): void {

  }
}
