import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormControl} from "@angular/forms";
import { User} from "../classes";
import {Observable} from "rxjs";
import {ApiService} from "../api.service";
import {MatDialog} from "@angular/material/dialog";
import {map, startWith} from "rxjs/operators";
import {ErrorDialogComponent} from "../error-dialog/error-dialog.component";

@Component({
  selector: 'app-user-autocomplet',
  templateUrl: './user-autocomplet.component.html',
  styleUrls: ['./user-autocomplet.component.css']
})
export class UserAutocompletComponent implements OnInit {

  @Input() value = '';
  @Output() Change = new EventEmitter<number>();
  myControl = new FormControl();
  options: User[] = [];
  filteredOptions: Observable<User[]> | undefined;
  constructor(private api: ApiService, private dialog:MatDialog) {
  }
  public changeValue(category: string): void{
    this.myControl.setValue(this._filter(category));
  }
  ngOnInit() {
    this.api.getAllUsers().subscribe( users => {
        this.options = users;
        this.filteredOptions = this.myControl.valueChanges
          .pipe(
            startWith(''),
            map(value => typeof value === 'string' ? value : value.user),
            map(user => user ? this._filter(user) : this.options.slice())
          );
      },
      error => {
        if(error === 'Unknown Error'){this.dialog.open(ErrorDialogComponent, {data: "Ошибка загрузки \"пользователей\": Обратитесь к администратору"});}
        else {this.dialog.open(ErrorDialogComponent, {data: "Ошибка загрузки \"пользователей\": " + error});}

      });
    this.myControl.setValue({name: this.value});
  }

  displayFn(user: User): string {
    return user && user.nickname ? user.nickname : '';
  }

  private _filter(user: string): User[] {
    const filterValue = user.toLowerCase();

    return this.options.filter(option => option.nickname.toLowerCase().includes(filterValue));
  }


  select(): void {
    this.myControl.setValue('');
  }

}
