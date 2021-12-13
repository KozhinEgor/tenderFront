import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubcategoryCheckboxComponent } from './subcategory-checkbox.component';

describe('SubcategoryCheckboxComponent', () => {
  let component: SubcategoryCheckboxComponent;
  let fixture: ComponentFixture<SubcategoryCheckboxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubcategoryCheckboxComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SubcategoryCheckboxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
