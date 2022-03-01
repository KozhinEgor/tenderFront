import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DublicateDialogComponent } from './dublicate-dialog.component';

describe('DublicateDialogComponent', () => {
  let component: DublicateDialogComponent;
  let fixture: ComponentFixture<DublicateDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DublicateDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DublicateDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
