import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VoirPlusDialogComponent } from './voir-plus-dialog.component';

describe('VoirPlusDialogComponent', () => {
  let component: VoirPlusDialogComponent;
  let fixture: ComponentFixture<VoirPlusDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VoirPlusDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VoirPlusDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
