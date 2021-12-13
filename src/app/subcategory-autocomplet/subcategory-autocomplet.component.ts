import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ApiService} from "../api.service";
import {FormControl} from "@angular/forms";
import {Country} from "../classes";
import {map, startWith} from "rxjs/operators";
import {Observable} from "rxjs";

@Component({
  selector: 'app-subcategory-autocomplet',
  templateUrl: './subcategory-autocomplet.component.html',
  styleUrls: ['./subcategory-autocomplet.component.css']
})
export class SubcategoryAutocompletComponent implements OnInit{
  subcategory: string[];
  myControl = new FormControl();
  options: string[] = [];
  @Output() Change = new EventEmitter<string>();
  filteredOptions: Observable<string[]> | undefined;
  constructor(private api: ApiService) { }

@Input() categ:number;

  ngOnInit() {
    this.api.getAllSubcategory().subscribe(
      data=>{
        if(data == null){
          this.myControl.disable();
        }
        else{
          this.options = data;

          this.filteredOptions = this.myControl.valueChanges
            .pipe(
              startWith(''),
              map(value => typeof value === 'string' ? value : ''),
              map(subcategory => typeof subcategory === 'string'? this._filter(subcategory) : this.options.slice())
            )
        }

      }
    )
  }

  setSubCategory(category: number){
    this.api.getSubcategory(category).subscribe(
      data=>{
        if(data == null){
          this.myControl.disable();
        }
        else{
          this.options = data;

          this.filteredOptions = this.myControl.valueChanges
            .pipe(
              startWith(''),
              map(value => typeof value === 'string' ? value : ''),
              map(subcategory => typeof subcategory === 'string'? this._filter(subcategory) : this.options.slice())
            )
        }

      }
    )
  }
  displayFn(subcategory: string): string {
    return subcategory ? subcategory : '';
  }

  private _filter(name: string):string[] {

      const filterValue = name.toLowerCase();

      return this.options.filter(name => {
        if(name == null){
          return false;
        }
        else {
          return name.toLowerCase().includes(filterValue);
        }
      }
      )



  }
  setSubcategoryBYName(name: string){
    for(let o of this.options){
      if(o === name){
        this.myControl.setValue(o);
      }
    }
  }

}
