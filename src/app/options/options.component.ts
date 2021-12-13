import { Component, OnInit } from '@angular/core';
import {FormControl} from "@angular/forms";
import{ Option} from "../classes";
import {ApiService} from "../api.service";
@Component({
  selector: 'app-options',
  templateUrl: './options.component.html',
  styleUrls: ['./options.component.css']
})
export class OptionsComponent implements OnInit {
  options: Option[];
  option = new FormControl();
  selected_options: string = null;
  constructor(private api:ApiService) { }

  ngOnInit(): void {

  }
  getAllOption(){
    this.api.getAllOption().subscribe(
      data => {
        this.options = data;
      }
    )
  }
  getAllOptionByProduct(product_category: number, id_product: number){
    this.api.getAllOptionByProduct(product_category,id_product).subscribe(
      data => {
        this.options = data;
        this.option.setValue(null);
        if(this.selected_options !== null){
          this.setOption(this.selected_options);
        }
      }
    )
  }
  setOption(id_string: string){
    this.option.setValue(null);
    if(id_string !== null){
      let mas = id_string.split(' ').map(x => x.trim());
      let op:Option[] = this.options.filter(x => mas.includes(x.name));
      this.option.setValue(op);

    }
    else {
      this.option.setValue(null);
    }
    this.selected_options = null;
  }

  toString(): string{
    if(this.option.value == null){
      return '';
    }
    let options:string = '';
    for(let option of this.option.value){
      options=options+' '+ option.name;
    }
    return options;
  }
}
