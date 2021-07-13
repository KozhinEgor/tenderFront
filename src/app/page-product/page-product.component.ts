import {Component, Inject, OnInit, ViewChild} from '@angular/core';
import {ApiService} from "../api.service";
import {ChangeCategory, CreateTable, Product, ProductCategory, User} from "../classes";
import {MatTableDataSource} from "@angular/material/table";
import {MatSort} from "@angular/material/sort";
import {ProductCategoryAutocompletComponent} from "../product-category-autocomplet/product-category-autocomplet.component";
import {VendorAutocompletComponent} from "../vendor-autocomplet/vendor-autocomplet.component";
import {AuthenticationService} from "../service/authentication.service";
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import {saveAs} from 'file-saver';
import {DialogData, ErrorDialogComponent} from "../error-dialog/error-dialog.component";
import {VendorCodeAutocompleatComponent} from "../vendor-code-autocompleat/vendor-code-autocompleat.component";

@Component({
  selector: 'app-page-product',
  templateUrl: './page-product.component.html',
  styleUrls: ['./page-product.component.scss']
})
export class PageProductComponent implements OnInit {
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(VendorAutocompletComponent) vendorAutocompletComponent:VendorAutocompletComponent
  @ViewChild(ProductCategoryAutocompletComponent) category:ProductCategoryAutocompletComponent
   noUses: boolean = false;
  Category: ProductCategory = null;
  product:Product = {
    id: null,
    vendor_id:null,
    vendor_code:null,
    frequency: -1,
    usb:null,
    vxi:null,
    portable: null,
    vendor: null,
    channel: -1,
    port:-1
  };
  dataSource = new MatTableDataSource<Product>();
  columns: string[] = [];
  user:User;


  constructor(private api: ApiService, private authenticationService: AuthenticationService, public dialog: MatDialog) {
  this.user = this.authenticationService.userValue;
}

  ngOnInit(): void {

  }
  default(){
    this.product = { id: null,
                    vendor_id:null,
                    vendor_code:this.columns.includes("vendor_code")? '' : null,
                    frequency:this.columns.includes("frequency")? 0 : -1,
                    usb:this.columns.includes("usb")? false : null,
                    vxi:this.columns.includes("vxi")? false : null,
                    portable:this.columns.includes("portable")? false : null,
                    vendor:this.columns.includes("vendor")? '' : null,
                    channel:this.columns.includes("channel")? 0 : -1,
                    port:this.columns.includes("port")? 0 : -1};
    //this.vendorAutocompletComponent.myControl.setValue('');
  }
  showTables(){
    if(this.category.myControl.value !== null) {

      this.noUses = false;

      this.api.getVendorCode(this.category.myControl.value.id).subscribe(product => {
          if(product.length == 0){
            this.dataSource = new MatTableDataSource();
            this.dialog.open(ErrorDialogComponent, {data: "Нет продуктов удовлетворяющих поиску"});
          }
          else {
            this.columns= ["id", "vendor", "vendor_code", "frequency", "vxi","usb", "portable",  "channel","port","edit"];
            for(let i = 0; i < this.columns.length; i++){
              // @ts-ignore
              if(product[0][this.columns[i]] === null) {
                this.columns.splice(i, 1);
                i--;
              }
            }
            this.dataSource = new MatTableDataSource(product);
            this.dataSource.sort = this.sort
            this.default();
          }
        },
        error =>{
          this.dialog.open(ErrorDialogComponent, {data: "Ошибка" + error});
          this.dataSource = new MatTableDataSource();
        });

    }
  }
  showProductNoUses(){
    console.log(this.category.myControl.value);
    if(this.category.myControl.value !== null && this.category.myControl.value !== '') {
      this.noUses = true;
      this.api.getVendorCodeNoUses(this.category.myControl.value.id).subscribe(product => {
          if(product.length == 0){
            this.dataSource = new MatTableDataSource();
            this.columns = [];
            this.dialog.open(ErrorDialogComponent, {data: "Нет продуктов удовлетворяющих поиску"});
          }
          else {
            this.columns= ["id", "vendor", "vendor_code", "frequency", "vxi","usb", "portable",  "channel","port","edit"];
            for(let i = 0; i < this.columns.length; i++){
              // @ts-ignore
              if(product[0][this.columns[i]] === null) {
                this.columns.splice(i, 1);
                i--;
              }
            }
            this.dataSource = new MatTableDataSource(product);
            this.dataSource.sort = this.sort
            this.default();
          }

        },
        error =>{
          this.dialog.open(ErrorDialogComponent, {data: "Ошибка" + error});
          this.dataSource = new MatTableDataSource();
        });
    }
    else {
      this.dialog.open(ErrorDialogComponent, {data: "Выберите категорию"});
    }
  }
  DeleteProduct(){
    this.noUses = true;

    this.api.DeleteCodeNoUses(this.category.myControl.value.id).subscribe(product => {
      this.dialog.open(ErrorDialogComponent, {data: "Удалил"});
      if(product.length == 0){
        this.dataSource = new MatTableDataSource();

      }
      else {
        this.columns= ["id", "vendor", "vendor_code", "frequency", "vxi","usb", "portable",  "channel","port","edit"];
        for(let i = 0; i < this.columns.length; i++){
          // @ts-ignore
          if(product[0][this.columns[i]] === null) {
            this.columns.splice(i, 1);
            i--;
          }
        }
        this.dataSource = new MatTableDataSource(product);
        this.dataSource.sort = this.sort
        this.default();
      }

    },
    error =>{
      this.dialog.open(ErrorDialogComponent, {data: "Ошибка" + error});
      this.dataSource = new MatTableDataSource();
    });
  }
  onChange(t: any) {
    if (t != null && typeof t !== 'string') {

      this.showTables();
    }
  }
  onChangeVendor(t: any){
    if (t != null && typeof t !== 'string') {
      this.product.vendor_id = t.id;
    }
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  editProduct(product: Product){
    this.product = product;
    this.vendorAutocompletComponent.myControl.setValue({name:product.vendor, id:product.vendor_id, second_name:'-'});
    /*
    this.product.id = product.id;
    this.product.channel = product.channel === null? -1:product.channel;
    this.product.vendor_code = product.vendor_code;
    this.product.vendor = product.vendor;
    this.product.vendor_id = product.vendor_id;
    this.product.frequency = product.frequency=== null? -1:product.frequency;
    this.product.vxi = product.vxi;
    this.product.portable = product.portable;
    this.product.usb = product.usb;
     */
  }
  saveProduct(){
    this.api.getSaveProduct(this.product, this.category.myControl.value.id).subscribe(product => {
      this.dialog.open(ErrorDialogComponent, {data: "Сохранил"});
      this.dataSource = new MatTableDataSource(product);
      this.dataSource.sort = this.sort
    },
      error => {
      this.dialog.open(ErrorDialogComponent, {data: "Ошибка " + error})
      });

    this.default();
  }
  createCategory(){
    const dialogRef = this.dialog.open(CreateCategoryComponent);
    dialogRef.afterClosed().subscribe(
      result =>{
        console.log(result);
        if(result !== null){
          this.category.request();
          this.category.setCategory(result);
        }
        else {
          this.category.myControl.setValue('');
          this.dataSource = new MatTableDataSource();
        }
      }
    );
  }
  ChageCategory(){
    const dialogRef  = this.dialog.open(ChangeCategoryComponent);
  }
  Clean(){
    this.columns = [];
    this.category.myControl.setValue('');
  }
  File(){
    if(this.category.myControl.value != null && this.category.myControl.value !== ''){
      this.api.getProductFile(this.category.myControl.value.id).subscribe(
        blob => {
          saveAs(blob, "Product.xlsx");
        },
        error => {this.dialog.open(ErrorDialogComponent, {data:"Ошибка" + error});}
      )
    }
    else{
      this.dialog.open(ErrorDialogComponent, {data:"Выберите категорию"});
    }
  }
}

@Component({
  selector: 'create-category',
  templateUrl: './create-category.component.html',
})
export class CreateCategoryComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: DialogData,private api: ApiService, private dialog: MatDialog,private dialogRef: MatDialogRef<CreateCategoryComponent>) {
  }
  createTable:CreateTable = {
    name : '',
    name_en: '',
    frequency: false,
    vendor: false,
    channel:false,
    vxi: false,
    usb:false,
    portable:false,
    port: false
  };
  name:string = null;
  Create(){
    this.createTable.name_en = this.createTable.name_en.toLowerCase().trim();
    this.createTable.name = this.createTable.name.trim();
    if(this.createTable.name_en !== '' && this.createTable.name !== ''){
      this.api.CreateTable(this.createTable).subscribe(data =>{
        this.dialog.open(ErrorDialogComponent, {data:'Создал таблицу: ' + data.name}).afterClosed().subscribe(d => {
          this.dialogRef.close(data.name);
        });

      },
      error => {
        this.dialog.open(ErrorDialogComponent, {data:'Ошибка'+ error});
      });
    }
    else{
      this.dialog.open(ErrorDialogComponent, {data:'Не заполнено "Название" или "Название на английском"'});
    }
  }
}
@Component({
  selector: 'change-category',
  templateUrl: './change-category.component.html',
})
export class ChangeCategoryComponent{
  @ViewChild(ProductCategoryAutocompletComponent)
  private category:ProductCategoryAutocompletComponent;
  @ViewChild(VendorCodeAutocompleatComponent)
  private vendorCodeAutocomplete: VendorCodeAutocompleatComponent;

  @ViewChild('newCategory')
  private newCategory:ProductCategoryAutocompletComponent;
  @ViewChild('newVendorCodeAutocomplete')
  private newVendorCodeAutocomplete: VendorCodeAutocompleatComponent;

  constructor(private api:ApiService,private dialog:MatDialog) {
  }

  onChangeCategory(t: any) {
    if (t != null && typeof t !== 'string') {
      this.vendorCodeAutocomplete.start(this.category.myControl.value.id);
    }
  }
  onChangeNewCategory(t: any) {
    if (t != null && typeof t !== 'string') {
      this.newVendorCodeAutocomplete.start(this.newCategory.myControl.value.id);
    }
  }

  Change(){
    if(this.category.myControl.value !== null && this.category.myControl.value !== ''
      && this.newCategory.myControl.value !== null  && this.newCategory.myControl.value !== ''
      && this.vendorCodeAutocomplete.myControl.value !== null && this.vendorCodeAutocomplete.myControl.value !== ''){
      let json:ChangeCategory = {
        category:this.category.myControl.value.id,
        vendor_code:this.vendorCodeAutocomplete.myControl.value.id,
        newCategory:this.newCategory.myControl.value.id,
        newVendor_code:(this.newVendorCodeAutocomplete.myControl.value !== null && this.newVendorCodeAutocomplete.myControl.value !== '')?this.newVendorCodeAutocomplete.myControl.value.id: null
      }
      console.log(json);
    }
   else{
     this.dialog.open(ErrorDialogComponent,{data: "Не заполнили продукт который хотите переместить"})
    }
  }
}
