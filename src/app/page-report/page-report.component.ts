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

export interface Quarter_count{
  [key: string]: number;
}
export interface Vendor_quarter{
  vendor: string;
  quarter_count: Quarter_count[];
}
@Component({
  selector: 'app-page-report',
  templateUrl: './page-report.component.html',
  styleUrls: ['./page-report.component.scss']
})
export class PageReportComponent implements OnInit{
  constructor(private api: ApiService, private dialog:MatDialog) {

  }
  load : boolean;
  noVendorNULL: boolean;
  vendorNUll: boolean;
  reportQuarter: ReportQuarter[] = [];
  dataSource = new MatTableDataSource<ReportQuarter>();
  data = new MatTableDataSource<ReportVendorQuarter>();
  dataS = new MatTableDataSource<ReportVendorQuarter>();
  colums: string[] =[];
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatSort) sorting: MatSort;
  q: Quarter_count[] = null;


  tabs:ProductCategory[] = [];
  selected = new FormControl(0);

  @ViewChild(CustomAutocompletComponent)
  private customAutocomplet: CustomAutocompletComponent | undefined;
  @ViewChild(WinnerAutocompletComponent)
  private winnerAutocomplet: WinnerAutocompletComponent | undefined;
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
  panelOpenState = true;
  dublicate: boolean = false;
  quarter: boolean = false;
  minSum = new FormControl(1, [Validators.max(999999999999), Validators.min(0)]);
  maxSum = new FormControl('', [Validators.max(999999999999), Validators.min(0)]);
  innCustomer: string = '';

  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  // @ts-ignore
  readonly separatorKeysCodes = [ENTER, COMMA, SPACE] as const;
  ids: number[] = [];
  numberShow = false;

  add(event: MatChipInputEvent): void {
    let value = (event.value || '').trim();
    let mas = value.split(/ |,|\.|;|:|\\|\//);


    if (value) {
      for (let i of mas) {
        i = i.replace(/\D/g, '');

        this.ids.push(Number(i));
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
        i = i.replace(/\D/g, '');

        this.number_bico.push(Number(i));
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

  country: number;
  ChangeCountry(country: any) {
    if(typeof country !=="string"){
      this.country = country.id;
    }
  }

  default(){
    this.dublicate = false;
    this.quarter = false;
    this.TypeExclude = false;
    this.types =[];
    this.CustomExclude = false;
    this.customers = [];
    this.innCustomer = '';
    this.country = null;
    this.WinnersExclude = false;
    this.winners = [];
    this.minSum.setValue(1);
    this.maxSum.setValue(null);
    this.ids = [];
    this.number_bico = [];
    this.numberShow = false;
    this.product = [];
    this.category = null;
    this.vendor = null;
    this.vendor_code = null;
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

  ChangeCategory(category : any){
    if (category != null && typeof category !== 'string') {
      this.category = category;

      if(this.category.id === 7 ){
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
      this.vendor = vendor;
      this.vendorCodeAutocompleatComponent.ChangeVendor(vendor.name);
    }
    else if (vendor === ''){
      this.vendorCodeAutocompleatComponent.ChangeVendor(null);
    }
  }

  ChangeVendorCode(vendor_code: any){
    if (vendor_code != null && typeof vendor_code !== 'string') {
      if(!this.vendor && this.category.id !== 7){
        this.vendorAutocompletComponent.setVendor(vendor_code.vendor);
      }

      this.vendor_code = vendor_code;
    }
  }

  AddProduct(){
    if((this.productCategoryAutocompletComponent.myControl.value !== null && this.productCategoryAutocompletComponent.myControl.value !== '')
      || (this.vendorAutocompletComponent.myControl.value !== null && this.vendorAutocompletComponent.myControl.value !== '')
      || (this.vendorCodeAutocompleatComponent.myControl.value !== null && this.vendorCodeAutocompleatComponent.myControl.value !== '')){
      if(this.product){
        this.product.push({category: this.productCategoryAutocompletComponent.myControl.value== ''?null:this.productCategoryAutocompletComponent.myControl.value,
          vendor: this.vendorAutocompletComponent.myControl.value == ''?null:this.vendorAutocompletComponent.myControl.value,
          vendor_code:this.vendorCodeAutocompleatComponent.myControl.value== ''?null:this.vendorCodeAutocompleatComponent.myControl.value});

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

  loadReport(){
    this.reportQuarter = null;
    this.load = true;
    this.data = null;
    this.dataS = null;
    this.colums = [];
    if(this.receivedJson == null){
      this.showOrder();
    }

    this.api.getReportQuarter(this.tabs[this.selected.value].id, this.receivedJson).subscribe(posts => {

      if(posts.length > 0){
        this.dataSource = new MatTableDataSource<ReportQuarter>(posts);
        this.dataSource.sort = this.sort;
        this.reportQuarter = posts;
        this.setColums();
      }
      else {
        this.dialog.open(ErrorDialogComponent,{data:"Для ваших условий поиска не найдено тендеров"})
      }
        this.load = false;},
      error => {this.dialog.open(ErrorDialogComponent,{data: "Ошибка" + error})}
      );
    this.api.getReportVendorQuarter(this.tabs[this.selected.value].id, this.receivedJson).subscribe(posts => {
        this.vendorNUll = false;
        if(posts.length > 0){
          this.data = new MatTableDataSource<ReportVendorQuarter>(posts);
        }
        else {
          this.vendorNUll = true;
        }
        this.load = false;},
      error => {this.dialog.open(ErrorDialogComponent,{data: "Ошибка" + error})}
      );

    this.api.getReportNoVendorQuarter(this.tabs[this.selected.value].id, this.receivedJson).subscribe(posts => {

      this.noVendorNULL =false;
      if(posts.length > 0){
          this.dataS = new MatTableDataSource<ReportVendorQuarter>(posts);
      }
      else {
        this.noVendorNULL = true;
      }
        this.load = false;},
      error => {this.dialog.open(ErrorDialogComponent,{data: "Ошибка" + error})}
      );

  }

  ngOnInit(): void {
    this.api.getAllProductCategory().subscribe(data =>{
      let cat:any;

      for(cat of data){
        if(cat.category !== 'Продукты'){
          this.tabs.push(cat);
        }
      }
    },
      error => {this.dialog.open(ErrorDialogComponent,{data:"Ошибка" + error})})
      this.selected.setValue(0);

  }

  setColums(){
    this.colums.push('vendor');
    for(let index = 0;index< this.reportQuarter.length;index++){
      this.colums.push(this.reportQuarter[index].year.toString()+ ' ' + this.reportQuarter[index].quarter.toString());
    }
  }

  getCount(column: string, element: ReportVendorQuarter){
    if(column === 'vendor'){
      return element.vendor
    }
    else if(typeof element.quarter !== "undefined"){
      return element.quarter[column]
    }
    else {
      return 0;
    }
  }

  receivedJson:ReceivedJson = null;
  getFile(){
    this.dialog.open(ErrorDialogComponent,{data:"Фомирую файл!!! Дождитесь загрузки!!!!"});
    if((this.productCategoryAutocompletComponent.myControl.value !== null && this.productCategoryAutocompletComponent.myControl.value !== '')
      || (this.vendorAutocompletComponent.myControl.value !== null && this.vendorAutocompletComponent.myControl.value !== '')
      || (this.vendorCodeAutocompleatComponent.myControl.value !== null && this.vendorCodeAutocompleatComponent.myControl.value !== '')){
      this.AddProduct();
    }
    this.receivedJson = {
      dateStart: this.dataRange.getDateStart(),
      dateFinish: this.dataRange.getDateFinish(),
      dublicate: this.dublicate,
      quarter: this.quarter,
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
    this.api.fileQuarter(this.receivedJson).subscribe(blob => {
        saveAs(blob, "Report.xlsx");
      },
      error => {
        this.dialog.open(ErrorDialogComponent,{data:"Ошибка" + error});
      });
  }

  show:boolean = false;

  showOrder(){
    this.show = true;
    if((this.productCategoryAutocompletComponent.myControl.value !== null && this.productCategoryAutocompletComponent.myControl.value !== '')
      || (this.vendorAutocompletComponent.myControl.value !== null && this.vendorAutocompletComponent.myControl.value !== '')
      || (this.vendorCodeAutocompleatComponent.myControl.value !== null && this.vendorCodeAutocompleatComponent.myControl.value !== '')){
      this.AddProduct();
    }
    this.receivedJson = {
      dateStart: this.dataRange.getDateStart(),
      dateFinish: this.dataRange.getDateFinish(),
      dublicate: this.dublicate,
      quarter: this.quarter,
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
    this.loadReport();
  }
}
