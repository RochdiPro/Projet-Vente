import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorIntl, MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatStepperModule } from '@angular/material/stepper';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorIntlCro } from '../matPaginatorIntlCro';
import { AjouterDevisComponent } from './ajouter-devis/ajouter-devis.component';
import { DialogContentAddArticleDialogComponent } from './ajouter-devis/dialog-content-add-article-dialog/dialog-content-add-article-dialog.component';
import { UpdateDialogOverviewArticleDialogComponent } from './ajouter-devis/update-dialog-overview-article-dialog/update-dialog-overview-article-dialog.component';
import { DevisRoutingModule } from './devis-routing.module';
import { ListerDevisComponent } from './lister-devis/lister-devis.component';
import { UpdateDevisComponent } from './update-devis/update-devis.component';
import { VoirPlusDialogComponent } from './ajouter-devis/voir-plus-dialog/voir-plus-dialog.component';








@NgModule({
  declarations: [AjouterDevisComponent, ListerDevisComponent, DialogContentAddArticleDialogComponent, UpdateDialogOverviewArticleDialogComponent, UpdateDevisComponent, VoirPlusDialogComponent],
  imports: [
    CommonModule,
    DevisRoutingModule,
    MatStepperModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSelectModule,
    MatButtonModule,
    MatProgressBarModule,
    MatTableModule,
    FormsModule,
    MatPaginatorModule,
    ReactiveFormsModule,
  ],
  providers: [{ provide: MatPaginatorIntl, useClass: MatPaginatorIntlCro }]
})
export class DevisModule { }
