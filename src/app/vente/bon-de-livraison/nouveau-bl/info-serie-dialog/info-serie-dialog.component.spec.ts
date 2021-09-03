import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoSerieDialogComponent } from './info-serie-dialog.component';

describe('InfoSerieDialogComponent', () => {
  let component: InfoSerieDialogComponent;
  let fixture: ComponentFixture<InfoSerieDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InfoSerieDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InfoSerieDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
