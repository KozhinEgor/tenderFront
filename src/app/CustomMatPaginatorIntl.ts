import {Injectable} from "@angular/core";
import {MatPaginatorIntl} from "@angular/material/paginator";

@Injectable()
export class CustomMatPaginatorIntl extends MatPaginatorIntl{
  constructor() {
    super();
    this.getAndInitTR();
  }
  getAndInitTR(){
    this.itemsPerPageLabel = 'Количество записей на странице';
    this.nextPageLabel = 'testNext';
    this.previousPageLabel = 'testPrev';
    this.changes.next();
  }
  getRangeLabel = (page:number, pageSize: number, length: number) =>{
    if(page === 0 || pageSize === 0){
      return `0 из ${length}`;
    }
    length = Math.max(length,0);
    const startIndex = page*pageSize;
    const endIndex = startIndex < length? Math.min(startIndex + pageSize, length):startIndex + pageSize;
    return `${startIndex+1} - ${endIndex} из ${length}`;
  }
}
