import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PageTenderComponent } from './page-tender.component';

describe('PageTenderComponent', () => {
  let component: PageTenderComponent;
  let fixture: ComponentFixture<PageTenderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PageTenderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PageTenderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
