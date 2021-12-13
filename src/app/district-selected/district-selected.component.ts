import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {District} from "../classes";
import {FormControl} from "@angular/forms";
import {ApiService} from "../api.service";
import {MatDialog} from "@angular/material/dialog";
import {ErrorDialogComponent} from "../error-dialog/error-dialog.component";
import {of} from "rxjs";

@Component({
  selector: 'app-district-selected',
  templateUrl: './district-selected.component.html',
  styleUrls: ['./district-selected.component.css']
})
export class DistrictSelectedComponent implements OnInit {


  districts: District[];
  myControl= new FormControl();
  @Output() Change = new EventEmitter<string>();
  constructor(private api: ApiService, private dialog:MatDialog) { }

  ngOnInit(): void {
    this.api.getDistrict().subscribe( districts => {
        this.districts = districts;
      },
      error => {
        if(error === 'Unknown Error'){this.dialog.open(ErrorDialogComponent, {data: "Ошибка загрузки \"Округ\": Обратитесь к администратору" });}
        else{this.dialog.open(ErrorDialogComponent, {data: "Ошибка загрузки \"Округ\": " + error});}

      });

  }
  setDistrict(districts: District[]) {
   let dis:District[] = [];
    for(let d of districts){
     for(let dist of this.districts){
       if(d.id === dist.id){
         dis.push(dist)
       }

     }
    }
    this.myControl.setValue(dis);
  }
}
