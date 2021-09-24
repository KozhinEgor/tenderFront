import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {
  Company,
  Post,
  Product,
  ProductCategory, ProductReceived, ReceivedJson,
  ReportQuarter,
  ReportVendorQuarter,
  Type,
  Vendor
} from '../classes';
import {ApiService} from '../api.service';
import {FormControl, Validators} from "@angular/forms";
import {MatSort} from '@angular/material/sort';
import {CustomAutocompletComponent} from "../custom-autocomplet/custom-autocomplet.component";
import {WinnerAutocompletComponent} from "../winner-autocomplet/winner-autocomplet.component";
import {ContryAutocompletComponent} from "../contry-autocomplet/contry-autocomplet.component";
import {DataRangeComponent} from "../data-range/data-range.component";
import {VendorCodeAutocompleatComponent} from "../vendor-code-autocompleat/vendor-code-autocompleat.component";
import {ProductCategoryAutocompletComponent} from "../product-category-autocomplet/product-category-autocomplet.component";
import {VendorAutocompletComponent} from "../vendor-autocomplet/vendor-autocomplet.component";
import {COMMA, ENTER, SPACE} from "@angular/cdk/keycodes";
import {MatChipInputEvent} from "@angular/material/chips";
import {MatDialog} from "@angular/material/dialog";
import {ErrorDialogComponent} from "../error-dialog/error-dialog.component";
import {saveAs} from 'file-saver';

@Component({
  selector: 'app-page-report',
  templateUrl: './page-report.component.html',
  styleUrls: ['./page-report.component.scss']
})
export class PageReportComponent implements OnInit{
  constructor() {
  }
  ngOnInit() {
  }
}
