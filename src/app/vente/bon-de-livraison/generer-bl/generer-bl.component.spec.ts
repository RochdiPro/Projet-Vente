import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenererBlComponent } from './generer-bl.component';

describe('GenererBlComponent', () => {
  let component: GenererBlComponent;
  let fixture: ComponentFixture<GenererBlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GenererBlComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GenererBlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
