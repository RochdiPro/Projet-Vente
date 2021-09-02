import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlFactureComponent } from './bl-facture.component';

describe('BlFactureComponent', () => {
  let component: BlFactureComponent;
  let fixture: ComponentFixture<BlFactureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BlFactureComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BlFactureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
