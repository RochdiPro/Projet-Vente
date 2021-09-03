import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BlService } from 'src/app/vente/services/bl.service';
@Component({
  selector: 'app-infos-dialog',
  templateUrl: './infos-dialog.component.html',
  styleUrls: ['./infos-dialog.component.scss']
})
export class InfosDialogComponent implements OnInit {

  item: any =[]; 
  nbrQte: any = [];
  numero_Serie :  any= []; 
  n_ImeiOne: any = [];
  n_ImeiTwo : any=  [];

  constructor(public dialogRef: MatDialogRef<InfosDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: any, private bLservice : BlService )  {
    this.item = data.formPage    
    this.nbrQte.length = this.item.quantite;
    this.getAllInfoFourG(this.item.id_Produit);
    console.log(this.item);
    
   }
  //fermer dialogue
  fermerDialogue() {
    this.dialogRef.close();
  }
  // get all info for prod 4 G
  getAllInfoFourG(id: any){
    this.bLservice.detailProdFourG(id).subscribe((res : any )=>{
      console.log(res.body);
      
    });
  }
  ngOnInit(): void {
  }
}
