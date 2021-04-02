import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VendorCodeAutocompleatComponent } from './vendor-code-autocompleat.component';

describe('VendorCodeAutocompleatComponent', () => {
  let component: VendorCodeAutocompleatComponent;
  let fixture: ComponentFixture<VendorCodeAutocompleatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VendorCodeAutocompleatComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VendorCodeAutocompleatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
