import { Component } from '@angular/core';
import {ApiService} from "./api.service";
import {count} from "rxjs/operators";
import {AuthenticationService} from "./service/authentication.service";
import {User} from "./classes";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'tender';
  CountTender: number = null;
  user: User;
  constructor(private api: ApiService, private authenticationService: AuthenticationService) {
    this.authenticationService.user.subscribe(x => this.user = x)
  }
  getCount(){
    this.api.getCountTenderWithoutOrders().subscribe(count => {this.CountTender = count;},
      err=> {this.CountTender = null;})
  }
  logout() {
    this.authenticationService.logout();
  }
}
