import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormControl} from "@angular/forms";
import {Product} from "../classes";
import {Observable} from "rxjs";
import {ApiService} from "../api.service";
import {map, startWith} from "rxjs/operators";

@Component({
  selector: 'app-vendor-code-autocompleat',
  templateUrl: './vendor-code-autocompleat.component.html',
  styleUrls: ['./vendor-code-autocompleat.component.css']
})
export class VendorCodeAutocompleatComponent implements OnInit {

  // tslint:disable-next-line:no-output-on-prefix
  @Output() Change = new EventEmitter<Product>();


  myControl = new FormControl();
  options: Product[] = [];
  filteredOptions: Observable<Product[]> | undefined;
  vendor: string;
  constructor(private api: ApiService) {
  }
  public start(productCategory: number){
    this.vendor = null;
    this.api.getVendorCode(productCategory).subscribe( product => {
      this.options = product;
      this.filteredOptions = this.myControl.valueChanges
        .pipe(
          startWith(''),
          map(value => typeof value === 'string' ? value : value.vendor_code),
          map(productVendorCode => {
            if(productVendorCode){

            return this._filter(productVendorCode)
          }
            else if(this.vendor){
              return this._filterVendor(this.vendor);
            }

          else{return this.options.slice();}


          }));
    })
  }

  ngOnInit() {
  }

  displayFn(product: Product): string {
    return product && product.vendor_code ? product.vendor_code : '';
  }

  private _filter(vendorCode: string): Product[] {
    const filterValue = vendorCode.toLowerCase();

    return this.options.filter(option => option.vendor_code.toLowerCase().includes(filterValue));
  }
  public ChangeVendor(vendor: string){
    this.vendor = vendor;
    this.myControl.setValue(this.myControl.value? this.myControl.value:'');
  }
  public _filterVendor(vendor: string): Product[]{
    const filterVendor = vendor.toLowerCase();
    return this.options.filter(option => option.vendor.toLowerCase().includes(filterVendor));
  }
  getProduct(): any{
    return this.myControl.value != null ? this.myControl.value.id : '%';
  }
}
