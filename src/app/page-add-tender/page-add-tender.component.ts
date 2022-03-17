import {Component, Inject, OnInit, ViewChild} from '@angular/core';
import {SearchParameters, Tender} from '../classes';

import {ApiService} from '../api.service';

import {MAT_DIALOG_DATA, MatDialog} from "@angular/material/dialog";
import {ErrorDialogComponent} from "../error-dialog/error-dialog.component";
import {MatChipInputEvent} from "@angular/material/chips";
import {COMMA, ENTER, SPACE} from "@angular/cdk/keycodes";
import {TenderDialogComponent, TenderTableComponent} from "../tender-table/tender-table.component";
import {fakeAsync} from "@angular/core/testing";
import {DublicateDialogComponent} from "../dublicate-dialog/dublicate-dialog.component";
import {MatTableDataSource} from "@angular/material/table";

@Component({
  selector: 'app-page-add-tender',
  templateUrl: './page-add-tender.component.html',
  styleUrls: ['./page-add-tender.component.scss'],
})
export class PageAddTenderComponent implements OnInit {
  @ViewChild(TenderTableComponent)
  private tenderTableComponent: TenderTableComponent;

   tenders:[Tender[]];
  load: boolean = false;
  arrayBuffer: any;
  upload_button = false;
  file: File;
  displayedColumnsAll: string[] = ['id','nameTender','customer','typetender','sum','dateStart','dateFinish','product'];
  displayedColumns: string[] =[];
  adjacent_tender: boolean = false;
  plan_schedule:boolean = false;

  searchParameters:SearchParameters = {
    id: null,
    nickname: null,
    name: null,
    ids_string: null,
    dateStart: null,
    dateFinish: null,
    dublicate: null,
    quarter: null,
    typeExclude:null,
    type: null,
    customExclude: null,
    custom: null,
    innCustomer: null,
    innString : null,
    country: null,
    winnerExclude: null,
    winner: null,
    minSum: null,
    maxSum: null,
    ids: null,
    bicotender: null,
    bicotender_string: null,
    numberShow: null,
    product: null,
    districts: null,
    regions: null,
    plan_schedule: this.plan_schedule,
    adjacent_tender: this.adjacent_tender,
    realized: null,
    private_search: null
  };

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
            // this.tenderTableComponent.dataSource.data = posts ;

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

  dublicate(tender_d:Tender, tender:Tender){
    this.dialog.open(DublicateDialogComponent, {data:{id: tender.id,id_d: tender_d.id}}).afterClosed().subscribe(rezult => {
      this.api.getTenderById(tender.id).subscribe(data =>
      {tender.price = data.price;
        tender.product = data.product;
        tender.win_sum = data.win_sum;
        tender.full_sum = data.full_sum;
        tender.sum = data.sum;
        tender.currency = data.currency;
        tender.rate = data.rate;
        tender.customer = data.customer;
        tender.name_tender = data.name_tender;
        tender.dublicate = data.dublicate;
        tender.typetender = data.typetender;
        tender.inn = data.inn;
        tender.winner = data.winner;
        tender.date_tranding = data.date_tranding;
        tender.gos_zakupki = data.gos_zakupki;
        tender.bico_tender = data.bico_tender;
        tender.number_tender = data.number_tender;
        tender.id = data.id;
        tender.country = data.country;
        tender.date_finish = data.date_finish;
        tender.date_start = data.date_start;
      });
      this.api.getTenderById(tender_d.id).subscribe(data =>
      {tender_d.price = data.price;
        tender_d.product = data.product;
        tender_d.win_sum = data.win_sum;
        tender_d.full_sum = data.full_sum;
        tender_d.sum = data.sum;
        tender_d.currency = data.currency;
        tender_d.rate = data.rate;
        tender_d.customer = data.customer;
        tender_d.name_tender = data.name_tender;
        tender_d.dublicate = data.dublicate;
        tender_d.typetender = data.typetender;
        tender_d.inn = data.inn;
        tender_d.winner = data.winner;
        tender_d.date_tranding = data.date_tranding;
        tender_d.gos_zakupki = data.gos_zakupki;
        tender_d.bico_tender = data.bico_tender;
        tender_d.number_tender = data.number_tender;
        tender_d.id = data.id;
        tender_d.country = data.country;
        tender_d.date_finish = data.date_finish;
        tender_d.date_start = data.date_start;
      });
    })
  }
  getdublicate(tender:Tender){
    this.dialog.open(AddDublicateDialogComponent, {height: '90%',data:{id: tender.id, id_d:null}}).afterClosed().subscribe(rezult => {
      this.api.getTenderById(tender.id).subscribe(data => {
        tender.price = data.price;
        tender.product = data.product;
        tender.win_sum = data.win_sum;
        tender.full_sum = data.full_sum;
        tender.sum = data.sum;
        tender.currency = data.currency;
        tender.rate = data.rate;
        tender.customer = data.customer;
        tender.name_tender = data.name_tender;
        tender.dublicate = data.dublicate;
        tender.typetender = data.typetender;
        tender.inn = data.inn;
        tender.winner = data.winner;
        tender.date_tranding = data.date_tranding;
        tender.gos_zakupki = data.gos_zakupki;
        tender.bico_tender = data.bico_tender;
        tender.number_tender = data.number_tender;
        tender.id = data.id;
        tender.country = data.country;
        tender.date_finish = data.date_finish;
        tender.date_start = data.date_start;
      });
  });
  }
  showTender(tender:Tender, plan: boolean) {

    this.dialog.open(TenderDialogComponent, {
      width: '80%',
      height: '90%',
      data: {adjacent_tender: false, id_tender: (tender.id), plan:plan}
    }).afterClosed().subscribe(result => {
      tender.price = result.price;
      tender.product = result.product;
      tender.win_sum = result.win_sum;
      tender.full_sum = result.full_sum;
      tender.sum = result.sum;
      tender.currency = result.currency;
      tender.rate = result.rate;
      tender.customer = result.customer;
      tender.name_tender = result.name_tender;
      tender.dublicate = result.dublicate;
      tender.typetender = result.typetender;
      tender.inn = result.inn;
      tender.winner = result.winner;
      tender.date_tranding = result.date_tranding;
      tender.gos_zakupki = result.gos_zakupki;
      tender.bico_tender = result.bico_tender;
      tender.number_tender = result.number_tender;
      tender.id = result.id;
      tender.country = result.country;
      tender.date_finish = result.date_finish;
      tender.date_start = result.date_start;
    });
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
          // this.tenderTableComponent.dataSource.data = posts ;
          this.dialog.open(ErrorDialogComponent, { data: 'Найдено 0 тендеров'});
        }
        else{
          this.number_bicoAdjacent = [];
          localStorage.setItem('number_bicoAdjacent', '');
          this.tenderTableComponent.dataSource.data = posts ;
          this.searchParameters.adjacent_tender = true;
          this.searchParameters.plan_schedule = false;
          this.tenderTableComponent.dataSource.paginator = this.tenderTableComponent.paginator;
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
          // this.tenderTableComponent.dataSource.data = posts ;
          this.dialog.open(ErrorDialogComponent, { data: 'Найдено 0 тендеров'});
        }
        else{
          this.number_bicoPlan;
          localStorage.setItem('number_bicoPlan', '');
          this.tenderTableComponent.dataSource.data = posts ;
          this.searchParameters.adjacent_tender = false;
          this.searchParameters.plan_schedule = true;
          this.tenderTableComponent.dataSource.paginator = this.tenderTableComponent.paginator;
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
tenders: Tender[];
  constructor(@Inject(MAT_DIALOG_DATA) public id_tender: Data,private api: ApiService, public dialog: MatDialog) {}

  ngOnInit() {
    this.api.getDublicate(this.id_tender.id).subscribe( data =>{
      this.tenders = data;
      },
    error => {
      this.dialog.open(ErrorDialogComponent, {data: "Ошибка" + error});
    })
  }
  showTender(tender:Tender) {

    this.dialog.open(TenderDialogComponent, {
      width: '80%',
      height: '90%',
      data: {adjacent_tender: false, id_tender: (tender.id), plan:false}
    }).afterClosed().subscribe(result => {
      tender.price = result.price;
      tender.product = result.product;
      tender.win_sum = result.win_sum;
      tender.full_sum = result.full_sum;
      tender.sum = result.sum;
      tender.currency = result.currency;
      tender.rate = result.rate;
      tender.customer = result.customer;
      tender.name_tender = result.name_tender;
      tender.dublicate = result.dublicate;
      tender.typetender = result.typetender;
      tender.inn = result.inn;
      tender.winner = result.winner;
      tender.date_tranding = result.date_tranding;
      tender.gos_zakupki = result.gos_zakupki;
      tender.bico_tender = result.bico_tender;
      tender.number_tender = result.number_tender;
      tender.id = result.id;
      tender.country = result.country;
      tender.date_finish = result.date_finish;
      tender.date_start = result.date_start;
    });
  }
  dublicate(){
    if(this.id !== 0 && this.id !== null &&
    this.id_d !== 0 && this.id_d !== null)
    this.dialog.open(DublicateDialogComponent, {data:{id: this.id,id_d: this.id_d}})
  }

}
