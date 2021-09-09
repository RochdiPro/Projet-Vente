import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BlService } from 'src/app/vente/services/bl.service';
import Swal from 'sweetalert2';
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
  numSerie: any =[]; 
  num_ImeiOne: any = [];
  num_ImeiTwo : any = [];
  verifStock: boolean = false;
  prevSerie: any ;
  prevE1 : any; 
  prevE2: any ;  
  newAttribute : any = {};
  tableaux_produits_emie : any = [];

  constructor(public dialogRef: MatDialogRef<InfosDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: any, private bLservice : BlService )  {
    this.item = data.formPage    
    this.nbrQte.length = this.item.quantite;
    this.getAllInfoFourG(this.item.id_Produit);
    if(this.item.tableaux_produits_emie != undefined){
      for(let i = 0 ; i<this.item.tableaux_produits_emie.length ; i++){
        this.numSerie[i] = this.item.tableaux_produits_emie[i].n_serie[0];
        this.num_ImeiOne[i]= this.item.tableaux_produits_emie[i].e1[0]
        this.num_ImeiTwo[i]= this.item.tableaux_produits_emie[i].e2[0]
        
        // disabled 
        this.numero_Serie.find((element: any ) =>{ 
          if (element.name == this.numSerie[i]) {
              element.selected = true;
          }}); 
  
        this.numero_Serie.find((element: any ) =>{ 
            if (element.name == this.num_ImeiOne[i]) {
                element.selected = true;
            }}); 
        
        this.numero_Serie.find((element: any ) =>{ 
              if (element.name == this.num_ImeiTwo[i]) {
                  element.selected = true;
              }}); 
      }
    }
   }
  //fermer dialogue
  fermerDialogue() {
    this.dialogRef.close();
  }
  // get all info for prod 4 G
  getAllInfoFourG(id: any){
    this.bLservice.detailProdFourG(id).subscribe((res : any )=>{
      res.body.forEach((ele: any) => {
        this.numero_Serie.push({ name : ele.n_Serie,  selected: false});
        this.n_ImeiOne.push({ name : ele.e1,  selected: false});
        this.n_ImeiTwo.push({name:ele.e2,  selected: false})
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
  verifN_eUnProduit(event : any ){
    if(this.prevE1){
      let index = this.n_ImeiOne.findIndex((element: any )=> element.name == this.prevE1);
      if(index>=0){
        this.n_ImeiOne[index].selected = false; 

        this.n_ImeiOne.find((element: any) =>{ 
          if (element.name == event) {
              element.selected = true;
          }});
      }
    }else{
      this.n_ImeiOne.find((element: any) =>{ 
        if (element.name == event) {
            element.selected = true;
        }});
    }
    this.prevE1 = event; 
  }
  verifN_eDeuxProduit(event : any){
    if(this.prevE2){
      let index = this.num_ImeiTwo.findIndex((element : any )=> element.name == this.prevE2); 
      if (index>=0 ){
        this.num_ImeiTwo[index].selected = false; 
        this.n_ImeiTwo.find((element: any) =>{ 
          if (element.name == event) {
              element.selected = true;
          }});
      }
    }else{
      this.n_ImeiTwo.find((element: any) =>{ 
        if (element.name == event) {
            element.selected = true;
        }});
    }
    this.prevE2 = event; 
  }
  
  VerifVide() {
    for (let i = 0; i < this.nbrQte.length; i++) {
      if ((this.numSerie[i] == '' || this.numSerie[i] == undefined) &&(this.num_ImeiOne[i] == '' || this.num_ImeiOne[i] == undefined) && (this.num_ImeiTwo[i] == '' || this.num_ImeiTwo[i] == undefined)) {
        Swal.fire("inofs Non Accompli");
      }
      else {
        this.newAttribute= {}; 
        this.newAttribute.n_serie = this.numSerie[i]; 
        this.newAttribute.e1= this.num_ImeiOne[i];
        this.newAttribute.e2= this.num_ImeiTwo[i];

        this.tableaux_produits_emie.push(this.newAttribute)

        Swal.fire("info Vérifié");   
      }
        this.dialogRef.close({event: 'close', data : this.tableaux_produits_emie});
    }
    
  }
  ngOnInit(): void {
  }
}
