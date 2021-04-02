import {AfterViewInit, Component, Inject, OnInit, ViewChild} from '@angular/core';
import {MatSort} from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ApiService } from '../api.service';
import {DataRangeComponent} from '../data-range/data-range.component';

import { Post, ReceivedJson } from '../classes';
import { registerLocaleData } from '@angular/common';
import localeRu from '@angular/common/locales/ru';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {AutocompletTypeComponent} from '../autocomplet-type/autocomplet-type.component';
import {CustomAutocompletComponent} from '../custom-autocomplet/custom-autocomplet.component';
import {WinnerAutocompletComponent} from '../winner-autocomplet/winner-autocomplet.component';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import {animate, state, style, transition, trigger} from "@angular/animations";



export interface group {
  name: string;
  nameru: string;
}
export interface DialogData {
  error: string;
}

@Component({
  selector: 'app-page-tender-date',
  templateUrl: './page-tender-date.component.html',
  styleUrls: ['./page-tender-date.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class PageTenderDateComponent implements OnInit {
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
  expandedElement: Post | null;

  panelOpenState = false;

  minSum = new FormControl('', [Validators.max(999999999999), Validators.min(0)]);
  maxSum = new FormControl('', [Validators.max(999999999999), Validators.min(0)]);

  ChoseColums: group[] = [];
  displayedColumns: string[] = [];

  AllColums: group[] = [{name: 'id', nameru: 'ID'}, {name: 'nameTender', nameru: 'Название тендера'}, {name: 'customer', nameru: 'Заказчик'}, {name: 'typetender', nameru: 'Тип тендера'},

     {name: 'sum', nameru: 'Сумма'}, {name: 'dateStart', nameru: 'Дата начала'},
    {name: 'dateFinish', nameru: 'Дата окончания'},  {name: 'winner', nameru: 'Победитель'}, {name: 'winSum', nameru: 'Выиграшная сумма'}];



  constructor(private api: ApiService, public dialog: MatDialog) {
    for (let index = 0; index < this.AllColums.length - 2; index++){
      this.ChoseColums.push(this.AllColums[index]);
      this.displayedColumns.push(this.AllColums[index].name);
    }
  }

  json: ReceivedJson = {dateStart: '', dateFinish: '', type: '%', custom: '%', winner: '%', minSum: 0, maxSum: 999999999999};

  showTables(): void{
    this.json.dateStart = this.dataRange?.getDateStart() || '2018-01-01T00:00Z[UTC]';
    this.json.dateFinish = this.dataRange?.getDateFinish() || '2040-01-01T00:00Z[UTC]';
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
    /*
    this.api.getPosts().subscribe(posts => {
      this.dataSource = new MatTableDataSource<Post>(posts) ;
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      */
    });
  }
  ngOnInit(): void {

    /*this.api.getPostDate().subscribe(ob => {
      this.exampe = ob;

    });*/
  }
  toggleOffer(offer: any): void {
    const index = this.ChoseColums.indexOf(offer);
    if (index >= 0) {
      this.ChoseColums.splice(index, 1);
      const indexDisplay = this.displayedColumns.indexOf(offer.name);
      this.displayedColumns.splice(indexDisplay, 1);
    } else {
      this.ChoseColums.push(offer);
      const indexDisplay = this.AllColums.indexOf(offer);
      console.log(indexDisplay);
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
  showTender(){
    this.dialog.open(TenderDialogComponent, { width: '80%', height: '80%', data:  this.expandedElement});
  }
}
@Component({
  selector: 'app-error-dialog',
  templateUrl: './error-dialog.component.html',
})
export class ErrorDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: DialogData) {}

}
@Component({
  selector: 'app-tender-dialog',
  templateUrl: './tender-dialog.component.html',
  styleUrls: ['./tender-dialog.component.scss'],
})
export class TenderDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<TenderDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Post) {}

}
