import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import {environment} from "../environments/environment";
import {
  Post,
  Type,
  ReceivedJson,
  Company,
  ReportQuarter,
  ProductCategory,
  Product,
  Vendor,
  OrdersDB,
  OrdersReceived,
  ReportVendorQuarter,
  TenderonProduct,
  Country,
  User,
  CreateTable,
  StringAnswer,
  ChangeCategory, ChangeCompany
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
  getAdjacentTenderWithParametrs(json: ReceivedJson){
    //const body = {dateStart: '2020-10-01T00:00:00Z', dateFinish: '2020-10-10T12:00:00Z'};
    // {dateStart: '', dateFinish: '', type: '%', custom: '%', winner: '%', minSum: 0, maxSum: 999999999999}
    return this.http.post(this.host+'/demo/AdjacentTender', json).pipe(
      map(posts => posts as Post[])
    );
  }
  getTenderById(id:number){
    return this.http.get(this.host + '/demo/TenderByID/'+id).pipe(
      map(data =>data as Post)
    )
  }
  getAdjacentTenderById(id:number){
    return this.http.get(this.host + '/demo/AdjacentTenderByID/'+id).pipe(
      map(data =>data as Post)
    )
  }

  getFile(json: ReceivedJson){
    return this.http.post(this.host+'/demo/File',json,{responseType: 'blob'}
      );
  }
  getProductFile(id:number){
    return this.http.get(this.host+'/demo/ProductFile/' + id,{responseType: 'blob'}
    );
  }
  deleteTender(tender: number){
    return this.http.get(this.host+'/demo/DeleteTender/'+tender).pipe(
      map(string => string as StringAnswer)
    );
  }
  deleteAdjacentTender(tender: number){

    return this.http.get(this.host+'/demo/DeleteAdjacentTender/'+tender).pipe(
      map(string => string as StringAnswer)
    );
  }

  getSaveProduct(product: Product,category: number){
    //const body = {dateStart: '2020-10-01T00:00:00Z', dateFinish: '2020-10-10T12:00:00Z'};
    // {dateStart: '', dateFinish: '', type: '%', custom: '%', winner: '%', minSum: 0, maxSum: 999999999999}
    return this.http.post(this.host+'/demo/saveProduct/'+category, product).pipe(
      map(product => product as Product[])
    );
  }
  getUsers(){
    return this.http.get(this.host+'/demo/AllUsers').pipe(
      map(user => user as User[])
    );
  }
  createUser(user: User){

    console.log(user);
     return this.http.post(this.host+'/registration', user).pipe(
      map(string => console.log(string))
    );
  }
  setPasswordUser(user: any){
    return this.http.post(this.host+'/setPassword', user);
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
      map(customs => customs as Company[])
    );
  }
  getAllCustomNoUses(){
    return this.http.get(this.host+'/demo/CustomerNoUses').pipe(
      map(customs => customs as Company[])
    );
  }
  DeleteCustomerNoUses(){
    return this.http.get(this.host+'/demo/DeleteCustomerNoUses').pipe(
      map(customs => customs as Company[])
    );
  }
  InsertCustomer(customer: Company){
    return this.http.post(this.host +'/demo/insertCustomer', customer).pipe(
      map(status => status as string)
    );
  }
  ChangeCustomer(json: ChangeCompany){
    return this.http.post(this.host +'/demo/ChangeCustomer', json).pipe(
      map(status => status as StringAnswer)
    );
  }
  CustomerFile(){
    return this.http.get(this.host+'/demo/CustomerFile',{responseType: 'blob'}
    );
  }
  getAllWinner(){
    return this.http.get(this.host+'/demo/Winner').pipe(
      map(winners => winners as Company[])
    );
  }
  getAllWinnerNoUses() {
    return this.http.get(this.host + '/demo/WinnerNoUses').pipe(
      map(winners => winners as Company[])
    );
  }
    InsertWinner(winner: Company){
    return this.http.post(this.host +'/demo/insertWinner', winner).pipe(
      map(status => status as string)
    );
  }
  DeleteWinnerNoUses(){
    return this.http.get(this.host + '/demo/DeleteWinnerNoUses').pipe(
      map(winners => winners as Company[])
    );
  }
  ChangeWinner(json:ChangeCompany){
    return this.http.post(this.host +'/demo/ChangeWinner', json).pipe(
      map(status => status as StringAnswer)
    );
  }
  WinnerFile(){
    return this.http.get(this.host+'/demo/WinnerFile',{responseType: 'blob'}
    );
  }
  getReportQuarter(category: number, json:ReceivedJson){
    return this.http.post(this.host+'/demo/quarterTender/'+category,json).pipe(
      map(reportQuarter => reportQuarter as ReportQuarter[])
    );
  }
  getReportVendorQuarter(category: number, json:ReceivedJson){
    return this.http.post(this.host+'/demo/quarterVendor/'+category,json).pipe(
      map(reportQuarter => reportQuarter as ReportVendorQuarter[])
    );
  }
  getReportNoVendorQuarter(category: number, json:ReceivedJson){
    return this.http.post(this.host+'/demo/quarterNoVendor/'+category,json).pipe(
      map(reportQuarter => reportQuarter as ReportVendorQuarter[])
    );
  }
  fileQuarter(json:ReceivedJson){
    return this.http.post(this.host+'/demo/FileReport',json, {responseType: 'blob'})
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
  getVendorCodeNoUses(productCategory: number){
    return this.http.get(this.host+'/demo/VendorCodeNoUses/' + productCategory).pipe(
      map(product => product as Product[])
    );
  }
  DeleteCodeNoUses(productCategory: number){
    return this.http.get(this.host+'/demo/DeleteVendorCodeNoUses/' + productCategory).pipe(
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
      map(data => data as StringAnswer)
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
  getVendor(category:number){

    return this.http.get(this.host+'/demo/Vendor/'+category).pipe(
      map(vendors => vendors as Vendor[])
    );
  }
  SaveTender(json: Post){

    return this.http.post(this.host+'/demo/saveTender', json).pipe(map(data =>data as Post))
  }
  SaveAdjacentTender(json: Post){

    return this.http.post(this.host+'/demo/saveAdjacentTender', json).pipe(map(data =>data as Post))
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
  CreateTable(createTable:CreateTable){

    return this.http.post(this.host+'/demo/CreateTable',createTable).pipe(
      map(data => data as StringAnswer)
    )
  }
  ChangeCategory(json:ChangeCategory){
    return this.http.post(this.host+'/demo/ChangeCategory',json).pipe(
      map(data => data as StringAnswer)
    )
  }
  loadTender(json:number[]){
    return this.http.post(this.host+'/demo/loadTender', json).pipe(
      map(posts => posts as Post[])
    );
  }
  loadTenderAdjacent(json:number[]){
    return this.http.post(this.host+'/demo/loadTenderAdjacent', json).pipe(
      map(posts => posts as Post[])
    );
  }

}
