import {Component, EventEmitter, Inject, Input, OnInit, Output} from '@angular/core';
import {FormControl} from "@angular/forms";
import {Post, SearchParameters} from "../classes";
import {Observable} from "rxjs";
import {ApiService} from "../api.service";
import {MAT_DIALOG_DATA, MatDialog} from "@angular/material/dialog";
import {map, startWith} from "rxjs/operators";
import {ErrorDialogComponent} from "../error-dialog/error-dialog.component";
import {DeleteTenderComponent} from "../tender-table/tender-table.component";

@Component({
  selector: 'app-save-parametrs',
  templateUrl: './save-parametrs.component.html',
  styleUrls: ['./save-parametrs.component.css']
})
export class SaveParametrsComponent implements OnInit {
@Input() value = '';
@Output() Change = new EventEmitter<number>();
  myControl = new FormControl();
  options: SearchParameters[] = [];
  filteredOptions: Observable<SearchParameters[]> | undefined;
  constructor(private api: ApiService, private dialog:MatDialog) {
  }
public changeValue(category: string): void{
    this.myControl.setValue(this._filter(category));
  }
  ngOnInit() {
    this.api.SaveParameters().subscribe( types => {
        this.setOprions(types)
      },
      error => {
        if(error === 'Unknown Error'){this.dialog.open(ErrorDialogComponent, {data: "Ошибка загрузки \"сохраненных поисков\": Обратитесь к администратору"});}
        else {this.dialog.open(ErrorDialogComponent, {data: "Ошибка загрузки \"сохраненных поисков\": " + error});}

      });
    this.myControl.setValue({name: this.value});
  }

  displayFn(type: SearchParameters): string {
    return type && type.name ? type.name : '';
  }

private _filter(type: string): SearchParameters[] {
    const filterValue = type.toLowerCase();

    return this.options.filter(option => option.name.toLowerCase().includes(filterValue));
  }
setOprions(options:SearchParameters[]){
  this.options = options;
  this.filteredOptions = this.myControl.valueChanges
    .pipe(
      startWith(''),
      map(value => typeof value === 'string' ? value : value.name),
      map(name => name ? this._filter(name) : this.options.slice())
    );
}
delete(){
    this.dialog.open(DeleteSearchComponent,{data:this.myControl.value}).afterClosed().subscribe(result => {
        if (result) {
          this.api.deleteSaveParameters(this.myControl.value.id).subscribe(data => {
            this.setOprions(data);
              this.dialog.open(ErrorDialogComponent, {data: 'Удалил'});
            },
            err => {
              this.dialog.open(ErrorDialogComponent, {data: err});
            });
          this.myControl.setValue('');
        }
      }
    );
}

}
@Component({
  selector: 'deleteSearch',
  templateUrl: '../save-parametrs/deleteSearch.html',
})
export class DeleteSearchComponent {

  constructor(@Inject(MAT_DIALOG_DATA) public data: SearchParameters) {
  }

}
