import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateDialogOverviewArticleDialogComponent } from './update-dialog-overview-article-dialog.component';

describe('UpdateDialogOverviewArticleDialogComponent', () => {
  let component: UpdateDialogOverviewArticleDialogComponent;
  let fixture: ComponentFixture<UpdateDialogOverviewArticleDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdateDialogOverviewArticleDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateDialogOverviewArticleDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
