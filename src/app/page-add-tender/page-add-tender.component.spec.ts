import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PageAddTenderComponent } from './page-add-tender.component';

describe('PageAddTenderComponent', () => {
  let component: PageAddTenderComponent;
  let fixture: ComponentFixture<PageAddTenderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PageAddTenderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PageAddTenderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
