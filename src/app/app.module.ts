import { NgxMatFileInputModule } from '@angular-material-components/file-input';
import { PortalModule } from '@angular/cdk/portal';
import { CommonModule, DatePipe } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
// import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatSortModule } from '@angular/material/sort';
import { MatStepperModule } from '@angular/material/stepper';
import { MatTableModule } from '@angular/material/table';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgSelectModule } from '@ng-select/ng-select';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AjouterBonCommandeComponent } from './BonCommande/ajouter-bon-commande/ajouter-bon-commande.component';
import { EditerBonCommandeComponent } from './BonCommande/editer-bon-commande/editer-bon-commande.component';
import { ListerBonCommandeComponent } from './BonCommande/lister-bon-commande/lister-bon-commande.component';
import { ModifierBonCommandeComponent } from './BonCommande/modifier-bon-commande/modifier-bon-commande.component';
import { AjouterBonEntreeComponent, DialogOverview4gDialog, DialogOverviewArticleDialog, DialogOverviewChargeDialog, DialogOverviewSerieDialog } from './BonEntree/ajouter-bon-entree/ajouter-bon-entree.component';
import { EditerBonEntreeComponent } from './BonEntree/editer-bon-entree/editer-bon-entree.component';
import { ListerBonEntreeComponent } from './BonEntree/lister-bon-entree/lister-bon-entree.component';
import { Dialog4gModifBonEntreeLocal, DialogSerieModifBonEntreeLocal, ModifierBonEntreeComponent } from './BonEntree/modifier-bon-entree/modifier-bon-entree.component';
import { DialogOverviewExampleDialog, TestComponent } from './BonEntree/test/test.component';
import { AjouterBonEntreeImportationComponent } from './BonEntreeImportation/ajouter-bon-entree-importation/ajouter-bon-entree-importation.component';
import { EditerBonEntreeImportationComponent } from './BonEntreeImportation/editer-bon-entree-importation/editer-bon-entree-importation.component';
import { ListerBonEntreeImportationComponent } from './BonEntreeImportation/lister-bon-entree-importation/lister-bon-entree-importation.component';
import { ModifierBonEntreeImportationComponent } from './BonEntreeImportation/modifier-bon-entree-importation/modifier-bon-entree-importation.component';
import { AjouterDepotComponent } from './Depot/ajouter-depot/ajouter-depot.component';
import { EditerDepotComponent } from './Depot/editer-depot/editer-depot.component';
import { ListerDepotComponent } from './Depot/lister-depot/lister-depot.component';
import { ModifierDepotComponent } from './Depot/modifier-depot/modifier-depot.component';
import { EditerDonneesComponent } from './Donnees/editer-donnees/editer-donnees.component';
import { MenuComponent } from './menu/menu.component';
import { BonDeLivraisonComponent } from './vente/bon-de-livraison/bon-de-livraison.component';
import { DevisComponent } from './vente/devis/devis.component';
import { FactureComponent } from './vente/facture/facture.component';

@NgModule({
  declarations: [
    AppComponent,
    EditerDepotComponent,
    AjouterDepotComponent,
    ModifierDepotComponent,
    ListerDepotComponent,
    MenuComponent,
    EditerDonneesComponent,
    EditerBonEntreeComponent,
    ListerBonEntreeComponent,
    AjouterBonEntreeComponent,
    ModifierBonEntreeComponent,
    TestComponent,
    DialogOverviewExampleDialog,
    DialogOverviewArticleDialog,
    DialogOverviewChargeDialog,
    DialogOverviewSerieDialog,
    DialogOverview4gDialog,
    Dialog4gModifBonEntreeLocal,
    DialogSerieModifBonEntreeLocal,
    ModifierBonEntreeImportationComponent,
    AjouterBonEntreeImportationComponent,
    ListerBonEntreeImportationComponent,
    EditerBonEntreeImportationComponent,
    ModifierBonCommandeComponent,
    ListerBonCommandeComponent,
    EditerBonCommandeComponent,
    AjouterBonCommandeComponent,
    DevisComponent,
    FactureComponent,
    BonDeLivraisonComponent,  
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MatStepperModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    PortalModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatSelectModule,
    MatPaginatorModule,
    MatDialogModule,
    MatCheckboxModule,
    MatTableModule,
    MatSortModule,
    CommonModule,
    NgxMatFileInputModule,
    // MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule,
    NgSelectModule
  ],
  providers: [DatePipe,],
  bootstrap: [AppComponent]
})
export class AppModule { }
