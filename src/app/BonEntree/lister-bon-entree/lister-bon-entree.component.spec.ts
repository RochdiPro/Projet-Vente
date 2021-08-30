import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListerBonEntreeComponent } from './lister-bon-entree.component';

describe('ListerBonEntreeComponent', () => {
  let component: ListerBonEntreeComponent;
  let fixture: ComponentFixture<ListerBonEntreeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListerBonEntreeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListerBonEntreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
