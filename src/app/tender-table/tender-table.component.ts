import {AfterViewInit, Component, Inject, Input, OnChanges, OnInit, ViewChild} from '@angular/core';
import {animate, state, style, transition, trigger} from "@angular/animations";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {MatTableDataSource} from "@angular/material/table";
import {Company, Orders, OrdersDB, Post, Product, ProductCategory, User,Comment} from "../classes";
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



export interface CustomerWinner{
  id: number ;
  inn: number ;
  name: string ;
  ogrn: number ;
  country: string ;
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
export class TenderTableComponent implements OnInit,OnChanges {
  @Input() displayedColumns;
  @ViewChild(MatPaginator) paginator: MatPaginator | null = null;
  @ViewChild(MatSort) sort: MatSort | null = null;

  @Input() dataSource = new MatTableDataSource<Post>();
  @Input()  adjacent_tender: boolean;
  expandedElement: Post | null;
  user:User;
  totalCost: number = 0;
  totalCount:number = 0;
  totalCountFinish:number = 0;
  totalCostFinish:number = 0;
  constructor(public dialog: MatDialog, private api: ApiService, private authenticationService:AuthenticationService){
    this.user = this.authenticationService.userValue;
  }
  showTender() {
    this.dialog.open(TenderDialogComponent, { width: '80%', height: '90%', data:{adjacent_tender: this.adjacent_tender, id_tender: this.expandedElement.id}}).afterClosed().subscribe(result =>{
      this.expandedElement.price = result.price;
      this.expandedElement.product = result.product;
      this.expandedElement.win_sum=result.win_sum;
      this.expandedElement.full_sum=result.full_sum;
      this.expandedElement.sum=result.sum;
      this.expandedElement.currency=result.currency;
      this.expandedElement.rate=result.rate;
      this.expandedElement.customer=result.customer;
      this.expandedElement.name_tender=result.name_tender;
      this.expandedElement.dublicate=result.dublicate;
      this.expandedElement.typetender=result.typetender;
      this.expandedElement.inn=result.inn;
      this.expandedElement.winner=result.winner;
      this.expandedElement.date_tranding=result.date_tranding;
      this.expandedElement.gos_zakupki=result.gos_zakupki;
      this.expandedElement.bico_tender=result.bico_tender;
      this.expandedElement.number_tender=result.number_tender;
      this.expandedElement.id=result.id;
      this.expandedElement.country=result.country;
      this.expandedElement.date_finish=result.date_finish;
      this.expandedElement.date_start=result.date_start;
      if(result.id == null){
        this.dataSource.data.splice(this.dataSource.data.indexOf(this.expandedElement), 1)

        this.dataSource = new MatTableDataSource<Post>(this.dataSource.data);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator
      }
    });
  }

  ngOnInit(): void {

  }

  getTotal() {
    for(let i = 0;i<this.dataSource.data.length;i++){
      if(this.dataSource.data[i].win_sum>0){

        this.totalCountFinish++;
        this.totalCostFinish= this.totalCostFinish + (this.dataSource.data[i].win_sum *  this.dataSource.data[i].rate);
      }
      if(this.dataSource.data[i].sum !== 0 ){
        this.totalCount++;
        this.totalCost= this.totalCost + this.dataSource.data[i].sum;
      }
    }
  }


  ngOnChanges(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.totalCost = 0;
    this.totalCount = 0;
    this.totalCountFinish = 0;
    this.totalCostFinish = 0;
    this.getTotal();
  }


}

@Component({
  selector: 'add-dialog',
  templateUrl: './addComponent.html',
})
export class AddDialogTenderComponent implements OnInit, AfterViewInit{
   @ViewChild(ContryAutocompletComponent)
   private contryAutocompletComponent:ContryAutocompletComponent
  id: number = null;
  inn: number = null;
  name: string = null;
  country: number = null;
  save(){
    if(this.data.type === 'winner'){
      if (this.data.inn && this.data.name && this.data.country){
        let win: Company = {id: this.data.id, inn: this.data.inn.toString(), name: this.data.name, country: this.data.country.toString()};
        this.api.InsertWinner(win).subscribe(data => {this.dialog.open(ErrorDialogComponent, { data:'Сохранил'});},
          err => {
            this.dialog.open(ErrorDialogComponent, {data: 'Ошибка  не сохранил'+ err});

          });
      }
      else{
        this.dialog.open(ErrorDialogComponent, { data:'Заполнены не все поля'});
      }
    }

    if(this.data.type === 'customer'){
      if (this.data.inn && this.data.name && this.data.country){
        let customer: Company= {id: this.data.id, inn: this.data.inn.toString(), name: this.data.name, country: this.data.country.toString()};
        this.api.InsertCustomer(customer).subscribe(data => {this.dialog.open(ErrorDialogComponent, { data:'Сохранил'});},
          err => {
            this.dialog.open(ErrorDialogComponent, {data: 'Ошибка  не сохранил' + err});

          });
      }
      else{
        this.dialog.open(ErrorDialogComponent, { data:'Заполнены не все поля'});
      }
    }

  }
  ngOnInit(){



  }
  ngAfterViewInit() {
    if(this.data.type === 'customer'){
      this.contryAutocompletComponent.setContry(this.data.country);}

  }
  onChangeContry(t: any){

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

  constructor(@Inject(MAT_DIALOG_DATA) public data: Orders) {}

}

@Component({
  selector: 'delete-tender',
  templateUrl: '../tender-table/delete-tender.html',
})
export class DeleteTenderComponent {

  constructor(@Inject(MAT_DIALOG_DATA) public data: Post) {}

}

export interface dialogTender{
  adjacent_tender: boolean;
  id_tender: number;
}

@Component({
  selector: 'app-tender-dialog',
  templateUrl: '../tender-table/tender-dialog.component.html',
  styleUrls: ['../tender-table/tender-dialog.component.scss'],
})
export class TenderDialogComponent implements OnInit {
  @ViewChild(CustomAutocompletComponent)
  private customAutocompletComponent:CustomAutocompletComponent;
  @ViewChild(ContryAutocompletComponent)
  private contryAutocompletComponent:ContryAutocompletComponent;
  @ViewChild(WinnerAutocompletComponent)
  private winnerAutocompletComponent:WinnerAutocompletComponent;
  @ViewChild(AutocompletTypeComponent)
  private autocompletTypeComponent:AutocompletTypeComponent
  @ViewChild(VendorAutocompletComponent)
  private vendorAutocompletComponent:VendorAutocompletComponent;
  @ViewChild(ProductCategoryAutocompletComponent)
  private productCategoryAutocompletComponent: ProductCategoryAutocompletComponent;
  @ViewChild(UserAutocompletComponent)
  private userAutocompletComponent: UserAutocompletComponent;
  @ViewChild(VendorCodeAutocompleatComponent)
  private vendorCodeAutocompleatComponent:VendorCodeAutocompleatComponent;
  delete = false;
  dataSource = new MatTableDataSource<Orders>();
  Char:string;
  innWinner: number;

  channel = -1;
  port = -1;
  frequency = -1;
  vxi = null;
  portable = null;
  usb = null;
  comment = '';
  number = null;
  price = null;
  winprice = null;
  editOrders = null;
  flag = false;
  orders: Orders[] = [];
  ordersDB: OrdersDB[] = [];
  selected = new FormControl(0);
  comments: Comment[];
  color:string[]=['#FFCC33','#FF9933','#FF6600','#FF3300','#FF6666','#CC3333','#FF0066','#FF0099','#FF33CC','#FF66FF','#CC66CC','#CC00FF','#9933FF','#9966FF','#9999FF','#6666FF','#3300FF','#3366FF','#0066FF',
  '#3399FF','#33CCFF','#66CCCC','#66FFFF','#33FFCC','#00CC99','#00FF99','#33FF66','#66CC66','#00FF00','#33FF00','#66CC00','#99CC66','#CCFF33','#CCCC33','#CCCCCC'];
  data:Post = {
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
    country:''
  };

  default(){
    this.dataSource = new MatTableDataSource<Orders>(this.orders);
    this.productCategoryAutocompletComponent.myControl.setValue('');
    if(this.vendorAutocompletComponent.myControl.value !== null && this.vendorAutocompletComponent.myControl.value !== ''){

      this.vendorAutocompletComponent.myControl.setValue(null);
    }
    this.vendorCodeAutocompleatComponent.myControl.setValue('');
    this.channel = -1;
    this.port = -1;

    this.frequency = -1;
    this.vxi = null;
    this.portable = null;
    this.usb = null;
    this.comment = '';
    this.number = null;
    this.price = null;
    this.editOrders = null;
  }

  addProduct(){
    if (this.number !== null) {
      console.log(this.vendorAutocompletComponent.myControl.value);
      try {
        if (this.vendorCodeAutocompleatComponent.myControl.value.vendor_code === 'Без артикуля' || this.productCategoryAutocompletComponent.myControl.value.id === 7) {
          this.comment = (this.vendorAutocompletComponent.myControl.value !== '' && this.vendorAutocompletComponent.myControl.value !== null && this.vendorAutocompletComponent.myControl.value.name !== 'No vendor' ?this.vendorAutocompletComponent.myControl.value.name + ' ' : '' ) + (this.portable ? 'портативный ' : '') + (this.usb ? 'USB ' : '') + (this.vxi ? 'VXI ' : '') + (this.frequency !== -1 && this.frequency?  String(this.frequency) +  'ГГц ' : '') + (this.channel!== -1 &&this.channel? String(this.channel)+  'кан. ' : '')+ (this.port!== -1 &&this.port? String(this.port)+  'порта ' : '') + this.comment ;
        }
        this.ordersDB.push({
          id: null,
          vendor: this.vendorCodeAutocompleatComponent.myControl.value.vendor_id ? this.vendorCodeAutocompleatComponent.myControl.value.vendor_id : null,
          tender: this.data.id,
          product_category: this.productCategoryAutocompletComponent.myControl.value.id,
          comment: this.comment ? this.comment : '',
          id_product: this.vendorCodeAutocompleatComponent.myControl.value.id,
          number: this.number,
          price: this.price ? this.price : 0,
          winprice: this.winprice ? this.winprice : 0
        });
        this.orders.push({
          tender: this.data.id,
          vendor: this.vendorAutocompletComponent.myControl.value !== '' && this.vendorAutocompletComponent.myControl.value !== null ? this.vendorAutocompletComponent.myControl.value.name : '',
          product_category: this.productCategoryAutocompletComponent.myControl.value.category,
          id_product: (this.vendorAutocompletComponent.myControl.value !== '' && this.vendorAutocompletComponent.myControl.value !== null && this.vendorAutocompletComponent.myControl.value.name !== 'No vendor'  ? this.vendorAutocompletComponent.myControl.value.name : '') + ' ' + (this.vendorCodeAutocompleatComponent.myControl.value.vendor_code === 'Без артикуля'? '': this.vendorCodeAutocompleatComponent.myControl.value.vendor_code),
          comment: this.comment ? this.comment : '' ,
          number: this.number,
          price: this.price !== null ? this.price : 0,
          winprice: this.winprice !== null ? this.winprice : 0
        });
        this.default();
      }
      catch (e){
        if(e instanceof TypeError){
          console.log(e.message);
          this.dialog.open(ErrorDialogComponent, { data: 'Проверьте все значения, не подходит значениее в ' + e.message.substring(e.message.indexOf("\'")+1,e.message.lastIndexOf("\'")) + ' значие должно быть выбранно из списка'})
        }
        else {
          this.dialog.open(ErrorDialogComponent, { data: e.message});
        }
      }
    }
  }

  deleteProduct(or: Orders) {
    const dialogRef = this.dialog.open(DeleteProductComponent, { data: or});
    dialogRef.afterClosed().subscribe(result =>{
      let indexDelete = this.orders.indexOf(or);
      this.orders.splice(indexDelete, 1);
      this.ordersDB.splice(indexDelete, 1);

      if(!result ){
        var index = null;
        for( var i = 0; i < this.ordersDB.length; i++){

          if(this.ordersDB[i].id_product === 7 && this.ordersDB[i].product_category === 7){
            index = i;
          }
        }
        if(index !== null){
          this.orders[index].number = this.orders[index].number + or.number;
          this.orders[index].comment = '('+String(Number(this.orders[index].comment.replace(/[^\d]/g,'')) + 1) + ' наименований)';

          this.ordersDB[index].number = this.ordersDB[index].number + or.number;
          this.ordersDB[index].comment = '(' + String(Number(this.ordersDB[index].comment.replace(/[^\d]/g,'')) + 1) + ' наименований)';
        }
        else{
          this.ordersDB.push({
            id: null,
            vendor:  null,
            tender: this.data.id,
            product_category: 7,
            comment: '1 наименование',
            id_product: 7,
            number: or.number,
            price: 0,
            winprice: 0
          });
          this.orders.push({
            tender: this.data.id,
            vendor: '',
            product_category: 'Продукты',
            id_product: 'Другое оборудование',
            comment: '(1 наименование)' ,
            number: or.number,
            price:0,
            winprice: 0
          });
        }
      }
      this.dataSource = new MatTableDataSource<Orders>(this.orders);
    });

  }

  editProduct(or: Orders){
    this.editOrders = this.orders.indexOf(or);
    this.productCategoryAutocompletComponent.myControl.setValue({id: this.ordersDB[this.editOrders].product_category, category: or.product_category , category_en: null});
    this.api.getVendorCodeById(this.ordersDB[this.orders.indexOf(or)].product_category, this.ordersDB[this.editOrders].id_product).subscribe(product =>{
      this.vendorCodeAutocompleatComponent.myControl.setValue(product); },
      error => {
      this.dialog.open(ErrorDialogComponent,{data:"Ошибка " + error})
      }
    );
    this.comment = or.comment;
    this.number = or.number;
    this.price = or.price;
  }

  saveProduct(){
    if (this.vendorCodeAutocompleatComponent.myControl.value.vendor_code === 'Без артикуля' || this.productCategoryAutocompletComponent.myControl.value.id === 7) {
      this.comment = (this.vendorAutocompletComponent.myControl.value !== '' && this.vendorAutocompletComponent.myControl.value !== null && this.vendorAutocompletComponent.myControl.value.name !== 'No vendor' ?this.vendorAutocompletComponent.myControl.value.name + ' ' : '' ) + (this.portable ? 'портативный ' : '') + (this.usb ? 'USB ' : '') + (this.vxi ? 'VXI ' : '') + (this.frequency !== -1 && this.frequency?  String(this.frequency) +  'ГГц ' : '') + (this.channel!== -1 &&this.channel? String(this.channel)+  'кан. ' : '')+ (this.port!== -1 &&this.port? String(this.port)+  'порта ' : '') + this.comment ;
    }
    this.orders[this.editOrders] = {tender: this.data.id,
      vendor: this.vendorAutocompletComponent.myControl.value !== '' && this.vendorAutocompletComponent.myControl.value !== null ? this.vendorAutocompletComponent.myControl.value.name : '',
      product_category: this.productCategoryAutocompletComponent.myControl.value.category,
      id_product: (this.vendorAutocompletComponent.myControl.value !== null && this.vendorAutocompletComponent.myControl.value !== '' && this.vendorAutocompletComponent.myControl.value.name !== 'No vendor' ? this.vendorAutocompletComponent.myControl.value.name : '') + ' ' + (this.vendorCodeAutocompleatComponent.myControl.value.vendor_code === 'Без артикуля'? '': this.vendorCodeAutocompleatComponent.myControl.value.vendor_code),
      comment: this.comment ? this.comment : '' ,
      number: this.number,
      price: this.price ? this.price : 0,
      winprice: this.winprice ? this.winprice : 0};
    this.ordersDB[this.editOrders] = {
      id: this.ordersDB[this.editOrders].id,
      vendor: this.vendorCodeAutocompleatComponent.myControl.value.vendor_id ? this.vendorCodeAutocompleatComponent.myControl.value.vendor_id : null,
      tender: this.data.id,
      product_category: this.productCategoryAutocompletComponent.myControl.value.id,
      comment: this.comment ? this.comment : '',
      id_product: this.vendorCodeAutocompleatComponent.myControl.value.id,
      number: this.number,
      price: this.price ? this.price : 0,
      winprice: this.winprice ? this.winprice : 0
    };
    this.default();
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

  ChangeVendorCode(vendor_code: any){
    if (vendor_code != null && typeof vendor_code !== 'string') {
      if(!this.vendorAutocompletComponent.myControl.value && this.productCategoryAutocompletComponent.myControl.value.id !== 7){
        this.vendorAutocompletComponent.setVendor(vendor_code.vendor);
      }
      console.log()

      this.vxi = this.vendorCodeAutocompleatComponent.myControl.value.vxi;
      this.portable = this.vendorCodeAutocompleatComponent.myControl.value.portable;
      this.usb = this.vendorCodeAutocompleatComponent.myControl.value.usb;
      this.frequency = this.vendorCodeAutocompleatComponent.myControl.value.frequency === null ? -1: this.vendorAutocompletComponent.myControl.value.frequency;
      this.channel = this.vendorCodeAutocompleatComponent.myControl.value.channel === null?  -1  : this.vendorAutocompletComponent.myControl.value.channel;
      this.port = this.vendorCodeAutocompleatComponent.myControl.value.port === null? -1: this.vendorAutocompletComponent.myControl.value.port;
      this.flag = true;


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

  Save(){

    var sum = 0;
    for( var i = 0; i < this.ordersDB.length; i++){
      sum = sum + (this.ordersDB[i].number*this.ordersDB[i].price);
    }
    if(sum !== 0){
      this.data.price = parseFloat(sum.toFixed(2));
      this.data.sum = this.data.price * this.data.rate;
    }

    if(this.ordersDB.length === 0){


      this.ordersDB.push({
        id: null,
        vendor:  null,
        tender: this.data.id,
        product_category: null,
        comment: '',
        id_product: null,
        number: null,
        price: 0,
        winprice: 0
      });

    }
    let message: string = '';
    this.autocompletTypeComponent.setType(this.data.typetender);
    if(!this.dataDialog.adjacent_tender){this.winnerAutocompletComponent.setWinner(this.data.winner);}
    this.customAutocompletComponent.setCustomer(this.data.customer);
    let tender: Post= {id: this.data.id,
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
      winner:this.dataDialog.adjacent_tender?null: this.winnerAutocompletComponent.myControl.value.id,
      customer: this.customAutocompletComponent.myControl.value.id ,
      product: this.data.product,
      dublicate: this.data.dublicate,
      country: null,
      inn: null}


    if(this.dataDialog.adjacent_tender){
      this.api.SaveAdjacentTender(tender).subscribe(data => {
        this.dialog.open(ErrorDialogComponent, { data: 'Сохранил'});
        this.data = data;

        },
        err => {
          this.dialog.open(ErrorDialogComponent, { data: "Ошибка "+ err});
        });
    }

    else{
      let prod:string = null;
      let flag:boolean = false;
      this.api.addOrders( this.ordersDB).subscribe(
        data => {

          prod = data.name;
          if (flag){
            this.data.product = data.name;
            this.dialog.open(ErrorDialogComponent, { data: 'Сохранил'});
          }
          flag = true;},
        err => {
          this.dialog.open(ErrorDialogComponent, { data: "Ошибка "+ err});
        });
      this.api.SaveTender(tender).subscribe(data => {

          if (flag){
            this.dialog.open(ErrorDialogComponent, { data: 'Сохранил'});
          }
          this.data = data;
          this.data.product = prod;
          flag = true;
        },
        err => {
          this.dialog.open(ErrorDialogComponent, { data: "Ошибка "+ err});
        });
    }



  }

  ngOnInit() {
    if(this.dataDialog.adjacent_tender === true){
      this.api.getAdjacentTenderById(this.dataDialog.id_tender).subscribe(data =>{

          this.data = data
        },
        error => {
          this.dialog.open(ErrorDialogComponent, {data:"Возможно Тендер удален или ошибка на сервере. "+ error})
        });
    }
    else{
      this.api.getTenderById(this.dataDialog.id_tender).subscribe(data =>{

          this.data = data
      },
        error => {
          this.dialog.open(ErrorDialogComponent, {data:"Возможно Тендер удален или ошибка на сервере. "+ error})
        });
      this.api.getOrdersByTender(this.dataDialog.id_tender).subscribe(order => {
          this.orders = order.orders;
          this.dataSource = new MatTableDataSource<Orders>(order.orders) ;
          this.ordersDB = order.ordersDB;
        },
        error => {
          this.dialog.open(ErrorDialogComponent, {data:"Ошибка  "+ error})
        });
      this.api.getComments(this.dataDialog.id_tender).subscribe(comment =>{
          this.comments = comment;
          this.setcolor();
        },
        error => {
          this.dialog.open(ErrorDialogComponent, {data:"Ошибка  "+ error})
        }
      )
    }
    if(!this.dataDialog.adjacent_tender){
      this.countComment();
    }
    this.Char = this.user.nickname[0].toUpperCase();
  }

  countComment(){
    this.api.getCountCommentByTender(this.dataDialog.id_tender).subscribe(count => {
        this.CountComment = count;},
      error=> {this.CountComment = null;})
  }

  setcolor(){
    for(var a of this.comments){
      if(!this.UserColor.has(a.usr)){
        this.UserColor.set(a.usr,this.color[Math.floor(Math.random() * this.color.length)]);
      }
    }
  }

  setprice(){
    var sum = 0;
    for( var i = 0; i < this.ordersDB.length; i++){
      sum = sum + (this.ordersDB[i].number*this.ordersDB[i].price);
    }
    this.data.price = sum;
    this.data.sum = this.data.price * this.data.rate;
  }

  constructor(    public dialogRef: MatDialogRef<TenderDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public dataDialog: dialogTender, private api: ApiService, public dialog: MatDialog, private authenticationService:AuthenticationService) {
    this.user = this.authenticationService.userValue;
  }

    changeTab(){
    if((this.selected.value === 2 && !this.dataDialog.adjacent_tender)||(this.selected.value === 1 && this.dataDialog.adjacent_tender)){
      this.autocompletTypeComponent.setType(this.data.typetender);
      this.customAutocompletComponent.setCustomer(this.data.customer);
      this.contryAutocompletComponent.myControl.disable();
      if(!this.dataDialog.adjacent_tender){
        this.winnerAutocompletComponent.setWinner(this.data.winner);
      }

    }
    }

  onChangeWinner(t: any) {
    if (typeof t !== "string") {
      this.data.winner = t.name;
      this.innWinner = t.inn;
      //this.winnerAutocompletComponent.setWinner(t.name);
    }
    else{
      this.innWinner = null;
    }
  }

  onchangeCustomer(t:any){
    if (t != null && typeof t !== 'string') {
      this.data.customer = t.name;
      this.data.inn = t.inn;
      this.data.country = t.country;
      this.contryAutocompletComponent.setContry(t.country);
    }
    else{
      this.innWinner = null;
    }
  }

  onchangeType(t:any){
    if (t != null && typeof t !== 'string') {
      this.data.typetender = t.type;
    }

  }

  AddWinner(){
    this.dialog.open(AddDialogTenderComponent,{ data: {type:'winner'}}).afterClosed().subscribe(()=>this.winnerAutocompletComponent.update());

  }

  AddCustomer(){
    this.dialog.open(AddDialogTenderComponent,{ data: {type:'customer'}}).afterClosed().subscribe(()=>this.customAutocompletComponent.update());

  }

  ChangeWinner(){
    this.dialog.open(AddDialogTenderComponent,{ data: {
        id: this.winnerAutocompletComponent.myControl.value.id ,
        inn: this.winnerAutocompletComponent.myControl.value.inn ,
        name: this.winnerAutocompletComponent.myControl.value.name ,
        type:'winner'}}).afterClosed().subscribe(()=>this.winnerAutocompletComponent.update());
  }

  ChangeCustomer(){

    this.dialog.open(AddDialogTenderComponent,{ data: {
        id: this.customAutocompletComponent.myControl.value.id ,
        inn: this.customAutocompletComponent.myControl.value.inn ,
        name: this.customAutocompletComponent.myControl.value.name ,
        country: this.customAutocompletComponent.myControl.value.country ,
        type:'customer'}}).afterClosed().subscribe(()=>this.customAutocompletComponent.update());
  }

  deleteTender(){
    if(this.dataDialog.adjacent_tender){
      this.dialog.open(DeleteTenderComponent,{data: this.data}).afterClosed().subscribe(result => {
          if(result) {
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
    else{
      this.dialog.open(DeleteTenderComponent,{data: this.data}).afterClosed().subscribe(result => {
          if(result) {
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

  user:User;
  UserColor = new Map();
  selectable = true;
  removable = true;
  CountComment: number;
  ChangeComment: Comment ={
    id:null,
    text:'',
    usr:null,
    user: '',
    date: null,
    tender: this.dataDialog.id_tender,
    users:[]
  };

  defaultComment(){
    this.users=[];
    this.ChangeComment={
      id:null,
      text:'',
      usr:null,
      user: '',
      date: null,
      tender: this.dataDialog.id_tender,
      users:[]
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
    for(var u of this.users){
      this.ChangeComment.users.push(u.id);
    }
    this.api.postComments(this.ChangeComment).subscribe(comment =>{
        this.comments = comment;
        this.countComment();
        this.UserColor = new Map();
        this.setcolor();
      },
      error => {
        this.dialog.open(ErrorDialogComponent, {data:"Ошибка  "+ error})
      }
    )

    this.defaultComment();
  }

}
