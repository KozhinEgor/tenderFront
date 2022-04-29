import {Component, OnInit, ViewChild} from '@angular/core';
import {UserAutocompletComponent} from "../user-autocomplet/user-autocomplet.component";
import {
  Comment,
  Company,
  Tender,
  Product,
  ProductCategory,
  ProductReceived,
  ReceivedJson, SearchParameters,
  Type,
  User,
  Vendor
} from "../classes";
import {ApiService} from "../api.service";
import {MatDialog} from "@angular/material/dialog";
import {AuthenticationService} from "../service/authentication.service";
import {ActivatedRoute} from "@angular/router";
import {ErrorDialogComponent} from "../error-dialog/error-dialog.component";
import {AddDialogTenderComponent, TenderDialogComponent} from "../tender-table/tender-table.component";


import {MatTableDataSource} from "@angular/material/table";
import {CustomAutocompletComponent} from "../custom-autocomplet/custom-autocomplet.component";
import {WinnerAutocompletComponent} from "../winner-autocomplet/winner-autocomplet.component";
import {ContryAutocompletComponent} from "../contry-autocomplet/contry-autocomplet.component";
import {DataRangeComponent} from "../data-range/data-range.component";
import {VendorCodeCheckboxComponent} from "../vendor-code-checkbox/vendor-code-checkbox.component";
import {ProductCategoryCheckboxComponent} from "../product-category-checkbox/product-category-checkbox.component";
import {VendorCheckboxComponent} from "../vendor-checkbox/vendor-checkbox.component";
import {SubcategoryCheckboxComponent} from "../subcategory-checkbox/subcategory-checkbox.component";
import {CategoryProductComponent} from "../category-product/category-product.component";
import {TypeProductOrderComponent} from "../type-product-order/type-product-order.component";
import {SaveParametrsComponent} from "../save-parametrs/save-parametrs.component";
import {RegionSelectedComponent} from "../region-selected/region-selected.component";
import {DistrictSelectedComponent} from "../district-selected/district-selected.component";
import {FormControl, Validators} from "@angular/forms";
import {COMMA, ENTER, SPACE} from "@angular/cdk/keycodes";
import {MatChipInputEvent} from "@angular/material/chips";
import {group} from "../page-tender-date/page-tender-date.component";

@Component({
  selector: 'app-page-set-winner',
  templateUrl: './page-set-winner.component.html',
  styleUrls: ['./page-set-winner.component.scss']
})
export class PageSetWinnerComponent implements OnInit {

  dataSource = new MatTableDataSource<Tender>();

  // @ViewChild(AutocompletTypeComponent)
  // private autocompletType: AutocompletTypeComponent| undefined;
  @ViewChild(CustomAutocompletComponent)
  private customAutocomplet: CustomAutocompletComponent;

  @ViewChild(WinnerAutocompletComponent)
  private winnerAutocomplet: WinnerAutocompletComponent;
  @ViewChild('winnerChange')
  private winnerChange: WinnerAutocompletComponent;
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
  private_search: boolean = false;
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  // @ts-ignore
  readonly separatorKeysCodes = [ENTER, COMMA, SPACE] as const;
  ids: number[] = [];
  numberShow = false;
numberTenerInList: number = 0;
countTenderInList: number;

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

  number_bico: number[] = [];

  addBicoNumber(event: MatChipInputEvent): void {
    let value = (event.value || '').trim();
    let mas = value.split(/ |,|\.|;|:|\\|\//);

    // Add our fruit
    if (value) {
      for (let i of mas) {
        if (i !== '') {
          i = i.replace(/\D/g, '');
          if(i !== ''){
            this.number_bico.push(Number(i));
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
            this.number_bico.push(Number(i));
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
    this.typeProductOrderComponent.type = "Год";
    this.productCategoryCheckboxComponent.ChangeCategoryProduct('');

    this.saveParametrsComponent.myControl.setValue('');
  }

  category: ProductCategory = null;
  vendor: Vendor = null;
  vendor_code: Product = null;
  product: ProductReceived[] = [];



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

  removeProduct(product: ProductReceived) {
    const index = this.product.indexOf(product);

    if (index >= 0) {
      this.product.splice(index, 1);
    }
  }

  showTables(): void {
    this.numberTenerInList = 0;
    if (!this.adjacent_tender) {
      if ((this.productCategoryCheckboxComponent.myControl.value !== undefined && this.productCategoryCheckboxComponent.myControl.value !== null && this.productCategoryCheckboxComponent.myControl.value.length !== 0  && this.productCategoryCheckboxComponent.myControl.value !== [])
        || (this.vendorCheckboxComponent.myControl.value !== undefined && this.vendorCheckboxComponent.myControl.value !== null && this.vendorCheckboxComponent.myControl.value.length !== 0 && this.vendorCheckboxComponent.myControl.value !== [])
        || (this.vendorCodeCheckboxComponent.myControl.value  !== undefined && this.vendorCodeCheckboxComponent.myControl.value !== null && this.vendorCodeCheckboxComponent.myControl.value.length !== 0 && this.vendorCodeCheckboxComponent.myControl.value !== [])
        || (this.subcategoryCheckboxComponent.myControl.value !== undefined && this.subcategoryCheckboxComponent.myControl.value !== null && this.subcategoryCheckboxComponent.myControl.value.length !== 0 && this.subcategoryCheckboxComponent.myControl.value !== [])
        || (this.categoryProductComponent.category_product !== undefined && this.categoryProductComponent.category_product !== null && this.categoryProductComponent.category_product !== '')) {
        this.AddProduct();
      }
    }


    const json: SearchParameters = {
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
      plan_schedule:false,
      adjacent_tender: false,
      realized: false,
      private_search: false
    }
    // if (this.adjacent_tender) {
    //
    //   this.api.getAdjacentTenderWithParametrs(json).subscribe(posts => {
    //
    //       if (posts.length === 0) {
    //         this.dataSource = new MatTableDataSource<Tender>(posts)
    //         this.dialog.open(ErrorDialogComponent, {data: 'Найдено 0 тендеров'});
    //       } else {
    //         this.dataSource = new MatTableDataSource<Tender>(posts);
    //
    //       }
    //
    //     },
    //     error => {
    //       this.dialog.open(ErrorDialogComponent, {data: 'Ошибка' + error});
    //     });
    // } else {
      this.api.getPostWithParametrs(json).subscribe(posts => {

          if (posts.length === 0) {
            this.dataSource = new MatTableDataSource<Tender>(posts)
            this.dialog.open(ErrorDialogComponent, {data: 'Найдено 0 тендеров'});
          } else {
            this.dataSource = new MatTableDataSource<Tender>(posts);
            this.countTenderInList = posts.length;
            this.showTender(posts[0].id);
          }

        },
        error => {
          this.dialog.open(ErrorDialogComponent, {data: 'Ошибка' + error});
        });
    // }
  }
  ngOnInit(): void {

  }



  isSelected(offer: any): boolean {

    const index = this.ChoseColums.indexOf(offer);

    return index >= 0;
  }
  plan_schedule = false;
  realized= false;
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

      this.country = saveParameters.country;
      this.contryAutocompletComponent.setContryById(saveParameters.country);
      this.WinnersExclude = saveParameters.winnerExclude;
      this.winners = saveParameters.winner;
      this.minSum.setValue(saveParameters.minSum);
      this.maxSum.setValue(saveParameters.maxSum);
      if(saveParameters.ids_string !== null){this.addString(saveParameters.ids_string);}
      if(saveParameters.bicotender_string !== null){this.addBicoNumberString(saveParameters.bicotender_string)};
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
  @ViewChild(UserAutocompletComponent)
  private userAutocompletComponent: UserAutocompletComponent;
  user: User;
  ChangeComment: Comment = {
    id: null,
    text: '',
    usr: null,
    user: '',
    date: null,
    tender: null,
    users: []
  };
  data: Tender = {
    id: 0,
    name_tender: '',
    number_tender: '',
    bico_tender: '',
    gos_zakupki: '',
    price: 0,
    currency: '',
    rate: 0,
    date_start: Date.prototype,
    sum: 0,
    date_finish: Date.prototype,
    date_tranding: Date.prototype,
    full_sum: 0,
    win_sum: 0,
    typetender: '',
    winner: '',
    customer: '',
    inn: '',
    product: '',
    dublicate: false,
    country: '',
    winner_inn: '',
    winner_country: '',
    plan: false,
    tender_plan: '',
    tender_dublicate: ''
  };
  comments: Comment[];
  color: string[] = ['#FFCC33', '#FF9933', '#FF6600', '#FF3300', '#FF6666', '#CC3333', '#FF0066', '#FF0099', '#FF33CC', '#FF66FF', '#CC66CC', '#CC00FF', '#9933FF', '#9966FF', '#9999FF', '#6666FF', '#3300FF', '#3366FF', '#0066FF',
    '#3399FF', '#33CCFF', '#66CCCC', '#66FFFF', '#33FFCC', '#00CC99', '#00FF99', '#33FF66', '#66CC66', '#00FF00', '#33FF00', '#66CC00', '#99CC66', '#CCFF33', '#CCCC33', '#CCCCCC'];
  UserColor = new Map();
  users: User[] = [];
  load = false;
  constructor(private api: ApiService,
              public dialog: MatDialog,
              private authenticationService: AuthenticationService,
              private route: ActivatedRoute) {
    this.user = this.authenticationService.userValue;
  }
winner:number;
  showTender(id:number){
    this.api.getTenderByIdForSetWinner(id).subscribe(data => {
        if(data === null){
          this.dialog.open(ErrorDialogComponent, {data: "Возможно Тендер удален или ошибка на сервере. "})
        }
        this.data = data;

        if(this.winnerChange !== undefined){
          this.winnerChange.setWinner(this.data.winner);
        }
        else {
          this.winner = Number(this.data.winner);
        }
        this.defaultComment();
      },
      error => {
        this.dialog.open(ErrorDialogComponent, {data: "Возможно Тендер удален или ошибка на сервере. " + error})
      });
    this.api.getComments(id).subscribe(comment => {
        this.comments = comment;
        this.setcolor();
      },
      error => {
        this.dialog.open(ErrorDialogComponent, {data: "Ошибка  " + error})
      }
    )
  }
  showTenderToEdit() {
    this.dialog.open(TenderDialogComponent, {
      width: '80%',
      height: '90%',
      data: {adjacent_tender: false, id_tender: this.data.id, plan:false}
    }).afterClosed().subscribe(result => {
      location.reload();
    });
  }

  setcolor() {
    for (var a of this.comments) {
      if (!this.UserColor.has(a.usr)) {
        this.UserColor.set(a.usr, this.color[Math.floor(Math.random() * this.color.length)]);
      }
    }
  }
  removeUser(user: User) {
    const index = this.users.indexOf(user);
    if (index >= 0) {
      this.users.splice(index, 1);
    }
  }
  ChangeUser(user: any) {
    if (typeof user !== "string") {
      this.users.push(user);

      this.userAutocompletComponent.myControl.setValue('');
    }
  }
  addComment() {
    this.ChangeComment.usr = this.user.id;
    this.ChangeComment.user = this.user.nickname;
    for (var u of this.users) {
      this.ChangeComment.users.push(u.id);
    }
    this.api.postComments(this.ChangeComment).subscribe(comment => {
        this.comments = comment;
        this.UserColor = new Map();
        this.setcolor();
      },
      error => {
        this.dialog.open(ErrorDialogComponent, {data: "Ошибка  " + error})
      }
    )

    this.defaultComment();
  }
  defaultComment() {
    this.users = [];
    this.ChangeComment = {
      id: null,
      text: '',
      usr: null,
      user: '',
      date: null,
      tender: this.data.id,
      users: []
    };
  }
  save(){
    console.log(this.data)
    this.api.SaveTender(this.data).subscribe(data => {

      this.dialog.open(ErrorDialogComponent, {data: 'Сохранил'});
        this.data = data;
      },
      err => {
        this.dialog.open(ErrorDialogComponent, {data: "Ошибка " + err});
      });
  }
  next(){
    this.numberTenerInList=this.numberTenerInList+1;
    this.showTender(this.dataSource.data[this.numberTenerInList].id)
  }
  previous(){
    this.numberTenerInList=this.numberTenerInList-1;
    this.showTender(this.dataSource.data[this.numberTenerInList].id)
  }
  ChangeWinnerInTender(winner: any) {
    if (typeof winner !== "string") {
      this.data.winner = winner.id;
    }
  }
  AddWinner() {
    this.dialog.open(AddDialogTenderComponent, {data: {type: 'winner'}}).afterClosed().subscribe(() => this.winnerChange.update());

  }
  ChangeWinnerInDB() {
    this.dialog.open(AddDialogTenderComponent, {
      data: {
        id: this.winnerChange.myControl.value.id,
        inn: this.winnerChange.myControl.value.inn,
        name: this.winnerChange.myControl.value.name,
        type: 'winner'
      }
    }).afterClosed().subscribe(() => this.winnerChange.update());
  }
}
