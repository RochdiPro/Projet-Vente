import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AjouterDepotComponent } from './ajouter-depot.component';

describe('AjouterDepotComponent', () => {
  let component: AjouterDepotComponent;
  let fixture: ComponentFixture<AjouterDepotComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AjouterDepotComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AjouterDepotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
