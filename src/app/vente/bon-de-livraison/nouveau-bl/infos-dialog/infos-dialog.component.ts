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
  prevSerie: any = [] ;
  isAccompli: boolean = true; 
  ln : any ; 
  count : any=0 ; 
  newAttribute : any = {};
  tableaux_produits_emie : any = [];

  constructor(public dialogRef: MatDialogRef<InfosDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: any, private bLservice : BlService )  {
    this.item = data.formPage    
    this.ln = data.lnProd;
    this.nbrQte.length = this.item.quantite;
    this.getAllInfoFourG(this.item.id_Produit);
    
    if(this.item.tableaux_produits_emie != undefined){
      for(let j = 0 ; j< this.nbrQte.length; j++)
      if(this.item.tableaux_produits_emie[j] != undefined)
        { console.log(this.item.tableaux_produits_emie[j]);
          this.numSerie[j] = this.item.tableaux_produits_emie[j].n_serie[0];
          this.num_ImeiOne[j]= this.item.tableaux_produits_emie[j].e1
          this.num_ImeiTwo[j]= this.item.tableaux_produits_emie[j].e2
          
          // disabled 
          this.numero_Serie.find((element: any ) =>{ 
            if (element.name == this.numSerie[j]) {
                element.selected = true;
            }}); 
        
      }
    }
   }
  //fermer dialogue
  fermerDialogue() {
    this.dialogRef.close();
  }

  //** get Detail Prod By Nserie */
  getDetailProdByNserie(n_serie :any, id : any, i : any ){
    if (this.numSerie[i]== n_serie) {
      this.bLservice.getDetailProdByNserie(n_serie, id).subscribe((res:any)=>{
        this.num_ImeiOne[i] = res.body.e1;
        this.num_ImeiTwo[i] = res.body.e2;
      });
    }else{
      this.bLservice.getDetailProdByNserie(n_serie, id).subscribe((res:any)=>{
        this.num_ImeiOne[i] = res.body.e1;
        this.num_ImeiTwo[i] = res.body.e2;
      });
    }
  }
  // get all info for prod 4 G
  getAllInfoFourG(id: any){
    this.bLservice.detailProdFourG(id).subscribe((res : any )=>{
      res.body.forEach((ele: any) => {
        this.numero_Serie.push({ name : ele.n_Serie,  selected: false});
      });
    });
  }

  verifN_serieProduit(event: any , i : any ) {
    this.getDetailProdByNserie(event,this.item.id_Produit, i);
    if(this.prevSerie[i]){
      let index = this.numero_Serie.findIndex((element : any )=> element.name ==this.prevSerie[i]);
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
    this.prevSerie[i] = event;
      
  }
  VerifVide() {
    for (let i = 0; i < this.nbrQte.length; i++) {
      if ((this.numSerie[i] == '' || this.numSerie[i] == undefined) &&(this.num_ImeiOne[i] == '' || this.num_ImeiOne[i] == undefined) && (this.num_ImeiTwo[i] == '' || this.num_ImeiTwo[i] == undefined)) {
        Swal.fire('S\'il vous plaît remplir les champs','inofs Non Accompli','info')
      }
      else {
        this.newAttribute= {}; 
        this.newAttribute.n_serie = this.numSerie[i]; 
        this.newAttribute.e1= this.num_ImeiOne[i];
        this.newAttribute.e2= this.num_ImeiTwo[i];

        this.tableaux_produits_emie.push(this.newAttribute);
        this.isAccompli= false;

        Swal.fire("info Vérifié", '', 'success');   
      }
        this.dialogRef.close({event: 'close', data : this.tableaux_produits_emie, isAccompli: this.isAccompli});
    }
  }


  ngOnInit(): void {
  }
}
