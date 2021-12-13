import { Component } from '@angular/core';
import {ApiService} from "./api.service";
import {count, map} from "rxjs/operators";
import {AuthenticationService} from "./service/authentication.service";
import {User} from "./classes";
import {environment} from "../environments/environment";
import {HttpClient} from "@angular/common/http";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'tender';
  CountTender: number = null;
  user: User;
  constructor(private api: ApiService, private authenticationService: AuthenticationService, private http: HttpClient) {
    this.authenticationService.user.subscribe(x => this.user = x)
  }
  getCount(){
    this.api.getCountTenderWithoutOrders().subscribe(count => {this.CountTender = count;},
      err=> {this.CountTender = null;})
  }
  logout() {
    this.authenticationService.logout();
  }
  private host = environment.apiUrl;

}
