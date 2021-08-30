import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListerBonEntreeImportationComponent } from './lister-bon-entree-importation.component';

describe('ListerBonEntreeImportationComponent', () => {
  let component: ListerBonEntreeImportationComponent;
  let fixture: ComponentFixture<ListerBonEntreeImportationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListerBonEntreeImportationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListerBonEntreeImportationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
