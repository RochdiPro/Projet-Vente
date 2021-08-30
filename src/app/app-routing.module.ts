import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AjouterBonCommandeComponent } from './BonCommande/ajouter-bon-commande/ajouter-bon-commande.component';
import { EditerBonCommandeComponent } from './BonCommande/editer-bon-commande/editer-bon-commande.component';
import { ListerBonCommandeComponent } from './BonCommande/lister-bon-commande/lister-bon-commande.component';
import { ModifierBonCommandeComponent } from './BonCommande/modifier-bon-commande/modifier-bon-commande.component';
import { AjouterBonEntreeComponent } from './BonEntree/ajouter-bon-entree/ajouter-bon-entree.component';
import { EditerBonEntreeComponent } from './BonEntree/editer-bon-entree/editer-bon-entree.component';
import { ListerBonEntreeComponent } from './BonEntree/lister-bon-entree/lister-bon-entree.component';
import { ModifierBonEntreeComponent } from './BonEntree/modifier-bon-entree/modifier-bon-entree.component';
import { TestComponent } from './BonEntree/test/test.component';
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

const routes: Routes = 
  [
    { path: '', redirectTo: 'Menu', pathMatch: 'full' },
  //  { path: 'tt', component: EditDpotComponent} ,    
    { path: 'Menu', component: MenuComponent , children: [ 
        { path: 'Menu-depot', component: EditerDepotComponent , children: [ 
             { path: 'Ajouter-depot', component: AjouterDepotComponent },
             { path: 'Modifier-depot/:id', component: ModifierDepotComponent },
             { path: 'Lister-depot', component: ListerDepotComponent }]
        },
    { path: 'Menu-donnees', component: EditerDonneesComponent },
        { path: 'Menu-bon-entree', component: EditerBonEntreeComponent , children: [ 
            { path: 'Ajouter-bon-entree', component: AjouterBonEntreeComponent },
            { path: 'Modifier-bon-entree/:id', component: ModifierBonEntreeComponent },
            { path: 'Lister-bon-entree', component: ListerBonEntreeComponent }]
    },
    { path: 'Menu-bon-entree-importation', component: EditerBonEntreeImportationComponent , children: [ 
            { path: 'Ajouter-bon-entree-importation', component: AjouterBonEntreeImportationComponent },
            { path: 'Modifier-bon-entree-importation/:id', component: ModifierBonEntreeImportationComponent },
            { path: 'Lister-bon-entree-importation', component: ListerBonEntreeImportationComponent }]
    },
    { path: 'Menu-bon-commande', component: EditerBonCommandeComponent , children: [ 
            { path: 'Ajouter-bon-commande', component: AjouterBonCommandeComponent },
            { path: 'Modifier-bon-commande/:id', component: ModifierBonCommandeComponent },
            { path: 'Lister-bon-commande', component: ListerBonCommandeComponent }]
    },
    //** Module vente -- routing **//
   {path :'Menu-facture', loadChildren: () => import('../app/vente/facture/facture.module').then(m => m.FactureModule)},
   {path: 'Menu-Devis', loadChildren:()=>import('../app/vente/devis/devis.module').then(m=>m.DevisModule)},
   {path: 'Menu-BonLivraison', loadChildren: ()=>import('../app/vente/bon-de-livraison/bon-de-livraison.module').then(m=>m.BonDeLivraisonModule)},

  ],
     },
    {path:'test',component:TestComponent}
    ];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
