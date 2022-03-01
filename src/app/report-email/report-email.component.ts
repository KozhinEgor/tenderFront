import {Component, OnInit, Pipe, PipeTransform} from '@angular/core';
import {STEPPER_GLOBAL_OPTIONS} from "@angular/cdk/stepper";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {SelectionModel} from "@angular/cdk/collections";
import {Tender, EmailReport} from "../classes";
import {MatTableDataSource} from "@angular/material/table";
import * as moment from "moment";
import {ApiService} from "../api.service";
import {formatCurrency, formatDate, getCurrencySymbol, getLocaleCurrencySymbol} from "@angular/common";
import {animate, state, style, transition, trigger} from "@angular/animations";
import {environment} from "../../environments/environment";
import {DomSanitizer} from "@angular/platform-browser";
import {helper} from "../helper";


@Pipe({
  name: 'safeHtml',
})
export class SafeHtmlPipe implements PipeTransform {
  constructor(private sanitizer:DomSanitizer){}
  transform(html) {
    return this.sanitizer.bypassSecurityTrustHtml(html);
  }
}

@Component({
  selector: 'app-report-email',
  templateUrl: './report-email.component.html',
  styleUrls: ['./report-email.component.css'],

  providers: [
    {
      provide: STEPPER_GLOBAL_OPTIONS,
      useValue: {showError: true},
    },
  ],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class ReportEmailComponent implements OnInit {
  report: string = "";
  tenderSumTable = new MatTableDataSource<EmailReport>();
  tenderNoSumTable = new MatTableDataSource<EmailReport>();
  tenderPovTable = new MatTableDataSource<EmailReport>();
  tenderAdjTable = new MatTableDataSource<EmailReport>();
  tenderSum = new SelectionModel<EmailReport>(true, []);
  tenderNoSum = new SelectionModel<EmailReport>(true, []);
  tenderPov = new SelectionModel<EmailReport>(true, []);
  tenderAdj = new SelectionModel<EmailReport>(true, []);
  tenderSumString:string = "";
  tenderNoSumString:string = "";
  tenderPovString:string = "";
  tenderAdjString:string = "";
  period:EmailReport[];
  periodString = "";
  expandedElement: EmailReport | null;
  range = new FormGroup({
    dateStart: new FormControl(),
    dateFinish: new FormControl()
  });
  constructor(private _formBuilder: FormBuilder, private api:ApiService, private helper:helper) {this.range = this._formBuilder.group({
    dateStart: [new FormControl(), Validators.required],dateFinish: [new FormControl(), Validators.required]
  }); }

  ngOnInit(): void {
  }
  dateRange(){

    if((moment.isMoment(this.range.value.dateStart) && moment.isMoment(this.range.value.dateFinish))&&(this.range.value.dateStart !== null && this.range.value.dateFinish !== null))
      console.log(this.range.value.dateStart);
    console.log(this.range.value.dateFinish);
    this.api.postEmailReport({date_start:this.range.value.dateStart,date_finish:this.range.value.dateFinish,id_step:0}).subscribe(date=>{
        this.period=date;
        this.periodString = "<p><b>Всего за период с "+ formatDate( this.period[0].date_start,'dd.MM.yyyy', "ru-RU") +" по "+formatDate( this.period[0].date_finish,'dd.MM.yyyy', "ru-RU") +"</b> " +
          "было опубликовано <b>"+this.period[0].number+" " + this.helper.returnWord('тендер','','а','ов',this.period[0].number)+ " (из них "+this.period[0].numberWithPrice+" с объявленной начальной ценой)</b> " +
          "на контрольно-измерительное оборудование из конкурентных сегментов рынка " +
          "<b>на общую сумму "+(this.period[0].price/1000000).toFixed(2)+" млн.руб</b></p> <p>Для сравнения:<ul>"
        for(var a = 1;a<=5;a++){
          this.periodString = this.periodString + "<li >за период с "+ formatDate( this.period[a].date_start,'dd.MM.yyyy', "ru-RU") +" по "+formatDate( this.period[a].date_finish,'dd.MM.yyyy', "ru-RU") +" " +
            "было опубликовано <b>"+this.period[a].number+" " + this.helper.returnWord('тендер','','а','ов',this.period[a].number)+ " (из них "+this.period[a].numberWithPrice+" с объявленной начальной ценой)</b> " +
            "на контрольно-измерительное оборудование из конкурентных сегментов рынка " +
            "<b>на общую сумму "+(this.period[a].price/1000000).toFixed(2)+" млн.руб</b></li>"
        }
        this.periodString = this.periodString + "</ul></p>"

      },
        error => {
        console.log("error");
        })

  }
  stepChange(numberStep:number){

    if(numberStep === 0 ){
      this.report= "<p>Коллеги, добрый день </p><p>Ниже – информация о тендерной активности прошедшей недели:</p>"
      this.tenderSumString = "";
      this.tenderNoSumString = "";
      this.tenderPovString = "";
      this.tenderAdjString = "";
      this.periodString = "";
      this.tenderSum = new SelectionModel<EmailReport>(true, []);
      this.tenderNoSum = new SelectionModel<EmailReport>(true, []);
      this.tenderPov = new SelectionModel<EmailReport>(true, []);
      this.tenderAdj = new SelectionModel<EmailReport>(true, []);
    }
    else if(numberStep === 1 && this.tenderSum.selected.length === 0){
      this.api.postEmailReport({date_start:this.range.value.dateStart,date_finish:this.range.value.dateFinish,id_step:1}).subscribe(date=>{
          this.tenderSumTable = new  MatTableDataSource<EmailReport>(date);
          console.log(this.tenderSumTable);
        },
        error => {
          console.log("error");
        })

    }
    else if(numberStep === 2 && this.tenderNoSum.selected.length === 0){
      this.api.postEmailReport({date_start:this.range.value.dateStart,date_finish:this.range.value.dateFinish,id_step:2}).subscribe(date=>{
          this.tenderNoSumTable = new  MatTableDataSource<EmailReport>(date);
          console.log(this.tenderNoSumTable);
        },
        error => {
          console.log("error");
        })

    }
    else if(numberStep === 3 && this.tenderPov.selected.length === 0){
      this.api.postEmailReport({date_start:this.range.value.dateStart,date_finish:this.range.value.dateFinish,id_step:3}).subscribe(date=>{
          this.tenderPovTable = new  MatTableDataSource<EmailReport>(date);
          console.log(this.tenderPovTable);
        },
        error => {
          console.log("error");
        })

    }
    else if(numberStep === 4 && this.tenderAdj.selected.length === 0){
      this.api.postEmailReport({date_start:this.range.value.dateStart,date_finish:this.range.value.dateFinish,id_step:4}).subscribe(date=>{
          this.tenderAdjTable = new  MatTableDataSource<EmailReport>(date);
          console.log(this.tenderAdjTable);
        },
        error => {
          console.log("error");
        })

    }
    else{
      this.api.postEmailReport({date_start:this.range.value.dateStart,date_finish:this.range.value.dateFinish,id_step:5}).subscribe(date=>{

          this.report = "<p>Коллеги, добрый день </p><p>Ниже – информация о тендерной активности прошедшей недели:</p>"+this.periodString+this.tenderSumString +this.tenderNoSumString + this.tenderPovString + this.tenderAdjString+
          "<p>Продолжается публикация планов-графиков на закупки в "+formatDate(this.range.value.dateStart,"yyyy", "ru-RU")+" году. С начала "+formatDate(this.range.value.dateStart,"yyyy", "ru-RU")+" года<b> опубликовано "+date[0].number+" планов-графиков </b>" +
            " от разных заказчиков <b> на общую сумму " +(date[0].price/1000000).toFixed(2)+ " млн.руб..</b> Более подробную информацию можно увидеть в <b>TAS (Tender Analytic System).</b></p>"+
          "<p></p>" +
            "<p>Информацию о деталях тендеров теперь можно получать из <b><a style=\"color:black; text-decoration:none\"href=\""+environment.url+"\">TAS (Tender Analytic System).</a></b>. </p>" +
            "<p><b>Для доступа к системе каждый желающий может прислать мне (на почту/вотсап/телеграм) адрес своей почты</b> - он будет вашим логином. На этот адрес система отправит код активации, пройдя по которому, вы создадите свой пароль, с которым дальше будете входить в систему. Сама система имеет интуитивно понятный интерфейс, так что особых вопросов по работе с ней возникнуть не должно. \n" +
            "</p><p>" +
            "Ваши вопросы, предложения и комментарии по дальнейшему развитию информационного сервиса по тендерам всячески приветствуются!" +
            "</p>" +
            "<p>С наилучшими,</p>" +
            "<p>Алексей Соловьев</p>";

        },
        error => {
          console.log("error");
        })
      console.log("request tender no sum")
    }
  }


  isAllSelectedtenderSum() {
    const numSelected = this.tenderSum.selected.length;
    const numRows = this.tenderSumTable.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggletenderSum() {
    if (this.isAllSelectedtenderSum()) {
      this.tenderSum.clear();
      this.tenderSumString = "";
      return;
    }

    this.tenderSum.select(...this.tenderSumTable.data);
  }

  /** The label for the checkbox on the passed row */
  checkboxLabeltenderSum(row?: EmailReport): string {

    if (!row) {
      return `${this.isAllSelectedtenderSum() ? 'deselect' : 'select'} all`;
    }
    return `${this.tenderSum.isSelected(row) ? 'deselect' : 'select'} row ${this.tenderSumTable.data.indexOf(row)}`;
  }
  generateTenderSumString() {
    this.tenderSumString = "<p>Самые крупные тендеры прошедшей недели:</p><ul>";
    for (var emailReport of this.tenderSum.selected) {

      if(emailReport.number>1){
        this.tenderSumString = this.tenderSumString+"<li>"+emailReport.number+" "+emailReport.type_tender+" <b>"+emailReport.customer+
          " на общую сумму "+formatCurrency(emailReport.price,'ru',getCurrencySymbol(emailReport.currency,"narrow","ru"),"RUB", '1.2-2')+" "+(emailReport.currency == "RUB"?"":"(~"+formatCurrency(emailReport.price,'ru',getCurrencySymbol(emailReport.currency,"narrow","ru"),"RUB", '1.2-2')+" ")+
          "</b><ul>"
        for(var a of emailReport.tenderIn){
          this.tenderSumString = this.tenderSumString+"<li >" +
            a.name_tender.substring(a.name_tender.indexOf('объявляет тендер:') != -1?a.name_tender.indexOf('объявляет тендер:')+17: 0)+
            "<b> Сумма "+formatCurrency(a.price,'ru',getCurrencySymbol(a.currency,"narrow","ru"),"RUB", '1.2-2')+" "+(a.currency == "RUB"?"":"(~"+formatCurrency(a.price,'ru',getCurrencySymbol(a.currency,"narrow","ru"),"RUB", '1.2-2')+" ")+"</b>. заявки до "+formatDate(a.date_finish,'dd.MM.yyyy', "ru-RU")+"</li>"
        }
        this.tenderSumString =this.tenderSumString+"</ul></li>";
      }
      else{
        var a:Tender = emailReport.tenderIn[0];
        this.tenderSumString = this.tenderSumString+"<li> "+a.typetender+" <b>"+a.customer+"</b>: "+a.name_tender.substring(a.name_tender.indexOf('объявляет тендер:') != -1?a.name_tender.indexOf('объявляет тендер:')+17: 0)+". <b>Сумма "+formatCurrency(a.sum,'ru',getCurrencySymbol("RUB","narrow","ru"),"RUB", '1.2-2')+"</b>.," +
          " заявки до "+formatDate(a.date_finish,'dd.MM.yyyy', "ru-RU")+(a.date_tranding!==null?" дата торгов"+formatDate(a.date_tranding,'dd.MM.yyyy', "ru-RU"):"")+"</li>"
      }
    }
    this.tenderSumString = this.tenderSumString+"</ul>"
  }
  isAllSelectedtenderNoSum() {
    const numSelected = this.tenderNoSum.selected.length;
    const numRows = this.tenderNoSumTable.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggletenderNoSum() {
    if (this.isAllSelectedtenderNoSum()) {
      this.tenderNoSum.clear();
      this.tenderNoSumString = "";
      return;
    }

    this.tenderNoSum.select(...this.tenderNoSumTable.data);
  }

  /** The label for the checkbox on the passed row */
  checkboxLabeltenderNoSum(row?: EmailReport): string {

    if (!row) {
      return `${this.isAllSelectedtenderNoSum() ? 'deselect' : 'select'} all`;
    }
    return `${this.tenderNoSum.isSelected(row) ? 'deselect' : 'select'} row ${this.tenderNoSumTable.data.indexOf(row)}`;
  }
  generateTenderNoSumString() {
    this.tenderNoSumString  = "<p>Из конкурсов без объявленной начальной цены, обратили на себя внимание:</p><ul>";
    for (var emailReport of this.tenderNoSum.selected) {

      if(emailReport.number>1){
        this.tenderNoSumString  = this.tenderNoSumString +"<li>"+emailReport.number+" "+emailReport.type_tender+" <b>"+emailReport.customer+
          "</b><ul>"
        for(var a of emailReport.tenderIn){
          this.tenderNoSumString  = this.tenderNoSumString +"<li>"
            +a.name_tender.substring(a.name_tender.indexOf('объявляет тендер:') != -1?a.name_tender.indexOf('объявляет тендер:')+17: 0)+". заявки до "+formatDate(a.date_finish,'dd.MM.yyyy', "ru-RU")+"</li>"
        }
        this.tenderNoSumString  =this.tenderNoSumString +"</ul></li>";
      }
      else{
        var a:Tender = emailReport.tenderIn[0];
        this.tenderNoSumString  = this.tenderNoSumString +"<li> "+a.typetender+" <b>"+a.customer+"</b>: "+a.name_tender.substring(a.name_tender.indexOf('объявляет тендер:') != -1?a.name_tender.indexOf('объявляет тендер:')+17: 0)+"," +
          " заявки до "+formatDate(a.date_finish,'dd.MM.yyyy', "ru-RU")+(a.date_tranding!==null?" дата торгов"+formatDate(a.date_tranding,'dd.MM.yyyy', "ru-RU"):"")+"</li>"
      }
    }
    this.tenderNoSumString  = this.tenderNoSumString +"</ul>";
  }
  isAllSelectedtenderPov() {
    const numSelected = this.tenderPov.selected.length;
    const numRows = this.tenderPovTable.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggletenderPov() {
    if (this.isAllSelectedtenderPov()) {
      this.tenderPov.clear();
      this.tenderPovString = "";
      return;
    }

    this.tenderPov.select(...this.tenderPovTable.data);
  }

  /** The label for the checkbox on the passed row */
  checkboxLabeltenderPov(row?: EmailReport): string {

    if (!row) {
      return `${this.isAllSelectedtenderPov() ? 'deselect' : 'select'} all`;
    }
    return `${this.tenderPov.isSelected(row) ? 'deselect' : 'select'} row ${this.tenderPovTable.data.indexOf(row)}`;
  }
  generateTenderPovString() {
    this.tenderPovString = "<p>Из тендеров на поверку, калибровку и ремонт обратили на себя внимание:</p><ul>";
    for (var emailReport of this.tenderPov.selected) {

      if(emailReport.number>1){
        this.tenderPovString = this.tenderPovString+"<li>"+emailReport.number+" "+emailReport.type_tender+" <b>"+emailReport.customer+
          " на общую сумму "+formatCurrency(emailReport.price,'ru',getCurrencySymbol(emailReport.currency,"narrow","ru"),"RUB", '1.2-2')+" "+(emailReport.currency == "RUB"?"":"(~"+formatCurrency(emailReport.price,'ru',getCurrencySymbol(emailReport.currency,"narrow","ru"),"RUB", '1.2-2')+" ")+
          "</b><ul>"
        for(var a of emailReport.tenderIn){
          this.tenderPovString = this.tenderPovString+"<li>"
            +a.name_tender.substring(a.name_tender.indexOf('объявляет тендер:') != -1?a.name_tender.indexOf('объявляет тендер:')+17: 0)+
            "<b> Сумма "+formatCurrency(a.price,'ru',getCurrencySymbol(a.currency,"narrow","ru"),"RUB", '1.2-2')+" "+(a.currency == "RUB"?"":"(~"+formatCurrency(a.price,'ru',getCurrencySymbol(a.currency,"narrow","ru"),"RUB", '1.2-2')+" ")+"</b>. заявки до "+formatDate(a.date_finish,'dd.MM.yyyy', "ru-RU")+"</li>"
        }
        this.tenderPovString =this.tenderPovString+"</ul></li>";
      }
      else{
        var a:Tender = emailReport.tenderIn[0];
        this.tenderPovString = this.tenderPovString+"<li> "+a.typetender+" <b>"+a.customer+"</b>: "+a.name_tender.substring(a.name_tender.indexOf('объявляет тендер:') != -1?a.name_tender.indexOf('объявляет тендер:')+17: 0)+". <b>Сумма "+formatCurrency(a.sum,'ru',getCurrencySymbol("RUB","narrow","ru"),"RUB", '1.2-2')+"</b>.," +
          " заявки до "+formatDate(a.date_finish,'dd.MM.yyyy', "ru-RU")+(a.date_tranding!==null?" дата торгов"+formatDate(a.date_tranding,'dd.MM.yyyy', "ru-RU"):"")+"</li>"
      }
    }
    this.tenderPovString = this.tenderPovString+"</ul>";
  }
  isAllSelectedtenderAdj() {
    const numSelected = this.tenderAdj.selected.length;
    const numRows = this.tenderAdjTable.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggletenderAdj() {
    if (this.isAllSelectedtenderAdj()) {
      this.tenderAdj.clear();
      this.tenderAdjString = "";
      return;
    }

    this.tenderAdj.select(...this.tenderAdjTable.data);
  }

  /** The label for the checkbox on the passed row */
  checkboxLabeltenderAdj(row?: EmailReport): string {

    if (!row) {
      return `${this.isAllSelectedtenderAdj() ? 'deselect' : 'select'} all`;
    }
    return `${this.tenderAdj.isSelected(row) ? 'deselect' : 'select'} row ${this.tenderAdjTable.data.indexOf(row)}`;
  }
  generateTenderAdjString() {
    this.tenderAdjString = "<p>Из опубликованных тендеров на продукцию из смежных отраслей, информация о которых может служить информационным поводом как для общения с отмеченными заказчиками, так и для лучшего понимания рыночной обстановки, привлекли внимание: </p><ul>";
    for (var emailReport of this.tenderAdj.selected) {

      if(emailReport.number>1){
        this.tenderAdjString = this.tenderAdjString+"<p>"+emailReport.number+" "+emailReport.type_tender+" <b>"+emailReport.customer+
          " на общую сумму "+formatCurrency(emailReport.price,'ru',getCurrencySymbol(emailReport.currency,"narrow","ru"),"RUB", '1.2-2')+" "+(emailReport.currency == "RUB"?"":"(~"+formatCurrency(emailReport.price,'ru',getCurrencySymbol(emailReport.currency,"narrow","ru"),"RUB", '1.2-2')+" ")+
          "</b><ul>"
        for(var a of emailReport.tenderIn){
          this.tenderAdjString = this.tenderAdjString+"<li>"
            +a.name_tender.substring(a.name_tender.indexOf('объявляет тендер:') != -1?a.name_tender.indexOf('объявляет тендер:')+17: 0)+
            "<b> Сумма "+formatCurrency(a.price,'ru',getCurrencySymbol(a.currency,"narrow","ru"),"RUB", '1.2-2')+" "+(a.currency == "RUB"?"":"(~"+formatCurrency(a.price,'ru',getCurrencySymbol(a.currency,"narrow","ru"),"RUB", '1.2-2')+" ")+"</b>. заявки до "+formatDate(a.date_finish,'dd.MM.yyyy', "ru-RU")+"</li>"
        }
        this.tenderAdjString =this.tenderAdjString+"</ul></li>";
      }
      else{
        var a:Tender = emailReport.tenderIn[0];
        this.tenderAdjString = this.tenderAdjString+"<li> "+a.typetender+" <b>"+a.customer+"</b>: "+a.name_tender.substring(a.name_tender.indexOf('объявляет тендер:') != -1?a.name_tender.indexOf('объявляет тендер:')+17: 0)+". <b>Сумма "+formatCurrency(a.sum,'ru',getCurrencySymbol("RUB","narrow","ru"),"RUB", '1.2-2')+"</b>.," +
          " заявки до "+formatDate(a.date_finish,'dd.MM.yyyy', "ru-RU")+(a.date_tranding!==null?" дата торгов"+formatDate(a.date_tranding,'dd.MM.yyyy', "ru-RU"):"")+"</li>"
      }
    }
    this.tenderAdjString = this.tenderAdjString+"</ul>";
  }
}
