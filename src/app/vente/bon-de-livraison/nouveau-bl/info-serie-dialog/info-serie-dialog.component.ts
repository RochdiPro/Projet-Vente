import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BlService } from 'src/app/vente/services/bl.service';
@Component({
  selector: 'app-info-serie-dialog',
  templateUrl: './info-serie-dialog.component.html',
  styleUrls: ['./info-serie-dialog.component.scss']
})
export class InfoSerieDialogComponent implements OnInit {
  item: any =[]; 
  nbrQte: any = [];
  numero_Serie :  any= []; 

  constructor(public dialogRef: MatDialogRef<InfoSerieDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: any, private bLservice : BlService )  {
    this.item = data.formPage    
    this.nbrQte.length = this.item.quantite;
    this.getAllInfoSerie(this.item.id_Produit);
    console.log(this.item);
    
   }
  //fermer dialogue
  fermerDialogue() {
    this.dialogRef.close();
  }
  // get all info for prod serie
  getAllInfoSerie(id: any){
    this.bLservice.getAllInfoSerie(id).subscribe((res : any )=>{
      console.log(res.body);
      
    });
  }
  ngOnInit(): void {
  }

}
