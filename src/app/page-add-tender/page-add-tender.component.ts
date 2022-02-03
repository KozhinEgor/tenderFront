import {Component, Inject, OnInit} from '@angular/core';
import {Post} from '../classes';
import {MatTableDataSource} from '@angular/material/table';
import {ApiService} from '../api.service';

import {MAT_DIALOG_DATA, MatDialog} from "@angular/material/dialog";
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
   tenders:[Post[]];
  load: boolean = false;
  arrayBuffer: any;
  upload_button = false;
  file: File;
  displayedColumnsAll: string[] = ['id','nameTender','customer','typetender','sum','dateStart','dateFinish','product'];
  displayedColumns: string[] =[];
  adjacent_tender: boolean = false;
  plan_schedule:boolean = false;
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
    this.addBicoNumberTenderFromBuffer(localStorage.getItem('number_bicoTender'));
    this.addBicoNumberAdjacentFromBuffer(localStorage.getItem('number_bicoAdjacent'))
    this.addBicoNumberPlanFromBuffer(localStorage.getItem('number_bicoPlan'));
      this.api.numberFromBuffer(1).subscribe(posts => {
        this.addBicoNumberTenderFromBuffer(posts.name)

      }
      );
    this.api.numberFromBuffer(2).subscribe(posts => {
      this.addBicoNumberAdjacentFromBuffer(posts.name)
    }
    );
    this.api.numberFromBuffer(3).subscribe(posts => {
        this.addBicoNumberPlanFromBuffer(posts.name)
      }
    );
  }
  number_bicoTender: number[] = [];
  selectable = true;
  removable = true;
  addOnBlur = true;
  dis=false;
  readonly separatorKeysCodes = [ENTER, COMMA, SPACE] as const;
  addBicoNumberTenderFromBuffer(event: string): void {
    let value = (event || '').trim();
    let mas = value.split(/ |,|\.|;|:|\\|\//);

    // Add our fruit
    if (value) {
      for (let i of mas) {
        if(i !== ''){
          i = i.replace(/\D/g, '');
          if(this.number_bicoTender.indexOf(Number(i)) < 0){
            this.number_bicoTender.push(Number(i));
          }

        }

      }

    }
  }

  addBicoNumberTender(event: MatChipInputEvent): void {
    let value = (event.value || '').trim();
    let mas = value.split(/ |,|\.|;|:|\\|\//);

    // Add our fruit
    if (value) {
      for (let i of mas) {
        if(i !== ''){
          i = i.replace(/\D/g, '');

          if(this.number_bicoTender.indexOf(Number(i)) < 0){
            this.number_bicoTender.push(Number(i));
            localStorage.setItem('number_bicoTender', this.number_bicoTender.toString().replace(',',' '));
          }
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
      localStorage.setItem('number_bicoTender', this.number_bicoTender.toString().replace(',',' '));
    }
  }

  loadTender(){
    this.plan_schedule = false;
    this.adjacent_tender = false;
    this.displayedColumns = this.displayedColumnsAll;
    this.dialog.open(ErrorDialogComponent,{data:'Дождитетесь загрузки, она займет какое-то время'});
    this.dis = true;
    this.api.loadTender(this.number_bicoTender).subscribe(posts => {
      if (posts === null){
        this.dialog.open(ErrorDialogComponent, { data: 'Ошибка ответа от Бикотендера, номера Основных тендеров сохранены'});
        this.dis = false;
      }
      else { // @ts-ignore
        if(posts.length === 0){
                  this.dialog.open(ErrorDialogComponent, { data: 'Найдено 0 тендеров'});
              }
              else{
                this.number_bicoTender = [];
                localStorage.setItem('number_bicoTender', '');
                this.tenders = posts;
               }
      }
      this.dis = false;
      },
      error => {
        this.dis = false;
        this.dialog.open(ErrorDialogComponent, { data:"Ошибка на сервере: "+ error});
      })
  }
  dublicate(id_d:number, id:number){
    this.dialog.open(DublicateDialogComponent, {data:{id: id,id_d: id_d}})
  }
  getdublicate(id:number){
    this.dialog.open(AddDublicateDialogComponent, {height: '90%',data:{id: id, id_d:null}})
  }
  plan(id_d:number, id:number){
    this.dialog.open(PlanDialogComponent, {data:{id: id,id_d: id_d}})
  }
  number_bicoAdjacent: number[] = [];

  addBicoNumberAdjacentFromBuffer(event: string): void {
    let value = (event || '').trim();
    let mas = value.split(/ |,|\.|;|:|\\|\//);

    // Add our fruit
    if (value) {
      for (let i of mas) {
        if(i !== ''){
          i = i.replace(/\D/g, '');
          if(this.number_bicoAdjacent.indexOf(Number(i)) < 0){
            this.number_bicoAdjacent.push(Number(i));
          }

        }

      }

    }
  }

  addBicoNumberAdjacent(event: MatChipInputEvent): void {
    let value = (event.value || '').trim();
    let mas = value.split(/ |,|\.|;|:|\\|\//);

    // Add our fruit
    if (value) {
      for (let i of mas) {
        if(i !== ''){
          i = i.replace(/\D/g, '');
          if(this.number_bicoAdjacent.indexOf(Number(i)) < 0) {
            this.number_bicoAdjacent.push(Number(i));
            localStorage.setItem('number_bicoAdjacent', this.number_bicoAdjacent.toString().replace(',', ' '));
          }
        }

      }

    }

    // Clear the input value
    event.input.value = null;
  }

  removeBicoNumberAdjacent(number: number): void {
    const index = this.number_bicoAdjacent.indexOf(number);

    if (index >= 0) {
      this.number_bicoAdjacent.splice(index, 1);
      localStorage.setItem('number_bicoAdjacent', this.number_bicoAdjacent.toString().replace(',', ' '));
    }
  }

  loadTenderAdjacent(){
    this.plan_schedule = false;
    this.adjacent_tender = true;
    this.displayedColumns = this.displayedColumnsAll.slice(0,this.displayedColumnsAll.length-2);
    this.dialog.open(ErrorDialogComponent,{data:'Дождитетесь загрузки, она займет какое-то время'});
    this.dis = true;
    this.api.loadTenderAdjacent(this.number_bicoAdjacent).subscribe(posts => {
        if (posts === null){
          this.dialog.open(ErrorDialogComponent, { data: 'Ошибка ответа от Бикотендера, номера тендеров из смежных отраслей сохранены'});
          this.dis = false;
        }
        else if(posts.length === 0){
          this.dataSource = new MatTableDataSource<Post>(posts)
          this.dialog.open(ErrorDialogComponent, { data: 'Найдено 0 тендеров'});
        }
        else{
          this.number_bicoAdjacent = [];
          localStorage.setItem('number_bicoAdjacent', '');
          this.dataSource = new MatTableDataSource<Post>(posts) ;
        }
        this.dis = false;
      },
      error => {
        this.dis = false;
        this.dialog.open(ErrorDialogComponent, { data:"Ошибка на сервере: "+ error});
      })
  }

  number_bicoPlan: number[] = [];

  addBicoNumberPlanFromBuffer(event: string): void {
    let value = (event || '').trim();
    let mas = value.split(/ |,|\.|;|:|\\|\//);

    // Add our fruit
    if (value) {
      for (let i of mas) {
        if(i !== ''){
          i = i.replace(/\D/g, '');
          if(this.number_bicoPlan.indexOf(Number(i)) < 0){
            this.number_bicoPlan.push(Number(i));
          }

        }

      }

    }
  }

  addBicoNumberPlan(event: MatChipInputEvent): void {
    let value = (event.value || '').trim();
    let mas = value.split(/ |,|\.|;|:|\\|\//);

    // Add our fruit
    if (value) {
      for (let i of mas) {
        if(i !== ''){
          i = i.replace(/\D/g, '');
          if(this.number_bicoPlan.indexOf(Number(i)) < 0) {
            this.number_bicoPlan.push(Number(i));
            localStorage.setItem('number_bicoPlan', this.number_bicoPlan.toString().replace(',', ' '));
          }
        }

      }

    }

    // Clear the input value
    event.input.value = null;
  }

  removeBicoNumberPlan(number: number): void {
    const index = this.number_bicoPlan.indexOf(number);

    if (index >= 0) {
      this.number_bicoPlan.splice(index, 1);
      localStorage.setItem('number_bicoPlan', this.number_bicoAdjacent.toString().replace(',', ' '));
    }
  }

  loadTenderPlan(){
    this.plan_schedule = true;
    this.adjacent_tender = false;
    this.displayedColumns = this.displayedColumnsAll.slice(0,this.displayedColumnsAll.length-2);
    this.dialog.open(ErrorDialogComponent,{data:'Дождитетесь загрузки, она займет какое-то время'});
    this.dis = true;
    this.api.loadTenderPlan(this.number_bicoPlan).subscribe(posts => {
        if (posts === null){
          this.dialog.open(ErrorDialogComponent, { data: 'Ошибка ответа от Бикотендера, номера тендеров из смежных отраслей сохранены'});
          this.dis = false;
        }
        else if(posts.length === 0){
          this.dataSource = new MatTableDataSource<Post>(posts)
          this.dialog.open(ErrorDialogComponent, { data: 'Найдено 0 тендеров'});
        }
        else{
          this.number_bicoPlan;
          localStorage.setItem('number_bicoPlan', '');
          this.dataSource = new MatTableDataSource<Post>(posts) ;
        }
        this.dis = false;
      },
      error => {
        this.dis = false;
        this.dialog.open(ErrorDialogComponent, { data:"Ошибка на сервере: "+ error});
      })
  }

}
export interface Data {
  id: number;
  id_d:number;
}

@Component({
  selector: 'app-dublicate-dialog',
  templateUrl: './dublicate-dialog.component.html'
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

@Component({
  selector: 'app-plan-dialog',
  templateUrl: './plan-dialog.component.html'
})
export class PlanDialogComponent {

  constructor(@Inject(MAT_DIALOG_DATA) public data: Data,private api: ApiService, public dialog: MatDialog) {}
  setPlan(){
    this.api.setPlane(this.data.id,this.data.id_d).subscribe(data => {
        this.dialog.open(ErrorDialogComponent, {data: "Сохранено"})
      },
      error => {
        this.dialog.open(ErrorDialogComponent, {data: "Ошибка" + error});
      });
  }
}

@Component({
  selector: 'app-add-dublicate-dialog',
  templateUrl: './add-dublicate.component.html',
  styleUrls: ['./page-add-tender.component.scss']
})
export class AddDublicateDialogComponent implements OnInit{
id: number;
id_d: number;
tenders: Post[];
  constructor(@Inject(MAT_DIALOG_DATA) public id_tender: Data,private api: ApiService, public dialog: MatDialog) {}

  ngOnInit() {
    console.log(this.id_tender)
    this.api.getDublicate(this.id_tender.id).subscribe( data =>{
      this.tenders = data;
      },
    error => {
      this.dialog.open(ErrorDialogComponent, {data: "Ошибка" + error});
    })
  }

  dublicate(){
    if(this.id !== 0 && this.id !== null &&
    this.id_d !== 0 && this.id_d !== null)
    this.dialog.open(DublicateDialogComponent, {data:{id: this.id,id_d: this.id_d}})
  }

}
