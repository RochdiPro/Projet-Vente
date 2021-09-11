import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FactureComponent } from '../../vente/facture/facture.component';
import { AjouterFactureComponent } from './ajouter-facture/ajouter-facture.component';
import { BlFactureComponent } from './bl-facture/bl-facture.component';
import { FactureATermeComponent } from './facture-aterme/facture-aterme.component';
import { FactureDevisComponent } from './facture-devis/facture-devis.component';
import { GenerateDevisFactureComponent } from './generate-devis-facture/generate-devis-facture.component';
import { ListerFactureComponent } from './lister-facture/lister-facture.component';

const routes: Routes = [
  {path: '' , component: FactureComponent, children: [
    {path: 'Ajouter-Facture' , component: AjouterFactureComponent},
    {path: 'Lister-Facture',component: ListerFactureComponent},
    {path: 'Ajouter-Facture/Facture-terme' , component: FactureATermeComponent},
    {path: 'Ajouter-Facture/BL-Facture', component : BlFactureComponent},
    {path: 'Ajouter-Facture/Devis-Facture',component: FactureDevisComponent},
    {path: 'Ajouter-Facture/Devis-Facture/:id',component: GenerateDevisFactureComponent},

  ]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FactureRoutingModule { }
