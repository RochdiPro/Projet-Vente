import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditerDonneesComponent } from './editer-donnees.component';

describe('EditerDonneesComponent', () => {
  let component: EditerDonneesComponent;
  let fixture: ComponentFixture<EditerDonneesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditerDonneesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditerDonneesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
