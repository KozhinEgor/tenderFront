import {Component, OnInit, ViewChild} from '@angular/core';
import {ApiService} from "../api.service";
import {Orders, Product, ProductCategory} from "../classes";
import {map, startWith} from "rxjs/operators";
import {MatTableDataSource} from "@angular/material/table";
import {MatSort} from "@angular/material/sort";
import {ProductCategoryAutocompletComponent} from "../product-category-autocomplet/product-category-autocomplet.component";
import {VendorAutocompletComponent} from "../vendor-autocomplet/vendor-autocomplet.component";

@Component({
  selector: 'app-page-product',
  templateUrl: './page-product.component.html',
  styleUrls: ['./page-product.component.scss']
})
export class PageProductComponent implements OnInit {
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(VendorAutocompletComponent) vendorAutocompletComponent:VendorAutocompletComponent

  Category: ProductCategory = null;
  product:Product = {
    id: null,
    vendor_id:null,
    vendor_code:null,
    frequency: -1,
    usb:null,
    vxi:null,
    portable: null,
    vendor: null,
    channel: -1
  };
  dataSource = new MatTableDataSource<Product>();
  columns: string[] = [];
  constructor(private api: ApiService) { }

  ngOnInit(): void {

  }
  default(){
    this.product = { id: null,
                    vendor_id:null,
                    vendor_code:this.columns.includes("vendor_code")? '' : null,
                    frequency:this.columns.includes("frequency")? 0 : -1,
                    usb:this.columns.includes("usb")? false : null,
                    vxi:this.columns.includes("vxi")? false : null,
                    portable:this.columns.includes("portable")? false : null,
                    vendor:this.columns.includes("vendor")? '' : null,
                    channel:this.columns.includes("channel")? 0 : -1};
    this.vendorAutocompletComponent.myControl.setValue('');
  }
  showTables(){
    if(this.Category !== null) {
      this.columns= ["id", "vendor", "vendor_code", "frequency", "vxi","usb", "portable",  "channel","edit"];
      this.api.getVendorCode(this.Category.id).subscribe(product => {
        for(let i = 0; i < this.columns.length; i++){
          // @ts-ignore
          if(product[0][this.columns[i]] === null) {
            this.columns.splice(i, 1);
            i--;
          }

        }

        this.dataSource = new MatTableDataSource(product);
        this.dataSource.sort = this.sort
        this.default();
      });

    }
  }
  onChange(t: any) {
    if (t != null && typeof t !== 'string') {
      this.Category = t;
    }
  }
  onChangeVendor(t: any){
    if (t != null && typeof t !== 'string') {
      this.product.vendor_id = t.id;
    }
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  editProduct(product: Product){
    this.product = product;
    this.vendorAutocompletComponent.myControl.setValue({name:product.vendor, id:product.vendor_id, second_name:'-'});
    /*
    this.product.id = product.id;
    this.product.channel = product.channel === null? -1:product.channel;
    this.product.vendor_code = product.vendor_code;
    this.product.vendor = product.vendor;
    this.product.vendor_id = product.vendor_id;
    this.product.frequency = product.frequency=== null? -1:product.frequency;
    this.product.vxi = product.vxi;
    this.product.portable = product.portable;
    this.product.usb = product.usb;
     */
  }
  saveProduct(){
    this.api.getSaveProduct(this.product, this.Category.id).subscribe(product => {
      this.dataSource = new MatTableDataSource(product);
      this.dataSource.sort = this.sort
    });

    this.default();
  }
}
