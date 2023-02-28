import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {Orders, OrdersDB, Tender, TenderWithProduct} from "../classes";
import {FormControl, Validators} from "@angular/forms";
import {ApiService} from "../api.service";

export interface NewOrder{
  order: Orders;
  number: number;
}
export interface TenderAndOrders{
  tender: Tender;
  orders: Orders[];
}
@Component({
  selector: 'app-divde-tender',
  templateUrl: './divde-tender.component.html',
  styleUrls: ['./divde-tender.component.css']
})
export class DivdeTenderComponent implements OnInit {

  disabledSave = true;
  step: number = 0;
  newNumberTender: any = new FormControl();
  newOrders: NewOrder[] = [];
  tenders: Tender[] = [];
  load: boolean = false;

  constructor(@Inject(MAT_DIALOG_DATA) public data: TenderWithProduct, public api: ApiService,
              private dialogRef: MatDialogRef<DivdeTenderComponent>) {

    this.newNumberTender = new FormControl('', [Validators.max(data.orders.length), Validators.min(2)]);
  }

  ngOnInit(): void {
  }
  next(){
    switch (this.step) {
      case 1:
        this.step++;
        this.load = true;
        for ( let i = 0; i < this.newNumberTender.value ; i++){
          this.api.getOrdersString(this.newOrders.filter(a => a.number === (i + 1)).map(({order}) => order)).subscribe(
            product => {
              this.tenders.push({
                id: this.data.tender.id,
                name_tender: this.data.tender.name_tender,
                number_tender: this.data.tender.number_tender,
                bico_tender: this.data.tender.bico_tender,
                gos_zakupki: this.data.tender.gos_zakupki,
                price: this.data.tender.price,
                currency: this.data.tender.currency,
                rate: this.data.tender.rate,
                date_start: this.data.tender.date_start,
                sum: this.data.tender.sum,
                date_finish: this.data.tender.date_finish,
                date_tranding: this.data.tender.date_tranding,
                full_sum: this.data.tender.full_sum,
                win_sum: this.data.tender.win_sum,
                typetender: this.data.tender.typetender,
                winner: this.data.tender.winner,
                customer: this.data.tender.customer,
                inn: this.data.tender.inn,
                product: product.name,
                dublicate: this.data.tender.dublicate,
                country: this.data.tender.country,
                winner_inn: this.data.tender.winner_inn,
                winner_country: this.data.tender.winner_country,
                plan: this.data.tender.plan,
                tender_plan: this.data.tender.tender_plan,
                tender_dublicate: this.data.tender.tender_dublicate
              });
            }
          );

        }
        this.load = false;
        break;
      case 0:
        if( this.newNumberTender.value <= this.data.orders.length && this.newNumberTender.value > 1){
          this.step++;
          for ( const ord of this.data.orders){
            this.newOrders.push({order: ord, number: 1});
          }
        }
        break;
      case 2:
        break;
    }
  }
  back(){
    switch (this.step) {
      case 1:
        this.step--;
        this.newOrders = [];
        this.newNumberTender.setValue(2);
        break;
      case 2:
        this.step--;
        this.tenders = [];
        break;
    }
  }
  save(){
    this.load = true;
    let data: TenderAndOrders[] = [];
    for (const tender of this.tenders){
      data.push({tender, orders: this.newOrders.filter(a => a.number === (this.tenders.indexOf(tender) + 1 )).map(({order}) => (order))});
    }
    this.api.divedTender(data).subscribe( next => {
      if (next.name === 'ok')
        this.dialogRef.close(null);
    },
      error => {
        this.load = false;
      });
  }
}
