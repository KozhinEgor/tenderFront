import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {Product, Vendor} from "../classes";
import {FormControl} from "@angular/forms";
import {Observable} from "rxjs";
import {ApiService} from "../api.service";
import {map, startWith} from "rxjs/operators";

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
  constructor(private api: ApiService) {
  }
  public start(){

  }

  ngOnInit() {
    this.api.getVendor().subscribe( vendors => {

      this.options = vendors;
      this.filteredOptions = this.myControl.valueChanges
        .pipe(
          startWith(''),
          map(value => typeof value === 'string' ? value : value.name),
          map(vendor => vendor ? this._filter(vendor) : this.options.slice())
        );
    });
  }

  displayFn(vendor: Vendor): string {
    return vendor && vendor.name ? vendor.name : '';
  }

  private _filter(name: string): Vendor[] {
    const filterValue = name.toLowerCase();

    return this.options.filter(option => option.name.toLowerCase().includes(filterValue));
  }
  getProduct(): any{
    return this.myControl.value != null ? this.myControl.value.id : '%';
  }
}
