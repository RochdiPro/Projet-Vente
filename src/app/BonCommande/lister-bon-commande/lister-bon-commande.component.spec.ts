import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListerBonCommandeComponent } from './lister-bon-commande.component';

describe('ListerBonCommandeComponent', () => {
  let component: ListerBonCommandeComponent;
  let fixture: ComponentFixture<ListerBonCommandeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListerBonCommandeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListerBonCommandeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
