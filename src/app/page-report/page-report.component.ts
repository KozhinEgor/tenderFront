import { Component, OnInit } from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {ReportQuarter} from '../classes';
import { ApiService } from '../api.service';
import {any} from 'codelyzer/util/function';

@Component({
  selector: 'app-page-report',
  templateUrl: './page-report.component.html',
  styleUrls: ['./page-report.component.css']
})
export class PageReportComponent implements OnInit {
  constructor(private api: ApiService) { }
  load = true;
  reportQuarter: ReportQuarter[] = [];
  reportdata = [];
  nameQuaterlist = [];
  vendor: string;
  type = 'ColumnChart';
  columnNames = ['Year', 'анализатор сигналов', 'анализатор спектра'];
  options = {
    hAxis: {
      title: 'Year'
    },
    vAxis: {
      minValue: 0
    },
    chartArea: {left: 30, top: 10, width: '70%', height: '80%'}
  };
  width = 600;
  height = 400;
  ngOnInit(): void {
    this.api.getReportQuarter().subscribe(posts => {
      this.parsReport(posts);
      this.reportQuarter = posts;
      this.load = false;
      console.log(this.reportQuarter);
      this.vendor = JSON.stringify(this.reportQuarter[4].vendor);
    });
  }
  getVendor(r: ReportQuarter): string {
    return JSON.stringify(this.reportQuarter[this.reportQuarter.indexOf(r)].vendor);
  }
  parsReport(report: ReportQuarter[]): void{
    for (const index of report){
      const nameQuarter: string = index.year.toString() + ' ' +  index.quarter.toString();
      if (this.nameQuaterlist.indexOf(nameQuarter) >= 0){
        if (index.product === 'анализатор сигналов'){
          this.reportdata[this.nameQuaterlist.indexOf(nameQuarter)][1] = index.count;
        }
        else if (index.product === 'анализатор спектра'){
          this.reportdata[this.nameQuaterlist.indexOf(nameQuarter)][2] = index.count;
        }
      }
      else{
        this.nameQuaterlist.push(nameQuarter);
        if (index.product === 'анализатор сигналов'){
          this.reportdata.push([nameQuarter, index.count, 0]);
        }
        else if (index.product === 'анализатор спектра'){
          this.reportdata.push([nameQuarter, 0, index.count]);
        }
      }
    }
    console.log(this.reportdata);
}
}
