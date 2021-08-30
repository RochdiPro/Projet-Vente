import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModifierDepotComponent } from './modifier-depot.component';

describe('ModifierDepotComponent', () => {
  let component: ModifierDepotComponent;
  let fixture: ComponentFixture<ModifierDepotComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModifierDepotComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModifierDepotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
