import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BigcategoryAutocompletComponent } from './bigcategory-autocomplet.component';

describe('BigcategoryAutocompletComponent', () => {
  let component: BigcategoryAutocompletComponent;
  let fixture: ComponentFixture<BigcategoryAutocompletComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BigcategoryAutocompletComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BigcategoryAutocompletComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
