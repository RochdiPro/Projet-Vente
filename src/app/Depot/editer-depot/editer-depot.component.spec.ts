import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditerDepotComponent } from './editer-depot.component';

describe('EditerDepotComponent', () => {
  let component: EditerDepotComponent;
  let fixture: ComponentFixture<EditerDepotComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditerDepotComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditerDepotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
