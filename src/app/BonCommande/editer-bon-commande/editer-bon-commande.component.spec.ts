import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditerBonCommandeComponent } from './editer-bon-commande.component';

describe('EditerBonCommandeComponent', () => {
  let component: EditerBonCommandeComponent;
  let fixture: ComponentFixture<EditerBonCommandeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditerBonCommandeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditerBonCommandeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
