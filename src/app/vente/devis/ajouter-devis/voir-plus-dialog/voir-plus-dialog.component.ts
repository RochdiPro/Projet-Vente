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
  type: string; 
  num : any ;
  
  constructor(public dialogRef: MatDialogRef<VoirPlusDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: any, private devisService : DevisService) {
    this.item = data.formPage    
    this.local= data.loca
    this.devisService.quentiteProdLocal(this.item.id_Produit, this.local).subscribe((res:any)=> this.num = res.body)
    if (this.item.n_Imei == "true"){
      this.type ="Produit 4G"
    }else if(this.item.n_Serie =="true"){
      this.type= "Produit Serie "
    }
    else{
      this.type ="Produit Simple"
    }
   }

  ngOnInit(): void {
  }

}
