import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FormControl} from "@angular/forms";
import {Product} from "../classes";
import {Observable} from "rxjs";
import {ApiService} from "../api.service";
import {map, startWith} from "rxjs/operators";
import {MatDialog} from "@angular/material/dialog";
import {ErrorDialogComponent} from "../error-dialog/error-dialog.component";

@Component({
  selector: 'app-vendor-code-autocompleat',
  templateUrl: './vendor-code-autocompleat.component.html',
  styleUrls: ['./vendor-code-autocompleat.component.css']
})
export class VendorCodeAutocompleatComponent implements OnInit {

  // tslint:disable-next-line:no-output-on-prefix
  @Output() Change = new EventEmitter<Product>();

  subcategory: string;
  myControl = new FormControl();
  options: Product[] = [];
  filteredOptions: Observable<Product[]> | undefined;
  vendor: string;
  constructor(private api: ApiService, private dialog:MatDialog) {
  }
  public start(productCategory: number){
    this.vendor = null;
    this.api.getVendorCode(productCategory).subscribe( product => {
      this.options = product;
      if(product != null){
        this.filteredOptions = this.myControl.valueChanges
          .pipe(
            startWith(''),
            map(value => typeof value === 'string' ? value : value.vendor_code),
            map(productVendorCode => this._filter(productVendorCode?productVendorCode:'',this.vendor?this.vendor:'',this.subcategory?this.subcategory:'')
            )
          );
      }

    },
      error => {
        if(error === 'Unknown Error'){this.dialog.open(ErrorDialogComponent, {data: "Ошибка загрузки \"артикулов\": Обратитесь к администратору"});}
        else{this.dialog.open(ErrorDialogComponent, {data: "Ошибка загрузки \"артикулов\": " + error});}

      })
  }

  ngOnInit() {
  }

  displayFn(product: Product): string {
    return product && product.vendor_code ? product.vendor_code : '';
  }

  private _filter(vendorCode: string,vendor: string, subcategory: string): Product[] {
    const filterValue = vendorCode.toLowerCase();
    const filterSubcategory = subcategory.toLowerCase();
    const filterVendor = typeof vendor === 'string'?vendor.toLowerCase():'';

    return this.options.filter(option =>{
      let sub: boolean = true;
      let ven: boolean = true;
      let val: boolean = true;

      if(filterSubcategory !== '' && option.subcategory !== null && typeof option.subcategory === "string"){
        sub =  option.subcategory.toLowerCase().includes(filterSubcategory);

      }
      else if(filterSubcategory !== '' && option.subcategory === null && typeof option.subcategory !== "string") {sub = false;}
      if(filterVendor !== '' && option.vendor!=null && typeof  option.vendor === "string"){
        ven = option.vendor.toLowerCase().includes(filterVendor);
      }
      else if(filterVendor !== '' && option.vendor === null && typeof  option.vendor !== "string") { ven = false;}
      if(filterValue !== '' && option.vendor_code != null && typeof  option.vendor_code === "string"){
        val = option.vendor_code.toLowerCase().includes(filterValue);
      }
      else if (filterValue !== '' && option.vendor_code === null && typeof option.vendor_code !== "string"){ val = false}
      return sub && ven && val;
    }
    );
  }
  public ChangeVendor(vendor: string){
    this.vendor = vendor;
    this.myControl.setValue(this.myControl.value? this.myControl.value:'');
  }


  getProduct(): any{
    return this.myControl.value != null ? this.myControl.value.id : '%';
  }
  ChangeSubcategory(subcategory: string){
    this.subcategory = subcategory;
    this.myControl.setValue(this.myControl.value? this.myControl.value:'');
  }
}
