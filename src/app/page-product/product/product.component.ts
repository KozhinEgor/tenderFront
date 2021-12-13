import {Component, Inject, OnInit, ViewChild} from '@angular/core';
import {MatSort} from "@angular/material/sort";
import {VendorAutocompletComponent} from "../../vendor-autocomplet/vendor-autocomplet.component";
import {ProductCategoryAutocompletComponent} from "../../product-category-autocomplet/product-category-autocomplet.component";
import {ChangeCategory, CreateTable, Post, Product, ProductCategory, Role, Type, User} from "../../classes";
import {MatTableDataSource} from "@angular/material/table";
import {ApiService} from "../../api.service";
import {AuthenticationService} from "../../service/authentication.service";
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import {DialogData, ErrorDialogComponent} from "../../error-dialog/error-dialog.component";
import {VendorCodeAutocompleatComponent} from "../../vendor-code-autocompleat/vendor-code-autocompleat.component";
import {saveAs} from 'file-saver';
import {SubcategoryAutocompletComponent} from "../../subcategory-autocomplet/subcategory-autocomplet.component";
import {FormControl} from "@angular/forms";
import {OptionsComponent} from "../../options/options.component";


@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(VendorAutocompletComponent) vendorAutocompletComponent: VendorAutocompletComponent
  @ViewChild(ProductCategoryAutocompletComponent) category: ProductCategoryAutocompletComponent
  @ViewChild(SubcategoryAutocompletComponent)
  private subcategoryAutocompletComponent: SubcategoryAutocompletComponent
  @ViewChild(OptionsComponent)
  private optionsComponent:OptionsComponent;
  noUses: boolean = false;
  Category: ProductCategory = null;
  product: Product = {
    id: null,
    vendor_id: null,
    vendor_code: null,
    frequency: -1,
    usb: null,
    vxi: null,
    portable: null,
    vendor: null,
    channel: -1,
    port: -1,
    form_factor: null,
    purpose: null,
    voltage: -1,
    current: -1,
    subcategory: null,
    subcategory_id: null,
    option: [],
    options:null
  };
  dataSource = new MatTableDataSource<Product>();
  columns: string[] = [];
  user: User;
  columnLength: number;
  option: string = null;

  constructor(private api: ApiService, private authenticationService: AuthenticationService, public dialog: MatDialog) {
    this.user = this.authenticationService.userValue;
  }

  ngOnInit(): void {

  }

  default() {
    this.product = {
      id: null,
      vendor_id: null,
      vendor_code: this.columns.includes("vendor_code") ? '' : null,
      frequency: this.columns.includes("frequency") ? null : null,
      usb: this.columns.includes("usb") ? false : null,
      vxi: this.columns.includes("vxi") ? false : null,
      portable: this.columns.includes("portable") ? false : null,
      vendor: this.columns.includes("vendor") ? '' : null,
      channel: this.columns.includes("channel") ? null : null,
      port: this.columns.includes("port") ? null : null,
      form_factor: this.columns.includes("form_factor") ? null : null,
      purpose: this.columns.includes("purpose") ? null : null,
      voltage: this.columns.includes("voltage") ? null : null,
      current: this.columns.includes("current") ? null : null,
      subcategory_id: null,
      subcategory: this.columns.includes("subcategory") ? '' : null,
      option: [],
      options:null
    };

    if (this.columns.indexOf("vendor") >= 0 && this.vendorAutocompletComponent !== undefined) {
      this.vendorAutocompletComponent.myControl.setValue('');
    }
    if (this.columns.indexOf("subcategory") >= 0 && this.subcategoryAutocompletComponent !== undefined) {
      this.subcategoryAutocompletComponent.myControl.setValue('');
    }
    if(this.optionsComponent !== undefined){
      this.optionsComponent.option.setValue([]);
    }

  }

  showTables() {
    if (this.category.myControl.value !== null) {

      this.noUses = false;

      this.api.getVendorCode(this.category.myControl.value.id).subscribe(product => {
          if (product.length == 0) {
            this.dataSource = new MatTableDataSource();
            this.dialog.open(ErrorDialogComponent, {data: "Нет продуктов удовлетворяющих поиску"});
          } else {
            this.dataSource = new MatTableDataSource(product);
            this.dataSource.sort = this.sort
            this.default();
            this.optionsComponent.getAllOption();
          }
        },
        error => {
          this.dialog.open(ErrorDialogComponent, {data: "Ошибка" + error});
          this.dataSource = new MatTableDataSource();
        });
      this.api.getColumnCategory(this.category.myControl.value.id).subscribe(
        data => {
          this.columns = data;
          if (this.user.role !== "ROLE_USER") {
            this.columns.splice(this.columns.length, 0, "options");
            this.columns.splice(this.columns.length, 0, "edit");
            this.columnLength = this.columns.length - 1;
          } else {
            this.columns.splice(this.columns.length, 0, "options");
            this.columnLength = this.columns.length;
          }
          this.default();
          // this.subcategoryAutocompletComponent.setSubCategory(this.category.myControl.value.id);
        }
      )

    }
  }

  showProductNoUses() {
    if (this.category.myControl.value !== null && this.category.myControl.value !== '') {
      this.noUses = true;
      this.api.getVendorCodeNoUses(this.category.myControl.value.id).subscribe(product => {
          if (product.length == 0) {
            this.dataSource = new MatTableDataSource();
            this.columns = [];
            this.dialog.open(ErrorDialogComponent, {data: "Нет продуктов удовлетворяющих поиску"});
          } else {
            this.dataSource = new MatTableDataSource(product);
            this.dataSource.sort = this.sort
            this.default();
          }

        },
        error => {
          this.dialog.open(ErrorDialogComponent, {data: "Ошибка" + error});
          this.dataSource = new MatTableDataSource();
        });
      this.api.getColumnCategory(this.category.myControl.value.id).subscribe(
        data => {
          this.columns = data;
          if (this.user.role !== "ROLE_USER") {
            this.columns.splice(this.columns.length, 0, "edit");
            this.columnLength = this.columns.length - 1;
          } else {
            this.columnLength = this.columns.length;
          }
        }
      );
    } else {
      this.dialog.open(ErrorDialogComponent, {data: "Выберите категорию"});
    }
  }

  DeleteProduct() {
    this.noUses = true;

    this.api.DeleteCodeNoUses(this.category.myControl.value.id).subscribe(product => {
        this.dialog.open(ErrorDialogComponent, {data: "Удалил"});
        if (product.length == 0) {
          this.dataSource = new MatTableDataSource();

        } else {
          this.columns = ["id", "vendor", "vendor_code", "frequency", "vxi", "usb", "portable", "channel", "port", "edit"];
          for (let i = 0; i < this.columns.length; i++) {
            // @ts-ignore
            if (product[0][this.columns[i]] === null) {
              this.columns.splice(i, 1);
              i--;
            }
          }
          this.dataSource = new MatTableDataSource(product);
          this.dataSource.sort = this.sort
          this.default();
        }

      },
      error => {
        this.dialog.open(ErrorDialogComponent, {data: "Ошибка" + error});
        this.dataSource = new MatTableDataSource();
      });
  }

  onChange(t: any) {
    if (t != null && typeof t !== 'string') {

      this.showTables();
    }
  }

  onChangeVendor(t: any) {
    if (t != null && typeof t !== 'string') {
      this.product.vendor_id = t.id;
    }
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  editProduct(product: Product) {
    this.product = product;
    if (this.columns.indexOf("vendor") >= 0) {
      this.vendorAutocompletComponent.myControl.setValue({
        name: product.vendor,
        id: product.vendor_id,
        second_name: '-'
      });
      if (this.columns.indexOf("subcategory") >= 0) {
        this.subcategoryAutocompletComponent.setSubcategoryBYName(this.product.subcategory)
      }

      this.optionsComponent.setOption(product.options)


    }

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

  saveProduct() {
    if ((this.product.vendor_id !== null || this.columns.indexOf("vendor") <= 0) &&
      this.product.vendor_code !== null && this.product.vendor_code !== '') {
      this.product.option = this.optionsComponent.option.value;
      this.api.getSaveProduct(this.product, this.category.myControl.value.id).subscribe(product => {
          this.dialog.open(ErrorDialogComponent, {data: "Сохранил"});
          this.dataSource = new MatTableDataSource(product);
          this.dataSource.sort = this.sort
        },
        error => {
          this.dialog.open(ErrorDialogComponent, {data: "Ошибка " + error})
        });

      this.default();
    } else {
      this.dialog.open(ErrorDialogComponent, {data: "Необходимо выбрать вендора из списка и заполнить поле артикул"})
    }
  }

  ChangeSubCategory(subcategory: any) {
    this.product.subcategory = subcategory;
  }

  createCategory() {
    const dialogRef = this.dialog.open(CreateCategoryComponent);
    dialogRef.afterClosed().subscribe(
      result => {

        if (result !== null) {
          this.category.request();
          this.category.setCategory(result);
        } else {
          this.category.myControl.setValue('');
          this.dataSource = new MatTableDataSource();
        }
      }
    );
  }

  ChageCategory() {
    const dialogRef = this.dialog.open(ChangeCategoryComponent);
  }

  addProduct() {
    const dialogRef = this.dialog.open(AddProductComponent, {data: this.category.myControl.value});
  }
  changeProduct(){
    const dialogRef = this.dialog.open(ChangeProductFileComponent, {data: this.category.myControl.value});
  }
  Clean() {
    this.columns = [];
    this.category.myControl.setValue('');
  }

  File() {
    if (this.category.myControl.value != null && this.category.myControl.value !== '') {
      this.api.getProductFile(this.category.myControl.value.id).subscribe(
        blob => {
          saveAs(blob, "Product.xlsx");
        },
        error => {
          this.dialog.open(ErrorDialogComponent, {data: "Ошибка" + error});
        }
      )
    } else {
      this.dialog.open(ErrorDialogComponent, {data: "Выберите категорию"});
    }
  }

  CreateOption(){
    if(this.option !== null){
      this.api.saveOption({id:null, name:this.option}).subscribe(
        data => {
        this.optionsComponent.options = data;
        this.option = null;
        }
      )
    }
  }
}

@Component({
  selector: 'create-category',
  templateUrl: './create-category.component.html',
})
export class CreateCategoryComponent implements OnInit {

  subsystem: string[];
  subsystems = new FormControl();

  constructor(@Inject(MAT_DIALOG_DATA) public data: DialogData, private api: ApiService, private dialog: MatDialog, private dialogRef: MatDialogRef<CreateCategoryComponent>) {
  }

  ngOnInit() {
    this.api.getAllSubcategory().subscribe(data => this.subsystem = data)
  }


  createTable: CreateTable = {
    name: '',
    name_en: '',
    frequency: false,
    vendor: true,
    channel: false,
    vxi: false,
    usb: false,
    portable: false,
    port: false,
    form_factor: false,
    purpose: false,
    voltage: false,
    current: false,
    subcategory: [],
    category: null
  };
  name: string = null;

  Create() {
    this.createTable.subcategory = this.subsystems.value;
    (this.createTable)
    this.createTable.name_en = this.createTable.name_en.toLowerCase().trim();
    this.createTable.name = this.createTable.name.trim();
    if (this.createTable.name_en !== '' && this.createTable.name !== '') {

      this.api.CreateTable(this.createTable).subscribe(data => {
          this.dialog.open(ErrorDialogComponent, {data: 'Создал таблицу: ' + data.name}).afterClosed().subscribe(d => {
            this.dialogRef.close(data.name);
          });

        },
        error => {
          this.dialog.open(ErrorDialogComponent, {data: 'Ошибка' + error});
        });
    } else {
      this.dialog.open(ErrorDialogComponent, {data: 'Не заполнено "Название" или "Название на английском"'});
    }
  }
}

@Component({
  selector: 'change-category',
  templateUrl: './change-category.component.html',
  styleUrls: ['./product.component.css']
})
export class ChangeCategoryComponent {
  @ViewChild(ProductCategoryAutocompletComponent)
  private category: ProductCategoryAutocompletComponent;
  @ViewChild(VendorCodeAutocompleatComponent)
  private vendorCodeAutocomplete: VendorCodeAutocompleatComponent;

  @ViewChild('newCategory')
  private newCategory: ProductCategoryAutocompletComponent;
  @ViewChild('newVendorCodeAutocomplete')
  private newVendorCodeAutocomplete: VendorCodeAutocompleatComponent;

  constructor(private api: ApiService, private dialog: MatDialog) {
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

  Change() {
    if (this.category.myControl.value !== null && this.category.myControl.value !== ''
      && this.newCategory.myControl.value !== null && this.newCategory.myControl.value !== ''
      && this.vendorCodeAutocomplete.myControl.value !== null && this.vendorCodeAutocomplete.myControl.value !== ''
      && this.newVendorCodeAutocomplete.myControl.value !== null && this.newVendorCodeAutocomplete.myControl.value !== '') {

      let json: ChangeCategory = {
        category: this.category.myControl.value.id,
        vendor_code: this.vendorCodeAutocomplete.myControl.value.id,
        newCategory: this.newCategory.myControl.value.id,
        newVendor_code: this.newVendorCodeAutocomplete.myControl.value.id
      }
      this.api.ChangeCategory(json).subscribe(data => {
          this.dialog.open(ErrorDialogComponent, {data: data.name})
        },
        error => {
          this.dialog.open(ErrorDialogComponent, {data: "Ошибка" + error});
        });
    } else {
      this.dialog.open(ErrorDialogComponent, {data: "Не заполнены все поля"});
    }
  }

}

@Component({
  selector: 'add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./product.component.css']
})
export class AddProductComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: ProductCategory, private api: ApiService, private dialog: MatDialog) {
    (data);
  }

  load: boolean = false;
  upload_button = false;
  file: File;

  onFileChanged(event) {
    this.file = event.target.files[0];
    this.load = true;
  }

  Upload() {
    const uploadData = new FormData();
    uploadData.append('excel', this.file, this.file.name);
    this.upload_button = true;
    try {
      this.api.addProduct(uploadData, this.data.id).subscribe(posts => {
          this.dialog.open(ErrorDialogComponent, {data: posts.name})

        },
        error => {
          if (error === 'Unknown Error') {
            this.dialog.open(ErrorDialogComponent, {data: "Ошибка загрузки \"в файл\": Обратитесь к администратору"});
          } else {
            this.dialog.open(ErrorDialogComponent, {data: "Ошибка на сервере: " + error});
          }
        }
      );
    } catch (e) {
      this.dialog.open(ErrorDialogComponent, {data: e.message});
    }
    this.upload_button = false;
  }
}

@Component({
  selector: 'change-productfile',
  templateUrl: './change-product.component.html',
  styleUrls: ['./product.component.css']
})
export class ChangeProductFileComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: ProductCategory, private api: ApiService, private dialog: MatDialog) {
    (data);
  }
  @ViewChild(ProductCategoryAutocompletComponent)
  private productCategoryAutocompletComponent:ProductCategoryAutocompletComponent;
  load: boolean = false;
  upload_button = false;
  file: File;

  onFileChanged(event) {
    this.file = event.target.files[0];
    this.load = true;
  }

  Upload() {
    const uploadData = new FormData();
    uploadData.append('excel', this.file, this.file.name);
    this.upload_button = true;
    try {
      this.api.changeProduct(uploadData, this.data.id, this.productCategoryAutocompletComponent.myControl.value.id).subscribe(posts => {
          this.dialog.open(ErrorDialogComponent, {data: posts.name})

        },
        error => {
          if (error === 'Unknown Error') {
            this.dialog.open(ErrorDialogComponent, {data: "Ошибка загрузки \"в файл\": Обратитесь к администратору"});
          } else {
            this.dialog.open(ErrorDialogComponent, {data: "Ошибка на сервере: " + error});
          }
        }
      );
    } catch (e) {
      this.dialog.open(ErrorDialogComponent, {data: e.message});
    }
    this.upload_button = false;
  }
}
