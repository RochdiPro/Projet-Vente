import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DevisService } from 'src/app/vente/services/devis.service';
import { AjouterDevisComponent } from '../ajouter-devis.component';

@Component({
  selector: 'app-update-dialog-overview-article-dialog',
  templateUrl: './update-dialog-overview-article-dialog.component.html',
  styleUrls: ['./update-dialog-overview-article-dialog.component.scss']
})
export class UpdateDialogOverviewArticleDialogComponent implements OnInit {
  upDateArrForm : FormGroup; ; 
  ligne : any;
  index : any; 
  table : any; 
  isExist : boolean; 
  produitFrom : FormGroup; 
  loading : boolean = true; 


  constructor(public dialogRef: MatDialogRef<AjouterDevisComponent>,private fb: FormBuilder,private devisService : DevisService,
    @Inject(MAT_DIALOG_DATA) public data: any) {
      this.ligne = data.ligne;
      this.index = data.index;
      this.table = data.table;
      this.produitFrom = fb.group({
        qte_modifier: [this.ligne.quantite],
        prixU_modifier: [this.ligne.prixU],
        remise_modifier: [this.ligne.remise],
        Fodec: [this.ligne.fodec],
        Tva: [this.ligne.tva],
        Nom_Produit: [this.ligne.nom_Produit],
        Id_Produit: [this.ligne.id_Produit],
      }); 
      this.upDateArrForm = this.fb.group({
        qte_modifier: [this.ligne.quantite],
        prixU_modifier: [this.ligne.prixU],
        remise_modifier: [this.ligne.remise],
        Fodec: [this.ligne.fodec],
        Tva: [this.ligne.tva],
        Nom_Produit: [this.ligne.nom_Produit],
        Id_Produit: [this.ligne.id_Produit],
      });
      dialogRef.disableClose = true;    
      this.isInStock(this.ligne.id_Produit);
     }
  
  ngOnInit(): void { 
    this.isInStock(this.ligne.id_Produit);
  }

  //** Product is in stock  */
    isInStock(id : any){
      this.loading = true;
      this.devisService.getInfoProductByIdFromStock(id).subscribe((res : any)=>{
        var existInStoc = false;
        if(res.body != null){
            existInStoc = true; 
        }else{
            existInStoc = false; 
        }
        this.isExist = existInStoc;
        this.loading = false; 
      });
      
    }
  fermerDialogue(){
    this.dialogRef.close(this.produitFrom.value);
  }
  editerLigneTable(){
    this.dialogRef.close(this.upDateArrForm.value);
  }
}
