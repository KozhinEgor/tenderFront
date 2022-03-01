import {Component, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {SearchParameters, Tender} from "../classes";
import {ErrorDialogComponent} from "../error-dialog/error-dialog.component";
import {ApiService} from "../api.service";
import {MatDialog} from "@angular/material/dialog";
import {TenderTableComponent} from "../tender-table/tender-table.component";

@Component({
  selector: 'app-page-tender-without-orders',
  templateUrl: './page-tender-without-orders.component.html',
  styleUrls: ['./page-tender-without-orders.component.scss']
})
export class PageTenderWithoutOrdersComponent implements OnInit {
  @ViewChild(TenderTableComponent)
  private tenderTableComponent: TenderTableComponent;

  displayedColumns: string[] = ['id','nameTender','customer','typetender','sum','dateStart','dateFinish','product'];

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
    plan_schedule: false,
    adjacent_tender: false,
    realized: null,
    private_search: null
  };


  constructor(private api: ApiService, public dialog: MatDialog) {
  }

  ngOnInit(): void {
    try {
      this.api.getTenderWithoutOrders().subscribe(posts => {
         this.tenderTableComponent.dataSource.data = posts ;
          this.searchParameters.adjacent_tender = false;
          this.searchParameters.plan_schedule = false;
          this.tenderTableComponent.dataSource.paginator = this.tenderTableComponent.paginator;

        },
        err => {
          this.dialog.open(ErrorDialogComponent, { data: "Ошибка " + err});
        });
    }
    catch (e) {
      this.dialog.open(ErrorDialogComponent, {data: "Ошибка " + e.message});
    }
  }
  noDocumentation(){
    try {
      this.api.getTendernoDocumentation().subscribe(posts => {
          this.tenderTableComponent.dataSource.data = posts ;


        },
        err => {
          this.dialog.open(ErrorDialogComponent, { data:"Ошибка " + err});
        });
    }
    catch (e) {
      this.dialog.open(ErrorDialogComponent, {data: "Ошибка " + e.message});
    }
  }
}
