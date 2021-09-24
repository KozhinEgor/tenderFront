import {Component, Inject, OnInit, ViewChild} from '@angular/core';
import {ApiService} from "../api.service";
import {ChangeCategory, CreateTable, Product, ProductCategory, SynonymsProduct, User} from "../classes";
import {MatTableDataSource} from "@angular/material/table";
import {MatSort} from "@angular/material/sort";
import {ProductCategoryAutocompletComponent} from "../product-category-autocomplet/product-category-autocomplet.component";
import {VendorAutocompletComponent} from "../vendor-autocomplet/vendor-autocomplet.component";
import {AuthenticationService} from "../service/authentication.service";
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import {saveAs} from 'file-saver';
import {DialogData, ErrorDialogComponent} from "../error-dialog/error-dialog.component";
import {VendorCodeAutocompleatComponent} from "../vendor-code-autocompleat/vendor-code-autocompleat.component";

@Component({
  selector: 'app-page-product',
  templateUrl: './page-product.component.html',
  styleUrls: ['./page-product.component.scss']
})
export class PageProductComponent implements OnInit {
  constructor() {
  }
  ngOnInit() {
  }
}
