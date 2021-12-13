import {Component, EventEmitter, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-type-product-order',
  templateUrl: './type-product-order.component.html',
  styleUrls: ['./type-product-order.component.css']
})
export class TypeProductOrderComponent implements OnInit {

  type: string = "Год";
  @Output() Change = new EventEmitter<string>();
  constructor() { }

  ngOnInit(): void {
  }

}
