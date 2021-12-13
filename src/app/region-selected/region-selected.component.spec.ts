import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegionSelectedComponent } from './region-selected.component';

describe('RegionSelectedComponent', () => {
  let component: RegionSelectedComponent;
  let fixture: ComponentFixture<RegionSelectedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegionSelectedComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RegionSelectedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
