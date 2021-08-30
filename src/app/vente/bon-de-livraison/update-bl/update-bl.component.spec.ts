import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateBlComponent } from './update-bl.component';

describe('UpdateBlComponent', () => {
  let component: UpdateBlComponent;
  let fixture: ComponentFixture<UpdateBlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdateBlComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateBlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
