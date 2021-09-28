import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DevisService } from 'src/app/vente/services/devis.service';

@Component({
  selector: 'app-voir-plus-dialog',
  templateUrl: './voir-plus-dialog.component.html',
  styleUrls: ['./voir-plus-dialog.component.scss']
})
export class VoirPlusDialogComponent implements OnInit {
  item: any =[]; 
  local : any; 
  locals: any
  type: string; 
  num : any ;
  loading : boolean = true
  qtePerLocals: any = []; 
  qteTotal : any = 0;
  
  constructor(public dialogRef: MatDialogRef<VoirPlusDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: any, private devisService : DevisService) {
    this.item = data.formPage    
    this.local= data.local
    this.locals= data.locals
    this.getQtePerLocals()
    this.devisService.quentiteProdLocal(this.item.id_Produit, this.local).subscribe((res:any)=> {this.num = res.body
    this.loading = false; 
    });

   
    
    if (this.item.n_Imei == "true"){
      this.type ="Produit 4G"
    }else if(this.item.n_Serie =="true"){
      this.type= "Produit Serie "
    }
    else{
      this.type ="Produit Simple"
    }    
   }
  getQtePerLocals(){
    console.log('hello');
    
    for(let i=0; i<this.locals.length; i++){
      let nom_Local: any = '';
      let objectQtePerLocal : any = {}
      nom_Local = this.locals[i].nom_Local;
      this.devisService.quentiteProdLocal(this.item.id_Produit, nom_Local).subscribe((res: any)=>{
        objectQtePerLocal.num = res.body;
        this.qteTotal+= objectQtePerLocal.num
        objectQtePerLocal.nom_Local= nom_Local; 
        this.qtePerLocals.push(objectQtePerLocal);
        this.loading = false; 
      });
    }
  }
  ngOnInit(): void {
  }

}
