import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoSimpleDialogComponent } from './info-simple-dialog.component';

describe('InfoSimpleDialogComponent', () => {
  let component: InfoSimpleDialogComponent;
  let fixture: ComponentFixture<InfoSimpleDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InfoSimpleDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InfoSimpleDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
