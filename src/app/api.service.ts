import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {map} from 'rxjs/operators';
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
  Comment,
  ChangeCategory,
  ChangeCompany,
  SynonymsProduct,
  BigCategory,
  Option,
  ReportCriteria,
  Report,
  SearchParameters,
  Region,
  District
} from './classes';


@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private host = environment.apiUrl;

  constructor(private http: HttpClient) {
  }

  getPosts() {
    // http://localhost:8081/demo/getAll
    return this.http.get(this.host + '/demo/Tender').pipe(
      map(posts => posts as Post[])
    );
    // tslint:disable-next-line:max-line-length
    // {"id","nameTender","numberTender","bicoTender","gosZakupki" "price","currency","rate","sum","dateStart","dateFinish","fullSum","winSum","typetender","winner","customer"}
  }

  getPostWithParametrs(json: SearchParameters) {
    //const body = {dateStart: '2020-10-01T00:00:00Z', dateFinish: '2020-10-10T12:00:00Z'};
    // {dateStart: '', dateFinish: '', type: '%', custom: '%', winner: '%', minSum: 0, maxSum: 999999999999}
    return this.http.post(this.host + '/demo/Tender', json).pipe(
      map(posts => posts as Post[])
    );
  }

  getAdjacentTenderWithParametrs(json: ReceivedJson) {
    //const body = {dateStart: '2020-10-01T00:00:00Z', dateFinish: '2020-10-10T12:00:00Z'};
    // {dateStart: '', dateFinish: '', type: '%', custom: '%', winner: '%', minSum: 0, maxSum: 999999999999}
    return this.http.post(this.host + '/demo/AdjacentTender', json).pipe(
      map(posts => posts as Post[])
    );
  }

  getPlanTenderWithParametrs(json: ReceivedJson) {
    //const body = {dateStart: '2020-10-01T00:00:00Z', dateFinish: '2020-10-10T12:00:00Z'};
    // {dateStart: '', dateFinish: '', type: '%', custom: '%', winner: '%', minSum: 0, maxSum: 999999999999}
    return this.http.post(this.host + '/demo/PlanTender', json).pipe(
      map(posts => posts as Post[])
    );
  }

  getTenderById(id: number) {
    return this.http.get(this.host + '/demo/TenderByID/' + id).pipe(
      map(data => data as Post)
    )
  }
  getTenderByIdForSetWinner(id: number) {
    return this.http.get(this.host + '/demo/TenderByIDForSetWinner/' + id).pipe(
      map(data => data as Post)
    )
  }
  getAdjacentTenderById(id: number) {
    return this.http.get(this.host + '/demo/AdjacentTenderByID/' + id).pipe(
      map(data => data as Post)
    )
  }

  getPlanTenderByID(id: number) {
    return this.http.get(this.host + '/demo/PlanTenderByID/' + id).pipe(
      map(data => data as Post)
    )
  }
  getFileTender(json: ReceivedJson) {
    return this.http.post(this.host + '/demo/FileTender', json, {responseType: 'blob'}
    );
  }

  getFileAdjacentTender(json: ReceivedJson) {
    return this.http.post(this.host + '/demo/FileAdjacentTender', json, {responseType: 'blob'}
    );
  }

  getProductFile(id: number) {
    return this.http.get(this.host + '/demo/ProductFile/' + id, {responseType: 'blob'}
    );
  }

  deleteTender(tender: number) {
    return this.http.get(this.host + '/demo/DeleteTender/' + tender).pipe(
      map(string => string as StringAnswer)
    );
  }

  deleteAdjacentTender(tender: number) {

    return this.http.get(this.host + '/demo/DeleteAdjacentTender/' + tender).pipe(
      map(string => string as StringAnswer)
    );
  }
  deletePlanTender(tender: number) {

    return this.http.get(this.host + '/demo/DeletePlanTender/' + tender).pipe(
      map(string => string as StringAnswer)
    );
  }
  getSaveProduct(product: Product, category: number) {
    //const body = {dateStart: '2020-10-01T00:00:00Z', dateFinish: '2020-10-10T12:00:00Z'};
    // {dateStart: '', dateFinish: '', type: '%', custom: '%', winner: '%', minSum: 0, maxSum: 999999999999}
    return this.http.post(this.host + '/demo/saveProduct/' + category, product).pipe(
      map(product => product as Product[])
    );
  }

  getUsers() {
    return this.http.get(this.host + '/demo/AllUsers').pipe(
      map(user => user as User[])
    );
  }

  createUser(user: User) {

    (user);
    return this.http.post(this.host + '/registration', user).pipe(
      map(string => (string))
    );
  }

  setPasswordUser(user: any) {
    (user);
    return this.http.post(this.host + '/setPassword', user).pipe(
      map(status => status as string)
    );
  }

  checkNickname(nickname: string) {
    return this.http.post(this.host + '/checkNickname', nickname).pipe(
      map(a => a as Map<string, boolean>)
    );
  }

  getAllTypes() {
    return this.http.get(this.host + '/demo/TypeTender').pipe(
      map(types => types as Type[])
    );
  }

  getContry() {
    return this.http.get(this.host + '/demo/Country').pipe(
      map(Contry => Contry as Country[])
    );
  }

  getAllCustom() {
    return this.http.get(this.host + '/demo/Customer').pipe(
      map(customs => customs as Company[])
    );
  }

  getAllCustomNoUses() {
    return this.http.get(this.host + '/demo/CustomerNoUses').pipe(
      map(customs => customs as Company[])
    );
  }

  DeleteCustomerNoUses() {
    return this.http.get(this.host + '/demo/DeleteCustomerNoUses').pipe(
      map(customs => customs as Company[])
    );
  }

  InsertCustomer(customer: Company) {
    return this.http.post(this.host + '/demo/insertCustomer', customer).pipe(
      map(status => status as string)
    );
  }

  ChangeCustomer(json: ChangeCompany) {
    return this.http.post(this.host + '/demo/ChangeCustomer', json).pipe(
      map(status => status as StringAnswer)
    );
  }

  CustomerFile() {
    return this.http.get(this.host + '/demo/CustomerFile', {responseType: 'blob'}
    );
  }

  getAllWinner() {
    return this.http.get(this.host + '/demo/Winner').pipe(
      map(winners => winners as Company[])
    );
  }

  getAllWinnerNoUses() {
    return this.http.get(this.host + '/demo/WinnerNoUses').pipe(
      map(winners => winners as Company[])
    );
  }

  InsertWinner(winner: Company) {
    return this.http.post(this.host + '/demo/insertWinner', winner).pipe(
      map(status => status as string)
    );
  }

  DeleteWinnerNoUses() {
    return this.http.get(this.host + '/demo/DeleteWinnerNoUses').pipe(
      map(winners => winners as Company[])
    );
  }

  ChangeWinner(json: ChangeCompany) {
    return this.http.post(this.host + '/demo/ChangeWinner', json).pipe(
      map(status => status as StringAnswer)
    );
  }

  WinnerFile() {
    return this.http.get(this.host + '/demo/WinnerFile', {responseType: 'blob'}
    );
  }

  getReportQuarter(category: number, json: ReceivedJson) {
    return this.http.post(this.host + '/demo/quarterTender/' + category, json).pipe(
      map(reportQuarter => reportQuarter as ReportQuarter[])
    );
  }

  getReportQuarterBigCategory(category: number, json: ReceivedJson) {
    return this.http.post(this.host + '/demo/quarterTenderBigCategory/' + category, json).pipe(
      map(reportQuarter => reportQuarter as ReportQuarter[])
    );
  }

  getReportVendorQuarter(category: number, json: ReceivedJson) {
    return this.http.post(this.host + '/demo/quarterVendor/' + category, json).pipe(
      map(reportQuarter => reportQuarter as ReportVendorQuarter[])
    );
  }

  getReportVendorQuarterBigCategory(category: number, json: ReceivedJson) {
    return this.http.post(this.host + '/demo/quarterVendorBigCategory/' + category, json).pipe(
      map(reportQuarter => reportQuarter as ReportVendorQuarter[])
    );
  }

  getReportNoVendorQuarter(category: number, json: ReceivedJson) {
    return this.http.post(this.host + '/demo/quarterNoVendor/' + category, json).pipe(
      map(reportQuarter => reportQuarter as ReportVendorQuarter[])
    );
  }

  getReportNoVendorQuarterBigCategory(category: number, json: ReceivedJson) {
    return this.http.post(this.host + '/demo/quarterNoVendorBigCategory/' + category, json).pipe(
      map(reportQuarter => reportQuarter as ReportVendorQuarter[])
    );
  }

  getReportQuarterCustomer(category: number, json: ReceivedJson) {
    return this.http.post(this.host + '/demo/quarterTender/' + category, json).pipe(
      map(reportQuarter => reportQuarter as ReportQuarter[])
    );
  }

  getReportCustomerQuarter(category: number, json: ReportCriteria) {
    return this.http.post(this.host + '/demo/quarterCustomer/' + category, json).pipe(
      map(reportQuarter => reportQuarter as Report)
    );
  }

  getQuartal(json: ReceivedJson) {
    return this.http.post(this.host + '/demo/getQuartal/', json).pipe(
      map(reportQuarter => reportQuarter as string[])
    );
  }

  fileQuarter(json: ReceivedJson) {
    return this.http.post(this.host + '/demo/FileReport', json, {responseType: 'blob'})
  }

  addTender(uploadData: any) {
    return this.http.post(this.host + '/demo/addTender', uploadData).pipe(
      map(posts => posts as Post[])
    );
  }

  addProduct(uploadData: any, category: number) {
    return this.http.post(this.host + '/demo/addProduct/' + category, uploadData).pipe(
      map(data => data as StringAnswer)
    );
  }

  changeProduct(uploadData: any, category: number, oldcategory: number) {
    return this.http.post(this.host + '/demo/ChangeProduct/' + category+"/"+oldcategory, uploadData).pipe(
      map(data => data as StringAnswer)
    );
  }

  getAllProductCategory() {
    return this.http.get(this.host + '/demo/ProductCategory/').pipe(
      map(productCategories => productCategories as ProductCategory[])
    );
  }

  getVendorCode(productCategory: number) {
    return this.http.get(this.host + '/demo/VendorCode/' + productCategory).pipe(
      map(product => product as Product[])
    );
  }

  getVendorCodeNoUses(productCategory: number) {
    return this.http.get(this.host + '/demo/VendorCodeNoUses/' + productCategory).pipe(
      map(product => product as Product[])
    );
  }

  DeleteCodeNoUses(productCategory: number) {
    return this.http.get(this.host + '/demo/DeleteVendorCodeNoUses/' + productCategory).pipe(
      map(product => product as Product[])
    );
  }

  getVendorCodeById(productCategory: number, id_product: number) {
    return this.http.get(this.host + '/demo/VendorCodeById/' + productCategory + '/' + id_product).pipe(
      map(product => product as Product)
    );
  }

  getOrdersByTender(tender: number) {
    return this.http.get(this.host + '/demo/OrdersByTender/' + tender).pipe(
      map(order => order as OrdersReceived)
    );
  }

  addOrders(json: OrdersDB[]) {
    return this.http.post(this.host + '/demo/addOrders', json).pipe(
      map(data => data as StringAnswer)
    );
  }

  getCountTenderWithoutOrders() {
    return this.http.get(this.host + '/demo/CountTenderWithoutOrders').pipe(
      map(count => count as number)
    );
  }

  getCountCommentByTender(tender: number) {
    return this.http.get(this.host + '/demo/CountCommentByTender/' + tender).pipe(
      map(count => count as number)
    );
  }

  getTenderWithoutOrders() {
    return this.http.get(this.host + '/demo/TenderWithoutOrders').pipe(
      map(posts => posts as Post[]));
  }

  getTendernoDocumentation() {
    return this.http.get(this.host + '/demo/TendernoDocumentation').pipe(
      map(posts => posts as Post[]));
  }

  getVendor(category: number) {

    return this.http.get(this.host + '/demo/Vendor/' + category).pipe(
      map(vendors => vendors as Vendor[])
    );
  }

  SaveTender(json: Post) {

    return this.http.post(this.host + '/demo/saveTender', json).pipe(map(data => data as Post))
  }

  SaveAdjacentTender(json: Post) {

    return this.http.post(this.host + '/demo/saveAdjacentTender', json).pipe(map(data => data as Post))
  }
  SavePlanTender(json: Post) {

    return this.http.post(this.host + '/demo/savePlanTender', json).pipe(map(data => data as Post))
  }
  getFooter(ids: number[]) {
    return this.http.post(this.host + '/demo/getFooter', ids).pipe(
      map(status => status as string)
    );
  }

  getTenderOnProduct(tenderProduct: TenderonProduct) {
    return this.http.post(this.host + '/demo/TenderOnProduct/', tenderProduct).pipe(
      map(posts => posts as Post[])
    );
  }

  CreateTable(createTable: CreateTable) {

    return this.http.post(this.host + '/demo/CreateTable', createTable).pipe(
      map(data => data as StringAnswer)
    )
  }

  ChangeCategory(json: ChangeCategory) {
    return this.http.post(this.host + '/demo/ChangeCategory', json).pipe(
      map(data => data as StringAnswer)
    )
  }

  loadTender(json: number[]) {
    return this.http.post(this.host + '/demo/loadTender', json).pipe(
      map(posts => posts as [Post[]])
    );
  }

  loadTenderAdjacent(json: number[]) {
    return this.http.post(this.host + '/demo/loadTenderAdjacent', json).pipe(
      map(posts => posts as Post[])
    );
  }

  loadTenderPlan(json: number[]) {
    return this.http.post(this.host + '/demo/loadTenderPlan', json).pipe(
      map(posts => posts as Post[])
    );
  }

  getSynonymsProduct() {
    return this.http.get(this.host + '/demo/SynonymsProduct').pipe(
      map(synonyms => synonyms as SynonymsProduct[])
    );
  }

  saveSynonymsProduct(syn: SynonymsProduct) {
    return this.http.post(this.host + '/demo/ChangeSynonymsProduct', syn).pipe(
      map(synonyms => synonyms as SynonymsProduct[])
    );
  }

  getBigCategory() {
    return this.http.get(this.host + '/demo/BigCategory').pipe(
      map(bigCategory => bigCategory as BigCategory[])
    );
  }

  saveBigCategory(big: BigCategory) {
    return this.http.post(this.host + '/demo/ChangeBigCategory', big).pipe(
      map(bigCategory => bigCategory as BigCategory[])
    );
  }

  getAllUsers() {
    return this.http.get(this.host + '/demo/getAllUsers').pipe(
      map(user => user as User[])
    )
  }

  getComments(tender: number) {
    return this.http.get(this.host + '/demo/getCommentsByTender/' + tender).pipe(
      map(comment => comment as Comment[])
    )
  }

  postComments(comment: Comment) {
    return this.http.post(this.host + '/demo/postComment/', comment).pipe(
      map(comment => comment as Comment[])
    )
  }

  test() {
    return this.http.get(this.host + '/demo/Test').pipe(
      map(comment => comment as Post[])
    )
  }

  numberFromBuffer(id: number) {
    return this.http.get(this.host + '/demo/numberFromBuffer/' + id).pipe(
      map(data => data as StringAnswer)
    )
  }

  getSubcategory(category:number){
    return this.http.get(this.host + '/demo/subcategoryInCategory/'+ category).pipe(
      map( data => data as string[]
      )
    )
  }
  getAllSubcategory(){
    return this.http.get(this.host + '/demo/AllSubcategory').pipe(
      map( data => data as string[]
      )
    )
  }
  getColumnCategory(category:number){
    return this.http.get(this.host + '/demo/ColumnCategory/'+ category).pipe(
      map( data => data as string[]
      )
    )
  }
  saveOption(option:Option){

    return this.http.post(this.host + '/demo/Saveoption',option).pipe(
      map(data => data as Option[])
    )
  }
  getAllOption(){
    return this.http.get(this.host + '/demo/getAllOptions').pipe(
      map(data => data as Option[])
    )
  }
  getAllOptionByProduct(product_category,id_product){
  return this.http.get(this.host + '/demo/getAllOptionsByProduct/'+product_category+'/'+id_product).pipe(
    map(data => data as Option[])
)
}
  getProductReport(reportCriteria:ReportCriteria){

    return this.http.post(this.host + '/demo/ReportProduct',reportCriteria).pipe(
      map(data => data as Report)
    )
  }
  SaveParameters() {
    return this.http.get(this.host + '/demo/SaveParameters').pipe(
      map(parameters => parameters as SearchParameters[])
    );
  }

  save_SaveParameters(searchparametrs:SearchParameters) {
    return this.http.post(this.host + '/demo/save_SaveParameters', searchparametrs).pipe(
      map(parameters => parameters as SearchParameters[])
    );
  }
  deleteSaveParameters(id: number){
    return this.http.post(this.host + '/demo/delete_SaveParameters', id).pipe(
      map(parameters => parameters as SearchParameters[])
    );
  }
  getRegion() {

    return this.http.get(this.host + '/demo/Region' ).pipe(
      map(regions => regions as Region[])
    );
  }
  getDistrict() {

    return this.http.get(this.host + '/demo/District' ).pipe(
      map(districts => districts as District[])
    );
  }
  setDublicate(id:number,id_d:number){
    return this.http.get(this.host + '/demo/setDublicate/'+id+'/'+id_d).pipe(
      map(data => data as StringAnswer)
    )
  }
  setPlane(id:number,id_d:number){
    return this.http.get(this.host + '/demo/setPlane/'+id+'/'+id_d).pipe(
      map(data => data as StringAnswer)
    )
  }
  deleteDublicate(id:number){
    return this.http.get(this.host + '/demo/deleteDublicate/'+id).pipe(
      map(data => data as StringAnswer)
    )
  }
  getDublicate(id: number){
    return this.http.get(this.host + '/demo/getDublicate/'+id).pipe(
      map(posts => posts as Post[])
    )
  }
}
