import { Component, OnInit } from '@angular/core';
import {FormControl} from '@angular/forms';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';

import {Post, Type} from '../classes';
import {ApiService} from '../api.service';

export interface User {
  name: string;
  id: number;
}

@Component({
  selector: 'app-autocomplet-type',
  templateUrl: './autocomplet-type.component.html',
  styleUrls: ['./autocomplet-type.component.scss']
})
export class AutocompletTypeComponent implements OnInit {

  myControl = new FormControl();
  options: Type[] = [];
 filteredOptions: Observable<Type[]> | undefined;
  constructor(private api: ApiService) {
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
    });

  }

  displayFn(type: Type): string {
    return type && type.type ? type.type : '';
  }

  private _filter(type: string): Type[] {
    const filterValue = type.toLowerCase();

    return this.options.filter(option => option.type.toLowerCase().indexOf(filterValue) === 0);
  }
  getType(): any{
    return this.myControl.value != null ? this.myControl.value.id : '%';
}
}
