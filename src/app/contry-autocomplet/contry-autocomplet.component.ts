import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Country} from "../classes";
import {FormControl} from "@angular/forms";
import {Observable} from "rxjs";
import {ApiService} from "../api.service";
import {map, startWith} from "rxjs/operators";
import {MatDialog} from "@angular/material/dialog";
import {ErrorDialogComponent} from "../error-dialog/error-dialog.component";

@Component({
  selector: 'app-contry-autocomplet',
  templateUrl: './contry-autocomplet.component.html',
  styleUrls: ['./contry-autocomplet.component.css']
})
export class ContryAutocompletComponent implements OnInit {

// tslint:disable-next-line:no-output-on-prefix
  @Output() Change = new EventEmitter<Country>();
  name: string = null;
  id: number = null;
  myControl = new FormControl();
  options: Country[] = [];
  filteredOptions: Observable<Country[]> | undefined;
  constructor(private api: ApiService,private dialog:MatDialog) {
  }
  public start(){

  }
  public changeValue(category: string): void{
    this.myControl.setValue(this._filter(category));
  }
  ngOnInit() {

    this.api.getContry().subscribe( Contry=> {
      // console.log(Contry)
      this.options = Contry;
      this.filteredOptions = this.myControl.valueChanges
        .pipe(
          startWith(''),
          map(value => {if(typeof value === 'string'){return value} else {return value.name}}),
          map(country => country? this._filter(country) : this.options.slice())
        );
      if(this.name !== null){
        this.setContry(this.name);
      }
      if(this.id !== null){
        this.setContryById(this.id);
      }
    },
      error => {
        if(error === 'Unknown Error'){this.dialog.open(ErrorDialogComponent, {data: "Ошибка загрузки \"стран\": Обратитесь к администратору"});}
        else{this.dialog.open(ErrorDialogComponent, {data: "Ошибка загрузки \"стран\": " + error});}

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
    if(this.options.length === 0){
      this.name = name;
    }
    else{
      for( let cont of this.options){

        if(cont.name == name){
          this.myControl.setValue(cont);
        }
      }
    }
  }
  setContryById(id: number){
    if(this.options.length === 0){
      this.id = id;
    }
    else{
      for( let cont of this.options){

        if(cont.id == id){
          this.myControl.setValue(cont);
        }
      }
    }
  }
}
