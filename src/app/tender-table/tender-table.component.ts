import {AfterViewInit, Component, Inject, Input, OnChanges, OnInit, ViewChild} from '@angular/core';
import {animate, state, style, transition, trigger} from "@angular/animations";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {MatTableDataSource} from "@angular/material/table";
import {
  Company,
  Orders,
  OrdersDB,
  Tender,
  Product,
  ProductCategory,
  User,
  Comment,
  SearchParameters,
  ChannelForTable
} from "../classes";
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import {VendorCodeAutocompleatComponent} from "../vendor-code-autocompleat/vendor-code-autocompleat.component";
import {ProductCategoryAutocompletComponent} from "../product-category-autocomplet/product-category-autocomplet.component";
import {ApiService} from "../api.service";
import {FormControl} from "@angular/forms";
import {CustomAutocompletComponent} from "../custom-autocomplet/custom-autocomplet.component";
import {WinnerAutocompletComponent} from "../winner-autocomplet/winner-autocomplet.component";
import {AutocompletTypeComponent} from "../autocomplet-type/autocomplet-type.component";
import {ContryAutocompletComponent} from "../contry-autocomplet/contry-autocomplet.component";
import {AuthenticationService} from "../service/authentication.service";
import {ErrorDialogComponent} from "../error-dialog/error-dialog.component";
import {UserAutocompletComponent} from "../user-autocomplet/user-autocomplet.component";
import {of} from "rxjs";
import {VendorAutocompletComponent} from "../vendor-autocomplet/vendor-autocomplet.component";
import {SubcategoryAutocompletComponent} from "../subcategory-autocomplet/subcategory-autocomplet.component";
import {CategoryProductComponent} from "../category-product/category-product.component";
import {OptionsComponent} from "../options/options.component";
import {ActivatedRoute} from "@angular/router";

import {environment} from "../../environments/environment";
import {startWith, switchMap, tap} from "rxjs/operators";
import {merge} from "chart.js/helpers";
import {DublicateDialogComponent} from "../dublicate-dialog/dublicate-dialog.component";
import {helper} from "../helper";
import {DivdeTenderComponent} from "../divde-tender/divde-tender.component";


export interface CustomerWinner {
  id: number;
  inn: number;
  name: string;
  ogrn: number;
  country: string;
  type: string;
}

@Component({
  selector: 'app-tender-table',
  templateUrl: './tender-table.component.html',
  styleUrls: ['./tender-table.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class TenderTableComponent implements OnInit, OnChanges, AfterViewInit {
  @Input() displayedColumns;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort ;
  @Input() searchParametrs:SearchParameters;
  dataSource = new MatTableDataSource<Tender>();
  show:boolean = false;
  expandedElement: Tender | null;
  user: User;
  totalCost: number = null;
  totalCount: number = null;
  totalCountFinish: number = null;
  totalCostFinish: number = null;
  url:string;
  isLoadingResults = false;
  constructor(public dialog: MatDialog, private api: ApiService, private authenticationService: AuthenticationService, private helper:helper) {
    this.user = this.authenticationService.userValue;
    this.url = location.protocol;
  }

  showTender() {

    this.dialog.open(TenderDialogComponent, {
      width: '80%',
      height: '90%',
      data: {adjacent_tender: (this.searchParametrs.adjacent_tender === null?false:this.searchParametrs.adjacent_tender), id_tender: (this.expandedElement.id), plan:(this.searchParametrs.plan_schedule=== null?false:this.searchParametrs.plan_schedule)}
    }).afterClosed().subscribe(result => {
      this.expandedElement.price = result.price;
      this.expandedElement.product = result.product;
      this.expandedElement.win_sum = result.win_sum;
      this.expandedElement.full_sum = result.full_sum;
      this.expandedElement.sum = result.sum;
      this.expandedElement.currency = result.currency;
      this.expandedElement.rate = result.rate;
      this.expandedElement.customer = result.customer;
      this.expandedElement.name_tender = result.name_tender;
      this.expandedElement.dublicate = result.dublicate;
      this.expandedElement.typetender = result.typetender;
      this.expandedElement.inn = result.inn;
      this.expandedElement.winner = result.winner;
      this.expandedElement.date_tranding = result.date_tranding;
      this.expandedElement.gos_zakupki = result.gos_zakupki;
      this.expandedElement.bico_tender = result.bico_tender;
      this.expandedElement.number_tender = result.number_tender;
      this.expandedElement.id = result.id;
      this.expandedElement.country = result.country;
      this.expandedElement.date_finish = result.date_finish;
      this.expandedElement.date_start = result.date_start;
      if (result.id == null) {
        if(this.show){
          this.getData();
        }
        else{
          this.dataSource.data.splice(this.dataSource.data.indexOf(this.expandedElement), 1)

          this.dataSource = new MatTableDataSource<Tender>(this.dataSource.data);
          this.dataSource.sort = this.sort;
          this.dataSource.paginator = this.paginator
        }

      }
    });
  }

  ngAfterViewInit(){
    this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));
    this.paginator.page
      .pipe(
        tap(() => {
                this.isLoadingResults = true;
                 this.getData();
              })
      )
      .subscribe();
    this.sort.sortChange
      .pipe(
        tap(() => {
          this.isLoadingResults = true;
          this.getData();
        })
      )
      .subscribe();

  }

  ngOnInit(): void {

  }

 getData(){
    if(this.show){

      this.isLoadingResults = true;
      this.api.getTenders({page:this.paginator.pageIndex,sortName:this.sort.active,sortDirection:this.sort.direction,pageSize:this.paginator.pageSize, searchParametrs:this.searchParametrs}).subscribe(data =>{
        if(data.tenders.length === 0){
          this.dialog.open(ErrorDialogComponent, { data: 'Найдено 0 тендеров'});
          this.dataSource.data = [];
          this.isLoadingResults = false;
        }
        else{
          this.dataSource.data = data.tenders;
          this.totalCount = data.withPrice;
          this.totalCost = data.sumWithPrice;
          this.totalCountFinish = data.withWinner;
          this.totalCostFinish = data.sumWithWinner;
          this.paginator.length= data.allCount;
          this.isLoadingResults = false;
        }

      },
        err => {
          this.isLoadingResults = false;
          this.dataSource.data = [];
          this.dialog.open(ErrorDialogComponent, { data: "Ошибка " + err});
        });
    }
    else{
      this.isLoadingResults = false;
    }


}

  // getTotal() {
  //   for (let i = 0; i < this.dataSource.data.length; i++) {
  //     if (this.dataSource.data[i].win_sum > 0) {
  //
  //       this.totalCountFinish++;
  //       this.totalCostFinish = this.totalCostFinish + (this.dataSource.data[i].win_sum * this.dataSource.data[i].rate);
  //     }
  //     if (this.dataSource.data[i].sum !== 0) {
  //       this.totalCount++;
  //       this.totalCost = this.totalCost + this.dataSource.data[i].sum;
  //     }
  //   }
  // }

getURL(id_tender:string){
  return environment.url+"/tender/"+id_tender;
}
  ngOnChanges(): void {
    // this.dataSource.paginator = this.paginator;
    // this.dataSource.sort = this.sort;
    this.totalCost = null;
    this.totalCount = null;
    this.totalCountFinish = null;
    this.totalCostFinish = null;
    // this.getTotal();
  }


}

@Component({
  selector: 'add-dialog',
  templateUrl: './addComponent.html',
})
export class AddDialogTenderComponent implements OnInit, AfterViewInit {
  @ViewChild(ContryAutocompletComponent)
  private contryAutocompletComponent: ContryAutocompletComponent
  id: number = null;
  inn: number = null;
  name: string = null;
  country: number = null;

  save() {
    if (this.data.type === 'winner') {
      if (this.data.inn && this.data.name && this.data.country) {
        let win: Company = {
          id: this.data.id,
          inn: this.data.inn.toString(),
          name: this.data.name,
          country: this.data.country.toString()
        };
        this.api.InsertWinner(win).subscribe(data => {
            this.dialog.open(ErrorDialogComponent, {data: 'Сохранил'});
          },
          err => {
            this.dialog.open(ErrorDialogComponent, {data: 'Ошибка  не сохранил' + err});

          });
      } else {
        this.dialog.open(ErrorDialogComponent, {data: 'Заполнены не все поля'});
      }
    }

    if (this.data.type === 'customer') {
      if (this.data.inn && this.data.name && this.data.country) {
        let customer: Company = {
          id: this.data.id,
          inn: this.data.inn.toString(),
          name: this.data.name,
          country: this.data.country.toString()
        };
        this.api.InsertCustomer(customer).subscribe(data => {
            this.dialog.open(ErrorDialogComponent, {data: 'Сохранил'});
          },
          err => {
            this.dialog.open(ErrorDialogComponent, {data: 'Ошибка  не сохранил' + err});

          });
      } else {
        this.dialog.open(ErrorDialogComponent, {data: 'Заполнены не все поля'});
      }
    }

  }

  ngOnInit() {


  }

  ngAfterViewInit() {
    if (this.data.type === 'customer') {
      this.contryAutocompletComponent.setContry(this.data.country);
    }

  }

  onChangeContry(t: any) {

    if (t != null && typeof t !== 'string') {
      this.data.country = t.id;

    }
  }

  user: User;

  constructor(@Inject(MAT_DIALOG_DATA) public data: CustomerWinner, public dialog: MatDialog, private api: ApiService) {

  }
}

@Component({
  selector: 'delete-product',
  templateUrl: '../tender-table/delete-product.html',
})
export class DeleteProductComponent {

  constructor(@Inject(MAT_DIALOG_DATA) public data: Orders) {
  }

}

@Component({
  selector: 'delete-tender',
  templateUrl: '../tender-table/delete-tender.html',
})
export class DeleteTenderComponent {

  constructor(@Inject(MAT_DIALOG_DATA) public data: Tender) {
  }

}

export interface dialogTender {
  adjacent_tender: boolean;
  id_tender: number;
  plan: boolean;
}

@Component({
  selector: 'app-tender-dialog',
  templateUrl: '../tender-table/tender-dialog.component.html',
  styleUrls: ['../tender-table/tender-dialog.component.scss'],
})
export class TenderDialogComponent implements OnInit {
  @ViewChild(CustomAutocompletComponent)
  private customAutocompletComponent: CustomAutocompletComponent;
  @ViewChild(ContryAutocompletComponent)
  private contryAutocompletComponent: ContryAutocompletComponent;
  @ViewChild(WinnerAutocompletComponent)
  private winnerAutocompletComponent: WinnerAutocompletComponent;
  @ViewChild(AutocompletTypeComponent)
  private autocompletTypeComponent: AutocompletTypeComponent
  @ViewChild(VendorAutocompletComponent)
  private vendorAutocompletComponent: VendorAutocompletComponent;
  @ViewChild(ProductCategoryAutocompletComponent)
  private productCategoryAutocompletComponent: ProductCategoryAutocompletComponent;
  @ViewChild(UserAutocompletComponent)
  private userAutocompletComponent: UserAutocompletComponent;
  @ViewChild(VendorCodeAutocompleatComponent)
  private vendorCodeAutocompleatComponent: VendorCodeAutocompleatComponent;
  @ViewChild(CategoryProductComponent)
  private categoryProductComponent: CategoryProductComponent;
  @ViewChild(SubcategoryAutocompletComponent)
  private subcategoryAutocompletComponent: SubcategoryAutocompletComponent;
  @ViewChild(OptionsComponent)
  private optionComponent: OptionsComponent;
  delete = false;
  dataSource = new MatTableDataSource<Orders>();
  Char: string;
  innWinner: number;

  channel = null;
  port = null;
  frequency = null;
  vxi = null;
  portable = null;
  usb = null;
  form_factor: string = null;
  purpose: string = null;
  voltage: number = null;
  current: number = null;
  comment = '';
  number = null;
  price = null;
  winprice = null;
  editOrders = null;
  flag = false;
  orders: Orders[] = [];
  type_current = null;
  accuracy = null;
  channel_for_table:ChannelForTable[] = [];

  ordersDB: OrdersDB={
    id: null,
    tender: null,
    comment: '',
    product: null,
    number: null,
    price: 0,
    frequency: null,
    usb: null,
    vxi: null,
    portable: null,
    channel: null,
    port: null,
    form_factor: null,
    purpose: null,
    voltage: null,
    current: null,
    option: [],
    options: null,
    channel_for_table: null,
    type_current: null,
    accuracy: null,
    channel_for_table_str: null
  };
  selected = new FormControl(0);
  comments: Comment[];
  color: string[] = ['#FFCC33', '#FF9933', '#FF6600', '#FF3300', '#FF6666', '#CC3333', '#FF0066', '#FF0099', '#FF33CC', '#FF66FF', '#CC66CC', '#CC00FF', '#9933FF', '#9966FF', '#9999FF', '#6666FF', '#3300FF', '#3366FF', '#0066FF',
    '#3399FF', '#33CCFF', '#66CCCC', '#66FFFF', '#33FFCC', '#00CC99', '#00FF99', '#33FF66', '#66CC66', '#00FF00', '#33FF00', '#66CC00', '#99CC66', '#CCFF33', '#CCCC33', '#CCCCCC'];
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
  parameters: string[] = [];

  default() {
    this.vendorAutocompletComponent.myControl.disable();
    // this.vendorCodeAutocompleatComponent.myControl.disable();
    this.subcategoryAutocompletComponent.myControl.disable();
    this.dataSource = new MatTableDataSource<Orders>(this.orders);
    this.productCategoryAutocompletComponent.myControl.setValue('');
    if (this.vendorAutocompletComponent.myControl.value !== null && this.vendorAutocompletComponent.myControl.value !== '') {

      this.vendorAutocompletComponent.myControl.setValue('');
    }
    if (this.subcategoryAutocompletComponent.myControl.value !== null && this.subcategoryAutocompletComponent.myControl.value !== '') {

      this.subcategoryAutocompletComponent.myControl.setValue('');
    }
    this.vendorCodeAutocompleatComponent.myControl.setValue('');
    this.parameters = [];
    // this.optionComponent.option.setValue('');
    // this.optionComponent.options = [];
    this.channel = null;
    this.port = null;
    this.frequency = null;
    this.vxi = null;
    this.portable = null;
    this.usb = null;
    this.form_factor = null;
    this.purpose = null;
    this.voltage = null;
    this.current = null;
    this.comment = '';
    this.number = null;
    this.price = null;
    this.editOrders = null;
    this.type_current = null;
    this.accuracy = null;
    this.ChangeChannel();
  }

  addProduct() {
    if (this.number !== null) {
      if(this.vendorCodeAutocompleatComponent.myControl.value !== '' && this.vendorCodeAutocompleatComponent.myControl.value !== null &&this.vendorCodeAutocompleatComponent.myControl.value !== undefined){
      try {
        let CFT: any = {};
        if (this.channel > 0 && this.parameters.includes('channel_for_table')){
          for(let c of this.channel_for_table){
            if(c.value != 0){
              CFT[c.name] =  c.value
            }
          }
        }
        this.ordersDB= {
          id: null,
          tender: this.data.id,
          comment: this.comment ? this.comment : '',
          product: this.vendorCodeAutocompleatComponent.myControl.value.id,
          number: this.number,
          price: this.price ? this.price : 0,
          frequency: this.frequency !== -1 && this.frequency ? this.frequency : null,
          usb: this.usb,
          vxi: this.vxi,
          portable: this.portable,
          channel: this.channel !== -1 && this.channel ? this.channel : null,
          port: this.port !== -1 && this.port ? this.port : null,
          form_factor: this.form_factor === '' ? null : this.form_factor,
          purpose: this.purpose === '' ? null : this.purpose,
          voltage: this.voltage !== -1 && this.voltage ? this.voltage : null,
          current: this.current !== -1 && this.current ? this.current : null,
          option: [],
          options:  '',
          channel_for_table:<JSON>CFT,
          type_current: this.type_current,
          accuracy: this.accuracy !== -1 && this.accuracy ? this.accuracy : null,
          channel_for_table_str: null
        };
        this.api.addOrder(this.ordersDB).subscribe(
          data => {
            this.orders = data;
            this.dataSource = new MatTableDataSource<Orders>(this.orders);

            this.default();
          },
          err => {
            this.dialog.open(ErrorDialogComponent, {data: "Ошибка " + err});
          });
      } catch (e) {
        if (e instanceof TypeError) {
          (e.message);
          this.dialog.open(ErrorDialogComponent, {data: 'Проверьте все значения, не подходит значениее в ' + e.message.substring(e.message.indexOf("\'") + 1, e.message.lastIndexOf("\'")) + ' значие должно быть выбранно из списка'})
        } else {
          this.dialog.open(ErrorDialogComponent, {data: e.message});
        }
      }
      }
    }
  }

  deleteProduct(or: Orders) {
    const dialogRef = this.dialog.open(DeleteProductComponent, {data: or});
    dialogRef.afterClosed().subscribe(result => {
      if(result !== null){
        this.api.deleteOrder({'id':or.id,'result':result,'tender':or.tender}).subscribe(
          data => {
            this.orders = data;
            this.dataSource = new MatTableDataSource<Orders>(this.orders);
            this.default();
          },
          err => {
            this.dialog.open(ErrorDialogComponent, {data: "Ошибка " + err});
          });
      }
      // let indexDelete = this.orders.indexOf(or);
      // this.orders.splice(indexDelete, 1);
      // this.ordersDB.splice(indexDelete, 1);
      //

    });

  }

  editProduct(or: Orders) {

    this.editOrders = this.orders.indexOf(or);
    this.productCategoryAutocompletComponent.myControl.setValue({
      id: or.product_category_DB,
      category: or.product_category,
      category_en: null
    });
    this.channel = or.channel;
    this.port = or.port;
    this.frequency = or.frequency;
    this.vxi = or.vxi;
    this.portable = or.portable;
    this.usb = or.usb;
    this.form_factor = or.form_factor;
    this.purpose = or.purpose;
    this.voltage = or.voltage;
    this.current = or.current;
    this.vendorCodeAutocompleatComponent.setProduct(or.product_DB);
    this.comment = or.comment_DB;
    this.number = or.number;
    this.price = or.price;
    this.accuracy = or.accuracy;
    this.type_current = or.type_current;
    // this.optionComponent.selected_options = or.options;
    this.channel_for_table = [];
    if (this.channel > 0 && this.parameters.includes('channel_for_table')){
      for(let i = 1; i<=this.channel;i++){
          this.channel_for_table.push({name:'current'+i,value:or.channel_for_table['current'+i]})
          this.channel_for_table.push({name:'voltage'+i,value:or.channel_for_table['voltage'+i]})
      }
    }
  }

  copyProduct(or: Orders) {

    this.productCategoryAutocompletComponent.myControl.setValue({
      id: or.product_category_DB,
      category: or.product_category,
      category_en: null
    });
    this.channel = or.channel;
    this.port = or.port;
    this.frequency = or.frequency;
    this.vxi = or.vxi;
    this.portable = or.portable;
    this.usb = or.usb;
    this.form_factor = or.form_factor;
    this.purpose = or.purpose;
    this.voltage = or.voltage;
    this.current = or.current;
    this.vendorCodeAutocompleatComponent.setProduct(or.product_DB);
    this.comment = or.comment_DB;
    this.number = or.number;
    this.price = or.price;
    // this.optionComponent.selected_options = or.options;
    this.channel_for_table = [];
    if (this.channel > 0 && this.parameters.includes('channel_for_table')){
      for(let i = 1; i<=this.channel;i++){

          this.channel_for_table.push({name:'current'+i,value:or.channel_for_table['current'+i]})
          this.channel_for_table.push({name:'voltage'+i,value:or.channel_for_table['voltage'+i]})

      }
    }
  }

  saveProduct() {
    if (this.number !== null) {
      if(this.vendorCodeAutocompleatComponent.myControl.value !== '' && this.vendorCodeAutocompleatComponent.myControl.value !== null &&this.vendorCodeAutocompleatComponent.myControl.value !== undefined){
        try {
          let CFT: any= {};
          if (this.channel > 0 && this.parameters.includes('channel_for_table')){
            for(let c of this.channel_for_table){
              if(c.value != 0){
                CFT[c.name] =  c.value
              }
            }
          }

          this.ordersDB= {
            id: this.orders[this.editOrders].id,
            tender: this.data.id,
            comment: this.comment ? this.comment : '',
            product: this.vendorCodeAutocompleatComponent.myControl.value.id,
            number: this.number,
            price: this.price ? this.price : 0,
            frequency: this.frequency !== -1 && this.frequency ? this.frequency : null,
            usb: this.usb,
            vxi: this.vxi,
            portable: this.portable,
            channel: this.channel !== -1 && this.channel ? this.channel : null,
            port: this.port !== -1 && this.port ? this.port : null,
            form_factor: this.form_factor === '' ? null : this.form_factor,
            purpose: this.purpose === '' ? null : this.purpose,
            voltage: this.voltage !== -1 && this.voltage ? this.voltage : null,
            current: this.current !== -1 && this.current ? this.current : null,
            option: [],
            options:  '',
            channel_for_table:CFT,
            type_current: this.type_current,
            accuracy: this.accuracy !== -1 && this.accuracy ? this.accuracy : null,
            channel_for_table_str: null
          };
          this.api.addOrder(this.ordersDB).subscribe(
            data => {
              this.orders = data;
              this.dataSource = new MatTableDataSource<Orders>(this.orders);
              this.default();
            },
            err => {
              this.dialog.open(ErrorDialogComponent, {data: "Ошибка " + err});
            });
        } catch (e) {
          if (e instanceof TypeError) {
            (e.message);
            this.dialog.open(ErrorDialogComponent, {data: 'Проверьте все значения, не подходит значениее в ' + e.message.substring(e.message.indexOf("\'") + 1, e.message.lastIndexOf("\'")) + ' значие должно быть выбранно из списка'})
          } else {
            this.dialog.open(ErrorDialogComponent, {data: e.message});
          }
        }
      }
    }
  }

  ChangeCategoryProduct(categoryProduct: any) {
    if (categoryProduct != null) {

      this.productCategoryAutocompletComponent.ChangeCategoryProduct(categoryProduct);
    }
  }

  ChangeCategory(category: any) {
    if (category != null && typeof category !== 'string') {
      this.api.getColumnCategory(category.id).subscribe(
        data => this.parameters = data
      );


      this.vendorAutocompletComponent.myControl.enable();
      // this.vendorCodeAutocompleatComponent.myControl.enable();
      this.subcategoryAutocompletComponent.myControl.enable();
      if (this.productCategoryAutocompletComponent.myControl.value.id === 7) {
        this.vendorAutocompletComponent.myControl.disable();
      } else {
        this.vendorAutocompletComponent.myControl.enable();
        this.vendorAutocompletComponent.start(category.id);
      }
      if(this.vendorCodeAutocompleatComponent.myControl.value === null || typeof this.vendorCodeAutocompleatComponent.myControl.value === "string"){
        this.subcategoryAutocompletComponent.setSubCategory(this.productCategoryAutocompletComponent.myControl.value.id);
        this.vendorCodeAutocompleatComponent.myControl.setValue('');
        this.vendorCodeAutocompleatComponent.start(category.id);
      }

    }
    else if (category === '') {
      this.vendorCodeAutocompleatComponent.myControl.setValue('');
      this.vendorAutocompletComponent.myControl.setValue('');
      this.subcategoryAutocompletComponent.myControl.setValue('');
      // this.vendorCodeAutocompleatComponent.myControl.disable();
      this.vendorAutocompletComponent.myControl.disable();
      this.subcategoryAutocompletComponent.myControl.disable();
      this.vendorCodeAutocompleatComponent.start(0);
    }
  }

  // this. !== this.vendorCodeAutocompleatComponent.myControl.value.? Math.max(this.,this.vendorCodeAutocompleatComponent.myControl.value.):this.;
  ChangeVendorCode(vendor_code: any) {
    if (vendor_code != null && typeof vendor_code !== 'string') {
      if(typeof this.productCategoryAutocompletComponent.myControl.value === 'string' || this.productCategoryAutocompletComponent.myControl.value === null){
          this.productCategoryAutocompletComponent.setCategoryByID(vendor_code.product_category_id);
      }
      if (!this.vendorAutocompletComponent.myControl.value && this.productCategoryAutocompletComponent.myControl.value.id !== 7) {
        this.vendorAutocompletComponent.setVendor(vendor_code.vendor);
        this.subcategoryAutocompletComponent.setSubcategoryBYName(vendor_code.subcategory);
      }
      // this.optionComponent.getAllOptionByProduct(this.productCategoryAutocompletComponent.myControl.value.id, this.vendorCodeAutocompleatComponent.myControl.value.id);
      this.channel = this.channel !== this.vendorCodeAutocompleatComponent.myControl.value.channel ? Math.max(this.channel, this.vendorCodeAutocompleatComponent.myControl.value.channel) : this.channel;
      this.port = this.port !== this.vendorCodeAutocompleatComponent.myControl.value.port ? Math.max(this.port, this.vendorCodeAutocompleatComponent.myControl.value.port) : this.port;
      this.frequency = this.frequency !== this.vendorCodeAutocompleatComponent.myControl.value.frequency ? Math.max(this.frequency, this.vendorCodeAutocompleatComponent.myControl.value.frequency) : this.frequency;
      this.vxi = this.vxi !== this.vendorCodeAutocompleatComponent.myControl.value.vxi ? Math.max(this.vxi, this.vendorCodeAutocompleatComponent.myControl.value.vxi) : this.vxi;
      this.portable = this.portable !== this.vendorCodeAutocompleatComponent.myControl.value.portable ? Math.max(this.portable, this.vendorCodeAutocompleatComponent.myControl.value.portable) : this.portable;
      this.usb = this.usb !== this.vendorCodeAutocompleatComponent.myControl.value.usb ? Math.max(this.usb, this.vendorCodeAutocompleatComponent.myControl.value.usb) : this.usb;
      this.form_factor = this.form_factor !== this.vendorCodeAutocompleatComponent.myControl.value.form_factor ? (this.form_factor === null ? this.vendorCodeAutocompleatComponent.myControl.value.form_factor : this.form_factor) : this.form_factor;
      this.purpose = this.purpose !== this.vendorCodeAutocompleatComponent.myControl.value.purpose ? (this.purpose === null ? this.vendorCodeAutocompleatComponent.myControl.value.purpose : this.purpose) : this.purpose;
      this.voltage = this.voltage !== this.vendorCodeAutocompleatComponent.myControl.value.voltage ? Math.max(this.voltage, this.vendorCodeAutocompleatComponent.myControl.value.voltage) : this.voltage;
      this.current = this.vendorCodeAutocompleatComponent.myControl.value.current ? Math.max(this.current, this.vendorCodeAutocompleatComponent.myControl.value.current) : this.current;
      this.flag = true;


    }
  }

  ChangeVendor(vendor: any) {
    if (vendor != null && typeof vendor !== "string") {
      (this.vendorCodeAutocompleatComponent.myControl.value )
      if(this.vendorCodeAutocompleatComponent.myControl.value === ''){
        this.vendorCodeAutocompleatComponent.ChangeVendor(vendor.name);
      }

    } else if (vendor === '') {

      this.vendorCodeAutocompleatComponent.ChangeVendor(null);
    }
  }

  ChangeSubCategory(subcategory: any) {
    if(this.vendorCodeAutocompleatComponent.myControl.value === ''){
      this.vendorCodeAutocompleatComponent.ChangeSubcategory(subcategory);
    }


  }

  ChangeChannel(){
    this.channel_for_table = [];
   if (this.channel > 0 && this.parameters.includes('channel_for_table')){
     for(let i = 1; i<=this.channel;i++){
       this.channel_for_table.push({name:'current'+i,value:0})
       this.channel_for_table.push({name:'voltage'+i,value:0})
     }
    }
  }

  Save() {


    this.autocompletTypeComponent.setType(this.data.typetender);
    if (!this.dataDialog.adjacent_tender && !this.dataDialog.plan &&(
      this.winnerAutocompletComponent.myControl.value === undefined || this.winnerAutocompletComponent.myControl.value === null)) {
      this.winnerAutocompletComponent.setWinner(this.data.winner);
    }
    this.customAutocompletComponent.setCustomer(this.data.customer);
    let tender: Tender = {
      id: this.data.id,
      name_tender: this.data.name_tender,
      number_tender: this.data.number_tender,
      bico_tender: this.data.bico_tender,
      gos_zakupki: this.data.gos_zakupki,
      price: this.data.price,
      currency: this.data.currency,
      rate: this.data.rate,
      sum: this.data.sum,
      date_start: this.data.date_start,
      date_finish: this.data.date_finish,
      date_tranding: this.data.date_tranding,
      full_sum: this.data.full_sum,
      win_sum: this.data.win_sum,
      typetender: this.autocompletTypeComponent.myControl.value.id,
      winner: this.dataDialog.adjacent_tender || this.dataDialog.plan && (
        this.winnerAutocompletComponent.myControl.value === undefined || this.winnerAutocompletComponent.myControl.value === null)? null : this.winnerAutocompletComponent.myControl.value.id,
      customer: this.customAutocompletComponent.myControl.value.id,
      product: this.data.product,
      dublicate: this.data.dublicate,
      country: null,
      inn: null,
      winner_inn: this.data.winner_inn,
      winner_country: this.data.winner_country,
      plan: this.data.plan,
      tender_plan: this.data.tender_plan,
      tender_dublicate: this.data.tender_dublicate
    }


    if (this.dataDialog.adjacent_tender) {
      this.api.SaveAdjacentTender(tender).subscribe(data => {
          this.dialog.open(ErrorDialogComponent, {data: 'Сохранил'});
          this.data = data;

        },
        err => {
          this.dialog.open(ErrorDialogComponent, {data: "Ошибка " + err});
        });
    }
    else if(this.dataDialog.plan){
      this.api.SavePlanTender(tender).subscribe(data => {
          this.dialog.open(ErrorDialogComponent, {data: 'Сохранил'});
          this.data = data;

        },
        err => {
          this.dialog.open(ErrorDialogComponent, {data: "Ошибка " + err});
        });
    }
    else {
      this.api.SaveTender(tender).subscribe(data => {

            this.dialog.open(ErrorDialogComponent, {data: 'Сохранил'});

          this.data = data;
          this.winnerAutocompletComponent.setWinner(this.data.winner);

        },
        err => {
          this.dialog.open(ErrorDialogComponent, {data: "Ошибка " + err});
        });
    }


  }

  ngOnInit() {

    if (this.dataDialog.adjacent_tender === true) {
      this.api.getAdjacentTenderById(this.dataDialog.id_tender).subscribe(data => {

          this.data = data
        },
        error => {
          this.dialog.open(ErrorDialogComponent, {data: "Возможно Тендер удален или ошибка на сервере. " + error})
        });
    }
    else if(this.dataDialog.plan === true){
      this.api.getPlanTenderByID(this.dataDialog.id_tender).subscribe(data => {

          this.data = data;

        },
        error => {
          this.dialog.open(ErrorDialogComponent, {data: "Возможно Тендер удален или ошибка на сервере. " + error})
        });
    }
    else {
      this.api.getTenderById(this.dataDialog.id_tender).subscribe(data => {

          this.data = data
        },
        error => {
          this.dialog.open(ErrorDialogComponent, {data: "Возможно Тендер удален или ошибка на сервере. " + error})
        });
      this.api.getOrdersByTender(this.dataDialog.id_tender).subscribe(order => {
          this.orders = order;

          this.dataSource = new MatTableDataSource<Orders>(order);
          this.vendorAutocompletComponent.myControl.disable();

          this.subcategoryAutocompletComponent.myControl.disable();
        },
        error => {
          this.dialog.open(ErrorDialogComponent, {data: "Ошибка  " + error})
        });
      this.api.getComments(this.dataDialog.id_tender).subscribe(comment => {
          this.comments = comment;
          this.setcolor();
        },
        error => {
          this.dialog.open(ErrorDialogComponent, {data: "Ошибка  " + error})
        }
      )
    }
    if (!this.dataDialog.adjacent_tender && !this.dataDialog.plan) {
      this.countComment();
    }
    this.Char = this.user.nickname[0].toUpperCase();
  }

  closeDialog() {

    this.dialogRef.close(this.data);
  }

  countComment() {
    this.api.getCountCommentByTender(this.dataDialog.id_tender).subscribe(count => {
        this.CountComment = count;
      },
      error => {
        this.CountComment = null;
      })
  }
  newTender:number;

  dublicate(id_d:number, id:number){
    this.dialog.open(DublicateDialogComponent, {data:{id: id,id_d: id_d}}).afterClosed().subscribe( date =>{
      this.api.getTenderById(this.dataDialog.id_tender).subscribe(data => {

          this.data = data
        },
        error => {
          this.dialog.open(ErrorDialogComponent, {data: "Возможно Тендер удален или ошибка на сервере. " + error})
        });
    })
  }

  deleteDublicate(){
    this.newTender = null;
    this.api.deleteDublicate(this.data.id).subscribe(data => {
        this.dialog.open(ErrorDialogComponent, {data: "Сохранено"})
        this.api.getTenderById(this.dataDialog.id_tender).subscribe(data => {

            this.data = data
          },
          error => {
            this.dialog.open(ErrorDialogComponent, {data: "Возможно Тендер удален или ошибка на сервере. " + error})
          });
      },
      error => {
        this.dialog.open(ErrorDialogComponent, {data: "Ошибка" + error});
      });
  }

  setcolor() {
    for (var a of this.comments) {
      if (!this.UserColor.has(a.usr)) {
        this.UserColor.set(a.usr, this.color[Math.floor(Math.random() * this.color.length)]);
      }
    }
  }

  setprice() {
    var sum = 0;
    for (var i = 0; i < this.orders.length; i++) {
      sum = sum + (this.orders[i].number * this.orders[i].price);
    }
    this.data.price = sum;
    this.data.sum = this.data.price * this.data.rate;
  }

  constructor(public dialogRef: MatDialogRef<TenderDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public dataDialog: dialogTender,
              private api: ApiService,
              public dialog: MatDialog,
              private authenticationService: AuthenticationService,
              private route: ActivatedRoute) {
    this.user = this.authenticationService.userValue;
  }

  changeTab() {
    if ((this.selected.value === 2 && !this.dataDialog.adjacent_tender && !this.dataDialog.plan) || (this.selected.value === 1 && (this.dataDialog.adjacent_tender || this.dataDialog.plan))) {
      this.autocompletTypeComponent.setType(this.data.typetender);
      this.customAutocompletComponent.setCustomer(this.data.customer);
      this.contryAutocompletComponent.myControl.disable();
      if (!this.dataDialog.adjacent_tender && !this.dataDialog.plan && (this.winnerAutocompletComponent.myControl.value === '' || this.winnerAutocompletComponent.myControl.value === null || this.winnerAutocompletComponent.myControl.value === undefined)) {
        this.winnerAutocompletComponent.setWinner(this.data.winner);
      }

    }
  }

  onChangeWinner(t: any) {
    if (typeof t !== "string" && t != undefined) {

      this.data.winner = t.name;
      this.innWinner = t.inn;
      //this.winnerAutocompletComponent.setWinner(t.name);
    } else {
      this.innWinner = null;
    }
  }

  onchangeCustomer(t: any) {
    if (t != null && typeof t !== 'string') {
      this.data.customer = t.name;
      this.data.inn = t.inn;
      this.data.country = t.country;
      this.contryAutocompletComponent.setContry(t.country);
    } else {
      this.innWinner = null;
    }
  }

  onchangeType(t: any) {
    if (t != null && typeof t !== 'string') {
      this.data.typetender = t.type;
    }

  }

  AddWinner() {
    this.dialog.open(AddDialogTenderComponent, {data: {type: 'winner'}}).afterClosed().subscribe(() => this.winnerAutocompletComponent.update());

  }

  AddCustomer() {
    this.dialog.open(AddDialogTenderComponent, {data: {type: 'customer'}}).afterClosed().subscribe(() => this.customAutocompletComponent.update());

  }

  ChangeWinner() {
    this.dialog.open(AddDialogTenderComponent, {
      data: {
        id: this.winnerAutocompletComponent.myControl.value.id,
        inn: this.winnerAutocompletComponent.myControl.value.inn,
        name: this.winnerAutocompletComponent.myControl.value.name,
        type: 'winner'
      }
    }).afterClosed().subscribe(() => this.winnerAutocompletComponent.update());
  }

  ChangeCustomer() {

    this.dialog.open(AddDialogTenderComponent, {
      data: {
        id: this.customAutocompletComponent.myControl.value.id,
        inn: this.customAutocompletComponent.myControl.value.inn,
        name: this.customAutocompletComponent.myControl.value.name,
        country: this.customAutocompletComponent.myControl.value.country,
        type: 'customer'
      }
    }).afterClosed().subscribe(() => this.customAutocompletComponent.update());
  }

  deleteTender() {
    if (this.dataDialog.adjacent_tender) {
      this.dialog.open(DeleteTenderComponent, {data: this.data}).afterClosed().subscribe(result => {
          if (result) {
            this.api.deleteAdjacentTender(this.data.id).subscribe(data => {
                this.dialog.open(ErrorDialogComponent, {data: 'Удалил'});
              },
              err => {
                this.dialog.open(ErrorDialogComponent, {data: err});
              });
            this.data.id = null;
          }
        }
      );
    }
    else if(this.dataDialog.plan){
      this.dialog.open(DeleteTenderComponent, {data: this.data}).afterClosed().subscribe(result => {
          if (result) {
            this.api.deletePlanTender(this.data.id).subscribe(data => {
                this.dialog.open(ErrorDialogComponent, {data: 'Удалил'});
              },
              err => {
                this.dialog.open(ErrorDialogComponent, {data: err});
              });
            this.data.id = null;
          }
        }
      );
    }
    else {
      this.dialog.open(DeleteTenderComponent, {data: this.data}).afterClosed().subscribe(result => {
          if (result) {
            this.api.deleteTender(this.data.id).subscribe(data => {
                this.dialog.open(ErrorDialogComponent, {data: 'Удалил'});
              },
              err => {
                this.dialog.open(ErrorDialogComponent, {data: err});
              });
            this.data.id = null;
          }
        }
      );
    }

  }

  openDived(){
    this.dialog.open(DivdeTenderComponent, {data: {tender: this.data, orders: this.dataSource.data}, width: '80%',
      height: '90%'});
  }
  user: User;
  UserColor = new Map();
  selectable = true;
  removable = true;
  CountComment: number;
  ChangeComment: Comment = {
    id: null,
    text: '',
    usr: null,
    user: '',
    date: null,
    tender: this.dataDialog.id_tender,
    users: []
  };
  getURL(id_tender:string){
    return environment.url+"/tender/"+id_tender;
  }
  defaultComment() {
    this.users = [];
    this.ChangeComment = {
      id: null,
      text: '',
      usr: null,
      user: '',
      date: null,
      tender: this.dataDialog.id_tender,
      users: []
    };
  }

  users: User[] = [];

  ChangeUser(user: any) {
    if (typeof user !== "string") {
      this.users.push(user);

      this.userAutocompletComponent.myControl.setValue('');
    }
  }

  removeUser(user: User) {
    const index = this.users.indexOf(user);
    if (index >= 0) {
      this.users.splice(index, 1);
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
        this.countComment();
        this.UserColor = new Map();
        this.setcolor();
      },
      error => {
        this.dialog.open(ErrorDialogComponent, {data: "Ошибка  " + error})
      }
    )

    this.defaultComment();
  }

}
