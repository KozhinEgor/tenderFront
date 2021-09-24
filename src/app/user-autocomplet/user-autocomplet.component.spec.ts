import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserAutocompletComponent } from './user-autocomplet.component';

describe('UserAutocompletComponent', () => {
  let component: UserAutocompletComponent;
  let fixture: ComponentFixture<UserAutocompletComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserAutocompletComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserAutocompletComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
