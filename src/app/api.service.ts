import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import {
  Post,
  Type,
  ReceivedJson,
  Custom,
  Winner,
  ReportQuarter,
  ProductCategory,
  Product,
  Vendor,
  OrdersDB, OrdersReceived
} from './classes';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient) {}

  getPosts() {
    // http://localhost:8081/demo/getAll
    return this.http.get('http://localhost:8082/demo/Tender').pipe(
      map(posts => posts as Post[])
    );
    // tslint:disable-next-line:max-line-length
    // {"id","nameTender","numberTender","bicoTender","gosZakupki" "price","currency","rate","sum","dateStart","dateFinish","fullSum","winSum","typetender","winner","customer"}
  }
  getPostWithParametrs(json: ReceivedJson){
    //const body = {dateStart: '2020-10-01T00:00:00Z', dateFinish: '2020-10-10T12:00:00Z'};
    // {dateStart: '', dateFinish: '', type: '%', custom: '%', winner: '%', minSum: 0, maxSum: 999999999999}
    return this.http.post('http://localhost:8082/demo/Tender', json).pipe(
      map(posts => posts as Post[])
    );
  }
  getAllTypes(){
      return this.http.get('http://localhost:8082/demo/TypeTender').pipe(
        map(types => types as Type[])
      );
    }
  getAllCustom(){
    return this.http.get('http://localhost:8082/demo/Customer').pipe(
      map(customs => customs as Custom[])
    );
  }
  getAllWinner(){
    return this.http.get('http://localhost:8082/demo/Winner').pipe(
      map(winners => winners as Winner[])
    );
  }
  getReportQuarter(){
    return this.http.get('http://localhost:8081/demo/quarter').pipe(
      map(reportQuarter => reportQuarter as ReportQuarter[])
    );
  }
  addTender(uploadData: any){
    return this.http.post('http://localhost:8082/demo/addTender', uploadData).pipe(
      map(posts => posts as Post[])
    );
  }
  getAllProductCategory(){
    return this.http.get('http://localhost:8082/demo/ProductCategory/').pipe(
      map(productCategories => productCategories as ProductCategory[])
    );
  }
  getVendorCode(productCategory: number){
    return this.http.get('http://localhost:8082/demo/VendorCode/' + productCategory).pipe(
      map(product => product as Product[])
    );
  }
  getVendorCodeById(productCategory: number, id_product: number){
    return this.http.get('http://localhost:8082/demo/VendorCodeById/' + productCategory + '/' + id_product).pipe(
      map(product => product as Product)
    );
  }
  getOrdersByTender(tender: number){
    return this.http.get('http://localhost:8082/demo/OrdersByTender/' + tender).pipe(
      map(order => order as OrdersReceived)
    );
  }
  addOrders(json: OrdersDB[]){
    console.log(json);
    return this.http.post('http://localhost:8082/demo/addOrders', json).pipe(
      map(status => status as string)
    );
  }
  getVendorName(){
    return this.http.get('http://localhost:8082/demo/Vendor/').pipe(
      map(vendors => vendors as Vendor[])
    );
  }
}
