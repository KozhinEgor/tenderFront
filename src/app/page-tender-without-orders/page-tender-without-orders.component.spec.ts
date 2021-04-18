import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PageTenderWithoutOrdersComponent } from './page-tender-without-orders.component';

describe('PageTenderWithoutOrdersComponent', () => {
  let component: PageTenderWithoutOrdersComponent;
  let fixture: ComponentFixture<PageTenderWithoutOrdersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PageTenderWithoutOrdersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PageTenderWithoutOrdersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
