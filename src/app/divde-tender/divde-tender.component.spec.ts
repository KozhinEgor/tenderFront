import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DivdeTenderComponent } from './divde-tender.component';

describe('DivdeTenderComponent', () => {
  let component: DivdeTenderComponent;
  let fixture: ComponentFixture<DivdeTenderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DivdeTenderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DivdeTenderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
