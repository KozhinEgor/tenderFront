import { Component } from '@angular/core';
import {ApiService} from "./api.service";
import {count} from "rxjs/operators";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'tender';
  CountTender: number = null;
  constructor(private api: ApiService) {
  }
  getCount(){
    this.api.getCountTenderWithoutOrders().subscribe(count => {this.CountTender = count;},
      err=> {this.CountTender = null;})
  }
}
