import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListerDevisComponent } from './lister-devis.component';

describe('ListerDevisComponent', () => {
  let component: ListerDevisComponent;
  let fixture: ComponentFixture<ListerDevisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListerDevisComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListerDevisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
