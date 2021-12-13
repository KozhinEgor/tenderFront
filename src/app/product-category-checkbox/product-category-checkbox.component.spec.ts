import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductCategoryCheckboxComponent } from './product-category-checkbox.component';

describe('ProductCategoryCheckboxComponent', () => {
  let component: ProductCategoryCheckboxComponent;
  let fixture: ComponentFixture<ProductCategoryCheckboxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductCategoryCheckboxComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductCategoryCheckboxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
