import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';


import { AjouterBlComponent } from './ajouter-bl/ajouter-bl.component';
import { BonDeLivraisonComponent } from './bon-de-livraison.component';
import { ConvertDevisToBlComponent } from './convert-devis-to-bl/convert-devis-to-bl.component';
import { DevisBLComponent } from './devis-bl/devis-bl.component';
import { GenererBlComponent } from './generer-bl/generer-bl.component';
import { ListerBlComponent } from './lister-bl/lister-bl.component';
import { NouveauBLComponent } from './nouveau-bl/nouveau-bl.component';
import { UpdateBlComponent } from './update-bl/update-bl.component';

const routes: Routes = [
  {path: '', component: BonDeLivraisonComponent, children : [ 
    {path: 'Lister-BL', component: ListerBlComponent},
    {path: 'Ajouter-BL', component: AjouterBlComponent},
    {path:'Update-bl/:id', component: UpdateBlComponent},
    {path:'Ajouter-BL/Nouveau-BL', component: NouveauBLComponent},
    {path: 'Ajouter-BL/Devis-BL', component: DevisBLComponent},
    {path: 'Ajouter-BL/Generer-Devis-BL/:id' ,component :GenererBlComponent },
    {path: 'Ajouter-BL/Convertir-Devis-BL/:id' ,component :ConvertDevisToBlComponent },
  ]},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BonDeLivraisonRoutingModule { }
