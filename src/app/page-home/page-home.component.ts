import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {User} from '../classes';
import {AuthenticationService} from "../service/authentication.service";


@Component({
  selector: 'app-page-home',
  templateUrl: './page-home.component.html',
  styleUrls: ['./page-home.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class PageHomeComponent implements OnInit {
  user:User
  constructor( private authenticationService: AuthenticationService) {
    this.user = this.authenticationService.userValue;
  }
  ngOnInit(): void {

  }
}
