import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogContentAddArticleDialogComponent } from './dialog-content-add-article-dialog.component';

describe('DialogContentAddArticleDialogComponent', () => {
  let component: DialogContentAddArticleDialogComponent;
  let fixture: ComponentFixture<DialogContentAddArticleDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogContentAddArticleDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogContentAddArticleDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
