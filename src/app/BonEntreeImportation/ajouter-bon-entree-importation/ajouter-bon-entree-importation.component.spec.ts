import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AjouterBonEntreeImportationComponent } from './ajouter-bon-entree-importation.component';

describe('AjouterBonEntreeImportationComponent', () => {
  let component: AjouterBonEntreeImportationComponent;
  let fixture: ComponentFixture<AjouterBonEntreeImportationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AjouterBonEntreeImportationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AjouterBonEntreeImportationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
