import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormControl} from "@angular/forms";
import {BigCategory, Type} from "../classes";
import {Observable} from "rxjs";
import {ApiService} from "../api.service";
import {MatDialog} from "@angular/material/dialog";
import {map, startWith} from "rxjs/operators";
import {ErrorDialogComponent} from "../error-dialog/error-dialog.component";

@Component({
  selector: 'app-bigcategory-autocomplet',
  templateUrl: './bigcategory-autocomplet.component.html',
  styleUrls: ['./bigcategory-autocomplet.component.css']
})
export class BigcategoryAutocompletComponent implements OnInit {
  @Input() value = '';
  @Output() Change = new EventEmitter<number>();
  myControl = new FormControl();
  options: BigCategory[] = [];
  filteredOptions: Observable<BigCategory[]> | undefined;
  constructor(private api: ApiService, private dialog:MatDialog) {
  }
  public changeValue(category: string): void{
    this.myControl.setValue(this._filter(category));
  }
  ngOnInit() {
    this.api.getBigCategory().subscribe( bigCategory => {
        this.options = bigCategory;
        this.filteredOptions = this.myControl.valueChanges
          .pipe(
            startWith(''),
            map(value => typeof value === 'string' ? value : value.big_category),
            map(bigCategory => bigCategory ? this._filter(bigCategory) : this.options.slice())
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

  private _filter(bigCategory: string): BigCategory[]  {
    const filterValue = bigCategory.toLowerCase();

    return this.options.filter(option => option.big_category.toLowerCase().includes(filterValue));
  }
  getType(): any{
    return this.myControl.value != null ? this.myControl.value.id : '%';
  }
  setType(name: string){
    for( let bigCategory of this.options){
      if(bigCategory.big_category === name){
        this.myControl.setValue(bigCategory);
        return bigCategory.big_category_id;
      }
    }
  }
  select(): void {
    this.myControl.setValue('');
  }

}
