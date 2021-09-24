import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BigCategoryReportComponent } from './big-category-report.component';

describe('BigCategoryReportComponent', () => {
  let component: BigCategoryReportComponent;
  let fixture: ComponentFixture<BigCategoryReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BigCategoryReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BigCategoryReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
