import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfosDialogComponent } from './infos-dialog.component';

describe('InfosDialogComponent', () => {
  let component: InfosDialogComponent;
  let fixture: ComponentFixture<InfosDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InfosDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InfosDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
