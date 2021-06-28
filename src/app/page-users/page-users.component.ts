import {Component, OnInit, ViewChild} from '@angular/core';
import {ApiService} from "../api.service";
import {MatTableDataSource} from "@angular/material/table";
import {Product, Role, User} from "../classes";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {ErrorDialogComponent} from "../error-dialog/error-dialog.component";
import {MatDialog} from "@angular/material/dialog";

@Component({
  selector: 'app-page-users',
  templateUrl: './page-users.component.html',
  styleUrls: ['./page-users.component.css']
})
export class PageUsersComponent implements OnInit {
  @ViewChild(ErrorDialogComponent)
  private errorDialogComponent:ErrorDialogComponent;
  dataSource = new MatTableDataSource<User>();
  roles: string[] = this.getAllValues();
  role: string;
  constructor(private formBuilder: FormBuilder,private api: ApiService, public dialog: MatDialog) { }
  columns = ['username','role','code'];
  getUser(){
    this.api.getUsers().subscribe(user=>{
        this.dataSource = new MatTableDataSource(user);
      }
    )
  }
  ngOnInit(): void {
    this.getUser();
  }
  email = new FormControl('', [Validators.required, Validators.email]);

  getErrorMessage() {
    if (this.email.hasError('required')) {
      return 'You must enter a value';
    }

    return this.email.hasError('email') ? 'Not a valid email' : '';
  }
  getAllValues():string[]  {
   let items: string[] = [];
   for(var  en in Role){
     var isValueProperty = parseInt(en, 10) >= 0
     if (isValueProperty) {
       items.push(Role[en]);
     }

   }
    return items;
  }

  saveUsers() {
    if(this.email.value !== null && this.role !== null){
      let user:User = {username:this.email.value, role: this.role, activationCode:null, token: null}

      this.api.createUser(user).subscribe(data => this.getUser(),
        error => {this.dialog.open(ErrorDialogComponent,{data:'Если не появился пользователь, значит ошибка в отправке сообщения на почту'});
          this.getUser();
      });

      this.email.setValue('');
      this.role = '';

    }
  }
}
