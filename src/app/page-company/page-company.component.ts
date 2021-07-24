import {Component, Inject, OnInit, ViewChild} from '@angular/core';
import {ApiService} from "../api.service";
import {MatSort} from "@angular/material/sort";
import {MatTableDataSource} from "@angular/material/table";
import {ChangeCategory, ChangeCompany, Company, User} from "../classes";
import {FormControl} from "@angular/forms";
import {AuthenticationService} from "../service/authentication.service";
import {ContryAutocompletComponent} from "../contry-autocomplet/contry-autocomplet.component";
import {MAT_DIALOG_DATA, MatDialog} from "@angular/material/dialog";
import {ErrorDialogComponent} from "../error-dialog/error-dialog.component";
import {ProductCategoryAutocompletComponent} from "../product-category-autocomplet/product-category-autocomplet.component";
import {VendorCodeAutocompleatComponent} from "../vendor-code-autocompleat/vendor-code-autocompleat.component";
import {CustomAutocompletComponent} from "../custom-autocomplet/custom-autocomplet.component";
import {WinnerAutocompletComponent} from "../winner-autocomplet/winner-autocomplet.component";
import {saveAs} from 'file-saver';

@Component({
  selector: 'app-page-company',
  templateUrl: './page-company.component.html',
  styleUrls: ['./page-company.component.css']
})
export class PageCompanyComponent implements OnInit {
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(ContryAutocompletComponent)
  private contryAutocompletComponent:ContryAutocompletComponent
  dataSource = new MatTableDataSource<Company>();
  selected = new FormControl(0);
  columns = ['id','name','inn','country','edit'];
  user:User;
  noUses = false;
  id:number = null;
  name:string = null;
  inn:string = null;
  country:number = null;

  constructor(private api:ApiService, private authenticationService: AuthenticationService, private dialog:MatDialog) {
    this.user = this.authenticationService.userValue;
  }

  ngOnInit(): void {
    this.selected.setValue(0);
    this.getCompany();
  }

  default(){
    this.id = null;
    this.name = null;
    this.inn = null;
    this.country = null;
    this.contryAutocompletComponent.myControl.setValue('');
  }

  getCompany(){
    this.noUses = false;
    if(this.selected.value === 0){
      this.api.getAllCustom().subscribe(
        data => {
          if(data.length == 0){
            this.dataSource = new MatTableDataSource();
            this.dialog.open(ErrorDialogComponent, {data: "Нет компаний удовлетворяющих поиску"});
          }
          this.dataSource = new MatTableDataSource<Company>(data);
          this.dataSource.sort = this.sort;
        },error => {
          this.dialog.open(ErrorDialogComponent,{data:'Ошибка ' + error});
        }
      )
    }
    else {
      this.api.getAllWinner().subscribe(
        data => {
          if(data.length == 0){
            this.dataSource = new MatTableDataSource();
            this.dialog.open(ErrorDialogComponent, {data: "Нет компаний удовлетворяющих поиску"});
          }
          this.dataSource = new MatTableDataSource<Company>(data);
          this.dataSource.sort = this.sort;
        },error => {
          this.dialog.open(ErrorDialogComponent,{data:'Ошибка ' + error});
        }
      );

    }
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  editCompany(company:Company){
    this.id = company.id;
    this.name = company.name;
    this.inn = company.inn;
    this.contryAutocompletComponent.setContry(company.country);
    this.country = this.contryAutocompletComponent.myControl.value.id;
  }

  showCompanyNoUses(){
    this.noUses = true;
    if(this.selected.value === 0){
      this.api.getAllCustomNoUses().subscribe(
        data => {
          if(data.length == 0){
            this.dataSource = new MatTableDataSource();
            this.dialog.open(ErrorDialogComponent, {data: "Нет компаний удовлетворяющих поиску"});
          }
          this.dataSource = new MatTableDataSource<Company>(data);
          this.dataSource.sort = this.sort;
        },error => {
          this.dialog.open(ErrorDialogComponent,{data:'Ошибка ' + error});
        }
      )
    }
    else {
      this.api.getAllWinnerNoUses().subscribe(
        data => {
          if(data.length == 0){
            this.dataSource = new MatTableDataSource();
            this.dialog.open(ErrorDialogComponent, {data: "Нет компаний удовлетворяющих поиску"});
          }
          this.dataSource = new MatTableDataSource<Company>(data);
          this.dataSource.sort = this.sort;
        },error => {
          this.dialog.open(ErrorDialogComponent,{data:'Ошибка ' + error});
        }
      );

    }
  }

  ChageCompany(){
    this.dialog.open(ChangeCompanyComponent,{data:this.selected.value})
  }

  DeleteCompany(){
    if(this.selected.value === 0){
      this.api.DeleteCustomerNoUses().subscribe(
        data => {
          if(data.length == 0){
            this.dataSource = new MatTableDataSource();
            this.dialog.open(ErrorDialogComponent, {data: "Нет компаний удовлетворяющих поиску"});
          }
          this.dataSource = new MatTableDataSource<Company>(data);
          this.dataSource.sort = this.sort;
        },error => {
          this.dialog.open(ErrorDialogComponent,{data:'Ошибка ' + error});
        }
      )
    }
    else {
      this.api.DeleteWinnerNoUses().subscribe(
        data => {
          if(data.length == 0){
            this.dataSource = new MatTableDataSource();
            this.dialog.open(ErrorDialogComponent, {data: "Нет компаний удовлетворяющих поиску"});
          }
          this.dataSource = new MatTableDataSource<Company>(data);
          this.dataSource.sort = this.sort;
        },error => {
          this.dialog.open(ErrorDialogComponent,{data:'Ошибка ' + error});
        }
      );

    }
  }

  onChangeContry(t: any){

    if (t != null && typeof t !== 'string') {
      this.country = t.id;

    }
  }

  saveCompany(){
    if(this.selected.value === 0){
      if (this.inn && this.name && this.country){
        let customer: Company= {id: this.id, inn: this.inn.toString(), name: this.name, country: this.country.toString()};
        this.api.InsertCustomer(customer).subscribe(data => {
          this.dialog.open(ErrorDialogComponent, { data:'Сохранил'});
          this.getCompany();
          },
          err => {
            this.dialog.open(ErrorDialogComponent, {data: 'Ошибка  не сохранил' + err});

          });
        this.default();
      }
      else{
        this.dialog.open(ErrorDialogComponent, { data:'Заполнены не все поля'});
      }
    }

    else {

      if (this.inn && this.name && this.country){
        let win: Company = {id: this.id, inn: this.inn.toString(), name: this.name, country: this.country.toString()};
        this.api.InsertWinner(win).subscribe(data => {
          this.dialog.open(ErrorDialogComponent, { data:'Сохранил'});
            this.getCompany();
            },
          err => {
            this.dialog.open(ErrorDialogComponent, {data: 'Ошибка  не сохранил'+ err});

          });
        this.default();
      }
      else{
        this.dialog.open(ErrorDialogComponent, { data:'Заполнены не все поля'});
      }
    }

  }

  SaveToFile(){

    if(this.selected.value === 0){
      this.api.CustomerFile().subscribe(
        blob => {
          saveAs(blob, "Customer.xlsx");
        },
        error => {
          this.dialog.open(ErrorDialogComponent,{data:"Ошибка" + error});
        });
    }
    else {
      this.api.WinnerFile().subscribe(
        blob => {
          saveAs(blob, "Winner.xlsx");
        },
        error => {
          this.dialog.open(ErrorDialogComponent,{data:"Ошибка" + error});
        });

    }
  }
}
@Component({
  selector: 'change-company',
  templateUrl: './change-company.component.html'
})
export class ChangeCompanyComponent{
  @ViewChild(CustomAutocompletComponent)
  private customer:CustomAutocompletComponent;
  @ViewChild(WinnerAutocompletComponent)
  private winner:WinnerAutocompletComponent;

  @ViewChild('newCustomer')
  private newCustomer:CustomAutocompletComponent;
  @ViewChild('newWinner')
  private newWinner:WinnerAutocompletComponent;

  constructor(private api:ApiService,private dialog:MatDialog, @Inject(MAT_DIALOG_DATA) public data:number) {
  }



  Change(){
    if(this.data === 0){
      if(this.customer.myControl.value !== '' && this.customer.myControl.value !== null
        && this.newCustomer.myControl.value !== '' && this.newCustomer.myControl.value !== null) {
        let json:ChangeCompany ={
          company: this.customer.myControl.value.id,
          newCompany: this.newCustomer.myControl.value.id
        }
        this.api.ChangeCustomer(json).subscribe(data => {
            this.dialog.open(ErrorDialogComponent, {data: data.name})
          },
          error => {
            this.dialog.open(ErrorDialogComponent, {data: 'Ошибка' + error})
          })
      }
      else{
        this.dialog.open(ErrorDialogComponent,{data: "Не заполнены все поля"});
      }
    }

    else {
      if (this.winner.myControl.value !== '' && this.winner.myControl.value !== null
        && this.newWinner.myControl.value !== '' && this.newWinner.myControl.value !== null) {
        let json: ChangeCompany = {
          company: this.winner.myControl.value.id,
          newCompany: this.newWinner.myControl.value.id
        }
        this.api.ChangeWinner(json).subscribe(data => {
            this.dialog.open(ErrorDialogComponent, {data: data.name})
          },
          error => {
            this.dialog.open(ErrorDialogComponent, {data: 'Ошибка' + error})
          })
      } else {
        this.dialog.open(ErrorDialogComponent, {data: "Не заполнены все поля"});
      }

    }
  }

}
