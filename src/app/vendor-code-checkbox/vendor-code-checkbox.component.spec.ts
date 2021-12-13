import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VendorCodeCheckboxComponent } from './vendor-code-checkbox.component';

describe('VendorCodeCheckboxComponent', () => {
  let component: VendorCodeCheckboxComponent;
  let fixture: ComponentFixture<VendorCodeCheckboxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VendorCodeCheckboxComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VendorCodeCheckboxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
