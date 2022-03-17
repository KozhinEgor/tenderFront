export interface Tender {
  id: number;
  name_tender: string;
  number_tender: string;
  bico_tender: string;
  gos_zakupki: string;
  price: number;
  currency: string;
  rate: number;
  date_start: Date;
  sum: number;
  date_finish: Date;
  date_tranding: Date;
  full_sum: number;
  win_sum: number;
  typetender: string;
  winner: string;
  customer: string;
  inn: string;
  product: string;
  dublicate: boolean;
  country: string;
  winner_inn: string;
  winner_country: string;
  plan: boolean;
  tender_plan:string;
  tender_dublicate:string;
}

export interface Tenders{
  tenders:Tender[];
  allCount:number;
  withPrice: number;
  sumWithPrice:number;
  withWinner: number;
  sumWithWinner: number;
}

export interface searchTender{
  page:number;
  sortName:string;
  sortDirection:string;
  pageSize:number;
  searchParametrs:SearchParameters;
}

export interface Type {
  id: number;
  type: string;
}
// export interface Customer {
//   id: number;
//   name: string;
//   inn: string;
//   country: string;
// }
// export interface Winner{
//   id: number;
//   name: string;
//   inn: string;
// }
export interface Company {
  id: number;
  name: string;
  inn: string;
  country: string;
}



export interface ReportQuarter {
  product: string;
  count: number;
  sum: number;
  quarter: number;
  year: number;
  vendor: any;
}

export interface Orders {
  id: number;
  comment_DB: string;
  comment: string;
  tender: number;
  number: number;
  price: number;

  product_category: string;
  product_category_DB: number;
  product_DB:number;
  product:string;
  vendor: string;
  vendor_DB: number;
  subcategory: string;
  subcategory_DB: number;

  frequency: number;
  usb: boolean;
  vxi: boolean;
  portable: boolean;
  channel: number;
  port: number;
  form_factor: string;
  purpose: string;
  voltage: number;
  current: number;
  option:Option[];
  options: string;
}

export interface deleteOrder{
  id:number;
  result:boolean;
  tender:number;
}

export interface OrdersDB {
  id: number;
  product: number;
  tender: number;
  number: number;
  comment: string;
  price: number;
  frequency: number;
  usb: boolean;
  vxi: boolean;
  portable: boolean;
  channel: number;
  port: number;
  form_factor: string;
  purpose: string;
  voltage: number;
  current: number;
  option:Option[];
  options: string;
}

export interface OrdersReceived {
  orders: Orders[];
  ordersDB: OrdersDB[];
}

export interface ProductCategory {
  id: number;
  category: string;
  category_en: string;
  category_product: string;
}

export interface Product {
  id: number;
  vendor_id: number;
  vendor_code: string;
  product_category: string;
  product_category_id: number;
  vendor: string;
  frequency: number;
  usb: boolean;
  vxi: boolean;
  portable: boolean;
  channel: number;
  port: number;
  form_factor: string;
  purpose: string;
  voltage: number;
  current: number;
  subcategory: string;
  subcategory_id: number;
  option:Option[];
  options: string;
}

export interface Vendor {
  id: number;
  name: string;
  second_name: string;
}

export interface ReportVendorQuarter {
  vendor: string;
  quarter: string;
}


export interface TenderonProduct {
  dateStart: string;
  dateFinish: string;
  productCategory: number;
  product: string;
}

export interface Country {
  id: number;
  name: string;
}

export interface ProductReceived {
  category_product: string;
  category: ProductCategory[];
  vendor: Vendor[];
  vendor_code: Product[];
  subcategory: string[];
}

export interface User {
  id: number;
  token?: string;
  role: string;
  username: string;
  activationCode: string;
  nickname: string;
}

export enum Role {
  ROLE_ADMIN, ROLE_USER, ROLE_OPERATOR
}



export interface CreateTable {
  vendor: boolean;
  frequency: boolean;
  usb: boolean;
  vxi: boolean;
  portable: boolean;
  channel: boolean;
  port: boolean;
  form_factor: boolean;
  purpose:  boolean;
  voltage:  boolean;
  current:  boolean;
  subcategory: string[];
  name: string;
  name_en: string;
  category;
}

export interface StringAnswer {
  name: string;
}

export interface ChangeCategory {
  category: number;
  vendor_code: number;
  newCategory: number;
  newVendor_code: number;
}

export interface ChangeCompany {
  company: number;
  newCompany: number;
}

export interface SynonymsProduct {
  id: number;
  product_category: string;
  synonyms: string;
  id_category: number;
}

export interface BigCategory {
  big_category_id: number;
  big_category: string;
  category: ProductCategory[];
  productCategory: string;
}

export interface Comment {
  id: number;
  text: string;
  usr: number;
  user: string;
  date: Date;
  tender: number;
  users: number[];
}
export interface Option{
  id: number;
  name: string;
}
export interface ReportCriteria{
  searchParameters:SearchParameters;
  interval:string;
}
export interface Report{
  sumByTender:Array<Map<string,string>>;
  sumProduct:Array<Map<string,string>>;
  columnProduct:Array<string>;
  columnTender:Array<string>;
}

export interface ReceivedJson {
  dateStart: string;
  dateFinish: string;
  dublicate: boolean;
  quarter: boolean;
  typeExclude: boolean;
  type: Type[];
  customExclude: boolean;
  custom: Company[];
  innCustomer: string[];
  country: number;
  winnerExclude: boolean;
  winner: Company[];
  minSum: number;
  maxSum: number;
  ids: number[];
  bicotender: number[];
  numberShow: boolean;
  product: ProductReceived[];
  regions: Region[];
  districts: District[];
  plan_schedule: boolean;
  realized: boolean;
}

export interface SearchParameters{
  id: number;
  nickname: string;
  name: string;
  dateStart: string;
  dateFinish: string;
  dublicate: boolean;
  quarter: boolean;
  typeExclude: boolean;
  type: Type[];
  customExclude: boolean;
  custom: Company[];
  innCustomer: string[];
  innString:string;
  country: number;
  winnerExclude: boolean;
  winner: Company[];
  minSum: number;
  maxSum: number;
  ids: number[];
  ids_string: string;
  bicotender: number[];
  bicotender_string: string;
  numberShow: boolean;
  product: ProductReceived[];
  regions: Region[];
  districts: District[];
  plan_schedule: boolean;
  adjacent_tender: boolean;
  realized: boolean;
  private_search: boolean;
}
export interface Region{
  id:number;
  name:string
  number:string;
}
export interface District{
  id: number;
  name: string;
}
export interface EmailReport {
  name_tender:string;
  date_start:string;
  date_finish:string;
  number:number;
  numberWithPrice:number;
  type_tender:string;
  customer: string;
  customer_id:number;
  full_sum:number;
  currency:string;
  price:number;
  tenderIn:Tender[];
}
export interface CriteriaEmailReport{
  date_start:Date;
  date_finish:Date;
  id_step:number;
}

