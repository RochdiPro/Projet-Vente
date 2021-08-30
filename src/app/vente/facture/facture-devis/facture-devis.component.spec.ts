import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FactureDevisComponent } from './facture-devis.component';

describe('FactureDevisComponent', () => {
  let component: FactureDevisComponent;
  let fixture: ComponentFixture<FactureDevisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FactureDevisComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FactureDevisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
