import {Component, OnInit} from '@angular/core';
import {Post} from '../classes';
import {MatTableDataSource} from '@angular/material/table';
import {ApiService} from '../api.service';

import {MatDialog} from "@angular/material/dialog";
import {ErrorDialogComponent} from "../error-dialog/error-dialog.component";
import {MatChipInputEvent} from "@angular/material/chips";
import {COMMA, ENTER, SPACE} from "@angular/cdk/keycodes";

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
  displayedColumnsAll: string[] = ['id','nameTender','customer','typetender','sum','dateStart','dateFinish','product'];
  displayedColumns: string[] =[];
  adjacent_tender: boolean = false;
    onFileChanged(event)
  {
    this.file = event.target.files[0];
    this.load = true;
  }

  Upload() {
    this.adjacent_tender = false;
    this.displayedColumns = this.displayedColumnsAll;
    const uploadData = new FormData();
    uploadData.append('excel', this.file, this.file.name);
    this.upload_button = true;
    try {
        this.api.addTender(uploadData).subscribe(posts => {
        this.dataSource = new MatTableDataSource<Post>(posts) ;

      },
  error => {
    if(error === 'Unknown Error'){this.dialog.open(ErrorDialogComponent, {data: "Ошибка загрузки \"в файл\": Обратитесь к администратору"});}
     else{this.dialog.open(ErrorDialogComponent, { data:"Ошибка на сервере: "+ error});}
            }
            );
    }
    catch (e) {
      this.dialog.open(ErrorDialogComponent, {data: e.message});
    }
    this.upload_button = false;
  }
  constructor(private api: ApiService, public dialog: MatDialog) {
      this.displayedColumns = this.displayedColumnsAll;
  }

  ngOnInit(): void {
  }
  number_bicoTender: number[] = [];
  selectable = true;
  removable = true;
  addOnBlur = true;
  dis=false;
  readonly separatorKeysCodes = [ENTER, COMMA, SPACE] as const;
  addBicoNumberTender(event: MatChipInputEvent): void {
    let value = (event.value || '').trim();
    let mas = value.split(/ |,|\.|;|:|\\|\//);

    // Add our fruit
    if (value) {
      for (let i of mas) {
        if(i !== ''){
          i = i.replace(/\D/g, '');

          this.number_bicoTender.push(Number(i));
        }

      }

    }

    // Clear the input value
    event.input.value = null;
  }

  removeBicoNumberTender(fruit: number): void {
    const index = this.number_bicoTender.indexOf(fruit);

    if (index >= 0) {
      this.number_bicoTender.splice(index, 1);
    }
  }
  loadTender(){
    this.adjacent_tender = false;
    this.displayedColumns = this.displayedColumnsAll;
    this.dialog.open(ErrorDialogComponent,{data:'Дождитетесь загрузки, она займет какое-то время'});
    this.dis = true;
    this.api.loadTender(this.number_bicoTender).subscribe(posts => {
        if(posts.length === 0){
          this.dataSource = new MatTableDataSource<Post>(posts)
          this.dialog.open(ErrorDialogComponent, { data: 'Найдено 0 тендеров'});
        }
        else{this.dataSource = new MatTableDataSource<Post>(posts) ;
         }
        this.dis = false;
      },
      error => {
        this.dis = false;
        this.dialog.open(ErrorDialogComponent, { data:"Ошибка на сервере: "+ error});
      })
  }
  number_bicoAdjacent: number[] = [];
  addBicoNumberAdjacent(event: MatChipInputEvent): void {
    let value = (event.value || '').trim();
    let mas = value.split(/ |,|\.|;|:|\\|\//);

    // Add our fruit
    if (value) {
      for (let i of mas) {
        if(i !== ''){
          i = i.replace(/\D/g, '');

          this.number_bicoAdjacent.push(Number(i));
        }

      }

    }

    // Clear the input value
    event.input.value = null;
  }

  removeBicoNumberAdjacent(fruit: number): void {
    const index = this.number_bicoAdjacent.indexOf(fruit);

    if (index >= 0) {
      this.number_bicoAdjacent.splice(index, 1);
    }
  }
  loadTenderAdjacent(){
    this.adjacent_tender = true;
    this.displayedColumns = this.displayedColumnsAll.slice(0,this.displayedColumnsAll.length-2);
    this.dialog.open(ErrorDialogComponent,{data:'Дождитетесь загрузки, она займет какое-то время'});
    this.dis = true;
    this.api.loadTenderAdjacent(this.number_bicoAdjacent).subscribe(posts => {
        if(posts.length === 0){
          this.dataSource = new MatTableDataSource<Post>(posts)
          this.dialog.open(ErrorDialogComponent, { data: 'Найдено 0 тендеров'});
        }
        else{this.dataSource = new MatTableDataSource<Post>(posts) ;
        }
        this.dis = false;
      },
      error => {
        this.dis = false;
        this.dialog.open(ErrorDialogComponent, { data:"Ошибка на сервере: "+ error});
      })
  }
}
