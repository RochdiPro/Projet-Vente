import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConvertDevisToBlComponent } from './convert-devis-to-bl.component';

describe('ConvertDevisToBlComponent', () => {
  let component: ConvertDevisToBlComponent;
  let fixture: ComponentFixture<ConvertDevisToBlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConvertDevisToBlComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConvertDevisToBlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
