import {Component, OnInit, ViewChild} from '@angular/core';
import {Post, Product, ProductCategory, TenderonProduct} from "../classes";
import {MatTableDataSource} from "@angular/material/table";
import {ApiService} from "../api.service";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {DataRangeComponent} from "../data-range/data-range.component";
import {VendorCodeAutocompleatComponent} from "../vendor-code-autocompleat/vendor-code-autocompleat.component";

@Component({
  selector: 'app-page-tender',
  templateUrl: './page-tender.component.html',
  styleUrls: ['./page-tender.component.css']
})
export class PageTenderComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator | null = null;
  @ViewChild(MatSort) sort: MatSort | null = null;
  dataSource = new MatTableDataSource<Post>();

  @ViewChild(VendorCodeAutocompleatComponent)
  private vendorCodeAutocomplete: VendorCodeAutocompleatComponent;
  @ViewChild(DataRangeComponent)
  private dataRange: DataRangeComponent | undefined;
  tenderonProduct: TenderonProduct;
  product: Product = null;
  Category: ProductCategory = null;
  displayedColumns: string[] = ['id','nameTender','customer','typetender','sum','dateStart','dateFinish','product', 'winner', 'winSum'];
  constructor(private api: ApiService) { }

  ngOnInit(): void {
  }
  onChange(t: any) {
    if (t != null && typeof t !== 'string') {
      this.Category = t;
      this.vendorCodeAutocomplete.start(this.Category.id);
    }
  }
  onChangeVendorCode(product: Product){

    if (product != null && typeof product !== 'string'){
      this.product = product;

    }
  }
  showTables(){

    if(this.Category !== null) {
      this.tenderonProduct = {dateStart: this.dataRange?.getDateStart() || '2018-01-01T00:00Z[UTC]',
                              dateFinish: this.dataRange?.getDateFinish() || '2040-01-01T00:00Z[UTC]',
                              productCategory: this.Category.id,
                              product:  this.product !== null? this.product.id.toString() : '%'}
      console.log(this.tenderonProduct);
      this.api.getTenderOnProduct(this.tenderonProduct).subscribe(posts => {

        this.dataSource = new MatTableDataSource<Post>(posts) ;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      });

    }
  }
}
