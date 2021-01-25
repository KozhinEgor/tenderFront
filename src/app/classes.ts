export interface Post {
  id: number;
  nameTender: string;
  numberTender: string;
  bicoTender: string;
  gosZakupki: string;
  price: number;
  currency: string;
  rate: number;
  sum: number;
  dateStart: Date;
  dateFinish: Date;
  fullSum: number;
  winSum: number;
  typetender: string;
  winner: string;
  customer: string;
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
  maxSum: number
}
