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
  constructor(private api: ApiService) {
  }
  public start(productCategory: number){
    this.api.getVendorCode(productCategory).subscribe( product => {
      this.options = product;
      this.filteredOptions = this.myControl.valueChanges
        .pipe(
          startWith(''),
          map(value => typeof value === 'string' ? value : value.vendor_code),
          map(productVendorCode => productVendorCode ? this._filter(productVendorCode) : this.options.slice())
        );
    });
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
  getProduct(): any{
    return this.myControl.value != null ? this.myControl.value.id : '%';
  }
}
