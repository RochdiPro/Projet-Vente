import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditerBonEntreeComponent } from './editer-bon-entree.component';

describe('EditerBonEntreeComponent', () => {
  let component: EditerBonEntreeComponent;
  let fixture: ComponentFixture<EditerBonEntreeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditerBonEntreeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditerBonEntreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
