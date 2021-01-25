import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import {Post, Type, ReceivedJson, Custom, Winner} from './classes';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient) {}

  getPosts() {
    // http://localhost:8081/demo/getAll
    return this.http.get('http://localhost:8081/demo/getAll').pipe(
      map(posts => posts as Post[])
    );
    // tslint:disable-next-line:max-line-length
    // {"id","nameTender","numberTender","bicoTender","gosZakupki" "price","currency","rate","sum","dateStart","dateFinish","fullSum","winSum","typetender","winner","customer"}
  }
  getPostWithParametrs(json: ReceivedJson){
    //const body = {dateStart: '2020-10-01T00:00:00Z', dateFinish: '2020-10-10T12:00:00Z'};
    // {dateStart: '', dateFinish: '', type: '%', custom: '%', winner: '%', minSum: 0, maxSum: 999999999999}
    return this.http.post('http://localhost:8081/demo/betweenDate', json).pipe(
      map(posts => posts as Post[])
    );
  }
  getAllTypes(){
      return this.http.get('http://localhost:8081/demo/getAllTypes').pipe(
        map(types => types as Type[])
      );
    }
  getAllCustom(){
    return this.http.get('http://localhost:8081/demo/getAllCustom').pipe(
      map(customs => customs as Custom[])
    );
  }
  getAllWinner(){
    return this.http.get('http://localhost:8081/demo/getAllWinner').pipe(
      map(winners => winners as Winner[])
    );
  }
}
