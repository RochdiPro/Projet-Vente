import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
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
import {MatExpansionModule} from '@angular/material/expansion';

import { AjouterFactureComponent } from './ajouter-facture/ajouter-facture.component';
import { FactureATermeComponent } from './facture-aterme/facture-aterme.component';
import { FactureDevisComponent } from './facture-devis/facture-devis.component';
import { FactureRoutingModule } from './facture-routing.module';
import { ListerFactureComponent } from './lister-facture/lister-facture.component';
import { UpdateFactureComponent } from './update-facture/update-facture.component';



@NgModule({
  declarations: [FactureATermeComponent, FactureDevisComponent, AjouterFactureComponent, ListerFactureComponent, UpdateFactureComponent],
  imports: [
    CommonModule,
    FactureRoutingModule,
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
    MatCardModule,
    MatExpansionModule
  ],
  providers: [{ provide: MatPaginatorIntl, useClass: MatPaginatorIntlCro }]
})
export class FactureModule { }
