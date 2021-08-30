import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListerDepotComponent } from './lister-depot.component';

describe('ListerDepotComponent', () => {
  let component: ListerDepotComponent;
  let fixture: ComponentFixture<ListerDepotComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListerDepotComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListerDepotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
