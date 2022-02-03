import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PageSetWinnerComponent } from './page-set-winner.component';

describe('PageSetWinnerComponent', () => {
  let component: PageSetWinnerComponent;
  let fixture: ComponentFixture<PageSetWinnerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PageSetWinnerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PageSetWinnerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
