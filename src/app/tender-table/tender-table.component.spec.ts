import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TenderTableComponent } from './tender-table.component';

describe('TenderTableComponent', () => {
  let component: TenderTableComponent;
  let fixture: ComponentFixture<TenderTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TenderTableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TenderTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
