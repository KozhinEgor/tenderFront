import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VendorAutocompletComponent } from './vendor-autocomplet.component';

describe('VendorAutocompletComponent', () => {
  let component: VendorAutocompletComponent;
  let fixture: ComponentFixture<VendorAutocompletComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VendorAutocompletComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VendorAutocompletComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
