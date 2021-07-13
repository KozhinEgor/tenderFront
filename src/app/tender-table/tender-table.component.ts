import {AfterViewInit, Component, Inject, Input, OnChanges, OnInit, ViewChild} from '@angular/core';
import {animate, state, style, transition, trigger} from "@angular/animations";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {MatTableDataSource} from "@angular/material/table";
import {Customer, Orders, OrdersDB, Post, Product, ProductCategory, User, Winner} from "../classes";
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
  expandedElement: Post | null;
user:User;
  constructor(public dialog: MatDialog, private api: ApiService, private authenticationService:AuthenticationService){
    this.user = this.authenticationService.userValue;
  }
  showTender() {
    this.dialog.open(TenderDialogComponent, { width: '80%', height: '90%', data:  this.expandedElement}).afterClosed().subscribe(result =>{
      if(result){
        this.dataSource.data.splice(this.dataSource.data.indexOf(this.expandedElement), 1);
      }
    });
  }

  ngOnInit(): void {

  }
  getTotalCost() {
    return this.dataSource.data.map(t =>t.sum).reduce((a,b) =>
       a+b, 0);
  }
  getTotalCount(){
    let count = 0;
    for(let i = 0;i<this.dataSource.data.length;i++){
      if(this.dataSource.data[i].sum !== 0 ){
        count= count +1;
      }
    }
    return count;
  }
  ngOnChanges(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
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
      if (this.data.inn  && this.data.name   ){
        let win: Winner = {id: this.data.id,inn : this.data.inn.toString(), name: this.data.name}
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
      console.log(this.data)
      if (this.data.inn && this.data.name && this.data.country){
        let customer: Customer = {id: this.data.id, inn: this.data.inn.toString(), name: this.data.name, country: this.data.country.toString()};
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
  @ViewChild(VendorCodeAutocompleatComponent)
  private vendorCodeAutocomplete: VendorCodeAutocompleatComponent;
  @ViewChild(ProductCategoryAutocompletComponent)
  private productCategoryAutocompletComponent: ProductCategoryAutocompletComponent;
  delete = false;
  dataSource = new MatTableDataSource<Orders>();
  innWinner: number;
  product: Product  = null;
  Category: ProductCategory = null;
  channel = -1;
  port = -1;
  nameCategory: string;
  vendor = null;
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

  default(){
    this.dataSource = new MatTableDataSource<Orders>(this.orders);
    this.productCategoryAutocompletComponent.myControl.setValue('');
    this.vendorCodeAutocomplete.myControl.setValue('');
    this.product = null;
    this.Category = null;
    this.channel = -1;
    this.port = -1;
    this.nameCategory = null;
    this.vendor = null;
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
      try {
        if (this.product.vendor_code === 'Без артикуля' || this.Category.id === 7) {
          this.comment = (this.vendor === 'No vendor' || this.vendor === null ? ''  : this.vendor + ' ') + (this.portable ? 'портативный ' : '') + (this.usb ? 'USB ' : '') + (this.vxi ? 'VXI ' : '') + (this.frequency !== -1 && this.frequency?  String(this.frequency) +  'ГГц ' : '') + (this.channel!== -1 &&this.channel? String(this.channel)+  'кан. ' : '')+ (this.port!== -1 &&this.port? String(this.port)+  'порта ' : '') + this.comment ;
        }
        this.ordersDB.push({
          id: null,
          vendor: this.product.vendor_id ? this.product.vendor_id : null,
          tender: this.data.id,
          product_category: this.Category.id,
          comment: this.comment ? this.comment : '',
          id_product: this.product.id,
          number: this.number,
          price: this.price ? this.price : 0,
          winprice: this.winprice ? this.winprice : 0
        });
        this.orders.push({
          tender: this.data.id,
          vendor: this.vendor ? this.vendor : '',
          product_category: this.Category.category,
          id_product: (this.vendor !== 'No vendor' && this.vendor !== null ? this.vendor : '') + ' ' + (this.product.vendor_code === 'Без артикуля'? '': this.product.vendor_code),
          comment: this.comment ? this.comment : '' ,
          number: this.number,
          price: this.price !== null ? this.price : 0,
          winprice: this.winprice !== null ? this.winprice : 0
        });
        this.default();
      }
      catch (e){
        if(e instanceof TypeError){
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
          console.log(this.ordersDB[i].id_product, '',  this.ordersDB[i].product_category)
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
      this.vendorCodeAutocomplete.myControl.setValue(product); },
      error => {
      this.dialog.open(ErrorDialogComponent,{data:"Ошибка " + error})
      }
    );
    this.comment = or.comment;
    this.number = or.number;
    this.price = or.price;
  }
  saveProduct(){
    if (this.product.vendor_code === 'Без артикуля' || this.Category.id === 7) {
      this.comment = (this.vendor === 'No vendor' || this.vendor === null ? ''  : this.vendor + ' ') + (this.portable ? 'портативный ' : '') + (this.usb ? 'USB ' : '') + (this.vxi ? 'VXI ' : '') + (this.frequency !== -1 && this.frequency?  String(this.frequency) +  'ГГц ' : '') + (this.channel!== -1 &&this.channel? String(this.channel)+  'кан. ' : '') + (this.port!== -1 &&this.port? String(this.port)+  'порта ' : '') + this.comment ;
    }
    this.orders[this.editOrders] = {tender: this.data.id,
      vendor: this.vendor ? this.vendor : '',
      product_category: this.Category.category,
      id_product: (this.vendor !== 'No vendor' && this.vendor !== null ? this.vendor : '') + ' ' + (this.product.vendor_code === 'Без артикуля'? '': this.product.vendor_code),
      comment: this.comment ? this.comment : '' ,
      number: this.number,
      price: this.price ? this.price : 0,
      winprice: this.winprice ? this.winprice : 0};
    this.ordersDB[this.editOrders] = {
      id: this.ordersDB[this.editOrders].id,
      vendor: this.product.vendor_id ? this.product.vendor_id : null,
      tender: this.data.id,
      product_category: this.Category.id,
      comment: this.comment ? this.comment : '',
      id_product: this.product.id,
      number: this.number,
      price: this.price ? this.price : 0,
      winprice: this.winprice ? this.winprice : 0
    };
    this.default();
  }
  onChange(t: any) {
    if (t != null && typeof t !== 'string') {
      this.Category = t;
      this.vendorCodeAutocomplete.start(this.Category.id);

    }
  }
  onChangeVendorCode(product: Product){

    if (product != null && typeof product !== 'string'){
      this.product = product;
      if ( this.product.vendor_code === 'Без артикуля' || this.Category.id === 7){
        this.product.vendor = null;
      }
      this.vendor = this.product.vendor;
      this.vxi = this.product.vxi;
      this.portable = this.product.portable;
      this.usb = this.product.usb;
      this.frequency = this.product.frequency === null ? -1: this.product.frequency;
      this.channel = this.product.channel === null?  -1  : this.product.channel;
      this.port = this.product.port === null? -1: this.product.port;
      this.flag = true;
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
    this.winnerAutocompletComponent.setWinner(this.data.winner);
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
      winner: this.winnerAutocompletComponent.myControl.value.id,
      customer: this.customAutocompletComponent.myControl.value.id ,
      product: this.data.product,
      dublicate: this.data.dublicate,
      country: null,
      inn: null}
    this.api.addOrders( this.ordersDB).subscribe(data => this.data.product = data.name,
      err => {
          this.dialog.open(ErrorDialogComponent, { data: "Ошибка "+ err});
      });
    this.api.SaveTender(tender).subscribe(data => {
        this.dialog.open(ErrorDialogComponent, { data: 'Сохранил'});
        this.data = data;
    },
      err => {
        this.dialog.open(ErrorDialogComponent, { data: "Ошибка "+ err});
      });


  }
  ngOnInit() {
    this.api.getOrdersByTender(this.data.id).subscribe(order => {
      this.orders = order.orders;
      this.dataSource = new MatTableDataSource<Orders>(order.orders) ;
      this.ordersDB = order.ordersDB;
    },
      error => {
      this.dialog.open(ErrorDialogComponent, {data:"Ошибка  "+ error})
      });

  }
  setprice(){
    var sum = 0;
    for( var i = 0; i < this.ordersDB.length; i++){
      sum = sum + (this.ordersDB[i].number*this.ordersDB[i].price);
    }
    this.data.price = sum;
    this.data.sum = this.data.price * this.data.rate;
  }
  constructor(
    public dialogRef: MatDialogRef<TenderDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Post, private api: ApiService, public dialog: MatDialog) {}

    changeTab(){
    if(this.selected.value === 2){
      this.autocompletTypeComponent.setType(this.data.typetender);
      this.winnerAutocompletComponent.setWinner(this.data.winner);
      this.customAutocompletComponent.setCustomer(this.data.customer);
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
    this.dialog.open(DeleteTenderComponent,{data: this.data}).afterClosed().subscribe(result => {
      if(result) {
        this.api.deleteTender(this.data.id).subscribe(data => data,
          err => {
            if (err.status === 200) {
              this.dialog.open(ErrorDialogComponent, {data: 'Удалил'});

            } else {
              this.dialog.open(ErrorDialogComponent, {data: err.message});
            }
          });
        this.delete = true;
      }
    }
    );
}
}
