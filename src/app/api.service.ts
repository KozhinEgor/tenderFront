import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import {environment} from "../environments/environment";
import {
  Post,
  Type,
  ReceivedJson,
  Customer,
  Winner,
  ReportQuarter,
  ProductCategory,
  Product,
  Vendor,
  OrdersDB, OrdersReceived, ReportVendorQuarter, TenderonProduct, Country
} from './classes';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
private host = environment.apiUrl;
  constructor(private http: HttpClient) {}

  getPosts() {
    // http://localhost:8081/demo/getAll
    return this.http.get(this.host+'/demo/Tender').pipe(
      map(posts => posts as Post[])
    );
    // tslint:disable-next-line:max-line-length
    // {"id","nameTender","numberTender","bicoTender","gosZakupki" "price","currency","rate","sum","dateStart","dateFinish","fullSum","winSum","typetender","winner","customer"}
  }
  getPostWithParametrs(json: ReceivedJson){
    //const body = {dateStart: '2020-10-01T00:00:00Z', dateFinish: '2020-10-10T12:00:00Z'};
    // {dateStart: '', dateFinish: '', type: '%', custom: '%', winner: '%', minSum: 0, maxSum: 999999999999}
    return this.http.post(this.host+'/demo/Tender', json).pipe(
      map(posts => posts as Post[])
    );
  }
  getFile(json: ReceivedJson){
    return this.http.post(this.host+'/demo/File',json,{responseType: 'blob'}
      );
  }
  deleteTender(tender: number){
    console.log(tender);
    return this.http.get(this.host+'/demo/DeleteTender/'+tender).pipe(
      map(string => string as string)
    );
  }
  getSaveProduct(product: Product,category: number){
    //const body = {dateStart: '2020-10-01T00:00:00Z', dateFinish: '2020-10-10T12:00:00Z'};
    // {dateStart: '', dateFinish: '', type: '%', custom: '%', winner: '%', minSum: 0, maxSum: 999999999999}
    return this.http.post(this.host+'/demo/saveProduct/'+category, product).pipe(
      map(product => product as Product[])
    );
  }
  getAllTypes(){
      return this.http.get(this.host+'/demo/TypeTender').pipe(
        map(types => types as Type[])
      );
    }
  getContry(){
    return this.http.get(this.host+'/demo/Country').pipe(
      map(Contry => Contry as Country[])
    );
  }
  getAllCustom(){
    return this.http.get(this.host+'/demo/Customer').pipe(
      map(customs => customs as Customer[])
    );
  }
  InsertCustomer(customer: Customer){
    return this.http.post(this.host +'/demo/insertCustomer', customer).pipe(
      map(status => status as string)
    );
  }
  getAllWinner(){
    return this.http.get(this.host+'/demo/Winner').pipe(
      map(winners => winners as Winner[])
    );
  }
  InsertWinner(winner: Winner){
    return this.http.post(this.host +'/demo/insertWinner', winner).pipe(
      map(status => status as string)
    );
  }
  getReportQuarter(category: number){
    return this.http.get(this.host+'/demo/quarterTender/'+category).pipe(
      map(reportQuarter => reportQuarter as ReportQuarter[])
    );
  }
  getReportVendorQuarter(category: number){
    return this.http.get(this.host+'/demo/quarterVendor/'+category).pipe(
      map(reportQuarter => reportQuarter as ReportVendorQuarter[])
    );
  }
  getReportNoVendorQuarter(category: number){
    return this.http.get(this.host+'/demo/quarterNoVendor/'+category).pipe(
      map(reportQuarter => reportQuarter as ReportVendorQuarter[])
    );
  }
  addTender(uploadData: any){
    return this.http.post(this.host+'/demo/addTender', uploadData).pipe(
      map(posts => posts as Post[])
    );
  }
  getAllProductCategory(){
    return this.http.get(this.host+'/demo/ProductCategory/').pipe(
      map(productCategories => productCategories as ProductCategory[])
    );
  }
  getVendorCode(productCategory: number){
    return this.http.get(this.host+'/demo/VendorCode/' + productCategory).pipe(
      map(product => product as Product[])
    );
  }
  getVendorCodeById(productCategory: number, id_product: number){
    return this.http.get(this.host+'/demo/VendorCodeById/' + productCategory + '/' + id_product).pipe(
      map(product => product as Product)
    );
  }
  getOrdersByTender(tender: number){
    return this.http.get(this.host+'/demo/OrdersByTender/' + tender).pipe(
      map(order => order as OrdersReceived)
    );
  }
  addOrders(json: OrdersDB[]){
    return this.http.post(this.host+'/demo/addOrders', json).pipe(
      map(status => status as string)
    );
  }
  getCountTenderWithoutOrders(){
    return this.http.get(this.host+'/demo/CountTenderWithoutOrders').pipe(
      map(count => count as number)
    );
  }
  getTenderWithoutOrders(){
    return this.http.get(this.host+'/demo/TenderWithoutOrders').pipe(
      map(posts => posts as Post[]));
  }
  getTendernoDocumentation(){
    return this.http.get(this.host+'/demo/TendernoDocumentation').pipe(
      map(posts => posts as Post[]));
  }
  getVendor(){

    return this.http.get(this.host+'/demo/Vendor/').pipe(
      map(vendors => vendors as Vendor[])
    );
  }
  SaveTender(json: Post){
    console.log(json);
    return this.http.post(this.host+'/demo/saveTender', json).pipe(
      map(status => status as string)
    );
  }
  getFooter(ids: number[]){
    return this.http.post(this.host+'/demo/getFooter', ids).pipe(
      map(status => status as string)
    );
  }
  getTenderOnProduct(tenderProduct: TenderonProduct){
    return this.http.post(this.host+'/demo/TenderOnProduct/',tenderProduct).pipe(
      map(posts => posts as Post[])
    );
  }
}
