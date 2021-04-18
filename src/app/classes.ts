export interface Post {
  id: number;
  name_tender: string;
  number_tender: string;
  bico_tender: string;
  gos_zakupki: string;
  price: number;
  currency: string;
  rate: number;
  sum: number;
  date_start: Date;
  date_finish: Date;
  full_sum: number;
  win_sum: number;
  typetender: string;
  winner: string;
  customer: string;
  inn: string;
  product: string;
}
export interface Type{
  id: number;
  type: string;
}
export interface Custom{
  id: number;
  name: string;
  inn: string;
}
export interface Winner{
  name: string;
  inn: string;
  ogrn: string;
}
export interface ReceivedJson{
  dateStart: string;
  dateFinish: string;
  type: string;
  custom: string;
  winner: string;
  minSum: number;
  maxSum: number;
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
  id: number;
  vendor_id: number;
  vendor_code: string;
  frequency: number;
  usb: boolean;
  vxi: boolean;
  portable: boolean;
  vendor: string;
  channel: number;
}
export interface Vendor{
  id: number;
  name: string;
  second_name: string;
}
