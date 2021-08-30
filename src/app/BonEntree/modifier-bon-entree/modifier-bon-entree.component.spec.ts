import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModifierBonEntreeComponent } from './modifier-bon-entree.component';

describe('ModifierBonEntreeComponent', () => {
  let component: ModifierBonEntreeComponent;
  let fixture: ComponentFixture<ModifierBonEntreeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModifierBonEntreeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModifierBonEntreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
