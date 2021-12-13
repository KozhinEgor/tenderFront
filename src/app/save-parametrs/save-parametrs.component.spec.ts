import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaveParametrsComponent } from './save-parametrs.component';

describe('SaveParametrsComponent', () => {
  let component: SaveParametrsComponent;
  let fixture: ComponentFixture<SaveParametrsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SaveParametrsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SaveParametrsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
