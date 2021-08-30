import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AjouterBonEntreeComponent } from './ajouter-bon-entree.component';

describe('AjouterBonEntreeComponent', () => {
  let component: AjouterBonEntreeComponent;
  let fixture: ComponentFixture<AjouterBonEntreeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AjouterBonEntreeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AjouterBonEntreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
