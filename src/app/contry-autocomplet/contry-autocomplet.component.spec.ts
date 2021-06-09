import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContryAutocompletComponent } from './contry-autocomplet.component';

describe('ContryAutocompletComponent', () => {
  let component: ContryAutocompletComponent;
  let fixture: ComponentFixture<ContryAutocompletComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContryAutocompletComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ContryAutocompletComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
