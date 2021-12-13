import {AfterViewInit, Component, Inject, Input, OnChanges, OnInit, ViewChild} from '@angular/core';
import {animate, state, style, transition, trigger} from "@angular/animations";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {MatTableDataSource} from "@angular/material/table";
import {Company, Orders, OrdersDB, Post, Product, ProductCategory, User, Comment} from "../classes";
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
export class TenderTableComponent implements OnInit, OnChanges {
  @Input() displayedColumns;
  @ViewChild(MatPaginator) paginator: MatPaginator | null = null;
  @ViewChild(MatSort) sort: MatSort | null = null;

  @Input() dataSource = new MatTableDataSource<Post>();
  @Input() adjacent_tender: boolean;
  expandedElement: Post | null;
  user: User;
  totalCost: number = 0;
  totalCount: number = 0;
  totalCountFinish: number = 0;
  totalCostFinish: number = 0;
  url:string;

  constructor(public dialog: MatDialog, private api: ApiService, private authenticationService: AuthenticationService) {
    this.user = this.authenticationService.userValue;
    this.url = location.protocol;
  }

  showTender() {
    this.dialog.open(TenderDialogComponent, {
      width: '80%',
      height: '90%',
      data: {adjacent_tender: this.adjacent_tender, id_tender: this.expandedElement.id}
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
    for (let i = 0; i < this.dataSource.data.length; i++) {
      if (this.dataSource.data[i].win_sum > 0) {

        this.totalCountFinish++;
        this.totalCostFinish = this.totalCostFinish + (this.dataSource.data[i].win_sum * this.dataSource.data[i].rate);
      }
      if (this.dataSource.data[i].sum !== 0) {
        this.totalCount++;
        this.totalCost = this.totalCost + this.dataSource.data[i].sum;
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

  constructor(@Inject(MAT_DIALOG_DATA) public data: Post) {
  }

}

export interface dialogTender {
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
  ordersDB: OrdersDB[] = [];
  selected = new FormControl(0);
  comments: Comment[];
  color: string[] = ['#FFCC33', '#FF9933', '#FF6600', '#FF3300', '#FF6666', '#CC3333', '#FF0066', '#FF0099', '#FF33CC', '#FF66FF', '#CC66CC', '#CC00FF', '#9933FF', '#9966FF', '#9999FF', '#6666FF', '#3300FF', '#3366FF', '#0066FF',
    '#3399FF', '#33CCFF', '#66CCCC', '#66FFFF', '#33FFCC', '#00CC99', '#00FF99', '#33FF66', '#66CC66', '#00FF00', '#33FF00', '#66CC00', '#99CC66', '#CCFF33', '#CCCC33', '#CCCCCC'];
  data: Post = {
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
    winner_country: ''
  };
  parameters: string[] = [];

  default() {
    this.vendorAutocompletComponent.myControl.disable();
    this.vendorCodeAutocompleatComponent.myControl.disable();
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
    this.optionComponent.option.setValue('');
    this.optionComponent.options = [];
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
  }

  addProduct() {
    let comment: string;
    if (this.number !== null) {
      if(this.vendorCodeAutocompleatComponent.myControl.value !== '' && this.vendorCodeAutocompleatComponent.myControl.value !== null &&this.vendorCodeAutocompleatComponent.myControl.value !== undefined){
      try {
        if (this.vendorCodeAutocompleatComponent.myControl.value.vendor_code === 'Без артикула' || this.productCategoryAutocompletComponent.myControl.value.id === 7) {
          comment = (this.parameters.includes('portable') && this.portable !== null && this.portable ? 'портативный ' : '')
            + (this.parameters.includes('usb') && this.usb !== null && this.usb ? 'USB ' : '')
            + (this.parameters.includes('vxi') && this.vxi !== null && this.vxi ? 'VXI ' : '')
            + (this.parameters.includes('frequency') && this.frequency !== null && this.frequency !== 0? String(this.frequency) + 'ГГц ' : '')
            + (this.parameters.includes('channel') && this.channel !== null && this.channel !== 0? String(this.channel) + 'кан. ' : '')
            + (this.parameters.includes('port') && this.port !== null && this.port !== 0? String(this.port) + 'порта ' : '')
            + (this.parameters.includes('form_factor') && this.form_factor !== null ? this.form_factor + ' ' : '')
            + (this.parameters.includes('purpose') && this.purpose !== null ? this.purpose + ' ' : '')
            + (this.parameters.includes('voltage') && this.voltage !== null  && this.voltage !== 0? String(this.voltage) + 'В ' : '')
            + (this.parameters.includes('current') && this.current !== null && this.current !== 0? String(this.current) + 'А ' : '')
            + (this.optionComponent.option !== null && this.optionComponent.option.value ? this.optionComponent.toString() : '')
            + this.comment;
            + this.comment;
        } else {
          comment =(this.optionComponent.option !== null && this.optionComponent.option.value ? this.optionComponent.toString() : '')
            + this.comment;
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
          winprice: this.winprice ? this.winprice : 0,
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
          option: this.optionComponent.option.value,
          options: this.optionComponent.option !== null && this.optionComponent.option.value ? this.optionComponent.toString() : ''
        });
        this.orders.push({
          tender: this.data.id,
          vendor: this.vendorAutocompletComponent.myControl.value !== '' && this.vendorAutocompletComponent.myControl.value !== null ? this.vendorAutocompletComponent.myControl.value.name : '',
          product_category: this.productCategoryAutocompletComponent.myControl.value.category,
          id_product: (this.vendorCodeAutocompleatComponent.myControl.value.subcategory !== null && this.vendorCodeAutocompleatComponent.myControl.value.subcategory !== '' ? this.vendorCodeAutocompleatComponent.myControl.value.subcategory : '') + ' ' + (this.vendorAutocompletComponent.myControl.value !== '' && this.vendorAutocompletComponent.myControl.value !== null && this.vendorAutocompletComponent.myControl.value.name !== 'No vendor' ? this.vendorAutocompletComponent.myControl.value.name : '') + ' ' + (this.vendorCodeAutocompleatComponent.myControl.value.vendor_code === 'Без артикула' ? '' : this.vendorCodeAutocompleatComponent.myControl.value.vendor_code),
          comment: comment ? comment : '',
          number: this.number,
          price: this.price !== null ? this.price : 0,
          winprice: this.winprice !== null ? this.winprice : 0
        });
        this.default();
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
      let indexDelete = this.orders.indexOf(or);
      this.orders.splice(indexDelete, 1);
      this.ordersDB.splice(indexDelete, 1);

      if (!result) {
        var index = null;
        for (var i = 0; i < this.ordersDB.length; i++) {

          if (this.ordersDB[i].id_product === 7 && this.ordersDB[i].product_category === 7) {
            index = i;
          }
        }
        if (index !== null) {
          this.orders[index].number = this.orders[index].number + or.number;
          this.orders[index].comment = '(' + String(Number(this.orders[index].comment.replace(/[^\d]/g, '')) + 1) + ' наименований)';

          this.ordersDB[index].number = this.ordersDB[index].number + or.number;
          this.ordersDB[index].comment = '(' + String(Number(this.ordersDB[index].comment.replace(/[^\d]/g, '')) + 1) + ' наименований)';
        } else {
          this.ordersDB.push({
            id: null,
            vendor: null,
            tender: this.data.id,
            product_category: 7,
            comment: '(1 наименование)',
            id_product: 7,
            number: or.number,
            price: 0,
            winprice: 0,
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
            options: null
          });
          this.orders.push({
            tender: this.data.id,
            vendor: '',
            product_category: 'Продукты',
            id_product: 'Другое оборудование',
            comment: '(1 наименование)',
            number: or.number,
            price: 0,
            winprice: 0
          });
        }
      }
      this.dataSource = new MatTableDataSource<Orders>(this.orders);
    });

  }

  editProduct(or: Orders) {

    this.editOrders = this.orders.indexOf(or);
    this.productCategoryAutocompletComponent.myControl.setValue({
      id: this.ordersDB[this.editOrders].product_category,
      category: or.product_category,
      category_en: null
    });
    this.channel = this.ordersDB[this.editOrders].channel;
    this.port = this.ordersDB[this.editOrders].port;
    this.frequency = this.ordersDB[this.editOrders].frequency;
    this.vxi = this.ordersDB[this.editOrders].vxi;
    this.portable = this.ordersDB[this.editOrders].portable;
    this.usb = this.ordersDB[this.editOrders].usb;
    this.form_factor = this.ordersDB[this.editOrders].form_factor;
    this.purpose = this.ordersDB[this.editOrders].purpose;
    this.voltage = this.ordersDB[this.editOrders].voltage;
    this.current = this.ordersDB[this.editOrders].current;
    this.api.getVendorCodeById(this.ordersDB[this.orders.indexOf(or)].product_category, this.ordersDB[this.editOrders].id_product).subscribe(
      product => {
        this.vendorCodeAutocompleatComponent.myControl.setValue(product);
      },
      error => {
        this.dialog.open(ErrorDialogComponent, {data: "Ошибка " + error})
      }
    );
    this.comment = this.ordersDB[this.editOrders].comment;
    this.number = this.ordersDB[this.editOrders].number;
    this.price = this.ordersDB[this.editOrders].price;
    this.optionComponent.selected_options = this.ordersDB[this.editOrders].options;
  }

  copyProduct(or: Orders) {

    let copyOrders = this.orders.indexOf(or);
    this.productCategoryAutocompletComponent.myControl.setValue({
      id: this.ordersDB[copyOrders].product_category,
      category: or.product_category,
      category_en: null
    });
    this.channel = this.ordersDB[copyOrders].channel;
    this.port = this.ordersDB[copyOrders].port;
    this.frequency = this.ordersDB[copyOrders].frequency;
    this.vxi = this.ordersDB[copyOrders].vxi;
    this.portable = this.ordersDB[copyOrders].portable;
    this.usb = this.ordersDB[copyOrders].usb;
    this.form_factor = this.ordersDB[copyOrders].form_factor;
    this.purpose = this.ordersDB[copyOrders].purpose;
    this.voltage = this.ordersDB[copyOrders].voltage;
    this.current = this.ordersDB[copyOrders].current;
    this.api.getVendorCodeById(this.ordersDB[this.orders.indexOf(or)].product_category, this.ordersDB[copyOrders].id_product).subscribe(
      product => {
        this.vendorCodeAutocompleatComponent.myControl.setValue(product);
      },
      error => {
        this.dialog.open(ErrorDialogComponent, {data: "Ошибка " + error})
      }
    );
    this.comment = this.ordersDB[copyOrders].comment;
    this.number = this.ordersDB[copyOrders].number;
    this.price = this.ordersDB[copyOrders].price;
    this.optionComponent.selected_options = this.ordersDB[copyOrders].options;
  }

  saveProduct() {
    let comment: string;
    if (this.number !== null) {
      if(this.vendorCodeAutocompleatComponent.myControl.value !== '' && this.vendorCodeAutocompleatComponent.myControl.value !== null &&this.vendorCodeAutocompleatComponent.myControl.value !== undefined){
    if (this.vendorCodeAutocompleatComponent.myControl.value.vendor_code === 'Без артикула' || this.productCategoryAutocompletComponent.myControl.value.id === 7) {
      comment = (this.parameters.includes('portable') && this.portable !== null && this.portable ? 'портативный ' : '')
        + (this.parameters.includes('usb') && this.usb !== null && this.usb ? 'USB ' : '')
        + (this.parameters.includes('vxi') && this.vxi !== null && this.vxi ? 'VXI ' : '')
        + (this.parameters.includes('frequency') && this.frequency !== null && this.frequency !== 0? String(this.frequency) + 'ГГц ' : '')
        + (this.parameters.includes('channel') && this.channel !== null && this.channel !== 0? String(this.channel) + 'кан. ' : '')
        + (this.parameters.includes('port') && this.port !== null && this.port !== 0? String(this.port) + 'порта ' : '')
        + (this.parameters.includes('form_factor') && this.form_factor !== null ? this.form_factor + ' ' : '')
        + (this.parameters.includes('purpose') && this.purpose !== null ? this.purpose + ' ' : '')
        + (this.parameters.includes('voltage') && this.voltage !== null  && this.voltage !== 0? String(this.voltage) + 'В ' : '')
        + (this.parameters.includes('current') && this.current !== null && this.current !== 0? String(this.current) + 'А ' : '')
        + (this.optionComponent.option !== null && this.optionComponent.option.value ? this.optionComponent.toString() : '')
        + this.comment;
    } else {
      comment = (this.optionComponent.option !== null && this.optionComponent.option.value ? this.optionComponent.toString() : '')
        + this.comment;
    }
    this.orders[this.editOrders] = {
      tender: this.data.id,
      vendor: this.vendorAutocompletComponent.myControl.value !== '' && this.vendorAutocompletComponent.myControl.value !== null ? this.vendorAutocompletComponent.myControl.value.name : '',
      product_category: this.productCategoryAutocompletComponent.myControl.value.category,
      id_product: (this.vendorCodeAutocompleatComponent.myControl.value.subcategory !== null && this.vendorCodeAutocompleatComponent.myControl.value.subcategory !== '' ? this.vendorCodeAutocompleatComponent.myControl.value.subcategory : '') + ' ' + (this.vendorAutocompletComponent.myControl.value !== null && this.vendorAutocompletComponent.myControl.value !== '' && this.vendorAutocompletComponent.myControl.value.name !== 'No vendor' ? this.vendorAutocompletComponent.myControl.value.name : '') + ' ' + (this.vendorCodeAutocompleatComponent.myControl.value.vendor_code === 'Без артикула' ? '' : this.vendorCodeAutocompleatComponent.myControl.value.vendor_code),
      comment: comment ? comment : '',
      number: this.number,
      price: this.price ? this.price : 0,
      winprice: this.winprice ? this.winprice : 0
    };
    this.ordersDB[this.editOrders] = {
      id: this.ordersDB[this.editOrders].id,
      vendor: this.vendorCodeAutocompleatComponent.myControl.value.vendor_id ? this.vendorCodeAutocompleatComponent.myControl.value.vendor_id : null,
      tender: this.data.id,
      product_category: this.productCategoryAutocompletComponent.myControl.value.id,
      comment: this.comment ? this.comment : '',
      id_product: this.vendorCodeAutocompleatComponent.myControl.value.id,
      number: this.number,
      price: this.price ? this.price : 0,
      winprice: this.winprice ? this.winprice : 0,
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
      option: this.optionComponent.option.value,
      options: this.optionComponent.toString()
    };
    this.default();
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
      this.vendorCodeAutocompleatComponent.myControl.setValue('');
      this.subcategoryAutocompletComponent.setSubCategory(this.productCategoryAutocompletComponent.myControl.value.id);
      this.vendorAutocompletComponent.myControl.enable();
      this.vendorCodeAutocompleatComponent.myControl.enable();
      this.subcategoryAutocompletComponent.myControl.enable();
      if (this.productCategoryAutocompletComponent.myControl.value.id === 7) {
        this.vendorAutocompletComponent.myControl.disable();
      } else {
        this.vendorAutocompletComponent.myControl.enable();
        this.vendorAutocompletComponent.start(category.id);
      }
      this.vendorCodeAutocompleatComponent.start(category.id);
    } else if (category === '') {
      this.vendorCodeAutocompleatComponent.myControl.setValue('');
      this.vendorAutocompletComponent.myControl.setValue('');
      this.subcategoryAutocompletComponent.myControl.setValue('');
      this.vendorCodeAutocompleatComponent.myControl.disable();
      this.vendorAutocompletComponent.myControl.disable();
      this.subcategoryAutocompletComponent.myControl.disable();
      this.vendorCodeAutocompleatComponent.start(0);
    }
  }

  // this. !== this.vendorCodeAutocompleatComponent.myControl.value.? Math.max(this.,this.vendorCodeAutocompleatComponent.myControl.value.):this.;
  ChangeVendorCode(vendor_code: any) {
    if (vendor_code != null && typeof vendor_code !== 'string') {
      ("here");
      if (!this.vendorAutocompletComponent.myControl.value && this.productCategoryAutocompletComponent.myControl.value.id !== 7) {
        this.vendorAutocompletComponent.setVendor(vendor_code.vendor);
        this.subcategoryAutocompletComponent.setSubcategoryBYName(vendor_code.subcategory);
      }
      this.optionComponent.getAllOptionByProduct(this.productCategoryAutocompletComponent.myControl.value.id, this.vendorCodeAutocompleatComponent.myControl.value.id);
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

  Save() {

    var sum = 0;
    for (var i = 0; i < this.ordersDB.length; i++) {
      sum = sum + (this.ordersDB[i].number * this.ordersDB[i].price);
    }
    if (sum !== 0) {
      this.data.price = parseFloat(sum.toFixed(2));
      this.data.sum = this.data.price * this.data.rate;
    }

    if (this.ordersDB.length === 0) {


      this.ordersDB.push({
        id: null,
        vendor: null,
        tender: this.data.id,
        product_category: null,
        comment: '',
        id_product: null,
        number: null,
        price: 0,
        winprice: 0,
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
        options: null
      });

    }
    let message: string = '';
    this.autocompletTypeComponent.setType(this.data.typetender);
    if (!this.dataDialog.adjacent_tender) {
      this.winnerAutocompletComponent.setWinner(this.data.winner);
    }
    this.customAutocompletComponent.setCustomer(this.data.customer);
    let tender: Post = {
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
      winner: this.dataDialog.adjacent_tender ? null : this.winnerAutocompletComponent.myControl.value.id,
      customer: this.customAutocompletComponent.myControl.value.id,
      product: this.data.product,
      dublicate: this.data.dublicate,
      country: null,
      inn: null,
      winner_inn: this.data.winner_inn,
      winner_country: this.data.winner_country
    }


    if (this.dataDialog.adjacent_tender) {
      this.api.SaveAdjacentTender(tender).subscribe(data => {
          this.dialog.open(ErrorDialogComponent, {data: 'Сохранил'});
          this.data = data;

        },
        err => {
          this.dialog.open(ErrorDialogComponent, {data: "Ошибка " + err});
        });
    } else {
      let prod: string = null;
      let flag: boolean = false;

      this.api.addOrders(this.ordersDB).subscribe(
        data => {

          prod = data.name;
          if (flag) {
            this.data.product = data.name;
            this.dialog.open(ErrorDialogComponent, {data: 'Сохранил'});
          }
          flag = true;
        },
        err => {
          this.dialog.open(ErrorDialogComponent, {data: "Ошибка " + err});
        });
      this.api.SaveTender(tender).subscribe(data => {

          if (flag) {
            this.dialog.open(ErrorDialogComponent, {data: 'Сохранил'});
          }
          this.data = data;
          this.data.product = prod;
          flag = true;
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
    } else {
      this.api.getTenderById(this.dataDialog.id_tender).subscribe(data => {

          this.data = data
        },
        error => {
          this.dialog.open(ErrorDialogComponent, {data: "Возможно Тендер удален или ошибка на сервере. " + error})
        });
      this.api.getOrdersByTender(this.dataDialog.id_tender).subscribe(order => {
          this.orders = order.orders;
          this.dataSource = new MatTableDataSource<Orders>(order.orders);
          this.ordersDB = order.ordersDB;
          this.vendorAutocompletComponent.myControl.disable();
          this.vendorCodeAutocompleatComponent.myControl.disable();
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
    if (!this.dataDialog.adjacent_tender) {
      this.countComment();
    }
    this.Char = this.user.nickname[0].toUpperCase();
  }

  countComment() {
    this.api.getCountCommentByTender(this.dataDialog.id_tender).subscribe(count => {
        this.CountComment = count;
      },
      error => {
        this.CountComment = null;
      })
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
    for (var i = 0; i < this.ordersDB.length; i++) {
      sum = sum + (this.ordersDB[i].number * this.ordersDB[i].price);
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
    if ((this.selected.value === 2 && !this.dataDialog.adjacent_tender) || (this.selected.value === 1 && this.dataDialog.adjacent_tender)) {
      this.autocompletTypeComponent.setType(this.data.typetender);
      this.customAutocompletComponent.setCustomer(this.data.customer);
      this.contryAutocompletComponent.myControl.disable();
      if (!this.dataDialog.adjacent_tender) {
        this.winnerAutocompletComponent.setWinner(this.data.winner);
      }

    }
  }

  onChangeWinner(t: any) {
    if (typeof t !== "string") {
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
    } else {
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
