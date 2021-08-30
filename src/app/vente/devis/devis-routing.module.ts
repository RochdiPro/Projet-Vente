import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AjouterDevisComponent } from './ajouter-devis/ajouter-devis.component';
import { DevisComponent } from './devis.component';
import { ListerDevisComponent } from './lister-devis/lister-devis.component';
import { UpdateDevisComponent } from './update-devis/update-devis.component';

const routes: Routes = [
    {path: '' , component: DevisComponent ,children: [
    {path: 'Ajouter-devis' , component: AjouterDevisComponent},
    {path: 'Lister-devis' , component: ListerDevisComponent},
    {path: 'Update-devis/:id', component:UpdateDevisComponent}
  ]},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DevisRoutingModule { }
