import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModifierBonEntreeImportationComponent } from './modifier-bon-entree-importation.component';

describe('ModifierBonEntreeImportationComponent', () => {
  let component: ModifierBonEntreeImportationComponent;
  let fixture: ComponentFixture<ModifierBonEntreeImportationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModifierBonEntreeImportationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModifierBonEntreeImportationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
