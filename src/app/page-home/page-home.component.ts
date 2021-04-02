import {Component, OnInit, ViewChild} from '@angular/core';

import {VendorCodeAutocompleatComponent} from "../vendor-code-autocompleat/vendor-code-autocompleat.component";
import {Order, OrderDB, Product, ProductCategory} from "../classes";


@Component({
  selector: 'app-page-home',
  templateUrl: './page-home.component.html',
  styleUrls: ['./page-home.component.scss']
})
export class PageHomeComponent implements OnInit {
  @ViewChild(VendorCodeAutocompleatComponent)
  private vendorCodeAutocomplete: VendorCodeAutocompleatComponent;
  product: Product;
  Category: ProductCategory;

  nameCategory: string;
  vendor = null;
  frequency = null;
  vxi = null;
  portable = null;
  usb = null;
  comment = '';
  number = 0;
  price = null;
  orders: Order[] = [];
  ordersDB: OrderDB[] = [];
  addProduct(){
    this.ordersDB.push({tender: 11, product_category: this.Category.id, comment: this.comment, id_product: this.product.id, number: this.number, price: this.price, win_price: 0});
    this.orders.push({tender: 11, product_category: this.Category.category, id_product: this.vendor + ' ' + this.product.vendor_code, comment: this.comment, number: this.number, price: this.price, win_price: 0});
    console.log(this.orders);
  }
  onChange(t: any){
    this.Category = t;
    this.vendorCodeAutocomplete.start(this.Category.id);

  }
  onChangeVendorCode(product: Product){
    console.log(product);
    this.product = product;
    this.vendor = this.product.vendor;
    this.vxi = this.product.vxi;
    this.portable = this.product.portable;
    this.usb = this.product.usb;
    this.frequency = this.product.frequency;
    console.log(this.vendor);
  }

  constructor() { }
  ngOnInit(): void {
  }
}
