import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VendorCheckboxComponent } from './vendor-checkbox.component';

describe('VendorCheckboxComponent', () => {
  let component: VendorCheckboxComponent;
  let fixture: ComponentFixture<VendorCheckboxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VendorCheckboxComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VendorCheckboxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
