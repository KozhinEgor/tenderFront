import {Component, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {Post, ReportQuarter, ReportVendorQuarter} from '../classes';
import { ApiService } from '../api.service';
import {any} from 'codelyzer/util/function';
import {FormControl} from "@angular/forms";
import {MatSort} from '@angular/material/sort';
export interface Quarter_count{
  [key: string]: number;
}
export interface Vendor_quarter{
  vendor: string;
  quarter_count: Quarter_count[];
}
@Component({
  selector: 'app-page-report',
  templateUrl: './page-report.component.html',
  styleUrls: ['./page-report.component.scss']
})
export class PageReportComponent implements OnInit {
  constructor(private api: ApiService) { }
  load : boolean;
  reportQuarter: ReportQuarter[] = [];
  dataSource = new MatTableDataSource<ReportQuarter>();
  data = new MatTableDataSource<ReportVendorQuarter>();
  dataS = new MatTableDataSource<ReportVendorQuarter>();
  colums: string[] =[];
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatSort) sorting: MatSort;
  q: Quarter_count[] = null;


  tabs = ['Анализатор спектра', 'Генератор сигнала', 'Генератор импульса', 'Анализатор сигналов','Анализатор цепей', 'Осциллограф'];
  selected = new FormControl(0);
  loadReport(){
    this.reportQuarter = null;
    this.load = true;
    this.data = null;
    this.dataS = null;
    this.colums = [];
    console.log(this.selected.value);
    this.api.getReportQuarter(this.selected.value+1).subscribe(posts => {
      this.dataSource = new MatTableDataSource<ReportQuarter>(posts);

      this.dataSource.sort = this.sort;
      this.reportQuarter = posts;
      this.setColums();
    });
    this.api.getReportVendorQuarter(this.selected.value+1).subscribe(posts => {
      this.data = new MatTableDataSource<ReportVendorQuarter>(posts);


    });
    this.api.getReportNoVendorQuarter(this.selected.value+1).subscribe(posts => {
      this.dataS = new MatTableDataSource<ReportVendorQuarter>(posts);


    });
    this.load = false;
  }

  ngOnInit(): void {
      this.selected.setValue(0);
      this.loadReport();
  }
  setColums(){
    this.colums.push('vendor');
    for(let index = 0;index< this.reportQuarter.length;index++){
      this.colums.push(this.reportQuarter[index].year.toString()+ ' ' + this.reportQuarter[index].quarter.toString());
    }
  }
  getCount(column: string, element: ReportVendorQuarter){
    if(column === 'vendor'){
      return element.vendor
    }
    else if(typeof element.quarter !== "undefined"){
      return element.quarter[column]
    }
    else {
      return 0;
    }
  }

}
