import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {District, Region} from "../classes";
import {FormControl} from "@angular/forms";
import {ApiService} from "../api.service";
import {MatDialog} from "@angular/material/dialog";
import {ErrorDialogComponent} from "../error-dialog/error-dialog.component";

@Component({
  selector: 'app-region-selected',
  templateUrl: './region-selected.component.html',
  styleUrls: ['./region-selected.component.css']
})
export class RegionSelectedComponent implements OnInit {

  regions: Region[];
  myControl= new FormControl();
  @Output() Change = new EventEmitter<string>();
  constructor(private api: ApiService, private dialog:MatDialog) { }

  ngOnInit(): void {
    this.api.getRegion().subscribe( regions => {
        this.regions = regions;
      },
      error => {
        if(error === 'Unknown Error'){this.dialog.open(ErrorDialogComponent, {data: "Ошибка загрузки \"Регионов\": Обратитесь к администратору" });}
        else{this.dialog.open(ErrorDialogComponent, {data: "Ошибка загрузки \"Регионов\": " + error});}

      });

  }
  setRegions(regions: Region[]) {
    let reg:Region[] = [];
    for(let r of regions){
      for(let regi of this.regions){
        if(r.id === regi.id){
          reg.push(regi)
        }

      }
    }
    this.myControl.setValue(reg);
  }
}
