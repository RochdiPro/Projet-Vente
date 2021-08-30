import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BonCommandeFournisseurService } from 'src/app/bon-commande-fournisseur.service';
@Component({
  selector: 'app-ajouter-bon-commande',
  templateUrl: './ajouter-bon-commande.component.html',
  styleUrls: ['./ajouter-bon-commande.component.scss']
})
export class AjouterBonCommandeComponent implements OnInit {
  isLinearBE = false;
  InformationsGeneralesForm: any = FormGroup;
  ListeArticleForm: any = FormGroup;
  constructor(public bonCommandeService: BonCommandeFournisseurService, private fb: FormBuilder) { 
    this.InformationsGeneralesForm = this.fb.group({
      Des: [''],
      DateEntree: ['', Validators.required],
      DateLivraison: ['', Validators.required],     
      Remise_Globale: ['', Validators.required],
      Sous_Famille: ['', Validators.required],
      Famille: ['', Validators.required],
      Fournisseur: [''],      
    });
    this.ListeArticleForm = this.fb.group({       
    });
  }
  ngOnInit(): void {
  }

}
