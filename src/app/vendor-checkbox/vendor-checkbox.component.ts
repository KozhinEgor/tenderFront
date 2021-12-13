import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {ProductCategory, Vendor} from "../classes";
import {FormControl} from "@angular/forms";
import {ApiService} from "../api.service";
import {MatDialog} from "@angular/material/dialog";
import {ErrorDialogComponent} from "../error-dialog/error-dialog.component";
import {map, startWith} from "rxjs/operators";

@Component({
  selector: 'app-vendor-checkbox',
  templateUrl: './vendor-checkbox.component.html',
  styleUrls: ['./vendor-checkbox.component.css']
})
export class VendorCheckboxComponent implements OnInit {

  vendors: Vendor[];
  myControl= new FormControl();
  @Output() Change = new EventEmitter<string>();
  constructor(private api: ApiService, private dialog:MatDialog) { }

  ngOnInit(): void {
    this.api.getVendor(0).subscribe( vendors => {
        this.vendors = vendors;
      },
      error => {
        if(error === 'Unknown Error'){this.dialog.open(ErrorDialogComponent, {data: "Ошибка загрузки \"вендоров\": Обратитесь к администратору" });}
        else{this.dialog.open(ErrorDialogComponent, {data: "Ошибка загрузки \"вендоров\": " + error});}

      });

  }

}
