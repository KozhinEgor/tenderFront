import {Component, Inject, OnInit, ViewChild} from '@angular/core';
import {Comment, Post, Product, ProductCategory, TenderonProduct, User} from "../classes";
import {MatTableDataSource} from "@angular/material/table";
import {ApiService} from "../api.service";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {DataRangeComponent} from "../data-range/data-range.component";
import {VendorCodeAutocompleatComponent} from "../vendor-code-autocompleat/vendor-code-autocompleat.component";
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import {AuthenticationService} from "../service/authentication.service";
import {ActivatedRoute} from "@angular/router";
import {dialogTender, TenderDialogComponent} from "../tender-table/tender-table.component";
import {ErrorDialogComponent} from "../error-dialog/error-dialog.component";
import {UserAutocompletComponent} from "../user-autocomplet/user-autocomplet.component";

@Component({
  selector: 'app-page-tender',
  templateUrl: './page-tender.component.html',
  styleUrls: ['./page-tender.component.scss']
})
export class PageTenderComponent implements OnInit {
  @ViewChild(UserAutocompletComponent)
  private userAutocompletComponent: UserAutocompletComponent;
  user: User;
  id: number;
  ChangeComment: Comment = {
    id: null,
    text: '',
    usr: null,
    user: '',
    date: null,
    tender: null,
    users: []
  };
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
  comments: Comment[];
  color: string[] = ['#FFCC33', '#FF9933', '#FF6600', '#FF3300', '#FF6666', '#CC3333', '#FF0066', '#FF0099', '#FF33CC', '#FF66FF', '#CC66CC', '#CC00FF', '#9933FF', '#9966FF', '#9999FF', '#6666FF', '#3300FF', '#3366FF', '#0066FF',
    '#3399FF', '#33CCFF', '#66CCCC', '#66FFFF', '#33FFCC', '#00CC99', '#00FF99', '#33FF66', '#66CC66', '#00FF00', '#33FF00', '#66CC00', '#99CC66', '#CCFF33', '#CCCC33', '#CCCCCC'];
  UserColor = new Map();
  users: User[] = [];
  selectable = true;
  removable = true;
  load = false;
  constructor(private api: ApiService,
              public dialog: MatDialog,
              private authenticationService: AuthenticationService,
              private route: ActivatedRoute) {
    this.user = this.authenticationService.userValue;
  }
ngOnInit() {
  this.route.params.subscribe(event => {
    this.id = event.id;
  });
  this.api.getTenderById(this.id).subscribe(data => {
      if(data === null){
        this.dialog.open(ErrorDialogComponent, {data: "Возможно Тендер удален или ошибка на сервере. "})
      }
      this.data = data
      this.defaultComment()
    },
    error => {
      this.dialog.open(ErrorDialogComponent, {data: "Возможно Тендер удален или ошибка на сервере. " + error})
    });
  this.api.getComments(this.id).subscribe(comment => {
      this.comments = comment;
      this.setcolor();
    },
    error => {
      this.dialog.open(ErrorDialogComponent, {data: "Ошибка  " + error})
    }
  )
  }
  showTender() {
    this.dialog.open(TenderDialogComponent, {
      width: '80%',
      height: '90%',
      data: {adjacent_tender: false, id_tender: this.id}
    }).afterClosed().subscribe(result => {
      location.reload();
    });
  }

  setcolor() {
    for (var a of this.comments) {
      if (!this.UserColor.has(a.usr)) {
        this.UserColor.set(a.usr, this.color[Math.floor(Math.random() * this.color.length)]);
      }
    }
  }
  removeUser(user: User) {
    const index = this.users.indexOf(user);
    if (index >= 0) {
      this.users.splice(index, 1);
    }
  }
  ChangeUser(user: any) {
    if (typeof user !== "string") {
      this.users.push(user);

      this.userAutocompletComponent.myControl.setValue('');
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
        this.UserColor = new Map();
        this.setcolor();
      },
      error => {
        this.dialog.open(ErrorDialogComponent, {data: "Ошибка  " + error})
      }
    )

    this.defaultComment();
  }
  defaultComment() {
    this.users = [];
    this.ChangeComment = {
      id: null,
      text: '',
      usr: null,
      user: '',
      date: null,
      tender: this.id,
      users: []
    };
  }

}
