import {Component, OnInit, ViewChild} from '@angular/core';
import * as XLSX from 'xlsx';
import { Post, ReceivedJson } from '../classes';
import {MatTableDataSource} from '@angular/material/table';
import { ApiService } from '../api.service';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {group} from '../page-tender-date/page-tender-date.component';
import {animate, state, style, transition, trigger} from '@angular/animations';

import {MatDialog} from "@angular/material/dialog";
import {ErrorDialogComponent} from "../error-dialog/error-dialog.component";
import {ErrorDialogTenderComponent} from "../tender-table/tender-table.component";

@Component({
  selector: 'app-page-add-tender',
  templateUrl: './page-add-tender.component.html',
  styleUrls: ['./page-add-tender.component.scss'],
})
export class PageAddTenderComponent implements OnInit {
   dataSource = new MatTableDataSource<Post>();
  load: boolean = false;
  arrayBuffer: any;
  upload_button = false;
  file: File;
  displayedColumns: string[] = ['id','nameTender','customer','typetender','sum','dateStart','dateFinish','product'];


  onFileChanged(event)
  {
    this.file = event.target.files[0];
    this.load = true;
  }

  Upload() {
    const uploadData = new FormData();
    uploadData.append('excel', this.file, this.file.name);
    this.upload_button = true;
    try {
        this.api.addTender(uploadData).subscribe(posts => {
        this.dataSource = new MatTableDataSource<Post>(posts) ;


      },
  err => {
        this.dialog.open(ErrorDialogTenderComponent, { data: err.message});
            });
    }
    catch (e) {
      this.dialog.open(ErrorDialogComponent, {data: e.message});
    }
    this.upload_button = false;
  }
  constructor(private api: ApiService, public dialog: MatDialog) {
  }

  ngOnInit(): void {
  }

}
