import {Component, EventEmitter, HostListener, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import { Comment, Tender, User} from '../classes';
import {AuthenticationService} from "../service/authentication.service";
import {MatTableDataSource} from "@angular/material/table";
import {ErrorDialogComponent} from "../error-dialog/error-dialog.component";
import {ApiService} from "../api.service";
import {MatDialog} from "@angular/material/dialog";
import {TenderDialogComponent} from "../tender-table/tender-table.component";
import {FormControl} from "@angular/forms";

export interface Chart{
  name_ru:string;
  name_en:string;
}

@Component({
  selector: 'app-page-home',
  templateUrl: './page-home.component.html',
  styleUrls: ['./page-home.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class PageHomeComponent implements OnInit {
  user:User;
  dataSource = new MatTableDataSource<Tender>();
  comments: Comment[];
  UserColor = new Map();
  color: string[] = ['#FFCC33', '#FF9933', '#FF6600', '#FF3300', '#FF6666', '#CC3333', '#FF0066', '#FF0099', '#FF33CC', '#FF66FF', '#CC66CC', '#CC00FF', '#9933FF', '#9966FF', '#9999FF', '#6666FF', '#3300FF', '#3366FF', '#0066FF',
    '#3399FF', '#33CCFF', '#66CCCC', '#66FFFF', '#33FFCC', '#00CC99', '#00FF99', '#33FF66', '#66CC66', '#00FF00', '#33FF00', '#66CC00', '#99CC66', '#CCFF33', '#CCCC33', '#CCCCCC'];
  type_keysight_number: string  = 'PieChart';
  data_keysight_number:[] = [];
  columnNames_keysight_number =  [] ;
  options_keysight_number={};
  width_keysight_number:number;
  height_keysight_number:number;
  type_category_number: string = 'PieChart';
  data_category_number:[] = [];
  columnNames_category_number =  [] ;
  options_category_number={};
  width_category_number:number;
  height_category_number:number;
  typeChart = [{name_en:'PieChart',name_ru:'Круговая диаграмма'},{name_en:'ColumnChart' ,name_ru:'Гистограмма'},{name_en:'BarChart' ,name_ru:'Линейная'},{name_en:'Table' ,name_ru: 'таблица'}];
  typeChartTop = new FormControl();
  typeChartBottom = new FormControl();
  periodTop: string = 'Неделя';
  periodBottom: string = 'Неделя';

  constructor( private authenticationService: AuthenticationService,private api: ApiService, public dialog: MatDialog) {
    this.user = this.authenticationService.userValue;
  }
  ngOnInit(): void {
    this.typeChartTop.setValue(this.typeChart[0]);
    this.typeChartBottom.setValue(this.typeChart[0]);
    try {
      this.api.getTenderWithoutOrdersForHome().subscribe(posts => {
          this.dataSource = new MatTableDataSource<Tender>(posts) ;


        },
        err => {
          this.dialog.open(ErrorDialogComponent, { data: "Ошибка " + err});
        });
    }
    catch (e) {
      this.dialog.open(ErrorDialogComponent, {data: "Ошибка " + e.message});
    }
    this.api.getCommentsForUser(this.user.id).subscribe(comment => {
        this.comments = comment;
        this.setcolor();
      },
      error => {
        this.dialog.open(ErrorDialogComponent, {data: "Ошибка  " + error})
      }
    )
    this.getTopDiagramm();
    this.getBottomDiagramm();
  }
  setcolor() {
    for (var a of this.comments) {
      if (!this.UserColor.has(a.usr)) {
        this.UserColor.set(a.usr, this.color[Math.floor(Math.random() * this.color.length)]);
      }
    }
  }

  showTender(id:number) {
    this.dialog.open(TenderDialogComponent, {
      width: '80%',
      height: '90%',
      data: {adjacent_tender: false, id_tender: id, plan:false}
    }).afterClosed().subscribe(result => {

    });
  }

  changeTop(){
    this.type_keysight_number = this.typeChartTop.value.name_en;
  }
  changeBottom(){
    this.type_category_number = this.typeChartBottom.value.name_en;
  }
getTopDiagramm(){
  this.api.getTopDiagrammHome(this.periodTop).subscribe(data => {

      this.data_keysight_number = data;

      this.columnNames_keysight_number = ['Период','Количетсво'];
      this.width_keysight_number = document.getElementById("keysight_number").offsetWidth - 5;
      this.height_keysight_number = document.getElementById("keysight_number").offsetHeight - 5;
    },
    error => {
      this.dialog.open(ErrorDialogComponent, {data: "Ошибка  " + error})
    })
}
  getBottomDiagramm(){
  this.api.getBottomDiagrammHome(this.periodBottom).subscribe(data => {

  this.data_category_number = data;

  this.columnNames_category_number = ['Период','Количетсво'];
  this.width_category_number = document.getElementById("category_number").offsetWidth - 5;
  this.height_category_number = document.getElementById("category_number").offsetHeight - 5;
},
error => {
  this.dialog.open(ErrorDialogComponent, {data: "Ошибка  " + error})
})
}
@HostListener('window:resize',['$event'])
  onResize(event: any){
  this.width_keysight_number = document.getElementById("keysight_number").offsetWidth - 5;
  this.height_keysight_number = document.getElementById("keysight_number").offsetHeight - 5;
  this.width_category_number = document.getElementById("category_number").offsetWidth - 5;
  this.height_category_number = document.getElementById("category_number").offsetHeight - 5;
}
}
