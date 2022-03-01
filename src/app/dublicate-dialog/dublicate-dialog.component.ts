import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog} from "@angular/material/dialog";
import {ApiService} from "../api.service";
import {ErrorDialogComponent} from "../error-dialog/error-dialog.component";
import {Data} from "../page-add-tender/page-add-tender.component";

@Component({
  selector: 'app-dublicate-dialog',
  templateUrl: './dublicate-dialog.component.html',
  styleUrls: ['./dublicate-dialog.component.css']
})
export class DublicateDialogComponent {

  constructor(@Inject(MAT_DIALOG_DATA) public data: Data,private api: ApiService, public dialog: MatDialog) {}
  setDublicate(){
    this.api.setDublicate(this.data.id,this.data.id_d).subscribe(data => {
        this.dialog.open(ErrorDialogComponent, {data: "Сохранено"})
      },
      error => {
        this.dialog.open(ErrorDialogComponent, {data: "Ошибка" + error});
      });
  }
}
