import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BigCategoryComponent } from './big-category.component';

describe('BigCategoryComponent', () => {
  let component: BigCategoryComponent;
  let fixture: ComponentFixture<BigCategoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BigCategoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BigCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
