import {Component, OnInit, ViewChild} from '@angular/core';
import {MatSort} from '@angular/material/sort';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import {ApiService} from '../api.service';
import {DataRangeComponent} from '../data-range/data-range.component';
import {saveAs} from 'file-saver';

import {
  Company,
  Tender,
  Product,
  ProductCategory,
  ProductReceived,
  ReceivedJson, SearchParameters,
  Type, User,
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
import {CategoryProductComponent} from "../category-product/category-product.component";
import {SubcategoryAutocompletComponent} from "../subcategory-autocomplet/subcategory-autocomplet.component";
import {VendorCodeCheckboxComponent} from "../vendor-code-checkbox/vendor-code-checkbox.component";
import {ProductCategoryCheckboxComponent} from "../product-category-checkbox/product-category-checkbox.component";
import {VendorCheckboxComponent} from "../vendor-checkbox/vendor-checkbox.component";
import {SubcategoryCheckboxComponent} from "../subcategory-checkbox/subcategory-checkbox.component";
import {TypeProductOrderComponent} from "../type-product-order/type-product-order.component";
import {AuthenticationService} from "../service/authentication.service";
import {SaveParametrsComponent} from "../save-parametrs/save-parametrs.component";
import {RegionSelectedComponent} from "../region-selected/region-selected.component";
import {DistrictSelectedComponent} from "../district-selected/district-selected.component";
import {TenderTableComponent} from "../tender-table/tender-table.component";


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
  // @ViewChild(MatPaginator) paginator: MatPaginator | null = null;
  // @ViewChild(MatSort) sort: MatSort | null = null;
  // dataSource = new MatTableDataSource<Tender>();

  // @ViewChild(AutocompletTypeComponent)
  // private autocompletType: AutocompletTypeComponent| undefined;
  @ViewChild(CustomAutocompletComponent)
  private customAutocomplet: CustomAutocompletComponent;

  @ViewChild(TenderTableComponent)
  private tenderTableComponent: TenderTableComponent;

  @ViewChild(WinnerAutocompletComponent)
  private winnerAutocomplet: WinnerAutocompletComponent;

  @ViewChild(ContryAutocompletComponent)
  private contryAutocompletComponent: ContryAutocompletComponent
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
  @ViewChild(SaveParametrsComponent)
  saveParametrsComponent:SaveParametrsComponent
  @ViewChild(RegionSelectedComponent)
  regionSelectedComponent:RegionSelectedComponent;
  @ViewChild(DistrictSelectedComponent)
  districtSelectedComponent:DistrictSelectedComponent;
  expandedElement: Tender | null;
  panelOpenState = false;
  dublicate: boolean = true;
  minSum = new FormControl('', [Validators.max(999999999999), Validators.min(0)]);
  maxSum = new FormControl('', [Validators.max(999999999999), Validators.min(0)]);
  innCustomer: string[] = [];
  ChoseColums: group[] = [];
  displayedColumns: string[] = [];
  displayedColumnsTender: string[] = [];
  displayedColumnsAdjacentTender: string[] = [];
  adjacent_tender: boolean = false;
  realized: boolean = false;
  AllColums: group[] = [{name: 'id', nameru: 'ID'},
    {name: 'nameTender', nameru: 'Название тендера'},
    {name: 'customer', nameru: 'Заказчик'},
    {name: 'typetender', nameru: 'Тип тендера'},
    {name: 'sum', nameru: 'Сумма'},
    {name: 'dateStart', nameru: 'Дата начала'},
    {name: 'dateFinish', nameru: 'Дата окончания'},
    {name: 'product', nameru: 'Продукты'},
    {name: 'winner', nameru: 'Победитель'},
    {name: 'winSum', nameru: 'Сумма победителя'}];
  Colums: group[];
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  load: boolean = false;
  // @ts-ignore
  readonly separatorKeysCodes = [ENTER, COMMA, SPACE] as const;
  ids: number[] = [];
  numberShow = false;
  plan_schedule: boolean = false;
  private_search: boolean = false;
  types: Type[] = [];
  TypeExclude: boolean = false;
  customers: Company[] = [];
  CustomExclude: boolean = false;
  country: number = null;
  winners: Company[] = [];
  WinnersExclude: boolean = false;
  number_bico: number[] = [];
  category: ProductCategory = null;
  vendor: Vendor = null;
  vendor_code: Product = null;
  product: ProductReceived[] = [];
  searchParameters:SearchParameters = {
    id: null,
    nickname: null,
    name: null,
    ids_string: null,
    dateStart: null,
    dateFinish: null,
    dublicate: this.dublicate,
    quarter: null,
    typeExclude: this.TypeExclude,
    type: this.types,
    customExclude: this.CustomExclude,
    custom: this.customers,
    innCustomer: this.innCustomer,
    innString : null,
    country: this.country,
    winnerExclude: this.WinnersExclude,
    winner: this.winners,
    minSum: this.minSum.value,
    maxSum: this.maxSum.value,
    ids: this.ids,
    bicotender: this.number_bico,
    bicotender_string: null,
    numberShow: this.numberShow,
    product: this.product,
    districts: null,
    regions: null,
    plan_schedule:this.plan_schedule,
    adjacent_tender: this.adjacent_tender,
    realized: this.realized,
    private_search: false
  };


  add(event: MatChipInputEvent): void {
    let value = (event.value || '').trim();
    let mas = value.split(/ |,|\.|;|:|\\|\//);


    if (value) {
      for (let i of mas) {
        if (i !== '') {
          i = i.replace(/\D/g, '');
          if(i !== ''){
            this.ids.push(Number(i));
          }

        }

      }

    }


    event.input.value = null;
  }

  addString(event:string){
    let value = (event || '').trim();
    let mas = value.split(/ |,|\.|;|:|\\|\//);
    if (value) {
      for (let i of mas) {
        if (i !== '') {
          i = i.replace(/\D/g, '');
          if(i !== ''){
            this.ids.push(Number(i));
          }
        }

      }

    }

  }

  remove(fruit: number): void {
    const index = this.ids.indexOf(fruit);

    if (index >= 0) {
      this.ids.splice(index, 1);
    }
  }



  addBicoNumber(event: MatChipInputEvent): void {
    let value = (event.value || '').trim();
    let mas = value.split(/ |,|\.|;|:|\\|\//);

    // Add our fruit
    if (value) {
      for (let i of mas) {
        if (i !== '') {
          i = i.replace(/\D/g, '');
          if(i !== ''){
            this.ids.push(Number(i));
          }
        }

      }

    }

    // Clear the input value
    event.input.value = null;
  }
  addBicoNumberString(event: string): void {
    let value = (event || '').trim();
    let mas = value.split(/ |,|\.|;|:|\\|\//);

    // Add our fruit
    if (value) {
      for (let i of mas) {
        if (i !== '') {
          i = i.replace(/\D/g, '');
          if(i !== ''){
            this.ids.push(Number(i));
          }
        }

      }

    }
  }
  removeBicoNumber(fruit: number): void {
    const index = this.number_bico.indexOf(fruit);

    if (index >= 0) {
      this.number_bico.splice(index, 1);
    }
  }

  addINN(event: MatChipInputEvent): void {
    let value = (event.value || '').trim();
    let mas = value.split(/ |,|\.|;|:|\\|\//);


    if (value) {
      for (let i of mas) {
        if (i !== '') {
          i = i.replace(/[^0-9 %]/gi, '');
          if(i !== ''){
            this.innCustomer.push(i);
          }

        }

      }

    }


    event.input.value = null;
  }

  addINNString(event:string): void {
    let value = (event|| '').trim();
    let mas = value.split(/ |,|\.|;|:|\\|\//);


    if (value) {
      for (let i of mas) {
        if (i !== '') {
          i = i.replace(/[^0-9 %]/gi, '');
          if(i !== ''){
            this.innCustomer.push(i);
          }
        }
      }
    }
  }

  removeINN(inn: string): void {
    const index = this.innCustomer.indexOf(inn);

    if (index >= 0) {
      this.innCustomer.splice(index, 1);
    }
  }



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

  user:User;

  constructor(private api: ApiService, public dialog: MatDialog,private authenticationService: AuthenticationService) {
    for (let index = 0; index < this.AllColums.length - 2; index++) {
      this.ChoseColums.push(this.AllColums[index]);
      this.displayedColumns.push(this.AllColums[index].name);
    }
    this.Colums = this.AllColums;
    this.user = this.authenticationService.userValue;

  }



  ChangeCountry(country: any) {
    if(typeof country !=="string"){
      this.country = country.id;
    }
    if(country === '' || country === null || country === undefined){
      this.country = null;
    }
  }

  default() {
    this.dublicate = true;
    this.TypeExclude = false;
    this.types = [];
    this.CustomExclude = false;
    this.customers = [];
    this.innCustomer = [];
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
    this.plan_schedule = false;
    this.changeColumn();
    this.Colums = this.AllColums;
    this.contryAutocompletComponent.myControl.setValue('');
    this.dataRange.range.setValue({dateStart: null, dateFinish: null});
    this.regionSelectedComponent.myControl.enable();
    this.districtSelectedComponent.myControl.enable();
    this.regionSelectedComponent.myControl.setValue([]);
    this.districtSelectedComponent.myControl.setValue([]);
    this.categoryProductComponent.category_product = "";
    this.categoryProductComponent.setCategory_product('');
    this.productCategoryCheckboxComponent.myControl.setValue([]);
    this.vendorCodeCheckboxComponent.myControl.setValue([]);
    this.vendorCodeCheckboxComponent.myControl.disable();
    this.vendorCheckboxComponent.myControl.setValue([]);
    this.subcategoryCheckboxComponent.myControl.setValue([]);
    //this.typeProductOrderComponent.type = "Год";
    this.productCategoryCheckboxComponent.ChangeCategoryProduct('');
    this.realized = false;
    this.saveParametrsComponent.myControl.setValue('');

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
          subcategory: this.subcategoryCheckboxComponent.myControl.value == []? null : this.subcategoryCheckboxComponent.myControl.value,
          category_product:this.categoryProductComponent.category_product
        });

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

  removeProduct(product: ProductReceived) {
    const index = this.product.indexOf(product);

    if (index >= 0) {
      this.product.splice(index, 1);
    }
  }

  showTables(): void {

    if (!this.adjacent_tender && !this.plan_schedule) {
      if ((this.productCategoryCheckboxComponent.myControl.value !== undefined && this.productCategoryCheckboxComponent.myControl.value !== null && this.productCategoryCheckboxComponent.myControl.value.length !== 0  && this.productCategoryCheckboxComponent.myControl.value !== [])
        || (this.vendorCheckboxComponent.myControl.value !== undefined && this.vendorCheckboxComponent.myControl.value !== null && this.vendorCheckboxComponent.myControl.value.length !== 0 && this.vendorCheckboxComponent.myControl.value !== [])
        || (this.vendorCodeCheckboxComponent.myControl.value  !== undefined && this.vendorCodeCheckboxComponent.myControl.value !== null && this.vendorCodeCheckboxComponent.myControl.value.length !== 0 && this.vendorCodeCheckboxComponent.myControl.value !== [])
        || (this.subcategoryCheckboxComponent.myControl.value !== undefined && this.subcategoryCheckboxComponent.myControl.value !== null && this.subcategoryCheckboxComponent.myControl.value.length !== 0 && this.subcategoryCheckboxComponent.myControl.value !== [])
        || (this.categoryProductComponent.category_product !== undefined && this.categoryProductComponent.category_product !== null && this.categoryProductComponent.category_product !== '')) {
        this.AddProduct();
      }
    }



    this.searchParameters = {
      id: null,
      nickname: null,
      name: null,
      ids_string: null,
      dateStart: this.dataRange.getDateStart(),
      dateFinish: this.dataRange.getDateFinish(),
      dublicate: this.dublicate,
      quarter: null,
      typeExclude: this.TypeExclude,
      type: this.types,
      customExclude: this.CustomExclude,
      custom: this.customers,
      innCustomer: this.innCustomer,
      innString : null,
      country: this.country,
      winnerExclude: this.WinnersExclude,
      winner: this.winners,
      minSum: this.minSum.value,
      maxSum: this.maxSum.value,
      ids: this.ids,
      bicotender: this.number_bico,
      bicotender_string: null,
      numberShow: this.numberShow,
      product: this.product,
      districts: this.districtSelectedComponent.myControl.value !== null? this.districtSelectedComponent.myControl.value:null,
      regions: this.regionSelectedComponent.myControl.value !== null? this.regionSelectedComponent.myControl.value:null,
      plan_schedule:this.plan_schedule,
      adjacent_tender: this.adjacent_tender,
      realized: this.realized,
      private_search: false
    }
    this.tenderTableComponent.searchParametrs =this.searchParameters;
    this.tenderTableComponent.show = true;
    this.tenderTableComponent.paginator.pageIndex = 0;
    this.tenderTableComponent.getData();
    // if (this.adjacent_tender) {
    //
    //   this.api.getAdjacentTenderWithParametrs(json).subscribe(posts => {
    //
    //       if (posts.length === 0) {
    //         this.dataSource = new MatTableDataSource<Tender>(posts)
    //         this.dialog.open(ErrorDialogComponent, {data: 'Найдено 0 тендеров'});
    //       } else {
    //         this.dataSource = new MatTableDataSource<Tender>(posts);
    //         this.dataSource.paginator = this.paginator;
    //         this.dataSource.sort = this.sort;
    //       }
    //
    //     },
    //     error => {
    //       this.dialog.open(ErrorDialogComponent, {data: 'Ошибка' + error});
    //     });
    // }
    // else if (this.plan_schedule){
    //   this.api.getPlanTenderWithParametrs(json).subscribe(posts => {
    //
    //       if (posts.length === 0) {
    //         this.dataSource = new MatTableDataSource<Tender>(posts)
    //         this.dialog.open(ErrorDialogComponent, {data: 'Найдено 0 тендеров'});
    //       } else {
    //         this.dataSource = new MatTableDataSource<Tender>(posts);
    //         this.dataSource.paginator = this.paginator;
    //         this.dataSource.sort = this.sort;
    //       }
    //
    //     },
    //     error => {
    //       this.dialog.open(ErrorDialogComponent, {data: 'Ошибка' + error});
    //     });
    // }
    // else {



      // this.api.getPostWithParametrs(json).subscribe(posts => {
      //
      //     if (posts.length === 0) {
      //       this.dataSource = new MatTableDataSource<Tender>(posts)
      //       this.dialog.open(ErrorDialogComponent, {data: 'Найдено 0 тендеров'});
      //       this.load = false;
      //     }
      //     else {
      //       this.dataSource = new MatTableDataSource<Tender>(posts);
      //       this.dataSource
      //       this.load = false;
      //     }
      //
      //   },
      //   error => {
      //     this.dialog.open(ErrorDialogComponent, {data: 'Ошибка' + error});
      //   });

    // }
  }


  getFile() {
    const json: SearchParameters = {
      id: typeof this.saveParametrsComponent.myControl.value === "string"? null: this.saveParametrsComponent.myControl.value.id,
      nickname: this.user.nickname,
      name: typeof this.saveParametrsComponent.myControl.value === "string"? this.saveParametrsComponent.myControl.value: this.saveParametrsComponent.myControl.value.name,
      ids_string: null,
      dateStart: this.dataRange.getDateStart(),
      dateFinish: this.dataRange.getDateFinish(),
      dublicate: this.dublicate,
      quarter: null,
      typeExclude: this.TypeExclude,
      type: this.types,
      customExclude: this.CustomExclude,
      custom: this.customers,
      innCustomer: this.innCustomer,
      innString : null,
      country: this.country,
      winnerExclude: this.WinnersExclude,
      winner: this.winners,
      minSum: this.minSum.value,
      maxSum: this.maxSum.value,
      ids: this.ids,
      bicotender: this.number_bico,
      bicotender_string: null,
      numberShow: this.numberShow,
      product: this.product,
      districts: this.districtSelectedComponent.myControl.value !== null? this.districtSelectedComponent.myControl.value:null,
      regions: this.regionSelectedComponent.myControl.value !== null? this.regionSelectedComponent.myControl.value:null,
      plan_schedule:this.plan_schedule,
      adjacent_tender: this.adjacent_tender,
      realized: this.realized,
      private_search: this.private_search
    }


      this.api.getFileTender(json).subscribe(
        blob => {
          saveAs(blob, "Tender.xlsx");
        },
        error => {
          this.dialog.open(ErrorDialogComponent, {data: "Ошибка" + error});
        }
      );


  }

  ngOnInit(): void {

  }

  changeColumn() {
    this.realized = false;
    // this.adjacent_tender = !this.adjacent_tender;
    if (this.adjacent_tender || this.plan_schedule) {
      if(this.adjacent_tender){
        this.Colums = this.AllColums.slice(0, 7);
      }
      else {
        this.Colums = this.AllColums.slice(0, 6);
      }
      if (this.isSelected(this.AllColums[6]) && !this.adjacent_tender) {
        this.toggleOffer(this.AllColums[6])
      }
      if (this.isSelected(this.AllColums[7])) {
        this.toggleOffer(this.AllColums[7])
      }
      if (this.isSelected(this.AllColums[8])) {
        this.toggleOffer(this.AllColums[8])
      }
      if (this.isSelected(this.AllColums[9])) {
        this.toggleOffer(this.AllColums[9])
      }
      if(this.plan_schedule){
        this.Colums.splice(this.Colums.length,0,{name: 'plan', nameru: 'План'});
        this.ChoseColums.splice(this.ChoseColums.length,0,{name: 'plan', nameru: 'План'});
        // this.toggleOffer({name: 'plan', nameru: 'План'});
      }
    }

    else {
      this.ChoseColums = [];
      this.displayedColumns = [];
      for (let index = 0; index < this.AllColums.length - 2; index++) {
        this.ChoseColums.push(this.AllColums[index]);
        this.displayedColumns.push(this.AllColums[index].name);
      }
      this.Colums = this.AllColums;
    }
    // this.dataSource = new MatTableDataSource<Tender>();
    return this.adjacent_tender;
  }

  toggleOffer(offer: any): void {
    const index = this.ChoseColums.indexOf(offer);
    if (index >= 0) {
      this.ChoseColums.splice(index, 1);

      const indexDisplay = this.displayedColumns.indexOf(offer.name);
      this.displayedColumns.splice(indexDisplay, 1);
    }
    else {
      this.ChoseColums.push(offer);
      if(offer.name === 'plan'){
        this.displayedColumns.splice(this.displayedColumns.length, 0, offer.name);
      }
      else{
        const indexDisplay = this.AllColums.indexOf(offer);
        this.displayedColumns.splice(indexDisplay, 0, offer.name);
      }

    }
    this.displayedColumns = this.displayedColumns;
  }

  isSelected(offer: any): boolean {

    const index = this.ChoseColums.indexOf(offer);

    return index >= 0;
  }

  saveSearch(){
    let name: string;
    let id:number;
    let flag:boolean;
    if(typeof this.saveParametrsComponent.myControl.value !== "string" && this.saveParametrsComponent.myControl.value !== '' && this.saveParametrsComponent.myControl.value.id !== undefined
      && this.saveParametrsComponent.myControl.value.id !== null){
      flag = true;
      name = this.saveParametrsComponent.myControl.value.name;
      id = this.saveParametrsComponent.myControl.value.id;
    }
    else if(typeof this.saveParametrsComponent.myControl.value  === "string" && this.saveParametrsComponent.myControl.value !== '' && this.saveParametrsComponent.myControl.value !== undefined
      && this.saveParametrsComponent.myControl.value !== null){
      flag = true;
      id = null;
      name = this.saveParametrsComponent.myControl.value;
    }
    else{
      flag = false;
      this.dialog.open(ErrorDialogComponent,{data:'Проверьте значение в навзание поиска'})
    }
    if(flag) {
      if (!this.adjacent_tender) {
        if ((this.productCategoryCheckboxComponent.myControl.value !== undefined && this.productCategoryCheckboxComponent.myControl.value !== null && this.productCategoryCheckboxComponent.myControl.value.length !== 0 && this.productCategoryCheckboxComponent.myControl.value !== [])
          || (this.vendorCheckboxComponent.myControl.value !== undefined && this.vendorCheckboxComponent.myControl.value !== null && this.vendorCheckboxComponent.myControl.value.length !== 0 && this.vendorCheckboxComponent.myControl.value !== [])
          || (this.vendorCodeCheckboxComponent.myControl.value !== undefined && this.vendorCodeCheckboxComponent.myControl.value !== null && this.vendorCodeCheckboxComponent.myControl.value.length !== 0 && this.vendorCodeCheckboxComponent.myControl.value !== [])
          || (this.subcategoryCheckboxComponent.myControl.value !== undefined && this.subcategoryCheckboxComponent.myControl.value !== null && this.subcategoryCheckboxComponent.myControl.value.length !== 0 && this.subcategoryCheckboxComponent.myControl.value !== [])
          || (this.categoryProductComponent.category_product !== undefined && this.categoryProductComponent.category_product !== null && this.categoryProductComponent.category_product !== '')) {
          this.AddProduct();
        }
      }

      const json: SearchParameters = {
        id: typeof this.saveParametrsComponent.myControl.value === "string"? null: this.saveParametrsComponent.myControl.value.id,
        nickname: this.user.nickname,
        name: typeof this.saveParametrsComponent.myControl.value === "string"? this.saveParametrsComponent.myControl.value: this.saveParametrsComponent.myControl.value.name,
        ids_string: null,
        dateStart: this.dataRange.getDateStart(),
        dateFinish: this.dataRange.getDateFinish(),
        dublicate: this.dublicate,
        quarter: null,
        typeExclude: this.TypeExclude,
        type: this.types,
        customExclude: this.CustomExclude,
        custom: this.customers,
        innCustomer: this.innCustomer,
        innString : null,
        country: this.country,
        winnerExclude: this.WinnersExclude,
        winner: this.winners,
        minSum: this.minSum.value,
        maxSum: this.maxSum.value,
        ids: this.ids,
        bicotender: this.number_bico,
        bicotender_string: null,
        numberShow: this.numberShow,
        product: this.product,
        districts: this.districtSelectedComponent.myControl.value !== null? this.districtSelectedComponent.myControl.value:null,
        regions: this.regionSelectedComponent.myControl.value !== null? this.regionSelectedComponent.myControl.value:null,
        plan_schedule:this.plan_schedule,
        adjacent_tender: this.adjacent_tender,
        realized: this.realized,
        private_search: this.private_search
      }

      this.api.save_SaveParameters(json).subscribe(
        data =>{
          this.saveParametrsComponent.setOprions(data);
          this.dialog.open(ErrorDialogComponent, {data: 'Сохранил'});},
    error => {
      this.dialog.open(ErrorDialogComponent, {data: 'Ошибка' + error});
    }
      );
    }
  }
userSaveSearch:string;
  ChangeSaveParameters(saveParameters: any) {
      if(typeof saveParameters !=="string"){
        this.dataRange.range.setValue({dateStart:saveParameters.dateStart !== null?new Date(saveParameters.dateStart):null, dateFinish:saveParameters.dateFinish != null?new Date(saveParameters.dateFinish):null});
          this.dublicate = saveParameters.dublicate;
          this.TypeExclude = saveParameters.typeExclude;
          this.types = saveParameters.type;
        this.CustomExclude = saveParameters.customExclude;
        this.customers = saveParameters.custom;
        if(saveParameters.innString !== null){
          this.addINNString(saveParameters.innString)
        }
        else{
          this.innCustomer = [];
        }
        this.country = saveParameters.country;
        this.contryAutocompletComponent.setContryById(saveParameters.country);
           this.WinnersExclude = saveParameters.winnerExclude;
          this.winners = saveParameters.winner;
          this.minSum.setValue(saveParameters.minSum);
          this.maxSum.setValue(saveParameters.maxSum);
          if(saveParameters.ids_string !== null){this.addString(saveParameters.ids_string);}
          else{
            this.ids = [];
          }

          if(saveParameters.bicotender_string !== null){this.addBicoNumberString(saveParameters.bicotender_string)}
          else{
            this.number_bico = [];
          }
          this.numberShow = saveParameters.numberShow;
          this.product = saveParameters.product;
          if(saveParameters.regions !== null){
            this.regionSelectedComponent.setRegions(saveParameters.regions);
          }
           if(saveParameters.districts !== null){
             this.districtSelectedComponent.setDistrict(saveParameters.districts);
           }

          this.userSaveSearch = saveParameters.nickname;
      }
    else{
        this.userSaveSearch = this.user.nickname;
      }
    }
  ChangePrivate(){
    this.saveParametrsComponent.setOprions(this.saveParametrsComponent.options);
  }

  regionsSelected: boolean = false;

  ChangeRegion(regions: any) {

    if(regions !== null && regions.length !== 0) {

      this.regionsSelected = true;
      this.innCustomer = [];

        this.contryAutocompletComponent.myControl.setValue('');
        this.contryAutocompletComponent.myControl.disable();


      this.customAutocomplet.myControl.disable();
      this.customers = [];
      this.districtSelectedComponent.myControl.disable();
      this.districtSelectedComponent.myControl.setValue([]);
    }
    else{
      if(this.districtSelectedComponent.myControl.value !== null && this.districtSelectedComponent.myControl.value.length < 1) {
        this.districtSelectedComponent.myControl.enable();
        this.regionsSelected = false;
        this.contryAutocompletComponent.myControl.enable();
        this.customAutocomplet.myControl.enable();
      }

    }
  }

  ChangeDistrict(district: any) {

    if(district !== null && district.length !== 0) {
      this.regionsSelected = true;
      this.innCustomer = [];
        this.contryAutocompletComponent.myControl.setValue('');
        this.contryAutocompletComponent.myControl.disable();

      this.customAutocomplet.myControl.disable();
      this.regionSelectedComponent.myControl.disable();
      this.regionSelectedComponent.myControl.setValue([]);
      this.customers = [];
    }
    else{
        if(this.regionSelectedComponent.myControl.value !== null && this.regionSelectedComponent.myControl.value.length < 1) {
          this.regionsSelected = false;
          if (!this.contryAutocompletComponent.myControl.enabled) {
            this.contryAutocompletComponent.myControl.enable();
          }
          this.customAutocomplet.myControl.enable();
          this.regionSelectedComponent.myControl.enable();
        }

    }
  }
}

