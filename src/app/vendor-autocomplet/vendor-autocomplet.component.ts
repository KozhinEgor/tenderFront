import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {Vendor} from "../classes";
import {FormControl} from "@angular/forms";
import {Observable} from "rxjs";
import {ApiService} from "../api.service";
import {map, startWith} from "rxjs/operators";
import {ErrorDialogComponent} from "../error-dialog/error-dialog.component";
import {MatDialog} from "@angular/material/dialog";

@Component({
  selector: 'app-vendor-autocomplet',
  templateUrl: './vendor-autocomplet.component.html',
  styleUrls: ['./vendor-autocomplet.component.css']
})
export class VendorAutocompletComponent implements OnInit {

// tslint:disable-next-line:no-output-on-prefix
  @Output() Change = new EventEmitter<Vendor>();


  myControl = new FormControl();
  options: Vendor[] = [];
  filteredOptions: Observable<Vendor[]> | undefined;
  constructor(private api: ApiService, private dialog:MatDialog) {
  }
  public start(category:number){
    this.api.getVendor(category).subscribe( vendors => {
        this.options = vendors;
        this.filteredOptions = this.myControl.valueChanges
          .pipe(
            startWith(''),
            map(value => typeof value === 'string' || value === null ? value :value.name ),
            map(vendor => vendor ? this._filter(vendor) : this.options.slice())
          );
      },
      error => {
        if(error === 'Unknown Error'){this.dialog.open(ErrorDialogComponent, {data: "Ошибка загрузки \"вендоров\": Обратитесь к администратору" });}
        else{this.dialog.open(ErrorDialogComponent, {data: "Ошибка загрузки \"вендоров\": " + error});}

      });
  }

  ngOnInit() {
    this.start(0);
  }

  displayFn(vendor: Vendor): string {
    return vendor && vendor.name ? vendor.name : '';
  }

  setVendor(name: string){
    for(let o of this.options){
      if(o.name === name){
        this.myControl.setValue(o);
      }
    }
  }
  private _filter(name: string): Vendor[] {
    const filterValue = name.toLowerCase();

    return this.options.filter(option => option.name.toLowerCase().includes(filterValue));
  }
}
