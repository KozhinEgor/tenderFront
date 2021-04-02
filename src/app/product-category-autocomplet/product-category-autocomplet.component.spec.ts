import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductCategoryAutocompletComponent } from './product-category-autocomplet.component';

describe('ProductCategoryAutocompletComponent', () => {
  let component: ProductCategoryAutocompletComponent;
  let fixture: ComponentFixture<ProductCategoryAutocompletComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductCategoryAutocompletComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductCategoryAutocompletComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
