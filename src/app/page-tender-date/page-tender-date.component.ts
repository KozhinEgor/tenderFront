import {AfterViewInit, Component, Inject, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {MatSort} from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ApiService } from '../api.service';
import {DataRangeComponent} from '../data-range/data-range.component';

import {Orders, OrdersDB, Post, Product, ProductCategory, ReceivedJson} from '../classes';
import { registerLocaleData } from '@angular/common';
import localeRu from '@angular/common/locales/ru';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {AutocompletTypeComponent} from '../autocomplet-type/autocomplet-type.component';
import {CustomAutocompletComponent} from '../custom-autocomplet/custom-autocomplet.component';
import {WinnerAutocompletComponent} from '../winner-autocomplet/winner-autocomplet.component';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import {animate, state, style, transition, trigger} from "@angular/animations";
import {VendorCodeAutocompleatComponent} from "../vendor-code-autocompleat/vendor-code-autocompleat.component";
import {ProductCategoryAutocompletComponent} from "../product-category-autocomplet/product-category-autocomplet.component";




export interface group {
  name: string;
  nameru: string;
}
export interface DialogData {
  error: string;
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

  @ViewChild(AutocompletTypeComponent)
  private autocompletType: AutocompletTypeComponent| undefined;
  @ViewChild(CustomAutocompletComponent)
  private customAutocomplet: CustomAutocompletComponent| undefined;
  @ViewChild(WinnerAutocompletComponent)
  private winnerAutocomplet: WinnerAutocompletComponent| undefined;

  @ViewChild(DataRangeComponent)
  private dataRange: DataRangeComponent | undefined;
  expandedElement: Post | null;

  panelOpenState = false;

  minSum = new FormControl('', [Validators.max(999999999999), Validators.min(0)]);
  maxSum = new FormControl('', [Validators.max(999999999999), Validators.min(0)]);

  ChoseColums: group[] = [];
  displayedColumns: string[] = [];

  AllColums: group[] = [{name: 'id', nameru: 'ID'}, {name: 'nameTender', nameru: 'Название тендера'}, {name: 'customer', nameru: 'Заказчик'}, {name: 'typetender', nameru: 'Тип тендера'},

     {name: 'sum', nameru: 'Сумма'}, {name: 'dateStart', nameru: 'Дата начала'},
    {name: 'dateFinish', nameru: 'Дата окончания'},  {name: 'winner', nameru: 'Победитель'}, {name: 'winSum', nameru: 'Выиграшная сумма'}];



  constructor(private api: ApiService, public dialog: MatDialog) {
    for (let index = 0; index < this.AllColums.length - 2; index++){
      this.ChoseColums.push(this.AllColums[index]);
      this.displayedColumns.push(this.AllColums[index].name);
    }
  }

  json: ReceivedJson = {dateStart: '', dateFinish: '', type: '%', custom: '%', winner: '%', minSum: 0, maxSum: 999999999999};

  showTables(): void{
    this.json.dateStart = this.dataRange?.getDateStart() || '2018-01-01T00:00Z[UTC]';
    this.json.dateFinish = this.dataRange?.getDateFinish() || '2040-01-01T00:00Z[UTC]';
    this.json.type = this.autocompletType?.getType() || '%';
    this.json.custom = this.customAutocomplet?.getCustom() || '%';
    this.json.winner = this.winnerAutocomplet?.getWinner() || '%';
    if (this.minSum && this.maxSum && this.maxSum.value > this.minSum.value) {
      this.json.maxSum = this.maxSum.value;
      this.json.minSum = this.minSum.value;
    }
    else if (this.minSum && this.maxSum && this.maxSum.value < this.minSum.value){
      this.dialog.open(ErrorDialogComponent, { data: 'Максимальная сумма меньше минимальной'});
    }

    console.log(this.json);
    this.api.getPostWithParametrs(this.json).subscribe(posts => {
      this.dataSource = new MatTableDataSource<Post>(posts) ;
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    /*
    this.api.getPosts().subscribe(posts => {
      this.dataSource = new MatTableDataSource<Post>(posts) ;
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      */
    });
  }
  ngOnInit(): void {

    /*this.api.getPostDate().subscribe(ob => {
      this.exampe = ob;

    });*/
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
      console.log(indexDisplay);
      this.displayedColumns.splice(indexDisplay, 0, offer.name);
    }
  }
  isSelected(offer: any): boolean {
    const index = this.ChoseColums.indexOf(offer);

    return index >= 0;
  }
  /*Winner(): void{
    if ( this.checkedWinner){
      this.displayedColumns = this.ColumsWithWin;
    }
    else {
      this.displayedColumns = this.ColumsWithoutWin;
    }
  }
*/
  showTender(){
    this.dialog.open(TenderDialogComponent, { width: '80%', height: '80%', data:  this.expandedElement});
  }
}
@Component({
  selector: 'app-error-dialog',
  templateUrl: './error-dialog.component.html',
})
export class ErrorDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: DialogData) {}

}

@Component({
  selector: 'delete-product',
  templateUrl: './delete-product.html',
})
export class DeleteProductComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: Orders) {}

}

@Component({
  selector: 'app-tender-dialog',
  templateUrl: './tender-dialog.component.html',
  styleUrls: ['./tender-dialog.component.scss'],
})
export class TenderDialogComponent implements OnInit {
  @ViewChild(VendorCodeAutocompleatComponent)
  private vendorCodeAutocomplete: VendorCodeAutocompleatComponent;
  @ViewChild(ProductCategoryAutocompletComponent)
  private productCategoryAutocompletComponent: ProductCategoryAutocompletComponent;

  dataSource = new MatTableDataSource<Orders>();

  product: Product  = null;
  Category: ProductCategory = null;
  channel = null;
  nameCategory: string;
  vendor = null;
  frequency = null;
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
    this.channel = null;
    this.nameCategory = null;
    this.vendor = null;
    this.frequency = null;
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
          this.comment = (this.vendor === 'no_vendor' || this.vendor === null ? ''  : this.vendor + ' ') + (this.portable ? 'портативный ' : '') + (this.usb ? 'USB ' : '') + (this.vxi ? 'VXI ' : '') + (this.frequency?  String(this.frequency) +  ' ' : '') + (this.channel? String(this.channel)+  ' ' : '') + this.comment ;
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
          id_product: (this.vendor ? this.vendor : '') + ' ' + this.product.vendor_code,
          comment: this.comment ? this.comment : '' ,
          number: this.number,
          price: this.price !== null ? this.price : 0,
          winprice: this.winprice !== null ? this.winprice : 0
        });
        this.default();
      }
    catch (e){
        if(e instanceof TypeError){
          this.dialog.open(ErrorDialogComponent, { data: 'Проверьте все значения, не подходит значениее в ' + e.message.substring(e.message.indexOf("\'")+1,e.message.lastIndexOf("\'")) + 'значие должно быть выбранно из списка'})
        }
        else {
          this.dialog.open(ErrorDialogComponent, { data: e});
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
          if(this.ordersDB[i].id_product === 7 && this.ordersDB[i].product_category === 7){
            index = i;
          }
        }
        if(index !== null){
          this.orders[index].number = this.orders[index].number + or.number;
          this.orders[index].comment = String(Number(this.orders[index].comment.replace(/[^\d]/g,'')) + 1) + 'наименований';

          this.ordersDB[index].number = this.ordersDB[index].number + or.number;
          this.ordersDB[index].comment = String(Number(this.ordersDB[index].comment.replace(/[^\d]/g,'')) + 1) + 'наименований';
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
      id_product: (this.vendor ? this.vendor : '') + ' ' + this.product.vendor_code,
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
      this.frequency = this.product.frequency !== 0 ? this.product.frequency : '';
      this.flag = true;
    }
  }
  Save(){
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
    this.api.addOrders( this.ordersDB).subscribe(data => console.log(data),
      err => {if(err.status === 200){
        this.dialog.open(ErrorDialogComponent, { data: 'Сохранил'});
      }
      else {
        this.dialog.open(ErrorDialogComponent, { data: err});
      }
      },
      () => console.log('yay'));

  }
  ngOnInit() {
    this.api.getOrdersByTender(this.data.id).subscribe(order => {

      this.orders = order.orders;
      this.dataSource = new MatTableDataSource<Orders>(order.orders) ;
      console.log(this.dataSource);
      this.ordersDB = order.ordersDB;

      /*
      this.api.getPosts().subscribe(posts => {
        this.dataSource = new MatTableDataSource<Post>(posts) ;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        */
    });
  }

  constructor(
    public dialogRef: MatDialogRef<TenderDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Post, private api: ApiService, public dialog: MatDialog) {}

}
