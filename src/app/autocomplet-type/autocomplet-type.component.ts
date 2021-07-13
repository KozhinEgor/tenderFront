import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormControl} from '@angular/forms';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';

import {Type} from '../classes';
import {ApiService} from '../api.service';
import {MatDialog} from "@angular/material/dialog";
import {ErrorDialogComponent} from "../error-dialog/error-dialog.component";


@Component({
  selector: 'app-autocomplet-type',
  templateUrl: './autocomplet-type.component.html',
  styleUrls: ['./autocomplet-type.component.scss']
})
export class AutocompletTypeComponent implements OnInit {
 @Input() value = '';
  @Output() Change = new EventEmitter<number>();
  myControl = new FormControl();
  options: Type[] = [];
 filteredOptions: Observable<Type[]> | undefined;
  constructor(private api: ApiService, private dialog:MatDialog) {
  }
  public changeValue(category: string): void{
    this.myControl.setValue(this._filter(category));
  }
  ngOnInit() {
    this.api.getAllTypes().subscribe( types => {
      this.options = types;
      this.filteredOptions = this.myControl.valueChanges
        .pipe(
          startWith(''),
          map(value => typeof value === 'string' ? value : value.type),
          map(type => type ? this._filter(type) : this.options.slice())
        );
    },
      error => {
      if(error === 'Unknown Error'){this.dialog.open(ErrorDialogComponent, {data: "Ошибка загрузки \"типов тендеров\": Обратитесь к администратору"});}
      else {this.dialog.open(ErrorDialogComponent, {data: "Ошибка загрузки \"типов тендеров\": " + error});}

      });
    this.myControl.setValue({name: this.value});
  }

  displayFn(type: Type): string {
    return type && type.type ? type.type : '';
  }

  private _filter(type: string): Type[] {
    const filterValue = type.toLowerCase();

    return this.options.filter(option => option.type.toLowerCase().includes(filterValue));
  }
  getType(): any{
    return this.myControl.value != null ? this.myControl.value.id : '%';
}
  setType(name: string){
    for( let type of this.options){
      if(type.type === name){
        this.myControl.setValue(type);
        return type.id;
      }
    }
  }
  select(): void {
    this.myControl.setValue('');
  }
}
