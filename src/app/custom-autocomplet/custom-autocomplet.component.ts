import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormControl} from "@angular/forms";
import {Company} from "../classes";
import {Observable} from "rxjs";
import {ApiService} from "../api.service";
import {map, startWith} from "rxjs/operators";
import {MatDialog} from "@angular/material/dialog";
import {ErrorDialogComponent} from "../error-dialog/error-dialog.component";

@Component({
  selector: 'app-custom-autocomplet',
  templateUrl: './custom-autocomplet.component.html',
  styleUrls: ['./custom-autocomplet.component.scss']
})
export class CustomAutocompletComponent implements OnInit {
  @Input() value = '';
  @Output() Change = new EventEmitter<number>();
  myControl = new FormControl();
  options: Company[] = [];
  filteredOptions: Observable<Company[]> | undefined;
  constructor(private api: ApiService, private dialog:MatDialog) {
  }
  ngOnInit() {
   this.update();
    this.myControl.setValue({name: this.value});
  }
  public changeValue(category: string): void{
    this.myControl.setValue(this._filter(category));
  }
  displayFn(custom: Company): string {
    return custom && custom.name ? custom.name : '';
  }

  private _filter(custom: string): Company[] {
    const filterValue = custom.toLowerCase();

    return this.options.filter(option => option.name.toLowerCase().includes(filterValue));
  }
  getCustom(): string{
    return this.myControl.value != null ? this.myControl.value.id : '%';
  }
  setCustomer(name: String){

    for( let cust of this.options){
      if(cust.name === name){
        this.myControl.setValue(cust);
      }
    }
  }
  update(){
    this.api.getAllCustom().subscribe( customs => {
      this.options = customs;
      this.filteredOptions = this.myControl.valueChanges
        .pipe(
          startWith(''),
          map(value => typeof value === 'string' ? value : value.name),
          map(custom => custom ? this._filter(custom) : this.options.slice())
        );
    },
      error => {
        if(error === 'Unknown Error'){this.dialog.open(ErrorDialogComponent, {data: "Ошибка загрузки \"заказчиков\": Обратитесь к администратору"});}
        else{this.dialog.open(ErrorDialogComponent, {data: "Ошибка загрузки \"заказчиков\": " + error});}

      });
  }
  select(): void {
    this.myControl.setValue('');
  }
}
