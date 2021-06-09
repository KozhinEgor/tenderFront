import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {Country, Vendor} from "../classes";
import {FormControl} from "@angular/forms";
import {Observable} from "rxjs";
import {ApiService} from "../api.service";
import {map, startWith} from "rxjs/operators";

@Component({
  selector: 'app-contry-autocomplet',
  templateUrl: './contry-autocomplet.component.html',
  styleUrls: ['./contry-autocomplet.component.css']
})
export class ContryAutocompletComponent implements OnInit {

// tslint:disable-next-line:no-output-on-prefix
  @Output() Change = new EventEmitter<Country>();


  myControl = new FormControl();
  options: Country[] = [];
  filteredOptions: Observable<Country[]> | undefined;
  constructor(private api: ApiService) {
  }
  public start(){

  }
  public changeValue(category: string): void{
    this.myControl.setValue(this._filter(category));
  }
  ngOnInit() {
    this.api.getContry().subscribe( Contry=> {

      this.options = Contry;
      this.filteredOptions = this.myControl.valueChanges
        .pipe(
          startWith(''),
          map(value => typeof value === 'string' ? value : value.name),
          map(contry => contry? this._filter(contry) : this.options.slice())
        );
    });
  }

  displayFn(contry: Country): string {
    return contry &&contry.name ? contry.name : '';
  }

  private _filter(name: string): Country[] {
    const filterValue = name.toLowerCase();

    return this.options.filter(contry => contry.name.toLowerCase().includes(filterValue));
  }
  setContry(name: string){
    for( let cont of this.options){
      if(cont.name === name){
        this.myControl.setValue(cont);
      }
    }
  }
}
