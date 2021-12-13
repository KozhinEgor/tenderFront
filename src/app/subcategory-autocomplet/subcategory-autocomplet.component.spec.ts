import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubcategoryAutocompletComponent } from './subcategory-autocomplet.component';

describe('SubcategoryAutocompletComponent', () => {
  let component: SubcategoryAutocompletComponent;
  let fixture: ComponentFixture<SubcategoryAutocompletComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubcategoryAutocompletComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SubcategoryAutocompletComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
