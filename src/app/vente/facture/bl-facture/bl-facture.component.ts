import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatStepper } from '@angular/material/stepper';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import * as xml2js from 'xml2js';
import { BlService } from '../../services/bl.service';

@Component({
  selector: 'app-bl-facture',
  templateUrl: './bl-facture.component.html',
  styleUrls: ['./bl-facture.component.scss']
})
export class BlFactureComponent implements OnInit {

  infoFormGroup : FormGroup;
  panelOpenState = true;

  champ : string = '';
  value: string = '';
  keyValues: any = [];
  dataSourceBl : any = [];
  blChecked : any ; 
  listBlCheched : any = []; 
  loading : boolean = false; 
  dsiable : boolean = true;
  date : any;  
  clt : any;
  detail: any;
  xmldata : any
  newAttribute : any = {};
  blArticls : any = []; 
  totalHTBrut : any = 0; 
  totalMontantFodec : any = 0;   
  totalRemise : any = 0;
  totalHT: any = 0 ; 
  totalMontantTVA : any = 0 ; 
  totalTTc : any = 0; 
  totalTTc_reg: any = 0 ; 
  id_modeP_typeTwo : any = 0 ; 
  valueRegTwo : any; 
  note : any ; 
  Montant_TVA : any = 0 ; 
  Montant_Fodec : any = 0; 
  details: any = [];  
  id: any ; 
  totalChGlobale: any = 0;
  totalPorcentageFodec: any = 0; 
  totalRHT: any =0; 
  totalTTc_ : any = 0 ; 
  totalRTTC: any = 0 ; 
  totalPourcentCh: any = 0; 
  remiseDiff: any = 0 
  assiettetva19: any = 0 ;
  montanttva19 : any = 0 ; 
  assiettetva7: any = 0 
  montanttva7: any = 0 ; 
  assiettetva13: any = 0 ; 
  montanttva13 : any = 0 ; 
  assiette19: any = 0 ;
  montant19: any = 0 ; 
  assiette7: any = 0 ; 
  montant7 : any = 0; 
  assiette13: any = 0 ;
  montant13 : any = 0 ; 
  voirmoins : boolean = false; 
  voirPlus: boolean = true;
  loadingDetail : boolean = true; 
  loadingGeneral : boolean = true; 

  blArticlsGeneral: any = [];

  columns : any = ['ID', 'Nom', 'Prix_U', 'Remise', 'Quantité', 'TVA', 'Total_HT'];
  displayedColumns: string[] = ['checkbox','id_Bl', 'type', 'date_Creation', 'id_Responsable', 'mode_Paiement', 'total_ttc' ,'Voir_pdf'];

  @ViewChild(MatPaginator) paginator: any = MatPaginator;
  @ViewChild(MatSort) sort: any = MatSort;

  // @Output() listBl = new EventEmitter();
  
  constructor(private _formBuilder: FormBuilder ,private bLService : BlService, public datepipe: DatePipe,private router: Router) { 
    this.infoFormGroup = this._formBuilder.group({
      lengthOfListBl : ['', Validators.required]
    })
  }

  ngOnInit(): void {
    //** INIT */
    this.getKeyWordQuote();
    this.getAllBL();
  }
  
  //** Get All BL */
  async getAllBL(){
        this.loading = true; 
        this.bLService.getAllBL().subscribe((res: any)=>{
          let bl_en_cours : any = []
          let data : any = []
          data = res
          data.map((ele: any)=>{ 
            // if (ele.etat ==='En cours')
            return bl_en_cours.unshift(ele)
          });  
        this.dataSourceBl= new MatTableDataSource(bl_en_cours);   
        this.dataSourceBl.sort = this.sort; 
        this.dataSourceBl.paginator = this.paginator;
        this.loading = false; 
        });
      }
  //** Lister les champ BL */
  getKeyWordQuote(){
    this.bLService.getListKeyWord().subscribe((res:any)=>{this.keyValues = res});
  }
  //** Get Value */
  onChange(ev : any){
    this.champ = ev.target.value;
  }
  getValue(ev: any){
    this.value = ev.target.value
  } 
  //** Filter By Champ */
  filterByChamp(){
    this.loading = true ; 
    this.dataSourceBl =[]
    this.bLService.filterByChampValeur(this.champ, this.value).subscribe((data : any)=>{
      console.log(data.body);
      data.body.total_TTC= Number(data.body.total_TTC).toFixed(3)
      this.dataSourceBl= new MatTableDataSource(data.body);    
      this.dataSourceBl.sort = this.sort; 
      this.dataSourceBl.paginator = this.paginator;
      this.loading = false ; 
    });
  }

    //** Calcul */
    calculTotal() {
      let total1 = 0;
      let total2 = 0;
      let total3 : any = 0;
      let total4 = 0;
      let total5 = 0;
      let total6 = 0;
      let total7 = 0;
      let total8 = 0;
      let total9 = 0;
      let total10 = 0;
      let total11 = 0;
      let total12 = 0 ; 
      
        for (var i = 0; i < this.blArticls.length; i++) {
        if (isNaN(this.blArticls[i].montant_TVA)=== false  ){
          total1 += Number(this.blArticls[i].montant_TVA)
          total2 += Number(this.blArticls[i].montant_HT);
          this.totalHT = total2.toFixed(3);
    
          total4 += Number(this.blArticls[i].ch_Globale);
          this.totalChGlobale = Number(total4).toFixed(3);
          total3 += Number(this.blArticls[i].totale_TTC);
          this.totalTTc = Number(total3).toFixed(3);
          // totale ttc with remise
          total5 += Number(this.blArticls[i].totale_TTC )-((this.blArticls[i].prixU * (Number(this.blArticls[i].remise)) / 100)*this.blArticls[i].quantite )
          this.totalRemise = Number(total5).toFixed(3);
          this.totalTTc_= this.totalTTc;
          // ***
          total9 += (Number(this.blArticls[i].fodec) * (Number(this.blArticls[i].quantite)));
          this.totalPorcentageFodec = Number(total9).toFixed(3);
          total6 += ((Number(this.blArticls[i].prixRevientU)) * (Number(this.blArticls[i].quantite)));
          this.totalRHT = Number(total6).toFixed(3);
          total7 += ((Number(this.blArticls[i].prixRevientU)) * (Number(this.blArticls[i].quantite)) + Number(this.blArticls[i].montant_TVA) + Number(this.blArticls[i].montant_Fodec));
          this.totalRTTC = Number(total7).toFixed(3);
          total8 += Number(this.blArticls[i].ch);
          this.totalPourcentCh = Number(total8).toFixed(3);
          this.newAttribute.totalPourcentCh = this.totalPourcentCh;
          total10 += Number( this.blArticls[i].montant_Fodec);
          total11 += (Number(this.blArticls[i].prixU) * Number(this.blArticls[i].quantite));
          this.totalHTBrut = Number(total11).toFixed(3);
          this.totalMontantFodec = Number(total10).toFixed(3);
          this.totalMontantTVA = Number(total1).toFixed(3);
        }    
        total12 = Number(this.totalTTc -this.totalRemise)
        this.remiseDiff =  total12.toFixed(3)
      }
  
    }
    //** Calcul Assiettes TVA */
    calculAssiettes(){
      if(this.blArticls.length == 0){
        this.assiettetva19 = 0;
        this.montanttva19 = 0
        this.assiettetva7 = 0
        this.montanttva7 = 0
        this.assiettetva13 = 0;
        this.montanttva13 = 0;
      }else {
        this.assiettetva19 = 0;
        this.montanttva19 = 0;
        this.assiettetva7 = 0; 
        this.montanttva7 = 0;
        this.assiettetva13 = 0;
        this.montanttva13 = 0;
        for (let i = 0; i < this.blArticls.length; i++) {
          if( isNaN(this.blArticls[i].montant_HT)=== false){
            if (this.blArticls[i].tva == '19') {
              this.assiettetva19 += (Number(Number(this.blArticls[i].montant_HT)));
              this.montanttva19 += Number(Number(Number(this.blArticls[i].montant_TVA)) * (this.blArticls[i].quantite));
              this.assiette19 = this.assiettetva19.toFixed(3);
              this.montant19 = this.montanttva19.toFixed(3);          
            }
            else if (this.blArticls[i].tva == '7') {
              this.assiettetva7 += Number(Number(this.blArticls[i].montant_HT));
              this.montanttva7 += Number(Number(Number(this.blArticls[i].montant_TVA) * Number(this.blArticls[i].quantite)));
              this.assiette7 = this.assiettetva7.toFixed(3);
              this.montant7 = this.montanttva7.toFixed(3);
            }
            else if (this.blArticls[i].tva == '13') {
              this.assiettetva13 += (Number(Number(this.blArticls[i].montant_HT)));
              this.montanttva13 += (Number(Number(this.blArticls[i].montant_TVA) * Number(this.blArticls[i].quantite)));
              this.assiette13 = this.assiettetva13.toFixed(3);
              this.montant13 = this.montanttva13.toFixed(3);
            }
          }  
        }
      }
    }
    //** Get Detail BL  */
  getDetail(id: string){
      this.id = id
      this.blArticls = [];
      this.loadingDetail = true
      this.bLService.detail(id).subscribe((detail: any)=>{
        //** Parsing an XML file unisng  'xml2js' lebraby*/
        const fileReader = new FileReader(); 
        // Convert blob to base64 with onloadend function
        fileReader.onloadend = () =>{
          this.detail = fileReader.result; // data: application/xml in base64
          let data : any; 
          xml2js.parseString(atob(this.detail.substr(28)),(err: any , res : any)=>{    
            if(res.Devis == null)  
            {
              data =res.BL;
              this.totalHTBrut = data.Total[0].TotalHTBrut[0]; 
              this.totalMontantFodec= data.Total[0].TotalFodec[0];
              this.totalRemise = data.Total[0].TotalRemise[0];
              this.totalHT = data.Total[0].TotalHTNet[0];
              this.totalMontantTVA = data.Total[0].TotalTVA[0];
              this.totalTTc = data.Total[0].TotalTTC[0];
              this.totalTTc_reg = data.Type_Reglement[0].ValueRegOne[0];          
              this.id_modeP_typeTwo = data.Type_Reglement[0].TypeRegTwo[0];
    
              this.valueRegTwo = data.Type_Reglement[0].ValueRegTwo[0];
            }else{
              data =res.Devis;
              this.totalHTBrut = data.Total[0].TotalHTBrut[0]; 
              this.totalMontantFodec= data.Total[0].TotalFodec[0];
              this.totalRemise = data.Total[0].TotalRemise[0];
              this.totalHT = data.Total[0].TotalHTNet[0];
              this.totalMontantTVA = data.Total[0].TotalTVA[0];
              this.totalTTc = data.Total[0].TotalTTC[0];
              this.totalTTc_reg = data.Type_Reglement[0].ValueRegOne[0];          
              this.id_modeP_typeTwo = data.Type_Reglement[0].TypeRegTwo[0];
    
              this.valueRegTwo = data.Type_Reglement[0].ValueRegTwo[0];
            }
                
          });
          
            if(data.Produits[0].Produits_Simples[0].Produit!= undefined){
            for (let i = 0; i < data.Produits[0].Produits_Simples[0].Produit.length; i++) 
            { 
              this.newAttribute = {};
              this.newAttribute.id_Produit=(data.Produits[0].Produits_Simples[0].Produit[i].Id[0]); 
              this.newAttribute.charge=(data.Produits[0].Produits_Simples[0].Produit[i].Charge); 
              this.newAttribute.nom_Produit =(data.Produits[0].Produits_Simples[0].Produit[i].Nom[0]); 
              this.newAttribute.Signaler_probleme=(data.Produits[0].Produits_Simples[0].Produit[i].Signaler_probleme); 
              this.newAttribute.quantite=(data.Produits[0].Produits_Simples[0].Produit[i].Qte[0]); 
              // this.newAttribute.montant_TVA=(data.Produits[0].Produits_Simples[0].Produit[i].Montant_Tva[0]);
              this.newAttribute.fodec=(data.Produits[0].Produits_Simples[0].Produit[i].fodec[0]);
              this.newAttribute.N_Imei = (data.Produits[0].Produits_Simples[0].Produit[i].n_Imei); 
              this.newAttribute.N_Serie = (data.Produits[0].Produits_Simples[0].Produit[i].n_Serie); 
              this.newAttribute.produits_simple = (data.Produits[0].Produits_Simples[0].Produit[i].produits_simple);           
              this.newAttribute.remise= (data.Produits[0].Produits_Simples[0].Produit[i].Remise[0]);
              this.newAttribute.prix_U_TTC= (data.Produits[0].Produits_Simples[0].Produit[i].PrixUTTC[0]);
              this.newAttribute.total_HT= (data.Produits[0].Produits_Simples[0].Produit[i].Total_HT[0]);
              this.newAttribute.prixU = (data.Produits[0].Produits_Simples[0].Produit[i].PrixU[0])
              this.newAttribute.totale_TTC = (data.Produits[0].Produits_Simples[0].Produit[i].TotalFacture[0]);
              this.newAttribute.tva = data.Produits[0].Produits_Simples[0].Produit[i].Tva[0];
              // Montant Tva u = (prix*tva)/100
              this.newAttribute.finalPrice=  (this.newAttribute.prixU - (this.newAttribute.prixU * (Number(this.newAttribute.remise)) / 100)).toFixed(3)  
              this.Montant_TVA = Number(this.newAttribute.finalPrice) * Number((this.newAttribute.tva)/ 100) ;
              this.newAttribute.montant_TVA = Number(this.Montant_TVA).toFixed(3);
  
              this.newAttribute.total_TVA = ((Number(this.newAttribute.montant_TVA)) / (Number(this.newAttribute.quantite))).toFixed(3);    
              this.newAttribute.montant_HT = ((Number(this.newAttribute.prixU) * Number(this.newAttribute.quantite)) * (1 - (Number(this.newAttribute.remise)) / 100)).toFixed(3);       
              this.Montant_Fodec = (this.newAttribute.montant_HT * this.newAttribute.fodec) / 100;
              this.newAttribute.montant_Fodec = Number(this.Montant_Fodec);
              this.blArticls.push(this.newAttribute);
              this.calculTotal();
              this.calculAssiettes();
            }
            }
            if(data.Produits[0].Produits_4Gs[0].Produit!= undefined){
              for (let i = 0; i < data.Produits[0].Produits_4Gs[0].Produit.length; i++) 
              { 
                this.newAttribute = {};
                this.newAttribute.id_Produit=(data.Produits[0].Produits_4Gs[0].Produit[i].Id[0]); 
                this.newAttribute.charge=(data.Produits[0].Produits_4Gs[0].Produit[i].Charge); 
                this.newAttribute.nom_Produit =(data.Produits[0].Produits_4Gs[0].Produit[i].Nom[0]); 
                this.newAttribute.Signaler_probleme=(data.Produits[0].Produits_4Gs[0].Produit[i].Signaler_probleme); 
                this.newAttribute.quantite=(data.Produits[0].Produits_4Gs[0].Produit[i].Qte[0]); 
                // this.newAttribute.montant_TVA=(data.Produits[0].Produits_4Gs[0].Produit[i].Montant_Tva[0]);
                
                this.newAttribute.fodec=(data.Produits[0].Produits_4Gs[0].Produit[i].fodec[0]);
                this.newAttribute.N_Imei = (data.Produits[0].Produits_4Gs[0].Produit[i].n_Imei); 
                this.newAttribute.N_Serie = (data.Produits[0].Produits_4Gs[0].Produit[i].n_Serie); 
                this.newAttribute.produits_simple = (data.Produits[0].Produits_4Gs[0].Produit[i].produits_simple); 
                this.newAttribute.tva = data.Produits[0].Produits_4Gs[0].Produit[i].Tva[0];          
                let tableaux_produits_emie = []
                for (let i = 0; i < data.Produits[0].Produits_4Gs[0].Produit[0].Produit_4Gs[0].Produit_4G.length; i++) {
                  let elem_4g : any = {};
                  elem_4g.n_serie = data.Produits[0].Produits_4Gs[0].Produit[0].Produit_4Gs[0].Produit_4G[i].N_Serie;
                  elem_4g.e1 = data.Produits[0].Produits_4Gs[0].Produit[0].Produit_4Gs[0].Produit_4G[i].E1
                  elem_4g.e2 = data.Produits[0].Produits_4Gs[0].Produit[0].Produit_4Gs[0].Produit_4G[i].E2   
                  tableaux_produits_emie.push(elem_4g)
                }
                this.newAttribute.remise= (data.Produits[0].Produits_4Gs[0].Produit[i].Remise[0]);
                this.newAttribute.tableaux_produits_emie=tableaux_produits_emie;
                this.newAttribute.prixU = (data.Produits[0].Produits_4Gs[0].Produit[i].PrixU[0]);
  
                      // Montant Tva u = (prix*tva)/100
                this.newAttribute.finalPrice=  (this.newAttribute.prixU - (this.newAttribute.prixU * (Number(this.newAttribute.remise)) / 100)).toFixed(3)  
                this.Montant_TVA = Number(this.newAttribute.finalPrice) * Number((this.newAttribute.tva)/ 100) ;
                this.newAttribute.montant_TVA = Number(this.Montant_TVA).toFixed(3);
              
                this.newAttribute.montant_HT = ((Number(this.newAttribute.prixU) * Number(this.newAttribute.quantite)) * (1 - (Number(this.newAttribute.remise)) / 100)).toFixed(3);
                this.Montant_Fodec = (this.newAttribute.montant_HT * this.newAttribute.fodec) / 100;
                this.newAttribute.montant_Fodec = Number(this.Montant_Fodec);
                this.newAttribute.prix_U_TTC= (data.Produits[0].Produits_4Gs[0].Produit[i].PrixUTTC[0]);
                this.newAttribute.total_HT= (data.Produits[0].Produits_4Gs[0].Produit[i].Total_HT[0]);
                this.newAttribute.totale_TTC = (data.Produits[0].Produits_4Gs[0].Produit[i].TotalFacture[0]);
                this.newAttribute.total_TVA = ((Number(this.newAttribute.montant_TVA)) / (Number(this.newAttribute.quantite))).toFixed(3); 
                this.blArticls.push(this.newAttribute);
                  this.calculTotal();
                this.calculAssiettes();
                
              }
            }
            if(data.Produits[0].Produits_Series[0].Produit!= undefined){
              for (let i = 0; i < data.Produits[0].Produits_Series[0].Produit.length; i++) 
              {
                this.newAttribute = {};
                this.newAttribute.id_Produit=(data.Produits[0].Produits_Series[0].Produit[i].Id[0]); 
                this.newAttribute.charge=(data.Produits[0].Produits_Series[0].Produit[i].Charge); 
                this.newAttribute.nom_Produit =(data.Produits[0].Produits_Series[0].Produit[i].Nom); 
                this.newAttribute.Signaler_probleme=(data.Produits[0].Produits_Series[0].Produit[i].Signaler_probleme); 
                this.newAttribute.quantite=(data.Produits[0].Produits_Series[0].Produit[i].Qte[0]); 
                // this.newAttribute.montant_TVA=(data.Produits[0].Produits_Series[0].Produit[i].Montant_Tva[0]);
                this.newAttribute.fodec=(data.Produits[0].Produits_Series[0].Produit[i].fodec);              
                this.newAttribute.N_Imei = (data.Produits[0].Produits_Series[0].Produit[i].n_Imei); 
                this.newAttribute.N_Serie = (data.Produits[0].Produits_Series[0].Produit[i].n_Serie); 
                this.newAttribute.produits_simple = (data.Produits[0].Produits_Series[0].Produit[i].produits_simple);           
                this.newAttribute.tva = data.Produits[0].Produits_Series[0].Produit[i].Tva[0]; 
                let tableaux_produits_serie = []
                for (let i = 0; i < data.Produits[0].Produits_Series[0].Produit[0].N_Series[0].N_Serie.length; i++) {
                  tableaux_produits_serie.push( data.Produits[0].Produits_Series[0].Produit[0].N_Series[0].N_Serie[i])
                
              }  
              this.newAttribute.remise= (data.Produits[0].Produits_Series[0].Produit[i].Remise[0]);      
              this.newAttribute.tableaux_produits_serie=tableaux_produits_serie;
              this.newAttribute.prixU = (data.Produits[0].Produits_Series[0].Produit[i].PrixU[0]);
              
              // Montant Tva u = (prix*tva)/100
              this.newAttribute.finalPrice=  (this.newAttribute.prixU - (this.newAttribute.prixU * (Number(this.newAttribute.remise)) / 100)).toFixed(3)  
              this.Montant_TVA = Number(this.newAttribute.finalPrice) * Number((this.newAttribute.tva)/ 100) ;
              this.newAttribute.montant_TVA = Number(this.Montant_TVA).toFixed(3);
  
              this.newAttribute.montant_HT = ((Number(this.newAttribute.prixU) * Number(this.newAttribute.quantite)) * (1 - (Number(this.newAttribute.remise)) / 100)).toFixed(3);
              this.Montant_Fodec = (this.newAttribute.montant_HT * this.newAttribute.fodec) / 100;
              this.newAttribute.montant_Fodec = Number(this.Montant_Fodec);
              
              this.newAttribute.charge = (data.Produits[0].Produits_Series[0].Produit[i].charge);
              this.newAttribute.prix_U_TTC= (data.Produits[0].Produits_Series[0].Produit[i].PrixUTTC[0]);
              this.newAttribute.total_HT= (data.Produits[0].Produits_Series[0].Produit[i].Total_HT[0]);
              this.newAttribute.totale_TTC = (data.Produits[0].Produits_Series[0].Produit[i].TotalFacture[0]);
              this.newAttribute.total_TVA = ((Number(this.newAttribute.montant_TVA)) / (Number(this.newAttribute.quantite))).toFixed(3);
              this.blArticls.push(this.newAttribute);
              this.calculTotal();
              this.calculAssiettes();
              }
            }
        }          
        fileReader.readAsDataURL(detail.body);
        this.loadingDetail = false; 
    }); 
    this.voirmoins = true;
    this.voirPlus = false
  }
      //** Get Detail BL for Generat table  */
  getDetailForGeneral(id: string){
      this.loadingGeneral = true
      this.bLService.detail(id).subscribe((detail: any)=>{
        //** Parsing an XML file unisng  'xml2js' lebraby*/
        const fileReader = new FileReader(); 
        // Convert blob to base64 with onloadend function
        fileReader.onloadend = () =>{
          this.detail = fileReader.result; // data: application/xml in base64
          let data : any; 
          xml2js.parseString(atob(this.detail.substr(28)),(err: any , res : any)=>{    
            if(res.Devis == null)  
            {
              data =res.BL;
              this.totalHTBrut = data.Total[0].TotalHTBrut[0]; 
              this.totalMontantFodec= data.Total[0].TotalFodec[0];
              this.totalRemise = data.Total[0].TotalRemise[0];
              this.totalHT = data.Total[0].TotalHTNet[0];
              this.totalMontantTVA = data.Total[0].TotalTVA[0];
              this.totalTTc = data.Total[0].TotalTTC[0];
              this.totalTTc_reg = data.Type_Reglement[0].ValueRegOne[0];          
              this.id_modeP_typeTwo = data.Type_Reglement[0].TypeRegTwo[0];
    
              this.valueRegTwo = data.Type_Reglement[0].ValueRegTwo[0];
            }else{
              data =res.Devis;
              this.totalHTBrut = data.Total[0].TotalHTBrut[0]; 
              this.totalMontantFodec= data.Total[0].TotalFodec[0];
              this.totalRemise = data.Total[0].TotalRemise[0];
              this.totalHT = data.Total[0].TotalHTNet[0];
              this.totalMontantTVA = data.Total[0].TotalTVA[0];
              this.totalTTc = data.Total[0].TotalTTC[0];
              this.totalTTc_reg = data.Type_Reglement[0].ValueRegOne[0];          
              this.id_modeP_typeTwo = data.Type_Reglement[0].TypeRegTwo[0];
    
              this.valueRegTwo = data.Type_Reglement[0].ValueRegTwo[0];
            }
                
          });
          
            if(data.Produits[0].Produits_Simples[0].Produit!= undefined){
            for (let i = 0; i < data.Produits[0].Produits_Simples[0].Produit.length; i++) 
            { 
              this.newAttribute = {};
              this.newAttribute.id_Produit=(data.Produits[0].Produits_Simples[0].Produit[i].Id[0]); 
              this.newAttribute.charge=(data.Produits[0].Produits_Simples[0].Produit[i].Charge); 
              this.newAttribute.nom_Produit =(data.Produits[0].Produits_Simples[0].Produit[i].Nom[0]); 
              this.newAttribute.Signaler_probleme=(data.Produits[0].Produits_Simples[0].Produit[i].Signaler_probleme); 
              this.newAttribute.quantite=(data.Produits[0].Produits_Simples[0].Produit[i].Qte[0]); 
              // this.newAttribute.montant_TVA=(data.Produits[0].Produits_Simples[0].Produit[i].Montant_Tva[0]);
              this.newAttribute.fodec=(data.Produits[0].Produits_Simples[0].Produit[i].fodec[0]);
              this.newAttribute.N_Imei = (data.Produits[0].Produits_Simples[0].Produit[i].n_Imei); 
              this.newAttribute.N_Serie = (data.Produits[0].Produits_Simples[0].Produit[i].n_Serie); 
              this.newAttribute.produits_simple = (data.Produits[0].Produits_Simples[0].Produit[i].produits_simple);           
              this.newAttribute.remise= (data.Produits[0].Produits_Simples[0].Produit[i].Remise[0]);
              this.newAttribute.prix_U_TTC= (data.Produits[0].Produits_Simples[0].Produit[i].PrixUTTC[0]);
              this.newAttribute.total_HT= (data.Produits[0].Produits_Simples[0].Produit[i].Total_HT[0]);
              this.newAttribute.prixU = (data.Produits[0].Produits_Simples[0].Produit[i].PrixU[0])
              this.newAttribute.totale_TTC = (data.Produits[0].Produits_Simples[0].Produit[i].TotalFacture[0]);
              this.newAttribute.tva = data.Produits[0].Produits_Simples[0].Produit[i].Tva[0];
              // Montant Tva u = (prix*tva)/100
              this.newAttribute.finalPrice=  (this.newAttribute.prixU - (this.newAttribute.prixU * (Number(this.newAttribute.remise)) / 100)).toFixed(3)  
              this.Montant_TVA = Number(this.newAttribute.finalPrice) * Number((this.newAttribute.tva)/ 100) ;
              this.newAttribute.montant_TVA = Number(this.Montant_TVA).toFixed(3);
  
              this.newAttribute.total_TVA = ((Number(this.newAttribute.montant_TVA)) / (Number(this.newAttribute.quantite))).toFixed(3);    
              this.newAttribute.montant_HT = ((Number(this.newAttribute.prixU) * Number(this.newAttribute.quantite)) * (1 - (Number(this.newAttribute.remise)) / 100)).toFixed(3);       
              this.Montant_Fodec = (this.newAttribute.montant_HT * this.newAttribute.fodec) / 100;
              this.newAttribute.montant_Fodec = Number(this.Montant_Fodec);
              
              this.blArticlsGeneral.push(this.newAttribute);
              // this.blArticlsGeneral.filter((item : any , index: any) => {
              //   this.blArticlsGeneral.indexOf(item) === index
              //   // if (this.blArticlsGeneral.indexOf(item.id_Produit) !== index){
              //   //   console.log('new itme');
              //   //   this.blArticlsGeneral.push(item);
                  
              //   // }
              //   // else {
              //   //   let ind : any ;
              //   //    ind = this.blArticlsGeneral.findIndex(((x: any)=>parseInt(x.id_Produit) === parseInt(this.newAttribute.id_produit))); 
              //   //    console.log(ind);
              //   //    this.blArticlsGeneral[ind].quantite = parseInt(this.blArticlsGeneral[ind].quantite) + parseInt(this.newAttribute.quantite);
              //   //    this.blArticlsGeneral[ind].prixU = (Number(this.blArticlsGeneral[ind].prixU) + Number(this.newAttribute.prixU)).toFixed(3);
              //   // }
              // })
     
             
            
              this.calculTotal();
              this.calculAssiettes();
            }
            }
            
            
            if(data.Produits[0].Produits_4Gs[0].Produit!= undefined){
              for (let i = 0; i < data.Produits[0].Produits_4Gs[0].Produit.length; i++) 
              { 
                this.newAttribute = {};
                this.newAttribute.id_Produit=(data.Produits[0].Produits_4Gs[0].Produit[i].Id[0]); 
                this.newAttribute.charge=(data.Produits[0].Produits_4Gs[0].Produit[i].Charge); 
                this.newAttribute.nom_Produit =(data.Produits[0].Produits_4Gs[0].Produit[i].Nom[0]); 
                this.newAttribute.Signaler_probleme=(data.Produits[0].Produits_4Gs[0].Produit[i].Signaler_probleme); 
                this.newAttribute.quantite=(data.Produits[0].Produits_4Gs[0].Produit[i].Qte[0]); 
                // this.newAttribute.montant_TVA=(data.Produits[0].Produits_4Gs[0].Produit[i].Montant_Tva[0]);
                
                this.newAttribute.fodec=(data.Produits[0].Produits_4Gs[0].Produit[i].fodec[0]);
                this.newAttribute.N_Imei = (data.Produits[0].Produits_4Gs[0].Produit[i].n_Imei); 
                this.newAttribute.N_Serie = (data.Produits[0].Produits_4Gs[0].Produit[i].n_Serie); 
                this.newAttribute.produits_simple = (data.Produits[0].Produits_4Gs[0].Produit[i].produits_simple); 
                this.newAttribute.tva = data.Produits[0].Produits_4Gs[0].Produit[i].Tva[0];          
                let tableaux_produits_emie = []
                for (let i = 0; i < data.Produits[0].Produits_4Gs[0].Produit[0].Produit_4Gs[0].Produit_4G.length; i++) {
                  let elem_4g : any = {};
                  elem_4g.n_serie = data.Produits[0].Produits_4Gs[0].Produit[0].Produit_4Gs[0].Produit_4G[i].N_Serie;
                  elem_4g.e1 = data.Produits[0].Produits_4Gs[0].Produit[0].Produit_4Gs[0].Produit_4G[i].E1
                  elem_4g.e2 = data.Produits[0].Produits_4Gs[0].Produit[0].Produit_4Gs[0].Produit_4G[i].E2   
                  tableaux_produits_emie.push(elem_4g)
                }
                this.newAttribute.remise= (data.Produits[0].Produits_4Gs[0].Produit[i].Remise[0]);
                this.newAttribute.tableaux_produits_emie=tableaux_produits_emie;
                this.newAttribute.prixU = (data.Produits[0].Produits_4Gs[0].Produit[i].PrixU[0]);
  
                      // Montant Tva u = (prix*tva)/100
                this.newAttribute.finalPrice=  (this.newAttribute.prixU - (this.newAttribute.prixU * (Number(this.newAttribute.remise)) / 100)).toFixed(3)  
                this.Montant_TVA = Number(this.newAttribute.finalPrice) * Number((this.newAttribute.tva)/ 100) ;
                this.newAttribute.montant_TVA = Number(this.Montant_TVA).toFixed(3);
              
                this.newAttribute.montant_HT = ((Number(this.newAttribute.prixU) * Number(this.newAttribute.quantite)) * (1 - (Number(this.newAttribute.remise)) / 100)).toFixed(3);
                this.Montant_Fodec = (this.newAttribute.montant_HT * this.newAttribute.fodec) / 100;
                this.newAttribute.montant_Fodec = Number(this.Montant_Fodec);
                this.newAttribute.prix_U_TTC= (data.Produits[0].Produits_4Gs[0].Produit[i].PrixUTTC[0]);
                this.newAttribute.total_HT= (data.Produits[0].Produits_4Gs[0].Produit[i].Total_HT[0]);
                this.newAttribute.totale_TTC = (data.Produits[0].Produits_4Gs[0].Produit[i].TotalFacture[0]);
                this.newAttribute.total_TVA = ((Number(this.newAttribute.montant_TVA)) / (Number(this.newAttribute.quantite))).toFixed(3); 
              
                // this.blArticlsGeneral.filter((item : any , index: any) => {
                //   this.blArticlsGeneral.indexOf(item) === index
                //   // if (this.blArticlsGeneral.indexOf(item.id_Produit) !== index){
                //   //   console.log('new itme');
                //   //   this.blArticlsGeneral.push(item);
                    
                //   // }
                //   // else {
                //   //   let ind : any ;
                //   //    ind = this.blArticlsGeneral.findIndex(((x: any)=>parseInt(x.id_Produit) === parseInt(this.newAttribute.id_produit))); 
                //   //    console.log(ind);
                //   //    this.blArticlsGeneral[ind].quantite = parseInt(this.blArticlsGeneral[ind].quantite) + parseInt(this.newAttribute.quantite);
                //   //    this.blArticlsGeneral[ind].prixU = (Number(this.blArticlsGeneral[ind].prixU) + Number(this.newAttribute.prixU)).toFixed(3);
                //   // }
                // });
                this.blArticlsGeneral.push(this.newAttribute);
                this.calculTotal();
                this.calculAssiettes();
                
              }
            }
            
            if(data.Produits[0].Produits_Series[0].Produit!= undefined){
              for (let i = 0; i < data.Produits[0].Produits_Series[0].Produit.length; i++) 
              {
                this.newAttribute = {};
                this.newAttribute.id_Produit=(data.Produits[0].Produits_Series[0].Produit[i].Id[0]); 
                this.newAttribute.charge=(data.Produits[0].Produits_Series[0].Produit[i].Charge); 
                this.newAttribute.nom_Produit =(data.Produits[0].Produits_Series[0].Produit[i].Nom); 
                this.newAttribute.Signaler_probleme=(data.Produits[0].Produits_Series[0].Produit[i].Signaler_probleme); 
                this.newAttribute.quantite=(data.Produits[0].Produits_Series[0].Produit[i].Qte[0]); 
                // this.newAttribute.montant_TVA=(data.Produits[0].Produits_Series[0].Produit[i].Montant_Tva[0]);
                this.newAttribute.fodec=(data.Produits[0].Produits_Series[0].Produit[i].fodec);              
                this.newAttribute.N_Imei = (data.Produits[0].Produits_Series[0].Produit[i].n_Imei); 
                this.newAttribute.N_Serie = (data.Produits[0].Produits_Series[0].Produit[i].n_Serie); 
                this.newAttribute.produits_simple = (data.Produits[0].Produits_Series[0].Produit[i].produits_simple);           
                this.newAttribute.tva = data.Produits[0].Produits_Series[0].Produit[i].Tva[0]; 
                let tableaux_produits_serie = []
                for (let i = 0; i < data.Produits[0].Produits_Series[0].Produit[0].N_Series[0].N_Serie.length; i++) {
                  tableaux_produits_serie.push( data.Produits[0].Produits_Series[0].Produit[0].N_Series[0].N_Serie[i])
                
              }  
              this.newAttribute.remise= (data.Produits[0].Produits_Series[0].Produit[i].Remise[0]);      
              this.newAttribute.tableaux_produits_serie=tableaux_produits_serie;
              this.newAttribute.prixU = (data.Produits[0].Produits_Series[0].Produit[i].PrixU[0]);
              
              // Montant Tva u = (prix*tva)/100
              this.newAttribute.finalPrice=  (this.newAttribute.prixU - (this.newAttribute.prixU * (Number(this.newAttribute.remise)) / 100)).toFixed(3)  
              this.Montant_TVA = Number(this.newAttribute.finalPrice) * Number((this.newAttribute.tva)/ 100) ;
              this.newAttribute.montant_TVA = Number(this.Montant_TVA).toFixed(3);
  
              this.newAttribute.montant_HT = ((Number(this.newAttribute.prixU) * Number(this.newAttribute.quantite)) * (1 - (Number(this.newAttribute.remise)) / 100)).toFixed(3);
              this.Montant_Fodec = (this.newAttribute.montant_HT * this.newAttribute.fodec) / 100;
              this.newAttribute.montant_Fodec = Number(this.Montant_Fodec);
              
              this.newAttribute.charge = (data.Produits[0].Produits_Series[0].Produit[i].charge);
              this.newAttribute.prix_U_TTC= (data.Produits[0].Produits_Series[0].Produit[i].PrixUTTC[0]);
              this.newAttribute.total_HT= (data.Produits[0].Produits_Series[0].Produit[i].Total_HT[0]);
              this.newAttribute.totale_TTC = (data.Produits[0].Produits_Series[0].Produit[i].TotalFacture[0]);
              this.newAttribute.total_TVA = ((Number(this.newAttribute.montant_TVA)) / (Number(this.newAttribute.quantite))).toFixed(3);
              console.log(this.newAttribute.id_Produit);
            
              
            //  this.blArticlsGeneral.filter((item : any , index: any) => {
            //   this.blArticlsGeneral.indexOf(item) === index
            //     // if (this.blArticlsGeneral.indexOf(item.id_Produit) !== index){
            //     //   console.log('new itme');
            //     //   this.blArticlsGeneral.push(item);
                  
            //     // }
            //     // else {
            //     //   let ind : any ;
            //     //    ind = this.blArticlsGeneral.findIndex(((x: any)=>parseInt(x.id_Produit) === parseInt(this.newAttribute.id_produit))); 
            //     //    console.log(ind);
            //     //    this.blArticlsGeneral[ind].quantite = parseInt(this.blArticlsGeneral[ind].quantite) + parseInt(this.newAttribute.quantite);
            //     //    this.blArticlsGeneral[ind].prixU = (Number(this.blArticlsGeneral[ind].prixU) + Number(this.newAttribute.prixU)).toFixed(3);
            //     // }
            //   });
             
              this.blArticlsGeneral.push(this.newAttribute)
              this.calculTotal();
              this.calculAssiettes();
              }
            }
            
        } 
        var result = this.blArticlsGeneral.reduce((unique : any , o: any) => {
          if(!unique.some((obj: any) => obj.id_Produit === o.id_Produit && obj.nom_Produit === o.nom_Produit)) {
            unique.push(o);
          }
          return unique;
      },[]);
      console.log('result', result); 
        fileReader.readAsDataURL(detail.body);
        this.loadingGeneral = false; 
    }); 
  }
  voirLess(id : any ){
    if (this.id === id){
      this.voirmoins = false
      this.voirPlus = true
    } 

  }
  //** Get Data (BL) */
  checkCheckBoxvalue(event : any , bl : any){
    if(event.target.checked) {
      this.blChecked = bl; 
      this.listBlCheched.push(this.blChecked);
      this.dsiable = false;
    }else{
      this.listBlCheched = this.listBlCheched.filter((ele : any)=> ele.id_Bl !== bl.id_Bl)
    }
  }
   //** Get Client by ID */
   getClientId(id : any): any{
    this.bLService.getClientById(id.toString()).subscribe((res: any ) => {
      this.clt= res.body; 
    }); 
  }

  contenuTable(data: any, columns: any) {
    var body = []; 
    body.push(columns);
    data.forEach((row: any)=> {
      var dataRow: any = [];
    // ['id_Produit', 'nom_Produit', 'prixU', 'remise', 'quantite', 'tva', 'total_HT']   
    this.columns.forEach((column: any) =>{  
        if(typeof(row[column])=='object'){
          dataRow.push(row[column][0]);
        }
        if((typeof(row[column])=='string')||typeof(row[column])=='number'){
          dataRow.push(row[column]);
        }
       
      });
      body.push(dataRow);
    });  
     return body;
  }
  //** Generate a table */
  generateTable(data: any, columns: any) {
    return {
      table: {
        headerRows: 1, 
        bold: true,
        body: this.contenuTable(data, columns),
        alignment: "center"
      }, layout: 'headerLineOnly',
    };
  }
  //** Convert the Image in base64  */
  getBase64ImageFromURL(url : any) {
    return new Promise((resolve, reject) => {
      var img = new Image();
      img.setAttribute("crossOrigin", "anonymous");
      img.onload = () => {
        var canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        var ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);
        var dataURL = canvas.toDataURL("image/png");
        resolve(dataURL);
      };
      img.onerror = error => {
        reject(error);
      };
      img.src = url;
    });
  }
  //** View PDF */
  viewPDF(bl: any){
    this.getClientId(bl.id_Clt);
    this.date =  this.datepipe.transform(bl.date_Creation, 'dd/MM/YYYY');
    // this.bLService.detail(devis.id_Bl.toString()).subscribe((detail: any)=>{
    //   var devisArr :any = [];
    //   //** Parsing an XML file unisng  'xml2js' lebraby*/
    //   const fileReader = new FileReader(); 
    //   // Convert blob to base64 with onloadend function
    //   fileReader.onloadend = () =>{
    //     this.detail = fileReader.result; // data: application/xml in base64
    //     let data : any; 
    //     xml2js.parseString(atob(this.detail.substr(28)),(err: any , res : any)=>{
    //       data =res.Devis;   
    //       console.log('data',data);  
    //     });
    //     this.xmldata = data;
    //     // 'Id_Produit', 'Nom_Produit', 'Prix', 'Remise', 'Quantite', 'TVA', 'Total_HT'
    //       if(data.Produits[0].Produits_Simples[0].Produit!= undefined){
    //       for (let i = 0; i < data.Produits[0].Produits_Simples[0].Produit.length; i++) 
    //       { 
    //          let Id_Produit: any =data.Produits[0].Produits_Simples[0].Produit[i].Id;  
    //          let Nom_Produit: any  =data.Produits[0].Produits_Simples[0].Produit[i].Nom;
    //          let Quantite: any =data.Produits[0].Produits_Simples[0].Produit[i].Qte ;
    //          let Prix_U: any=Number (data.Produits[0].Produits_Simples[0].Produit[i].PrixU).toFixed(3);
    //          let Remise : any =(data.Produits[0].Produits_Simples[0].Produit[i].Remise)
    //          let TVA : any = data.Produits[0].Produits_Simples[0].Produit[i].Tva;
    //          let Total_HT :any = data.Produits[0].Produits_Simples[0].Produit[i].Total_HT
    //          devisArr.push(
    //           {
    //             ID:  Id_Produit,
    //             Nom:  Nom_Produit,
    //             Quantité: Quantite,
    //             Prix_U:  Prix_U,
    //             Remise:Remise,
    //             TVA:TVA,
    //             Total_HT: Total_HT
    //           });
            
    //       }
    //        }
    //       if(data.Produits[0].Produits_4Gs[0].Produit!= undefined){
    //       for (let i = 0; i < data.Produits[0].Produits_4Gs[0].Produit.length; i++) 
    //       {   
    //        let Id_Produit: any =data.Produits[0].Produits_4Gs[0].Produit[i].Id;  
    //        let Nom_Produit: any  =data.Produits[0].Produits_4Gs[0].Produit[i].Nom;
    //        let Quantite: any =data.Produits[0].Produits_4Gs[0].Produit[i].Qte ;
    //        let Prix_U: any=Number (data.Produits[0].Produits_4Gs[0].Produit[i].PrixU).toFixed(3);
    //        let Remise : any =(data.Produits[0].Produits_4Gs[0].Produit[i].Remise)
    //        let TVA : any = data.Produits[0].Produits_4Gs[0].Produit[i].Tva;
    //        let Total_HT :any = data.Produits[0].Produits_4Gs[0].Produit[i].Total_HT
                            
    //         devisArr.push(
    //           {
    //             ID:  Id_Produit,
    //             Nom:  Nom_Produit,
    //             Quantité: Quantite,
    //             Prix_U:  Prix_U,
    //             Remise:Remise,
    //             TVA:TVA,
    //             Total_HT: Total_HT
    //           });
            
           
    //       }}
    //       if(data.Produits[0].Produits_Series[0].Produit!= undefined){
    //       for (let i = 0; i < data.Produits[0].Produits_Series[0].Produit.length; i++) 
    //       { 
    //         let Id_Produit: any =data.Produits[0].Produits_Series[0].Produit[i].Id;  
    //         let Nom_Produit: any  =data.Produits[0].Produits_Series[0].Produit[i].Nom;
    //         let Quantite: any =data.Produits[0].Produits_Series[0].Produit[i].Qte ;
    //         let Prix_U: any=Number (data.Produits[0].Produits_Series[0].Produit[i].PrixU).toFixed(3);
    //         let Remise : any =(data.Produits[0].Produits_Series[0].Produit[i].Remise)
    //         let TVA : any = data.Produits[0].Produits_Series[0].Produit[i].Tva;
    //         let Total_HT :any = data.Produits[0].Produits_Series[0].Produit[i].Total_HT
          
    //         devisArr.push(
    //           {
    //             ID:  Id_Produit,
    //             Nom:  Nom_Produit,
    //             Quantité: Quantite,
    //             Prix_U:  Prix_U,
    //             Remise:Remise,
    //             TVA:TVA,
    //             Total_HT: Total_HT
    //           }); 
            
    //       }}
    //       setTimeout(async ()=>{
    //         //** Generate the pdf file */ 
    //         let pdf_devis = {
    //           background: [
    //             {
    //               image: await this.getBase64ImageFromURL("../../../assets/images/template_Devis.jpg"), width: 600
    //             }
    //           ],
    //           content: [
    //             {
    //               text: 'Informations Générales :' + '\n\n',
    //               fontSize: 15,
    //               alignment: 'left',
    //               color: 'black',
    //               bold: true
    //             },
    //             {
    //               columns: [
    //                 {   
    //                   text: 
    //                  'Type Devis :' + '\t' + devis.type+ '\n\n' 
    //                   + 'Devise avec :' + '\t' +'DT'+ '\n\n'
    //                   + 'Nom Fournisseur :' + '\t' + 'InfoNet' + '\n\n'
    //                   + 'Mode Paiement :' + '\t' + devis.mode_Paiement+ '\n\n'
    //                 ,
    //                 fontSize: 12,
    //                 alignment: 'left',
    //                 color: 'black',
    //               },
    //                 {
    //                   text: '\t'
    //                 },
    //                 {   
    //                   text: 
    //                   'Code Client :' + '\t' + devis.id_Clt + '\n\n'
    //                   + 'Nom Client :' + '\t' + this.clt.nom_Client + '\n\n'
    //                   + 'Adresse :' + '\t' + this.clt.adresse+ '\n\n' 
    //                   + 'Date:' + '\t' + this.date+ '\n\n'
                    
    //                   ,
    //                   fontSize: 12,
    //                   alignment: 'left',
    //                   color: 'black'
    //                 }
    //               ]
    //             },
    //             {
    //               text: '\n\n'+'\n\n'
    //             },
    //             {
    //               text: 'Détails :' + '\t',
    //               fontSize: 20,
    //               alignment: 'left',
    //               color: 'black',
    //               bold: true
    //             },
    //             {
    //               text: '\n\n'
    //             },
    //             this.generateTable(devisArr, ['Id_Produit', 'Nom_Produit', 'Prix', 'Remise', 'Quantite', 'TVA', 'Total_HT']),
    //             {
    //               text: '\n\n\n'
    //             },
    //             , {
    //               columns: [
    //                 {
    //                   table: {
    //                     alignment: 'right',
    //                     body: [
    //                       [{ text: 'T.V.A %', alignment: 'left' }, '7%', '13%', '19%'],
    //                       [{ text: 'Assiette', alignment: 'left' }, data.Taxes[0].TVA[0].TVA7, data.Taxes[0].TVA[0].TVA13, data.Taxes[0].TVA[0].TVA19],
    //                       [{ text: 'Montant', alignment: 'left' }, data.Montant_TVA[0].Montant_TVA7, data.Montant_TVA[0].Montant_TVA13, data.Montant_TVA[0].Montant_TVA19],
    //                     ]
    //                   },
    //                   layout: 'lightHorizontalLines',
    //                   alignment: 'right',
    //                 },
    //                 {
    //                 },
    //                 {
    //                   style: 'tableExample',
    //                   table: {
    //                     heights: [20],
    //                     body: [
    //                       [{ text: 'Total H.T Brut', alignment: 'left' }, { text: data.Total[0].TotalHTBrut[0], alignment: 'right' }],
    //                       [{ text: 'Total Remise', alignment: 'left' }, { text: data.Total[0].TotalRemise[0], alignment: 'right' }],
    //                       [{ text: 'Total H.T Net', alignment: 'left' }, { text: data.Total[0].TotalHTNet[0], alignment: 'right' }],
    //                       [{ text: 'Total Fodec', alignment: 'left' }, { text: data.Total[0].TotalFodec[0], alignment: 'right' }],
    //                       [{ text: 'Total T.V.A', alignment: 'left' }, { text: data.Total[0].TotalTVA[0], alignment: 'right' }],
    //                       [{ text: 'Total T.T.C', alignment: 'left' }, { text: data.Total[0].TotalTTC[0], alignment: 'right' }],
    //                     ]
    //                   },
    //                   layout: 'lightHorizontalLines',
    //                 }]
    //             },
    //           ],
    //           footer: function (currentPage: any, pageCount: any) {
    //             return {
    //               margin: 35,
    //               columns: [
    //                 {
    //                   fontSize: 9,
    //                   text: [
    //                     {
    //                       text: currentPage.toString() + '/' + pageCount,
    //                     }
    //                   ],
    //                   alignment: 'center'
    //                 }
    //               ]
    //             };
    //           },
    //           pageMargins: [30, 125, 40, 60],
    //         };
    //         pdfMake.createPdf(pdf_devis).open();
    //        },1000)
    //   }      
    //   fileReader.readAsDataURL(detail.body);
    // });
  }
    //** Go Forward  */
  goForward(stepper : MatStepper){
      stepper.next();
  }
  detailBlFacture(stepper : MatStepper ){
    if(this.listBlCheched.length !== 0){
      // generate the table blArticlsGeneral 
      for(let i = 0 ; i< this.listBlCheched.length ; i++){
        this.getDetailForGeneral(this.listBlCheched[i].id_Bl)
      }
      this.infoFormGroup.controls['lengthOfListBl'].setValue(this.listBlCheched.length); 
      this.goForward(stepper);
    }
    else{
      // erro
      Swal.fire( 
        'Vous devez choisir au moins un BL',
        '',
        'info');
    }  
  }

  // save the bill
  saveFacture(){
    let formData : any = new FormData(); 

  }
}

