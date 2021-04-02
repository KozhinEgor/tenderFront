import {Component, OnInit, ViewChild} from '@angular/core';
import * as XLSX from 'xlsx';
import { Post, ReceivedJson } from '../classes';
import {MatTableDataSource} from '@angular/material/table';
import { ApiService } from '../api.service';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {group} from '../page-tender-date/page-tender-date.component';
import {animate, state, style, transition, trigger} from '@angular/animations';

@Component({
  selector: 'app-page-add-tender',
  templateUrl: './page-add-tender.component.html',
  styleUrls: ['./page-add-tender.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class PageAddTenderComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator | null = null;
  @ViewChild(MatSort) sort: MatSort | null = null;
  dataSource = new MatTableDataSource<Post>();
  expandedElement: Post | null;
  load: boolean = false;
  arrayBuffer: any;
  file: File;

  displayedColumns: string[] = [];

  AllColums: group[] = [{name: 'id', nameru: 'ID'}, {name: 'nameTender', nameru: 'Название тендера'}, {name: 'customer', nameru: 'Заказчик'}, {name: 'typetender', nameru: 'Тип тендера'},

    {name: 'sum', nameru: 'Сумма'}, {name: 'dateStart', nameru: 'Дата начала'},
    {name: 'dateFinish', nameru: 'Дата окончания'},  {name: 'winner', nameru: 'Победитель'}, {name: 'winSum', nameru: 'Выиграшная сумма'}];

  onFileChanged(event)
  {
    this.file = event.target.files[0];
    this.load = true;
  }

  Upload() {
    const uploadData = new FormData();
    uploadData.append('excel', this.file, this.file.name);
    console.log(uploadData.get('excel'));
    this.api.addTender(uploadData).subscribe(posts => {
      this.dataSource = new MatTableDataSource<Post>(posts) ;
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }
  constructor(private api: ApiService) {
    for (let index = 0; index < this.AllColums.length - 2; index++){
      this.displayedColumns.push(this.AllColums[index].name);
    }
  }

  ngOnInit(): void {
  }

}
