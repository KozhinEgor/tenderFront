import {Component, OnInit} from '@angular/core';
import {FormControl, Validators} from "@angular/forms";
import {ApiService} from "../api.service";
import {Router} from "@angular/router";
import {HttpErrorResponse} from "@angular/common/http";

@Component({
  selector: 'app-page-registration',
  templateUrl: './page-registration.component.html',
  styleUrls: ['./page-registration.component.css']
})
export class PageRegistrationComponent implements OnInit {

  hide=true;
  constructor(private api:ApiService,private router: Router) { }

  ngOnInit(): void {

  }
  email = new FormControl('', [Validators.required, Validators.email]);
  password: string;
  code:string;
  error:string;
  getErrorMessage() {
    if (this.email.hasError('required')) {
      return 'You must enter a value';
    }

    return this.email.hasError('email') ? 'Not a valid email' : '';
  }

  savepassword() {
    this.error='';
    if(this.email.value !== '' && this.code !== '' && this.password !== '' &&
    this.email.value !== null && this.code !== null && this.password !== null &&
    this.email.value !== undefined && this.code !== undefined && this.password !== undefined){

      this.api.setPasswordUser({username:this.email.value, activationCode:this.code.trim() ,password:this.password}).subscribe(
        data =>{this.router.navigate(['/login'])},
        (error:HttpErrorResponse) => { this.error = "Ошибка! Проверьте все значения, если все введено верно обратитесь к администратору";
        // if(error.status === 200){
        //   this.router.navigate(['/login']);
        // }
        // else {
        //   this.error = "Ошибка!\n" +
        //     "Проверьте все значения, если все введено верно обратитесь к администратору";
        // }
        })
    }
    else {
      this.error = "Ошибка! Проверьте все значения, если все введено верно обратитесь к администратору";
    }
  }
}
