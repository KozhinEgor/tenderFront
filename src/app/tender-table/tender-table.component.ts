import {Component, Inject, Input, OnChanges, OnInit, ViewChild} from '@angular/core';
import {animate, state, style, transition, trigger} from "@angular/animations";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {MatTableDataSource} from "@angular/material/table";
import {Orders, OrdersDB, Post, Product, ProductCategory} from "../classes";
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import {VendorCodeAutocompleatComponent} from "../vendor-code-autocompleat/vendor-code-autocompleat.component";
import {ProductCategoryAutocompletComponent} from "../product-category-autocomplet/product-category-autocomplet.component";
import {ApiService} from "../api.service";


export interface DialogData {
  error: string;
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

  constructor(public dialog: MatDialog, private api: ApiService){

  }
  showTender() {
    this.dialog.open(TenderDialogComponent, { width: '80%', height: '80%', data:  this.expandedElement});
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
  selector: 'app-error-dialog',
  templateUrl: './error-dialog.component.html',
})
export class ErrorDialogTenderComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: DialogData) {}

}

@Component({
  selector: 'delete-product',
  templateUrl: '../tender-table/delete-product.html',
})
export class DeleteProductComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: Orders) {}

}

@Component({
  selector: 'app-tender-dialog',
  templateUrl: '../tender-table/tender-dialog.component.html',
  styleUrls: ['../tender-table/tender-dialog.component.scss'],
})
export class TenderDialogComponent implements OnInit {
  @ViewChild(VendorCodeAutocompleatComponent)
  private vendorCodeAutocomplete: VendorCodeAutocompleatComponent;
  @ViewChild(ProductCategoryAutocompletComponent)
  private productCategoryAutocompletComponent: ProductCategoryAutocompletComponent;

  dataSource = new MatTableDataSource<Orders>();

  product: Product  = null;
  Category: ProductCategory = null;
  channel = -1;
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
  default(){
    this.dataSource = new MatTableDataSource<Orders>(this.orders);
    this.productCategoryAutocompletComponent.myControl.setValue('');
    this.vendorCodeAutocomplete.myControl.setValue('');
    this.product = null;
    this.Category = null;
    this.channel = -1;
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
        if (this.product.vendor_code === 'no_vendor_code' || this.Category.id === 7) {
          console.log(this.vendor);
          this.comment = (this.vendor === 'No vendor' || this.vendor === null ? ''  : this.vendor + ' ') + (this.portable ? 'портативный ' : '') + (this.usb ? 'USB ' : '') + (this.vxi ? 'VXI ' : '') + (this.frequency !== -1 && this.frequency?  String(this.frequency) +  'ГГц ' : '') + (this.channel!== -1 &&this.channel? String(this.channel)+  'кан. ' : '') + this.comment ;
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
          id_product: (this.vendor !== 'No vendor' && this.vendor !== null ? this.vendor : '') + ' ' + (this.product.vendor_code === 'no_vendor_code'? '': this.product.vendor_code),
          comment: this.comment ? this.comment : '' ,
          number: this.number,
          price: this.price !== null ? this.price : 0,
          winprice: this.winprice !== null ? this.winprice : 0
        });
        this.default();
      }
      catch (e){
        if(e instanceof TypeError){
          this.dialog.open(ErrorDialogTenderComponent, { data: 'Проверьте все значения, не подходит значениее в ' + e.message.substring(e.message.indexOf("\'")+1,e.message.lastIndexOf("\'")) + ' значие должно быть выбранно из списка'})
        }
        else {
          this.dialog.open(ErrorDialogTenderComponent, { data: e.message});
        }
      }
    }
  }

  deleteProduct(or: Orders) {
    const dialogRef = this.dialog.open(DeleteProductComponent, { data: or});
    dialogRef.afterClosed().subscribe(result =>{
      this.orders.splice(this.orders.indexOf(or), 1);
      this.ordersDB.splice(this.orders.indexOf(or), 1);
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
            comment: '1 наименование' ,
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
      this.vendorCodeAutocomplete.myControl.setValue(product); }
    );
    this.comment = or.comment;
    this.number = or.number;
    this.price = or.price;
  }
  saveProduct(){
    this.orders[this.editOrders] = {tender: this.data.id,
      vendor: this.vendor ? this.vendor : '',
      product_category: this.Category.category,
      id_product: (this.vendor !== 'NO vendor' && this.vendor !== null ? this.vendor : '') + ' ' + (this.product.vendor_code === 'no_vendor_code'? '': this.product.vendor_code),
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
      if ( this.product.vendor_code === 'no_vendor_code' || this.Category.id === 7){
        this.product.vendor = null;
      }
      this.vendor = this.product.vendor;
      this.vxi = this.product.vxi;
      this.portable = this.product.portable;
      this.usb = this.product.usb;
      this.frequency = this.product.frequency === null ? -1: this.product.frequency;
      this.channel = this.product.channel === null?  -1  : this.product.channel;
      this.flag = true;
    }
  }
  Save(){
    this.data.product = '';
    var sum = 0;
    for( var i = 0; i < this.ordersDB.length; i++){
      sum = sum + (this.ordersDB[i].number*this.ordersDB[i].price);
    }
    if(sum !== 0){
      this.data.price = sum;
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
    else{
      for( var i = 0; i < this.orders.length; i++){
        if(this.orders[i].product_category === 'Продукты'){
          this.data.product =this.data.product + this.orders[i].id_product + ' ' + this.orders[i].comment + ' - ' + this.orders[i].number + ';';
        }
        else{
          console.log(this.orders[i])
          this.data.product =this.data.product +this.orders[i].product_category  + (this.orders[i].id_product.length !== 1 ? ' ' + this.orders[i].id_product : '') + ' (' + this.orders[i].comment + ') - ' + this.orders[i].number + '; ';
        }

        }

    }
    let message: string = '';
    this.api.addOrders( this.ordersDB).subscribe(data => data,
      err => {if(err.status === 200){

      }
      else {
        this.dialog.open(ErrorDialogTenderComponent, { data: err.message});


      }
      });
    this.api.SaveTender(this.data).subscribe(data => data,
      err => {if(err.status === 200){
        this.dialog.open(ErrorDialogTenderComponent, { data: 'Сохранил'});

      }
      else {
        this.dialog.open(ErrorDialogTenderComponent, { data: message + err.message});
      }
      });


  }
  ngOnInit() {
    this.api.getOrdersByTender(this.data.id).subscribe(order => {

      this.orders = order.orders;
      this.dataSource = new MatTableDataSource<Orders>(order.orders) ;
      this.ordersDB = order.ordersDB;
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

}
