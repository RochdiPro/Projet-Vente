import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenerateDevisFactureComponent } from './generate-devis-facture.component';

describe('GenerateDevisFactureComponent', () => {
  let component: GenerateDevisFactureComponent;
  let fixture: ComponentFixture<GenerateDevisFactureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GenerateDevisFactureComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GenerateDevisFactureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
