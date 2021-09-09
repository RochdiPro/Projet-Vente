import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BlService } from 'src/app/vente/services/bl.service';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-info-serie-dialog',
  templateUrl: './info-serie-dialog.component.html',
  styleUrls: ['./info-serie-dialog.component.scss']
})
export class InfoSerieDialogComponent implements OnInit {
  item: any =[]; 
  nbrQte: any = [];
  numero_Serie :  any= []; 
  tableaux_produits_serie: any = [];
  numSerie: any = [];
  prevSerie : any ; 

  constructor(public dialogRef: MatDialogRef<InfoSerieDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: any, private bLservice : BlService )  {
    this.item = data.formPage    
    this.nbrQte.length = this.item.quantite;
    this.getAllInfoSerie(this.item.id_Produit);
    if(this.item.tableaux_produits_serie !=undefined){
      for(let i = 0 ; i<this.item.tableaux_produits_serie.length ; i++){
        this.numSerie[i] = this.item.tableaux_produits_serie[i];
           // disabled 
           this.numero_Serie.find((element: any ) =>{ 
            if (element.name == this.numSerie[i]) {
                element.selected = true;
            }}); 
      }
    }
   }
  // Get info serie   

  //fermer dialogue
  fermerDialogue() {
    this.dialogRef.close();
  }
  // get all info for prod serie
  getAllInfoSerie(id: any){
    this.bLservice.getAllInfoSerie(id).subscribe((res : any )=>{
      res.body.forEach((ele: any) => {
        this.numero_Serie.push({ name : ele.n_Serie,  selected: false});
      });
    });
  }
  verifN_serieProduit(event: any) {
    if(this.prevSerie){
      let index = this.numero_Serie.findIndex((element : any )=> element.name ==this.prevSerie);
        if (index >= 0){
        this.numero_Serie[index].selected = false;

        this.numero_Serie.find((element: any ) =>{ 
         if (element.name == event) {
             element.selected = true;
         }}); 
      }
    }else{
      this.numero_Serie.find((element: any ) =>{ 
        if (element.name == event) {
            element.selected = true;
        }}); 
    }
    this.prevSerie = event;
      
  }

  VerifVide() {
    for (let i = 0; i < this.nbrQte.length; i++) {
      if (this.numSerie[i] == '' || this.numSerie[i] == undefined) {
        Swal.fire("inofs Non Accompli");
      }
      else {
        this.tableaux_produits_serie.push(this.numSerie[i])

        Swal.fire("info Vérifié");   
      }
        this.dialogRef.close({event: 'close', data : this.tableaux_produits_serie});
    }
    
  }
  ngOnInit(): void {
  }

}
