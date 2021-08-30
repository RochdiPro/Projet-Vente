import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AjouterBlComponent } from './ajouter-bl.component';

describe('AjouterBlComponent', () => {
  let component: AjouterBlComponent;
  let fixture: ComponentFixture<AjouterBlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AjouterBlComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AjouterBlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
