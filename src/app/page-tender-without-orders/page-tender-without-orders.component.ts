import { Component, OnInit } from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {Post} from "../classes";
import {group} from "../page-tender-date/page-tender-date.component";
import {ErrorDialogTenderComponent} from "../tender-table/tender-table.component";
import {ErrorDialogComponent} from "../error-dialog/error-dialog.component";
import {ApiService} from "../api.service";
import {MatDialog} from "@angular/material/dialog";

@Component({
  selector: 'app-page-tender-without-orders',
  templateUrl: './page-tender-without-orders.component.html',
  styleUrls: ['./page-tender-without-orders.component.css']
})
export class PageTenderWithoutOrdersComponent implements OnInit {

  dataSource = new MatTableDataSource<Post>();

  displayedColumns: string[] = ['id','nameTender','customer','typetender','sum','dateStart','dateFinish','product'];




  constructor(private api: ApiService, public dialog: MatDialog) {
  }

  ngOnInit(): void {
    try {
      this.api.getTenderWithoutOrders().subscribe(posts => {
          this.dataSource = new MatTableDataSource<Post>(posts) ;


        },
        err => {
          this.dialog.open(ErrorDialogTenderComponent, { data: err.message});
        });
    }
    catch (e) {
      this.dialog.open(ErrorDialogComponent, {data: e.message});
    }
  }

}
