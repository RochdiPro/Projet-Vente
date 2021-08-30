import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditerBonEntreeImportationComponent } from './editer-bon-entree-importation.component';

describe('EditerBonEntreeImportationComponent', () => {
  let component: EditerBonEntreeImportationComponent;
  let fixture: ComponentFixture<EditerBonEntreeImportationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditerBonEntreeImportationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditerBonEntreeImportationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
