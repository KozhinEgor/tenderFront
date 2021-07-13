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
  country:string;
}
export interface Type{
  id: number;
  type: string;
}
export interface Customer {
  id: number;
  name: string;
  inn: string;
  country: string;
}
export interface Winner{
  id: number;
  name: string;
  inn: string;
}
export interface ReceivedJson{
  dateStart: string;
  dateFinish: string;
  dublicate: boolean;
  quarter: boolean;
  typeExclude: boolean;
  type: Type[];
  customExclude: boolean;
  custom: Customer[];
  innCustomer: string;
  country: number;
  winnerExclude: boolean;
  winner: Winner[];
  minSum: number;
  maxSum: number;
  ids: number[];
  bicotender: number[];
  numberShow: boolean;
  product: ProductReceived[];
}
export interface ReportQuarter{
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
}
export interface OrdersReceived{
  orders: Orders[];
  ordersDB: OrdersDB[];
}
export interface ProductCategory{
  id: number;
  category: string;
  category_en: string;
}
export interface Product{
  id: number ;
  vendor_id: number;
  vendor_code: string;
  frequency: number;
  usb: boolean;
  vxi: boolean;
  portable: boolean;
  vendor: string;
  channel: number;
  port:number;
}
export interface Vendor{
  id: number;
  name: string;
  second_name: string;
}
export interface ReportVendorQuarter{
  vendor: string;
  quarter: string;
}
export interface ReportCriteria{
  category:number;
  dateStart: string;
  dateFinish: string;
}
export interface TenderonProduct{
  dateStart: string;
  dateFinish: string;
  productCategory: number;
  product: string;
}
export interface Country {
  id: number;
  name: string;
}
export interface ProductReceived{
  category: ProductCategory;
  vendor: Vendor;
  vendor_code: Product;
}
export interface User{
  token?: string;
  role: string;
  username: string;
  activationCode: string;
}
export enum Role{
  ROLE_ADMIN,ROLE_USER,ROLE_OPERATOR
}
export interface CreateTable{
  vendor: boolean;
  frequency: boolean;
  usb: boolean;
  vxi: boolean;
  portable: boolean;
  channel: boolean;
  port:boolean;
  name: string;
  name_en: string;
}
export  interface StringAnswer{
  name:string;
}
export interface ChangeCategory{
  category:number;
  vendor_code:number;
  newCategory:number;
  newVendor_code:number;
}
