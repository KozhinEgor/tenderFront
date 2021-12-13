import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TypeProductOrderComponent } from './type-product-order.component';

describe('TypeProductOrderComponent', () => {
  let component: TypeProductOrderComponent;
  let fixture: ComponentFixture<TypeProductOrderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TypeProductOrderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TypeProductOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
