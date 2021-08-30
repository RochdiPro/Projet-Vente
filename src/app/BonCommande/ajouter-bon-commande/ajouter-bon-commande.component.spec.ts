import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AjouterBonCommandeComponent } from './ajouter-bon-commande.component';

describe('AjouterBonCommandeComponent', () => {
  let component: AjouterBonCommandeComponent;
  let fixture: ComponentFixture<AjouterBonCommandeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AjouterBonCommandeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AjouterBonCommandeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
