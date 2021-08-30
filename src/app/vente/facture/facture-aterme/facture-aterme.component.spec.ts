import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FactureATermeComponent } from './facture-aterme.component';

describe('FactureATermeComponent', () => {
  let component: FactureATermeComponent;
  let fixture: ComponentFixture<FactureATermeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FactureATermeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FactureATermeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
