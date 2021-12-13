import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DistrictSelectedComponent } from './district-selected.component';

describe('DistrictSelectedComponent', () => {
  let component: DistrictSelectedComponent;
  let fixture: ComponentFixture<DistrictSelectedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DistrictSelectedComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DistrictSelectedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
