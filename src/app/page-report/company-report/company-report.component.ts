import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ApiService} from "../../api.service";
import {MatDialog} from "@angular/material/dialog";
import {
  BigCategory,
  Company,
  Post, Product,
  ProductCategory, ProductReceived, ReceivedJson, Report, ReportCriteria,
  ReportQuarter,
  ReportVendorQuarter,
  Type,
  Vendor
} from "../../classes";
import {MatTableDataSource} from "@angular/material/table";
import {MatSort} from "@angular/material/sort";
import {Quarter_count} from "../product-report/product-report.component";
import {FormControl, Validators} from "@angular/forms";
import {CustomAutocompletComponent} from "../../custom-autocomplet/custom-autocomplet.component";
import {WinnerAutocompletComponent} from "../../winner-autocomplet/winner-autocomplet.component";
import {ContryAutocompletComponent} from "../../contry-autocomplet/contry-autocomplet.component";
import {DataRangeComponent} from "../../data-range/data-range.component";
import {VendorCodeAutocompleatComponent} from "../../vendor-code-autocompleat/vendor-code-autocompleat.component";
import {ProductCategoryAutocompletComponent} from "../../product-category-autocomplet/product-category-autocomplet.component";
import {VendorAutocompletComponent} from "../../vendor-autocomplet/vendor-autocomplet.component";
import {COMMA, ENTER, SPACE} from "@angular/cdk/keycodes";
import {MatChipInputEvent} from "@angular/material/chips";
import {ErrorDialogComponent} from "../../error-dialog/error-dialog.component";
import {saveAs} from 'file-saver';
import {SubcategoryAutocompletComponent} from "../../subcategory-autocomplet/subcategory-autocomplet.component";
import {ProductCategoryCheckboxComponent} from "../../product-category-checkbox/product-category-checkbox.component";
import {VendorCheckboxComponent} from "../../vendor-checkbox/vendor-checkbox.component";
import {SubcategoryCheckboxComponent} from "../../subcategory-checkbox/subcategory-checkbox.component";
import {CategoryProductComponent} from "../../category-product/category-product.component";
import {TypeProductOrderComponent} from "../../type-product-order/type-product-order.component";
import {VendorCodeCheckboxComponent} from "../../vendor-code-checkbox/vendor-code-checkbox.component";
import {RegionSelectedComponent} from "../../region-selected/region-selected.component";
import {DistrictSelectedComponent} from "../../district-selected/district-selected.component";
@Component({
  selector: 'app-company-report',
  templateUrl: './company-report.component.html',
  styleUrls: ['./company-report.component.scss']
})
export class CompanyReportComponent implements OnInit {



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
  @ViewChild('firstSort', { static: false }) firstSort: MatSort;
  q: Quarter_count[] = null;


  tabs:String[] = ["Заказчики","Победители"];
  selected = new FormControl(0);

  @ViewChild(CustomAutocompletComponent)
  private customAutocomplet: CustomAutocompletComponent | undefined;
  @ViewChild(WinnerAutocompletComponent)
  private winnerAutocomplet: WinnerAutocompletComponent | undefined;
  @ViewChild(ContryAutocompletComponent)
  private contryAutocompletComponent:ContryAutocompletComponent
  @ViewChild(DataRangeComponent)
  private dataRange: DataRangeComponent | undefined;

  @ViewChild(VendorCodeCheckboxComponent)
  private vendorCodeCheckboxComponent:VendorCodeCheckboxComponent;
  @ViewChild(ProductCategoryCheckboxComponent)
  private productCategoryCheckboxComponent:ProductCategoryCheckboxComponent
  @ViewChild(VendorCheckboxComponent)
  private vendorCheckboxComponent:VendorCheckboxComponent;
  @ViewChild(SubcategoryCheckboxComponent)
  private subcategoryCheckboxComponent: SubcategoryCheckboxComponent
  @ViewChild(CategoryProductComponent)
  private categoryProductComponent:CategoryProductComponent
  @ViewChild(TypeProductOrderComponent)
  private typeProductOrderComponent:TypeProductOrderComponent
  @ViewChild(RegionSelectedComponent)
  regionSelectedComponent:RegionSelectedComponent;
  @ViewChild(DistrictSelectedComponent)
  districtSelectedComponent:DistrictSelectedComponent;
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
    if(country === '' || country === null || country === undefined){
      this.country = null;
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

    this.categoryProductComponent.category_product = "";
    this.categoryProductComponent.setCategory_product('');
    this.productCategoryCheckboxComponent.myControl.setValue([]);
    this.vendorCodeCheckboxComponent.myControl.setValue([]);
    this.vendorCodeCheckboxComponent.myControl.disable();
    this.vendorCheckboxComponent.myControl.setValue([]);
    this.subcategoryCheckboxComponent.myControl.setValue([]);
    this.typeProductOrderComponent.type = "Год";
    this.productCategoryCheckboxComponent.ChangeCategoryProduct('');
  }

  category: ProductCategory = null;
  vendor: Vendor = null;
  vendor_code: Product = null;
  product: ProductReceived[] = [];
  ChangeBigCategory(bigCategory: any) {
    if (bigCategory != null && typeof bigCategory !== 'string') {
      this.product.push({category: null, vendor: null, vendor_code: null, big_category: bigCategory, subcategory: null, category_product:null});
    }
  }

  ChangeCategoryProduct(categoryProduct: any) {
    if (categoryProduct != null) {
      this.productCategoryCheckboxComponent.ChangeCategoryProduct(categoryProduct);
    }
  }

  ChangeCategory(category : any){
    if (category != null && this.productCategoryCheckboxComponent.myControl.value.length  !== 0) {
      if(this.productCategoryCheckboxComponent.myControl.value.length === 1){
        this.vendorCodeCheckboxComponent.myControl.enable();
        this.vendorCodeCheckboxComponent.start(this.productCategoryCheckboxComponent.myControl.value[0].id);
      }
      else{this.vendorCodeCheckboxComponent.myControl.disable()}
    }
    else if(category === ''){
      this.vendorCodeCheckboxComponent.myControl.setValue([]);

      this.vendorCodeCheckboxComponent.myControl.disable();

    }
  }



  ChangeVendor(vendor: any) {
    if (vendor != null && this.vendorCheckboxComponent.myControl.value.length !== 0) {
      if(this.vendorCheckboxComponent.myControl.value.length === 1 && this.productCategoryCheckboxComponent.myControl.value.length === 1){
        this.vendorCodeCheckboxComponent.filterProduct(vendor[0].name)
      }
    }
  }

  AddProduct() {
    if ((this.productCategoryCheckboxComponent.myControl.value !== undefined && this.productCategoryCheckboxComponent.myControl.value !== null && this.productCategoryCheckboxComponent.myControl.value.length !== 0  && this.productCategoryCheckboxComponent.myControl.value !== [])
      || (this.vendorCheckboxComponent.myControl.value !== undefined && this.vendorCheckboxComponent.myControl.value !== null && this.vendorCheckboxComponent.myControl.value.length !== 0 && this.vendorCheckboxComponent.myControl.value !== [])
      || (this.vendorCodeCheckboxComponent.myControl.value  !== undefined && this.vendorCodeCheckboxComponent.myControl.value !== null && this.vendorCodeCheckboxComponent.myControl.value.length !== 0 && this.vendorCodeCheckboxComponent.myControl.value !== [])
      || (this.subcategoryCheckboxComponent.myControl.value !== undefined && this.subcategoryCheckboxComponent.myControl.value !== null && this.subcategoryCheckboxComponent.myControl.value.length !== 0 && this.subcategoryCheckboxComponent.myControl.value !== [])
      || (this.categoryProductComponent.category_product !== undefined && this.categoryProductComponent.category_product !== null && this.categoryProductComponent.category_product !== '')) {
      if (this.product) {
        this.product.push({
          category: this.productCategoryCheckboxComponent.myControl.value == [] ? null : this.productCategoryCheckboxComponent.myControl.value,
          vendor: this.vendorCheckboxComponent.myControl.value == [] ? null : this.vendorCheckboxComponent.myControl.value,
          vendor_code: this.vendorCodeCheckboxComponent.myControl.value == [] ? null : (this.vendorCodeCheckboxComponent.myControl.value),
          big_category: null,
          subcategory: this.subcategoryCheckboxComponent.myControl.value == []? null : this.subcategoryCheckboxComponent.myControl.value,
          category_product:this.categoryProductComponent.category_product
        });
        console.log(this.product);
        this.productCategoryCheckboxComponent.myControl.setValue([]);
        if (this.vendorCheckboxComponent.myControl.value !== null && this.vendorCheckboxComponent.myControl.value !== []) {
          this.vendorCheckboxComponent.myControl.setValue([]);
        }
        this.categoryProductComponent.category_product = "";
        this.vendorCodeCheckboxComponent.myControl.setValue([]);
        this.vendorCodeCheckboxComponent.myControl.disable();
        if(this.subcategoryCheckboxComponent.myControl.value !== null && this.subcategoryCheckboxComponent.myControl.value !== []){
          this.subcategoryCheckboxComponent.myControl.setValue('')
        }
        this.productCategoryCheckboxComponent.ChangeCategoryProduct('');
      }
    }
  }

  removeProduct(product: ProductReceived){
    const index = this.product.indexOf(product);

    if (index >= 0) {
      this.product.splice(index, 1);
    }
  }
  reportCriteria:ReportCriteria = {interval: 'Год', receivedJSON: null}
  report:Report;

  loadReport(){
    this.reportCriteria = {interval: this.typeProductOrderComponent.type === null?'Год':this.typeProductOrderComponent.type
      ,receivedJSON:this.receivedJson}
    if(this.receivedJson == null){
      this.showOrder();
    }
  this.load = true;

    this.api.getReportCustomerQuarter(this.selected.value, this.reportCriteria).subscribe(data => {
        if(data === null){
          this.dialog.open(ErrorDialogComponent,{data:"Ничего не найдено"});
        }
        else {
          this.report = data;
          this.load = false;

          this.colums = this.report.columnProduct;
        }
        },
      error => {this.dialog.open(ErrorDialogComponent,{data: "Ошибка" + error})}
    );


  }

  ngOnInit(): void {

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
    if ((this.productCategoryCheckboxComponent.myControl.value !== undefined && this.productCategoryCheckboxComponent.myControl.value !== null && this.productCategoryCheckboxComponent.myControl.value.length !== 0  && this.productCategoryCheckboxComponent.myControl.value !== [])
      || (this.vendorCheckboxComponent.myControl.value !== undefined && this.vendorCheckboxComponent.myControl.value !== null && this.vendorCheckboxComponent.myControl.value.length !== 0 && this.vendorCheckboxComponent.myControl.value !== [])
      || (this.vendorCodeCheckboxComponent.myControl.value  !== undefined && this.vendorCodeCheckboxComponent.myControl.value !== null && this.vendorCodeCheckboxComponent.myControl.value.length !== 0 && this.vendorCodeCheckboxComponent.myControl.value !== [])
      || (this.subcategoryCheckboxComponent.myControl.value !== undefined && this.subcategoryCheckboxComponent.myControl.value !== null && this.subcategoryCheckboxComponent.myControl.value.length !== 0 && this.subcategoryCheckboxComponent.myControl.value !== [])
      || (this.categoryProductComponent.category_product !== undefined && this.categoryProductComponent.category_product !== null && this.categoryProductComponent.category_product !== '')) {

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
      product: this.product,
      districts: this.districtSelectedComponent.myControl.value !== null? this.districtSelectedComponent.myControl.value:null,
      regions: this.regionSelectedComponent.myControl.value !== null? this.regionSelectedComponent.myControl.value:null
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
    if ((this.productCategoryCheckboxComponent.myControl.value !== undefined && this.productCategoryCheckboxComponent.myControl.value !== null && this.productCategoryCheckboxComponent.myControl.value.length !== 0  && this.productCategoryCheckboxComponent.myControl.value !== [])
      || (this.vendorCheckboxComponent.myControl.value !== undefined && this.vendorCheckboxComponent.myControl.value !== null && this.vendorCheckboxComponent.myControl.value.length !== 0 && this.vendorCheckboxComponent.myControl.value !== [])
      || (this.vendorCodeCheckboxComponent.myControl.value  !== undefined && this.vendorCodeCheckboxComponent.myControl.value !== null && this.vendorCodeCheckboxComponent.myControl.value.length !== 0 && this.vendorCodeCheckboxComponent.myControl.value !== [])
      || (this.subcategoryCheckboxComponent.myControl.value !== undefined && this.subcategoryCheckboxComponent.myControl.value !== null && this.subcategoryCheckboxComponent.myControl.value.length !== 0 && this.subcategoryCheckboxComponent.myControl.value !== [])
      || (this.categoryProductComponent.category_product !== undefined && this.categoryProductComponent.category_product !== null && this.categoryProductComponent.category_product !== '')) {
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
      product: this.product,
      districts: this.districtSelectedComponent.myControl.value !== null? this.districtSelectedComponent.myControl.value:null,
      regions: this.regionSelectedComponent.myControl.value !== null? this.regionSelectedComponent.myControl.value:null
    }
    this.loadReport();
  }

}
