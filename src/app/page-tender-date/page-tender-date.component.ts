import {Component, OnInit, ViewChild} from '@angular/core';
import {MatSort} from '@angular/material/sort';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import {ApiService} from '../api.service';
import {DataRangeComponent} from '../data-range/data-range.component';
import {saveAs} from 'file-saver';

import {
  Company,
  Post,
  Product,
  ProductCategory,
  ProductReceived,
  ReceivedJson,
  Type,
  Vendor
} from '../classes';
import {FormControl, Validators} from '@angular/forms';
import {CustomAutocompletComponent} from '../custom-autocomplet/custom-autocomplet.component';
import {WinnerAutocompletComponent} from '../winner-autocomplet/winner-autocomplet.component';
import {MatDialog} from '@angular/material/dialog';
import {animate, state, style, transition, trigger} from "@angular/animations";
import {VendorCodeAutocompleatComponent} from "../vendor-code-autocompleat/vendor-code-autocompleat.component";
import {ProductCategoryAutocompletComponent} from "../product-category-autocomplet/product-category-autocomplet.component";
import {ErrorDialogComponent} from "../error-dialog/error-dialog.component";
import {MatChipInputEvent} from "@angular/material/chips";
import {COMMA, ENTER, SPACE} from "@angular/cdk/keycodes";
import {ContryAutocompletComponent} from "../contry-autocomplet/contry-autocomplet.component";
import {VendorAutocompletComponent} from "../vendor-autocomplet/vendor-autocomplet.component";
import {of} from "rxjs";


export interface group {
  name: string;
  nameru: string;
}

@Component({
  selector: 'app-page-tender-date',
  templateUrl: './page-tender-date.component.html',
  styleUrls: ['./page-tender-date.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class PageTenderDateComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator | null = null;
  @ViewChild(MatSort) sort: MatSort | null = null;
  dataSource = new MatTableDataSource<Post>();

  // @ViewChild(AutocompletTypeComponent)
  // private autocompletType: AutocompletTypeComponent| undefined;
  @ViewChild(CustomAutocompletComponent)
  private customAutocomplet: CustomAutocompletComponent;

  @ViewChild(WinnerAutocompletComponent)
  private winnerAutocomplet: WinnerAutocompletComponent;

  @ViewChild(ContryAutocompletComponent)
  private contryAutocompletComponent:ContryAutocompletComponent
  @ViewChild(DataRangeComponent)
  private dataRange: DataRangeComponent | undefined;
  @ViewChild(VendorCodeAutocompleatComponent)
  private vendorCodeAutocompleatComponent:VendorCodeAutocompleatComponent;
  @ViewChild(ProductCategoryAutocompletComponent)
  private productCategoryAutocompletComponent:ProductCategoryAutocompletComponent
  @ViewChild(VendorAutocompletComponent)
  private vendorAutocompletComponent:VendorAutocompletComponent;
  expandedElement: Post | null;
  panelOpenState = false;
  dublicate: boolean = true;
  minSum = new FormControl('', [Validators.max(999999999999), Validators.min(0)]);
  maxSum = new FormControl('', [Validators.max(999999999999), Validators.min(0)]);
  innCustomer: string = '';
  ChoseColums: group[] = [];
  displayedColumns: string[] = [];
  displayedColumnsTender: string[] = [];
  displayedColumnsAdjacentTender: string[] = [];
  adjacent_tender: boolean = false;
  AllColums: group[] = [{name: 'id', nameru: 'ID'},
    {name: 'nameTender', nameru: 'Название тендера'},
    {name: 'customer',    nameru: 'Заказчик'},
    {name: 'typetender', nameru: 'Тип тендера'},
    {name: 'sum', nameru: 'Сумма'},
    {name: 'dateStart', nameru: 'Дата начала'},
    {name: 'dateFinish', nameru: 'Дата окончания'},
    {name: 'product', nameru: 'Продукты'},
    {name: 'winner',nameru: 'Победитель'},
    {name: 'winSum', nameru: 'Сумма победителя'}];
Colums: group[];
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  // @ts-ignore
  readonly separatorKeysCodes = [ENTER, COMMA, SPACE] as const;
  ids: number[] = [];
  numberShow = false;
  changeColumn(){
    // this.adjacent_tender = !this.adjacent_tender;
    if(this.adjacent_tender){
      this.Colums = this.AllColums.slice(0,6);
      if(this.isSelected(this.AllColums[7])){
        this.toggleOffer(this.AllColums[7])
      }
      if(this.isSelected(this.AllColums[8])){
        this.toggleOffer(this.AllColums[8])
      }
      if(this.isSelected(this.AllColums[9])){
        this.toggleOffer(this.AllColums[9])
      }
    }
    else{
      this.Colums = this.AllColums;
      if(!this.isSelected(this.AllColums[7])){
        this.toggleOffer(this.AllColums[7])
      }
    }
    this.dataSource = new MatTableDataSource<Post>();
    return this.adjacent_tender;
  }
  add(event: MatChipInputEvent): void {
    let value = (event.value || '').trim();
    let mas = value.split(/ |,|\.|;|:|\\|\//);


    if (value) {
      for (let i of mas) {
        if(i !== ''){
          i = i.replace(/\D/g, '');

          this.ids.push(Number(i));
        }

      }

    }


    event.input.value = null;
  }

  remove(fruit: number): void {
    const index = this.ids.indexOf(fruit);

    if (index >= 0) {
      this.ids.splice(index, 1);
    }
  }

  number_bico: number[] = [];

  addBicoNumber(event: MatChipInputEvent): void {
    let value = (event.value || '').trim();
    let mas = value.split(/ |,|\.|;|:|\\|\//);

    // Add our fruit
    if (value) {
      for (let i of mas) {
        if(i !== ''){
          i = i.replace(/\D/g, '');

          this.number_bico.push(Number(i));
        }

      }

    }

    // Clear the input value
    event.input.value = null;
  }

  removeBicoNumber(fruit: number): void {
    const index = this.number_bico.indexOf(fruit);

    if (index >= 0) {
      this.number_bico.splice(index, 1);
    }
  }

  types: Type[] = [];
  TypeExclude: boolean = false;

  ChangeType(type: any) {
    if (typeof type !== "string") {
      this.types.push(type);
    }
  }

  removeType(type: Type) {
    const index = this.types.indexOf(type);
    if (index >= 0) {
      this.types.splice(index, 1);
    }
  }

  customers: Company[] = [];
  CustomExclude: boolean = false;

  ChangeCustom(customer: any) {
    if (typeof customer !== "string") {
      this.customers.push(customer);
      this.customAutocomplet.myControl.setValue('');
    }
  }

  removeCustom(customer: Company) {
    const index = this.customers.indexOf(customer);
    if (index >= 0) {
      this.customers.splice(index, 1);
    }
  }

  winners: Company[] = [];
  WinnersExclude: boolean = false;

  ChangeWinner(winner: any) {
    if (typeof winner !== "string") {
      this.winners.push(winner);
      this.winnerAutocomplet.myControl.setValue('');
    }
  }

  removeWinner(winner: Company) {
    const index = this.winners.indexOf(winner);
    if (index >= 0) {
      this.winners.splice(index, 1);
    }
  }

  constructor(private api: ApiService, public dialog: MatDialog) {
    for (let index = 0; index < this.AllColums.length - 2; index++) {
      this.ChoseColums.push(this.AllColums[index]);
      this.displayedColumns.push(this.AllColums[index].name);
    }
    this.Colums = this.AllColums;
  }
  country: number;

  ChangeCountry(country: any) {
  if(typeof country !=="string"){
    this.country = country.id;
  }
  }

  default(){
    this.dublicate = true;
    this.TypeExclude = false;
    this.types =[];
    this.CustomExclude = false;
    this.customers = [];
    this.innCustomer = '';
    this.country = null;
    this.WinnersExclude = false;
    this.winners = [];
    this.minSum.setValue(null);
    this.maxSum.setValue(null);
    this.ids = [];
    this.number_bico = [];
    this.numberShow = false;
    this.product = [];
    this.adjacent_tender = false;
    this.Colums = this.AllColums;
    this.contryAutocompletComponent.myControl.setValue('');
    this.dataRange.range.setValue({dateStart:null,dateFinish:null});
    this.productCategoryAutocompletComponent.myControl.setValue('');
    this.vendorAutocompletComponent.myControl.setValue('');
    this.vendorCodeAutocompleatComponent.myControl.setValue('')
  }

  category: ProductCategory = null;
  vendor: Vendor = null;
  vendor_code: Product = null;
  product: ProductReceived[] = [];
  ChangeBigCategory(bigCategory: any){
    if (bigCategory != null && typeof bigCategory !== 'string') {
      this.product.push({category:null, vendor:null, vendor_code:null,big_category:bigCategory});
    }
  }
  ChangeCategory(category : any){
    if (category != null && typeof category !== 'string') {


        if(this.productCategoryAutocompletComponent.myControl.value.id === 7 ){
          this.vendorAutocompletComponent.myControl.disable();
        }
        else {
          this.vendorAutocompletComponent.myControl.enable();
          this.vendorAutocompletComponent.start(category.id);
      }
      this.vendorCodeAutocompleatComponent.start(category.id);
    }
    else if(category === ''){
      this.vendorCodeAutocompleatComponent.start(0);
    }
  }

  ChangeVendor(vendor:any){
    if(vendor != null && typeof vendor !=="string"){
      this.vendorCodeAutocompleatComponent.ChangeVendor(vendor.name);
    }
    else if (vendor === ''){
      this.vendorCodeAutocompleatComponent.ChangeVendor(null);
    }
  }

  ChangeVendorCode(vendor_code: any){
    if (vendor_code != null && typeof vendor_code !== 'string') {
      if(!this.vendorAutocompletComponent.myControl.value && this.productCategoryAutocompletComponent.myControl.value.id !== 7){
        this.vendorAutocompletComponent.setVendor(vendor_code.vendor);
      }


    }
  }

  AddProduct(){
    if((this.productCategoryAutocompletComponent.myControl.value !== null && this.productCategoryAutocompletComponent.myControl.value !== '')
      || (this.vendorAutocompletComponent.myControl.value !== null && this.vendorAutocompletComponent.myControl.value !== '')
      || (this.vendorCodeAutocompleatComponent.myControl.value !== null && this.vendorCodeAutocompleatComponent.myControl.value !== '')){
      if(this.product){
        this.product.push({category: this.productCategoryAutocompletComponent.myControl.value== ''?null:this.productCategoryAutocompletComponent.myControl.value, vendor: this.vendorAutocompletComponent.myControl.value == ''?null:this.vendorAutocompletComponent.myControl.value, vendor_code:this.vendorCodeAutocompleatComponent.myControl.value== ''?null:(this.vendorCodeAutocompleatComponent.myControl.value),big_category:null});

        this.productCategoryAutocompletComponent.myControl.setValue('');
        if(this.vendorAutocompletComponent.myControl.value !== null && this.vendorAutocompletComponent.myControl.value !== ''){

          this.vendorAutocompletComponent.myControl.setValue(null);
        }
        this.vendorCodeAutocompleatComponent.myControl.setValue('');

      }
    }


  }

  removeProduct(product: ProductReceived){
    const index = this.product.indexOf(product);

    if (index >= 0) {
      this.product.splice(index, 1);
    }
  }

  showTables(): void{
    if(!this.adjacent_tender){
      if((this.productCategoryAutocompletComponent.myControl.value !== null && this.productCategoryAutocompletComponent.myControl.value !== '')
        || (this.vendorAutocompletComponent.myControl.value !== null && this.vendorAutocompletComponent.myControl.value !== '')
        || (this.vendorCodeAutocompleatComponent.myControl.value !== null && this.vendorCodeAutocompleatComponent.myControl.value !== '')){
        this.AddProduct();
      }
    }


    const json: ReceivedJson = {
      dateStart: this.dataRange.getDateStart(),
      dateFinish: this.dataRange.getDateFinish(),
      dublicate: this.dublicate,
      quarter: null,
      typeExclude: this.TypeExclude,
      type: this.types,
      customExclude: this.CustomExclude,
      custom: this.customers,
      innCustomer: this.innCustomer,
      country: this.country,
      winnerExclude: this.WinnersExclude,
      winner: this.winners,
      minSum: this.minSum.value,
      maxSum: this.maxSum.value,
      ids: this.ids,
      bicotender: this.number_bico,
      numberShow: this.numberShow,
      product: this.product
    }
    if(this.adjacent_tender){

      this.api.getAdjacentTenderWithParametrs(json).subscribe(posts => {

          if(posts.length === 0){
            this.dataSource = new MatTableDataSource<Post>(posts)
            this.dialog.open(ErrorDialogComponent, { data: 'Найдено 0 тендеров'});
          }
          else{this.dataSource = new MatTableDataSource<Post>(posts) ;
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;}

        },
        error => {
          this.dialog.open(ErrorDialogComponent,{data: 'Ошибка' + error});
        });
    }
    else {
      this.api.getPostWithParametrs(json).subscribe(posts => {

          if(posts.length === 0){
            this.dataSource = new MatTableDataSource<Post>(posts)
            this.dialog.open(ErrorDialogComponent, { data: 'Найдено 0 тендеров'});
          }
          else{this.dataSource = new MatTableDataSource<Post>(posts) ;
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;}

        },
        error => {
          this.dialog.open(ErrorDialogComponent,{data: 'Ошибка' + error});
        });
    }
  }

  getFile(){
    const json: ReceivedJson = {
      dateStart: this.dataRange.getDateStart(),
      dateFinish: this.dataRange.getDateFinish(),
      dublicate: this.dublicate,
      quarter: null,
      typeExclude: this.TypeExclude,
      type: this.types,
      customExclude: this.CustomExclude,
      custom: this.customers,
      innCustomer: this.innCustomer,
      country: this.country,
      winnerExclude: this.WinnersExclude,
      winner: this.winners,
      minSum: this.minSum.value,
      maxSum: this.maxSum.value,
      ids: this.ids,
      bicotender: this.number_bico,
      numberShow: this.numberShow,
      product: this.product
    }
    if (this.adjacent_tender){
      this.api.getFileAdjacentTender(json).subscribe(
        blob => {
          saveAs(blob, "Tender.xlsx");
        },
        error => {
          this.dialog.open(ErrorDialogComponent,{data:"Ошибка" + error});
        }
      );
    }
    else{
      this.api.getFileTender(json).subscribe(
        blob => {
          saveAs(blob, "Tender.xlsx");
        },
        error => {
          this.dialog.open(ErrorDialogComponent,{data:"Ошибка" + error});
        }
      );
    }

  }

  ngOnInit(): void {

  }

  toggleOffer(offer: any): void {
    const index = this.ChoseColums.indexOf(offer);
    if (index >= 0) {
      this.ChoseColums.splice(index, 1);
      const indexDisplay = this.displayedColumns.indexOf(offer.name);
      this.displayedColumns.splice(indexDisplay, 1);
    } else {
      this.ChoseColums.push(offer);
      const indexDisplay = this.AllColums.indexOf(offer);

     this.displayedColumns.splice(indexDisplay, 0, offer.name);
    }
    this.displayedColumns = this.displayedColumns;
  }

  isSelected(offer: any): boolean {

    const index = this.ChoseColums.indexOf(offer);

    return index >= 0;
  }

}

