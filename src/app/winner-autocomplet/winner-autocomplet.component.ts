import { Component, OnInit } from '@angular/core';
import {FormControl} from "@angular/forms";
import {Winner} from "../classes";
import {Observable} from "rxjs";
import {ApiService} from "../api.service";
import {map, startWith} from "rxjs/operators";

@Component({
  selector: 'app-winner-autocomplet',
  templateUrl: './winner-autocomplet.component.html',
  styleUrls: ['./winner-autocomplet.component.scss']
})
export class WinnerAutocompletComponent implements OnInit {

  myControl = new FormControl();
  options: Winner[] = [];
  filteredOptions: Observable<Winner[]> | undefined;
  constructor(private api: ApiService) {
  }
  ngOnInit() {
    this.api.getAllWinner().subscribe( winners => {
      this.options = winners;
      this.filteredOptions = this.myControl.valueChanges
        .pipe(
          startWith(''),
          map(value => typeof value === 'string' ? value : value.name),
          map(winner => winner ? this._filter(winner) : this.options.slice())
        );
    });

  }

  displayFn(winner: Winner): string {
    return winner && winner.name ? winner.name : '';
  }

  private _filter(winner: string): Winner[] {
    const filterValue = winner.toLowerCase();

    return this.options.filter(option => option.name.toLowerCase().indexOf(filterValue) === 0);
  }
  getWinner(): string{
    return this.myControl.value != null ? this.myControl.value.id : '%';
  }


}
