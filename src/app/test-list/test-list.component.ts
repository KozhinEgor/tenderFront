import {Component, OnInit, ViewChild} from '@angular/core';
import {ApiService} from "../api.service";
import {Chart, ChartComponent, DefaultDataPoint} from "chart.js";
import { GoogleChartComponent } from 'angular-google-charts';
export  interface dddd{
  name: string;
  value: number;
}

@Component({
  selector: 'app-test-list',
  templateUrl: './test-list.component.html',
  styleUrls: ['./test-list.component.css']
})

export class TestListComponent implements OnInit {


  constructor(private api: ApiService) {
  }
  title = 'Browser market shares at a specific website, 2014';
  type = 'ColumnChart';
  data = [
    ['Firefox', 45.0,58],
    ['IE', 26.8,78],
    ['Chrome', 12.8,52],
    ['Safari', 8.5,69],
    ['Opera', 6.2,87],
    ['Others', 0.7,78]
  ];
  columnNames = ['Browser', 'Percentage','asd'];
  options = {
  };
  width = 550;
  height = 400;


  ngOnInit(): void {
    // this.api.test().subscribe(data => {
    //   this.data = data;
    // });
    // this.width = document.getElementById('ss').offsetWidth;
    // this.height = document.getElementById('ss').offsetHeight;
    }


}
//PieChart,ColumnChart,Histogram,BarChart,Table
