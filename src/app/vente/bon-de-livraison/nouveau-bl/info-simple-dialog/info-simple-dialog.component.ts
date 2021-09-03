import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BlService } from 'src/app/vente/services/bl.service';

@Component({
  selector: 'app-info-simple-dialog',
  templateUrl: './info-simple-dialog.component.html',
  styleUrls: ['./info-simple-dialog.component.scss']
})
export class InfoSimpleDialogComponent implements OnInit {

  item: any =[]; 
  nbrQte: any = [];

  constructor(public dialogRef: MatDialogRef<InfoSimpleDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: any, private bLservice : BlService )  {
    this.item = data.formPage    
    this.nbrQte.length = this.item.quantite;    
   }
  //fermer dialogue
  fermerDialogue() {
    this.dialogRef.close();
  }
  ngOnInit(): void {
  }

}
