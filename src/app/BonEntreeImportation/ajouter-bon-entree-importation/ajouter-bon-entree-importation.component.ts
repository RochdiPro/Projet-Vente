import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BonEntreeImportationService } from '../bon-entree-importation.service';
@Component({
  selector: 'app-ajouter-bon-entree-importation',
  templateUrl: './ajouter-bon-entree-importation.component.html',
  styleUrls: ['./ajouter-bon-entree-importation.component.scss']
})
export class AjouterBonEntreeImportationComponent implements OnInit {
  lineaire = false;
  InformationsGeneralesForm: any = FormGroup;
  InformationsBanquesForm: any = FormGroup;
  ListeArticleForm: any = FormGroup;
  TaxeDouaneForm: any = FormGroup;
  ChargeGlobaleForm: any = FormGroup;
  locals:any= [];
  fournisseurs:any= [];
  categorie_paiement: any;
  constructor(public bonEntreeService: BonEntreeImportationService, private fb: FormBuilder) { 
    this.Locals();
    this.Fournisseurs();
    //récupérer la liste des catégories des données
    this.bonEntreeService.obtenirCategoriePaiement().subscribe((response: Response) => {
      this.categorie_paiement = response;
    });
    this.InformationsGeneralesForm = this.fb.group({
      Des: [''],
      DateEntree: ['', Validators.required],
      DateLivraison: ['', Validators.required],
      DatePaiement: ['', Validators.required],
      DateProforma: ['', Validators.required],
      DateFacture: ['', Validators.required],
      N_Facture: ['', Validators.required],
      N_Proforma: ['', Validators.required],
      Transport_Importation_DV:[''],
      Local: ['', Validators.required],
      Ag_Transport: [''],
      Ag_Transitaire: [''],
      Assurance_Importation_DT: [''],
      Mode_Paiement: ['', Validators.required],
      Mode_Livraison: ['', Validators.required],
      Type: ['', Validators.required],
      Type_Livraison: ['', Validators.required],
      Fournisseur: [''],      
    });
    this.InformationsBanquesForm = this.fb.group({
     Titre:['',Validators.required],
     LC:['',Validators.required], 
     Transfert:['',Validators.required],
     FED:['',Validators.required],
     Transport:[''],
     Transitaire:[''],
     Banque:[''],
     Penalite:[''],
     Magasinage:[''],
     AutreCharge:[''],
     Document_Banque:[''],
     Document_Importation:[''],
     Document_Transitaire:[''],
     Document_Transport:['']
    });
    this.ListeArticleForm = this.fb.group({        
     });
     this.TaxeDouaneForm = this.fb.group({
     T001:[''],
     T105:[''],
     T094:[''],
     T093:[''],
     T473:[''],
     AutreTaxe:['']   
    });
    this.ChargeGlobaleForm = this.fb.group({         
     });
  }
  ngOnInit(): void {
  } 
  //Récupérer tous locaux
  Locals() {
    this.bonEntreeService.Locals().subscribe((data: any) => {
      this.locals = data;
    });
  }
  //Récupérer tous fournisseurs
  Fournisseurs() {
    this.bonEntreeService.Fournisseurs().subscribe((data: any) => {
      this.fournisseurs = data;
    });
  }
}
