import {AfterViewInit, Component, Inject, OnInit, ViewChild} from '@angular/core';
import {MatSort} from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ApiService } from '../api.service';
import {DataRangeComponent} from '../data-range/data-range.component'

import { Post,ReceivedJson } from '../classes';
import { registerLocaleData } from '@angular/common';
import localeRu from '@angular/common/locales/ru';
import {ThemePalette} from "@angular/material/core";
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {AutocompletTypeComponent} from "../autocomplet-type/autocomplet-type.component";
import {CustomAutocompletComponent} from "../custom-autocomplet/custom-autocomplet.component";
import {WinnerAutocompletComponent} from "../winner-autocomplet/winner-autocomplet.component";
import {MAT_DIALOG_DATA, MatDialog} from "@angular/material/dialog";



export interface group {
  name: string;
  nameru: String;
}
export interface DialogData {
  error: string;
}


@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.scss']
})
export class PostsComponent implements OnInit, AfterViewInit {
  AllColumn: string[] = ['id', 'nameTender', 'customer', 'typetender', 'numberTender', 'bicoTender', 'gosZakupki', 'price', 'currency', 'rate', 'sum', 'dateStart',
    'dateFinish', 'fullSum', 'winner', 'winSum'];
  @ViewChild(MatPaginator) paginator: MatPaginator | null = null;
  @ViewChild(MatSort) sort: MatSort | null = null;
  dataSource = new MatTableDataSource<Post>();

  @ViewChild(AutocompletTypeComponent)
  private autocompletType: AutocompletTypeComponent| undefined;
  @ViewChild(CustomAutocompletComponent)
  private customAutocomplet: CustomAutocompletComponent| undefined;
  @ViewChild(WinnerAutocompletComponent)
  private winnerAutocomplet: WinnerAutocompletComponent| undefined;

  @ViewChild(DataRangeComponent)
  private dataRange: DataRangeComponent | undefined;


  panelOpenState = false;

  minSum = new FormControl('', [Validators.max(999999999999), Validators.min(0)]);
  maxSum = new FormControl('', [Validators.max(999999999999), Validators.min(0)]);

ChoseColums: group[] = [];

  AllColums: group[] = [{name: 'id', nameru: 'ID'}, {name: 'nameTender', nameru: 'Название тендера'}, {name: 'customer', nameru: 'Заказчик'}, {name: 'typetender', nameru: 'Тип тендера'},

    {name: 'numberTender', nameru: 'Номер тендера'}, {name: 'bicoTender', nameru: 'БикоТендер'}, {name: 'gosZakupki', nameru: 'Госзакупки'}, {name: 'price', nameru: 'Цена'},
    {name: 'currency', nameru: 'Валюта'}, {name: 'rate', nameru: 'Курс'}, {name: 'sum', nameru: 'Сумма'}, {name: 'dateStart', nameru: 'Дата начала'},
    {name: 'dateFinish', nameru: 'Дата окончания'}, {name: 'fullSum', nameru: 'Полная сумма'}, {name: 'winner', nameru: 'Победитель'}, {name: 'winSum', nameru: 'Выиграшная сумма'}];

  displayedColumns: string[] = [];

  constructor(private api: ApiService, public dialog: MatDialog) {
    for (let index = 0; index < 14; index++){
      this.ChoseColums.push(this.AllColums[index]);
      this.displayedColumns.push(this.AllColums[index].name);
    }
  }

  json: ReceivedJson = {dateStart: '', dateFinish: '', type: '%', custom: '%', winner: '%', minSum: 0, maxSum: 999999999999};

  showTables(): void{
    this.json.dateStart = this.dataRange?.getDateStart() || '';
    this.json.dateFinish = this.dataRange?.getDateFinish() || '';
    this.json.type = this.autocompletType?.getType() || '%';
    this.json.custom = this.customAutocomplet?.getCustom() || '%';
    this.json.winner = this.winnerAutocomplet?.getWinner() || '%';
    if (this.minSum && this.maxSum && this.maxSum.value > this.minSum.value) {
      this.json.maxSum = this.maxSum.value;
      this.json.minSum = this.minSum.value;
    }
    else if (this.minSum && this.maxSum && this.maxSum.value < this.minSum.value){
       this.dialog.open(ErrorDialogComponent, { data: 'Максимальная сумма меньше минимальной'});
    }

    console.log(this.json);
    this.api.getPostWithParametrs(this.json).subscribe(posts => {
      this.dataSource = new MatTableDataSource<Post>(posts) ;
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }
  ngOnInit(): void {

    /*this.api.getPostDate().subscribe(ob => {
      this.exampe = ob;

    });*/
  }


  ngAfterViewInit() {

  }
  toggleOffer(offer: any): void {
    let index = this.ChoseColums.indexOf(offer);
    if (index >= 0) {
      this.ChoseColums.splice(index, 1);
      const indexDisplay = this.displayedColumns.indexOf(offer.name);
      this.displayedColumns.splice(indexDisplay, 1);
    } else {
      this.ChoseColums.push(offer);
      const indexDisplay = this.AllColumn.indexOf(offer.name);
      this.displayedColumns.splice(indexDisplay, 0, offer.name);
    }
  }
  isSelected(offer: any): boolean {
    const index = this.ChoseColums.indexOf(offer);

    return index >= 0;
  }
  /*Winner(): void{
    if ( this.checkedWinner){
      this.displayedColumns = this.ColumsWithWin;
    }
    else {
      this.displayedColumns = this.ColumsWithoutWin;
    }
  }
*/

}
@Component({
  selector: 'app-error-dialog',
  templateUrl: './error-dialog.component.html',
})
export class ErrorDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: DialogData) {}

}
