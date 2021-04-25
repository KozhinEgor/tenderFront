import {Component, Input, OnInit} from '@angular/core';
import {FormControl} from "@angular/forms";
import {Custom} from "../classes";
import {Observable} from "rxjs";
import {ApiService} from "../api.service";
import {map, startWith} from "rxjs/operators";

@Component({
  selector: 'app-custom-autocomplet',
  templateUrl: './custom-autocomplet.component.html',
  styleUrls: ['./custom-autocomplet.component.scss']
})
export class CustomAutocompletComponent implements OnInit {
  @Input() value = '';
  myControl = new FormControl();
  options: Custom[] = [];
  filteredOptions: Observable<Custom[]> | undefined;
  constructor(private api: ApiService) {
  }
  ngOnInit() {
    this.api.getAllCustom().subscribe( customs => {
      this.options = customs;
      this.filteredOptions = this.myControl.valueChanges
        .pipe(
          startWith(''),
          map(value => typeof value === 'string' ? value : value.name),
          map(custom => custom ? this._filter(custom) : this.options.slice())
        );
    });
    this.myControl.setValue({name: this.value});
  }

  displayFn(custom: Custom): string {
    return custom && custom.name ? custom.name : '';
  }

  private _filter(custom: string): Custom[] {
    const filterValue = custom.toLowerCase();

    return this.options.filter(option => option.name.toLowerCase().includes(filterValue));
  }
  getCustom(): string{
    return this.myControl.value != null ? this.myControl.value.id : '%';
  }

}
