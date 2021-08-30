import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DevisBLComponent } from './devis-bl.component';

describe('DevisBLComponent', () => {
  let component: DevisBLComponent;
  let fixture: ComponentFixture<DevisBLComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DevisBLComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DevisBLComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
