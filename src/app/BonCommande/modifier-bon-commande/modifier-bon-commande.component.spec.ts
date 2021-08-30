import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModifierBonCommandeComponent } from './modifier-bon-commande.component';

describe('ModifierBonCommandeComponent', () => {
  let component: ModifierBonCommandeComponent;
  let fixture: ComponentFixture<ModifierBonCommandeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModifierBonCommandeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModifierBonCommandeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
