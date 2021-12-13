import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {Product, ProductCategory} from "../classes";
import {FormControl} from "@angular/forms";
import {ApiService} from "../api.service";
import {MatDialog} from "@angular/material/dialog";
import {ErrorDialogComponent} from "../error-dialog/error-dialog.component";
import {map, startWith} from "rxjs/operators";

@Component({
  selector: 'app-vendor-code-checkbox',
  templateUrl: './vendor-code-checkbox.component.html',
  styleUrls: ['./vendor-code-checkbox.component.css']
})
export class VendorCodeCheckboxComponent implements OnInit {

  vendor_codes: Product[];
  myControl= new FormControl();
  @Output() Change = new EventEmitter<string>();
  constructor(private api: ApiService, private dialog:MatDialog) { }

  ngOnInit(): void {
   this.myControl.disable();
  }

  public start(productCategory: number){

    this.api.getVendorCode(productCategory).subscribe( product => {
        this.vendor_codes = product;

      },
      error => {
        if(error === 'Unknown Error'){this.dialog.open(ErrorDialogComponent, {data: "Ошибка загрузки \"артикулов\": Обратитесь к администратору"});}
        else{this.dialog.open(ErrorDialogComponent, {data: "Ошибка загрузки \"артикулов\": " + error});}

      })
  }
  public filterProduct(vendor:string){
    this.vendor_codes.filter(product => {return product.vendor == vendor});
  }
}
