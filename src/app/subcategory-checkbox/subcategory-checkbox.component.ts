import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {ProductCategory} from "../classes";
import {FormControl} from "@angular/forms";
import {ApiService} from "../api.service";
import {MatDialog} from "@angular/material/dialog";
import {ErrorDialogComponent} from "../error-dialog/error-dialog.component";
import {map, startWith} from "rxjs/operators";

@Component({
  selector: 'app-subcategory-checkbox',
  templateUrl: './subcategory-checkbox.component.html',
  styleUrls: ['./subcategory-checkbox.component.css']
})
export class SubcategoryCheckboxComponent implements OnInit {

  subcategories: string[];
  myControl= new FormControl();
  @Output() Change = new EventEmitter<string>();
  constructor(private api: ApiService, private dialog:MatDialog) { }

  ngOnInit(): void {
    this.api.getAllSubcategory().subscribe(
      data=>{
        if(data == null){
          this.myControl.disable();
        }
        else {
          this.subcategories = data;

        }
      }
    )

  }

}
