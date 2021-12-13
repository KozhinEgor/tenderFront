import {Component, EventEmitter, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-category-product',
  templateUrl: './category-product.component.html',
  styleUrls: ['./category-product.component.css']
})
export class CategoryProductComponent implements OnInit {
  category_product: string;
  @Output() Change = new EventEmitter<string>();
  constructor() { }

  ngOnInit(): void {
  }
  getCategory_product(): string{
    return this.category_product;
  }
  setCategory_product(category_product: string){
    this.category_product = category_product;
  }
}
