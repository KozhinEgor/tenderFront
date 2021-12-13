export interface Post {
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

export interface ReceivedJson {
  dateStart: string;
  dateFinish: string;
  dublicate: boolean;
  quarter: boolean;
  typeExclude: boolean;
  type: Type[];
  customExclude: boolean;
  custom: Company[];
  innCustomer: string;
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
  product_category: string;
  vendor: string;
  id_product: string;
  tender: number;
  number: number;
  comment: string;
  price: number;
  winprice: number;
}

export interface OrdersDB {
  id: number;
  vendor: number;
  product_category: number;
  id_product: number;
  tender: number;
  number: number;
  comment: string;
  price: number;
  winprice: number;
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
  big_category: BigCategory;
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
  receivedJSON:ReceivedJson;
  interval:string;
}
export interface Report{
  sumByTender:Array<Map<string,string>>;
  sumProduct:Array<Map<string,string>>;
  columnProduct:Array<string>;
  columnTender:Array<string>;
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
  innCustomer: string;
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
