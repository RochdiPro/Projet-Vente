import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListerBlComponent } from './lister-bl.component';

describe('ListerBlComponent', () => {
  let component: ListerBlComponent;
  let fixture: ComponentFixture<ListerBlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListerBlComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListerBlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
