import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormControl} from "@angular/forms";
import {Company} from "../classes";
import {Observable} from "rxjs";
import {ApiService} from "../api.service";
import {map, startWith} from "rxjs/operators";
import {MatDialog} from "@angular/material/dialog";
import {ErrorDialogComponent} from "../error-dialog/error-dialog.component";

@Component({
  selector: 'app-winner-autocomplet',
  templateUrl: './winner-autocomplet.component.html',
  styleUrls: ['./winner-autocomplet.component.scss']
})
export class WinnerAutocompletComponent implements OnInit {
  @Output() Change = new EventEmitter<number>();
  myControl = new FormControl();
  options: Company[] = [];
  filteredOptions: Observable<Company[]> | undefined;

  constructor(private api: ApiService, private dialog:MatDialog) {
  }
  ngOnInit() {
    this.update()
  }
  setWinner(name: string){
  if (name !== null && name !== undefined){
    for( let win of this.options){
      if(win.name === name ){
        this.myControl.setValue(win);
      }
    }
  }

  }
  setWinnerById(id:number){

    this.myControl.setValue(this.options.find(op => op.id === id));
  }
  displayFn(winner: Company): string {
    return winner && winner.name ? winner.name : '';
  }

  private _filter(winner: string): Company[] {
    const filterValue = winner.toLowerCase();

    return this.options.filter(option => option.name.toLowerCase().includes(filterValue));
  }
  getWinner(): string{
    return this.myControl.value != null ? this.myControl.value.id : '%';
  }
  public changeValue(category: string): void{
    this.myControl.setValue(this._filter(category));
  }
  public update(){
    this.api.getAllWinner().subscribe( winners => {
      this.options = winners;
      this.filteredOptions = this.myControl.valueChanges
        .pipe(
          startWith(''),
          map(value => typeof value === 'string' ? value : value.name),
          map(winner => winner ? this._filter(winner) : this.options.slice())
        );

    },
      error => {
        if(error === 'Unknown Error'){this.dialog.open(ErrorDialogComponent, {data: "Ошибка загрузки \"победителей\": Обратитесь к администратору" });}
        else{this.dialog.open(ErrorDialogComponent, {data: "Ошибка загрузки \"победителей\": " + error});}

      });
  }
}
