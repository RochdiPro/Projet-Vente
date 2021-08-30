import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NouveauBLComponent } from './nouveau-bl.component';

describe('NouveauBLComponent', () => {
  let component: NouveauBLComponent;
  let fixture: ComponentFixture<NouveauBLComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NouveauBLComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NouveauBLComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
