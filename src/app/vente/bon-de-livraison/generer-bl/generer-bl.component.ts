import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatStepper } from '@angular/material/stepper';
import { ActivatedRoute, Router } from '@angular/router';
import { interval, Subscription } from 'rxjs';
import Swal from 'sweetalert2';
// XML to JavaScript object converter.
import * as xml2js from 'xml2js';
import { DialogContentAddArticleDialogComponent } from '../../devis/ajouter-devis/dialog-content-add-article-dialog/dialog-content-add-article-dialog.component';
import { UpdateDialogOverviewArticleDialogComponent } from '../../devis/ajouter-devis/update-dialog-overview-article-dialog/update-dialog-overview-article-dialog.component';
import { VoirPlusDialogComponent } from '../../devis/ajouter-devis/voir-plus-dialog/voir-plus-dialog.component';
import { BlService } from '../../services/bl.service';
import { DevisService } from '../../services/devis.service';

const pdfMake = require("pdfmake/build/pdfmake");
const pdfFonts = require("pdfmake/build/vfs_fonts");
pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-generer-bl',
  templateUrl: './generer-bl.component.html',
  styleUrls: ['./generer-bl.component.scss']
})
export class GenererBlComponent implements OnInit {


  modepaiement: any =[{id:'1',name:'Virement'},{id:'2',name:'Chèque'},{id:'3',name:'Carte Monétique'},{id:'4',name:'Espèces'}]; 
  currency:  string []= ['Euro', 'TND', 'Dollar'];
  infoFormGroup : FormGroup; 
  addArticleFormGroup: FormGroup;
  addReglementFormGroup: FormGroup;
  
  visibel : boolean = false; 
  code : any;
  id: any
  last_ID: any;
  dataArticle: any
  Id_Produit: any;
  Ref_FR: any;
  N_Facture: any;
  Quantite: any = 1;
  Remise: any = 0;
  Prix: any = 0;
  IdProduit: any;
  Montant_TVA: any = 0;
  prix: any = 0;
  ref_FR: any;
  quantite: any = 0;
  id_produit: any;
  tva: any = 0;
  fodec: any = 0;
  Totale_TTC: any = 0;
  ChargeTransport: any = 0;
  Autre_Charge_Fixe: any = 0;
  Ch: any = 0;
  Total_HT: any = 0;
  etat : string = 'Dispo';
  qteStock : any ; 
  Ch_Globale: any = 0;
  devis_ID : string; 
  typeDevis : string; 
  modePaiement : string;
  devise: string; 
  custemerName : any
  devisData : any
  clients: any; 
  loading : boolean = false; 
  devisDetail : any ; 
  xmldata : any
  newAttribute: any = {};
  devisArticls : any = []; 
  detail: any;
  totalHTBrut: any = 0;
  totalRemise: any = 0;
  totalHT : any=0;
  totalMontantFodec: any = 0;
  totalMontantTVA : any = 0; 
  totalTTc: any = 0
  assiettetva19: any ;
  montanttva19 : any;
  assiette19 : any = 0; 
  assiettetva13: any = 0;
  assiettetva7: any = 0; 
  montant19: any= 0;
  montanttva13: any =0; 
  montanttva7: any = 0;
  totalChGlobale: any;
  totalPorcentageFodec: any;
  totalRHT: any = 0; 
  totalRTTC: any = 0; 
  totalPourcentCh : any =0; 
  assiette7 : any = 0;
  assiette13 : any =0 ;
  montant7: any =0;
  montant13 : any =0;
  Montant_Fodec: any = 0;
  isCompleted: boolean = false;
  sum : any = 0;
  show : number = 0; 
  verifTotal: boolean = true;
  ligneOne: boolean = false;
  ligneTwo: boolean = false;
  existInStoc : boolean = false; 
  totalFodec: any = 0;
  numDeviss : number = 1; 
  latest_date : any; 
  currentDate = new Date();
  date : any; 
  subscription: Subscription;
  nameClient: string;
  id_client: string;
  getProdId : boolean = false; 
  getProdCode: boolean = false; 
  price: any;
  secondValue: any ;
  totalTTc_ : any = 0
  totalTTc_reg : any =0 ; 
  isNull : boolean= false
  remiseDiff : any = 0 ; 
  columns : any = ['id_Produit', 'nom_Produit', 'prixU', 'remise', 'quantite', 'tva', 'total_HT']
  id_modeP_typeTwo : any ; 
  valueRegTwo : any; 
  note : any ; 
  nom_client : string = ''; 
  adresse_clt : string = ''; 
  client_id : string = ''
  valueRegTree: any ;
  id_modeP_typeTree: any ; 
  typeRegTwo: any ;
  typeRegTree: any ;
  
  @ViewChild(MatPaginator) paginator: any = MatPaginator;
  @ViewChild(MatSort) sort: any = MatSort;
  
  constructor(private _formBuilder : FormBuilder,private route : ActivatedRoute,public datepipe: DatePipe, private devisService : DevisService, public dialog: MatDialog, private router: Router, private bLservice : BlService) {
    this.latest_date =this.datepipe.transform(this.currentDate, 'dd/MM/YYYY');
    this.subscription = interval(10000).subscribe((v) => {
      this.calculTotal();
      this.calculAssiettes();
    });
   }

  ngOnInit(): void {
    //** INIT */
      this.devis_ID = this.route.snapshot.params.id;
      this.getDevisByID(); 
      this.getAllClient();
      this.getDetail();

      this.infoFormGroup = this._formBuilder.group({
      numDevis:[''],
      dateDevis:[''],
      modePaiement: [''],
      typeDevis:[''],
      companyName: [''],
      custemerName: [''],
      devise: [''],
      adresse: [''],
    });
    this.addArticleFormGroup = this._formBuilder.group({
      IdProduit: [''],
      Ref_FR: [''],
      Quantite: [, Validators.min(0.1)],
      Prix: [''],
      Id_Produit: [''],
      Ref_fournisseur: [''],
      Qte: [''],
      Prix_U: [''],
      TVA: [''],
      M_TVA: [''],
      Fodec: [''],
      Prix_HT: [''],
      Totale_TTC: [''],
      lengthTableDevis :  [null, [Validators.required, Validators.min(1)]]
    });
    this.addReglementFormGroup = this._formBuilder.group({
      typeRegOne : ['', Validators.required],
      typeRegTwo : ['',],
      typeRegTree : ['',],
      valueOne : ['0', Validators.required],
      valueTwo : ['0',],
      valueTree : ['0',],
      note: ['',]
    });
  }

    //** voir plus  */
    viewPlus(prod: any ){
      const dialogRef = this.dialog.open(VoirPlusDialogComponent,{
        width: '100%', data : {
          formPage: prod
        }
      });
      dialogRef.afterClosed().subscribe(()=>{
        console.log('Closed');
        
      });
  }
  //** Get All Client */
  async getAllClient(){
    this.devisService.getAllClient().subscribe( res => {
      this.clients = res; 
    })
  }
  //** Get Client by id  */
  async getClientId(id : string){
    this.devisService.getClientById(id).subscribe(res => {
      this.custemerName = res.body;
      this.nameClient = res.body.nom_Client;
      this.id_client= res.body.id_Clt;      
      this.loading = true; 
      this.nom_client = this.nameClient;
      this.client_id = this.id_client;
      this.adresse_clt= this.custemerName.adresse
    }); 
  }
  //** Get Devis by ID */
  async getDevisByID(){
    this.devisService.getQuoteByID(this.devis_ID.toString()).subscribe((data: any)=>{
      this.devisData = data.body; 
      this.id_client = this.devisData.id_Clt
      this.typeDevis = this.devisData.type; 
      this.modePaiement = this.devisData.mode_Paiement;
      this.note = this.devisData.description;  
      this.getClientId(this.id_client.toString());
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
    
      for (var i = 0; i < this.devisArticls.length; i++) {
      if (isNaN(this.devisArticls[i].montant_TVA)=== false  ){
        total1 += Number(this.devisArticls[i].montant_TVA)
        total2 += Number(this.devisArticls[i].montant_HT);
        this.totalHT = total2.toFixed(3);
  
        total4 += Number(this.devisArticls[i].ch_Globale);
        this.totalChGlobale = Number(total4).toFixed(3);
        total3 += Number(this.devisArticls[i].totale_TTC);
        this.totalTTc = Number(total3).toFixed(3);
        // totale ttc with remise
        total5 += Number(this.devisArticls[i].totale_TTC )-((this.devisArticls[i].prixU * (Number(this.devisArticls[i].remise)) / 100)*this.devisArticls[i].quantite )
        this.totalRemise = Number(total5).toFixed(3);
        this.totalTTc_= this.totalTTc;
        // ***
        total9 += (Number(this.devisArticls[i].fodec) * (Number(this.devisArticls[i].quantite)));
        this.totalPorcentageFodec = Number(total9).toFixed(3);
        total6 += ((Number(this.devisArticls[i].prixRevientU)) * (Number(this.devisArticls[i].quantite)));
        this.totalRHT = Number(total6).toFixed(3);
        total7 += ((Number(this.devisArticls[i].prixRevientU)) * (Number(this.devisArticls[i].quantite)) + Number(this.devisArticls[i].montant_TVA) + Number(this.devisArticls[i].montant_Fodec));
        this.totalRTTC = Number(total7).toFixed(3);
        total8 += Number(this.devisArticls[i].ch);
        this.totalPourcentCh = Number(total8).toFixed(3);
        this.newAttribute.totalPourcentCh = this.totalPourcentCh;
        total10 += Number( this.devisArticls[i].montant_Fodec);
        total11 += (Number(this.devisArticls[i].prixU) * Number(this.devisArticls[i].quantite));
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
    if(this.devisArticls.length == 0){
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
      for (let i = 0; i < this.devisArticls.length; i++) {
        if( isNaN(this.devisArticls[i].montant_HT)=== false){
          if (this.devisArticls[i].tva == '19') {
            this.assiettetva19 += (Number(Number(this.devisArticls[i].montant_HT)));
            this.montanttva19 += Number(Number(Number(this.devisArticls[i].montant_TVA)) * (this.devisArticls[i].quantite));
            this.assiette19 = this.assiettetva19.toFixed(3);
            this.montant19 = this.montanttva19.toFixed(3);          
          }
          else if (this.devisArticls[i].tva == '7') {
            this.assiettetva7 += Number(Number(this.devisArticls[i].montant_HT));
            this.montanttva7 += Number(Number(Number(this.devisArticls[i].montant_TVA) * Number(this.devisArticls[i].quantite)));
            this.assiette7 = this.assiettetva7.toFixed(3);
            this.montant7 = this.montanttva7.toFixed(3);
          }
          else if (this.devisArticls[i].tva == '13') {
            this.assiettetva13 += (Number(Number(this.devisArticls[i].montant_HT)));
            this.montanttva13 += (Number(Number(this.devisArticls[i].montant_TVA) * Number(this.devisArticls[i].quantite)));
            this.assiette13 = this.assiettetva13.toFixed(3);
            this.montant13 = this.montanttva13.toFixed(3);
          }
        }  
      }
    }
  }
  //** Get Detail Devis  */
  getDetail(){
    this.devisService.detail(this.devis_ID.toString()).subscribe((detail: any)=>{
      //** Parsing an XML file unisng  'xml2js' lebraby*/
      const fileReader = new FileReader(); 
      // Convert blob to base64 with onloadend function
      fileReader.onloadend = () =>{
        this.detail = fileReader.result; // data: application/xml in base64
        let data : any; 
        xml2js.parseString(atob(this.detail.substr(28)),(err: any , res : any)=>{      
          data =res.Devis;
          this.devise= data["Informations-Generales"][0].Devise[0]
          this.totalHTBrut = data.Total[0].TotalHTBrut[0]; 
          this.totalMontantFodec= data.Total[0].TotalFodec[0];
          this.totalRemise = data.Total[0].TotalRemise[0];
          this.totalHT = data.Total[0].TotalHTNet[0];
          this.totalMontantTVA = data.Total[0].TotalTVA[0];
          this.totalTTc = data.Total[0].TotalTTC[0];

          this.totalTTc_reg = data.Type_Reglement[0].ValueRegOne[0];          
          this.id_modeP_typeTwo = data.Type_Reglement[0].TypeRegTwo[0];
          this.id_modeP_typeTree = data.Type_Reglement[0].TypeRegTree[0]
          this.valueRegTwo = data.Type_Reglement[0].ValueRegTwo[0];
          this.valueRegTree = data.Type_Reglement[0].ValueRegTree[0]
          if (this.id_modeP_typeTwo !== undefined){
            // [{id:'1',name:'Virement'},{id:'2',name:'Chèque'},{id:'3',name:'Carte Monétique'},{id:'4',name:'Espèces'}]; 
            if(this.id_modeP_typeTwo =='4')
             this.typeRegTwo ='Espèces';
             else if (this.id_modeP_typeTwo =='1'){
              this.typeRegTwo ='Virement';
             }else if (this.id_modeP_typeTwo =='2'){
              this.typeRegTwo ='Chèque';
            }else if (this.id_modeP_typeTwo =='3'){
              this.typeRegTwo ='Monétique';
            }
            this.ligneOne = true 
          }
          if (this.id_modeP_typeTree !== undefined){
            // [{id:'1',name:'Virement'},{id:'2',name:'Chèque'},{id:'3',name:'Carte Monétique'},{id:'4',name:'Espèces'}]; 
            if(this.id_modeP_typeTree =='4')
             this.typeRegTree ='Espèces';
             else if (this.id_modeP_typeTree =='1'){
              this.typeRegTree ='Virement';
             }else if (this.id_modeP_typeTree =='2'){
              this.typeRegTree ='Chèque';
            }else if (this.id_modeP_typeTree =='3'){
              this.typeRegTree ='Monétique';
            }
            this.ligneTwo = true 
          }
        
        });
        
        if(data.Produits[0].Produits_Simples[0].Produit!= undefined){
          for (let i = 0; i < data.Produits[0].Produits_Simples[0].Produit.length; i++) 
          { 
            this.newAttribute = {};
            this.newAttribute.id_Produit=(data.Produits[0].Produits_Simples[0].Produit[i].Id[0]); 
            this.newAttribute.charge=(data.Produits[0].Produits_Simples[0].Produit[i].Charge); 
            this.newAttribute.nom_Produit =(data.Produits[0].Produits_Simples[0].Produit[i].Nom[0]); 
            this.newAttribute.etat = (data.Produits[0].Produits_Simples[0].Produit[i].Etat[0]);
            this.newAttribute.Signaler_probleme=(data.Produits[0].Produits_Simples[0].Produit[i].Signaler_probleme); 
            this.newAttribute.quantite=(data.Produits[0].Produits_Simples[0].Produit[i].Qte[0]); 
            this.newAttribute.montant_TVA=(data.Produits[0].Produits_Simples[0].Produit[i].Montant_Tva[0]);
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
            this.newAttribute.total_TVA = ((Number(this.newAttribute.montant_TVA)) / (Number(this.newAttribute.quantite))).toFixed(3);    
            this.newAttribute.montant_HT = ((Number(this.newAttribute.prixU) * Number(this.newAttribute.quantite)) * (1 - (Number(this.newAttribute.remise)) / 100)).toFixed(3);       
            this.Montant_Fodec = (this.newAttribute.montant_HT * this.newAttribute.fodec) / 100;
            this.newAttribute.montant_Fodec = Number(this.Montant_Fodec);
            this.devisArticls.push(this.newAttribute);
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
              this.newAttribute.etat = (data.Produits[0].Produits_4Gs[0].Produit[i].Etat[0]);
              this.newAttribute.Signaler_probleme=(data.Produits[0].Produits_4Gs[0].Produit[i].Signaler_probleme); 
              this.newAttribute.quantite=(data.Produits[0].Produits_4Gs[0].Produit[i].Qte[0]); 
              this.newAttribute.montant_TVA=(data.Produits[0].Produits_4Gs[0].Produit[i].Montant_Tva[0]);

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
              this.newAttribute.prixU = (data.Produits[0].Produits_4Gs[0].Produit[i].PrixU[0])
              this.newAttribute.montant_HT = ((Number(this.newAttribute.prixU) * Number(this.newAttribute.quantite)) * (1 - (Number(this.newAttribute.remise)) / 100)).toFixed(3);
              this.Montant_Fodec = (this.newAttribute.montant_HT * this.newAttribute.fodec) / 100;
              this.newAttribute.montant_Fodec = Number(this.Montant_Fodec);
              this.newAttribute.prix_U_TTC= (data.Produits[0].Produits_4Gs[0].Produit[i].PrixUTTC[0]);
              this.newAttribute.total_HT= (data.Produits[0].Produits_4Gs[0].Produit[i].Total_HT[0]);
              this.newAttribute.totale_TTC = (data.Produits[0].Produits_4Gs[0].Produit[i].TotalFacture[0]);
              this.newAttribute.total_TVA = ((Number(this.newAttribute.montant_TVA)) / (Number(this.newAttribute.quantite))).toFixed(3); 
              this.devisArticls.push(this.newAttribute);
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
              this.newAttribute.nom_Produit =(data.Produits[0].Produits_Series[0].Produit[i].Nom[0]); 
              this.newAttribute.etat= (data.Produits[0].Produits_Series[0].Produit[i].Etat[0]);
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
            this.devisArticls.push(this.newAttribute);
            this.calculTotal();
            this.calculAssiettes();
            }
          }
      }          
      fileReader.readAsDataURL(detail.body)
  })

}
//** Error Msg */
  ErrorMessage(field: string) {
    if (this.infoFormGroup.get(field).hasError('required')) {
      return 'Vous devez entrer ';
    }
    else {
      return '';
    }
  }
  //** Get Article By ID */
  async getProuduitById(){
      this.getProdId = true;
      this.newAttribute = {};
      let idProd = this.id;   
      this.last_ID = this.id;   
      let index = this.devisArticls.findIndex(((x: any)=>parseInt(x.id_Produit) === parseInt(this.last_ID)));     
      //** Fetch if this product is exist in devisArticls or not  */ 
      if((index === -1) && (idProd != undefined)){
      this.devisService.getArticleById(idProd).subscribe((res) => {
        if(res.body === null){
          Swal.fire({
            title: 'Il n\'y a pas de produit avec ce code!',
            icon: 'warning',
            showCancelButton : true, 
            confirmButtonText: 'Ok',
          });
          this.getProdId = false;
        } else {
          if(parseInt(res.body.tva) ===0){
            Swal.fire({
              title: 'Désolé, vous ne pouvez pas ajouter ce produit! avec TVA = 0',
              icon: 'warning',
              showCancelButton : true, 
              confirmButtonText: 'Ok',
            });
            this.getProdId = false;
          }else{
            this.dataArticle = res.body; 
            this.newAttribute.id_Produit = idProd;
            this.newAttribute.nom_Produit = this.dataArticle.nom_Produit;
            this.newAttribute.n_Imei = this.dataArticle.n_Imei;
            this.newAttribute.n_Serie = this.dataArticle.n_Serie;
            this.newAttribute.tva = this.dataArticle.tva;
            this.tva = this.newAttribute.tva;
            this.newAttribute.ch = this.Ch;
            this.newAttribute.chargeTr = this.ChargeTransport;
            this.newAttribute.autreCharge = this.Autre_Charge_Fixe;
            this.newAttribute.quantite = Number(this.Quantite);
            this.newAttribute.remise = Number(this.Remise);
            if (this.dataArticle.fodec == "Sans_Fodec") {
              this.newAttribute.fodec = 0;
            }
            else {
              this.newAttribute.fodec = 1;
            }
            this.fodec = this.newAttribute.fodec;
            // get Prix U from stocks 
            this.devisService.getInfoProductByIdFromStock(idProd).subscribe((result : any) => {
              // if not exist in the table stocks 
              if ((result.body)===null){
                Swal.fire("ce produit est hors stock", '','warning');
                this.devisArticls.sort = this.sort;
                this.devisArticls.paginator = this.paginator;
              }
              else{ 
              this.qteStock= result.body.quantite; 
              // check availability
              if(this.qteStock<this.newAttribute.quantite){
                Swal.fire('vous ne pouvez pas ajouter ce produit','Qte de stock < Qte demandé ', 'warning'); 
              }else{
                this.newAttribute.prixU = Number(result.body.prix).toFixed(3); 
                this.newAttribute.finalPrice=  (this.newAttribute.prixU - (this.newAttribute.prixU * (Number(this.newAttribute.remise)) / 100)).toFixed(3)  
    
                this.newAttribute.montant_HT = ((Number(this.newAttribute.prixU) * Number(this.newAttribute.quantite)) * (1 - (Number(this.newAttribute.remise)) / 100)).toFixed(3);
                this.newAttribute.qprixU = Number(this.Prix).toFixed(3);
                this.Montant_Fodec = (this.newAttribute.montant_HT * this.newAttribute.fodec) / 100;
                this.newAttribute.montant_Fodec = Number(this.Montant_Fodec).toFixed(3);
    
                // Montant Tva u = (prix*tva)/100
                this.Montant_TVA = Number(this.newAttribute.finalPrice) * Number((this.newAttribute.tva)/ 100) ;
                this.newAttribute.montant_TVA = Number(this.Montant_TVA).toFixed(3);
                // Total ht = prix * qt
                this.Total_HT = Number(this.newAttribute.finalPrice * this.newAttribute.quantite); 
                this.newAttribute.total_HT = Number(this.Total_HT).toFixed(3);
                //  prix u ttc = prix u  + montant tva u 
                this.newAttribute.prix_U_TTC = (((Number(this.newAttribute.finalPrice) + Number((this.newAttribute.montant_Fodec)/this.newAttribute.quantite) + Number(this.newAttribute.montant_TVA)))).toFixed(3);;
    
                this.newAttribute.montant_TTC = Number(this.newAttribute.prix_U_TTC) * Number(this.newAttribute.quantite);
                this.newAttribute.total_TVA = ((Number(this.newAttribute.montant_TVA)) / (Number(this.newAttribute.quantite))).toFixed(3);
                 //  total ttc = prix u ttc * qte
                this.Totale_TTC = Number(this.newAttribute.prix_U_TTC * this.newAttribute.quantite).toFixed(3) ;                    
                this.newAttribute.totale_TTC = this.Totale_TTC;
    
                this.newAttribute.total_TVA = ((Number(this.newAttribute.montant_TVA)) / (Number(this.newAttribute.quantite))).toFixed(3);
                this.newAttribute.ch_Globale = Number(this.Ch_Globale);
    
                this.newAttribute.etatEntree = "Entrée Stock Non Accompli";
                this.newAttribute.fichierSimple = "";
                this.newAttribute.fichierSerie = "";
                this.newAttribute.fichier4G = "";
                this.newAttribute.produitsSeries = "";
                this.newAttribute.produits4g = "";
                this.newAttribute.etat = '' 
                this.newAttribute.etat = 'Dispo.'
                this.devisArticls.push(this.newAttribute);
                this.calculTotal();
                this.calculAssiettes();
                this.devisArticls.sort = this.sort;
                this.devisArticls.paginator = this.paginator;
              }  
            }
              this.last_ID = this.id; 
              this.id = '';      
            }); 
            }     
            this.getProdId= false;
          }
        },(err : any)=>{
          console.log(err);
          Swal.fire({
            title: 'Il n\'y a pas de produit avec ce code!',
            icon: 'warning',
            showCancelButton : true, 
            confirmButtonText: 'Ok',
          });
          this.getProdId = false;
        });
        } // if this product exist 
        else{
          this.devisService.getInfoProductByIdFromStock(idProd).subscribe((result : any) => {
            if ((result.body)===null){
              Swal.fire("ce produit est hors stock", '','warning');
              this.devisArticls.sort = this.sort;
              this.devisArticls.paginator = this.paginator;
            }
            else{ 
              this.qteStock= result.body.quantite; 
              let qte : any ; 
              qte = parseInt(this.devisArticls[index].quantite);
              qte +=1; 
            // Check availibility 
            if(this.qteStock<qte){
              Swal.fire('vous ne pouvez pas ajouter ce produit','Qte de stock < Qte demandé ', 'warning'); 
              this.getProdId= false;
            }else{
              this.devisArticls[index].quantite = parseInt(this.devisArticls[index].quantite)+1
              this.devisArticls[index].prixU=Number(this.devisArticls[index].prixU).toFixed(3);  
              this.devisArticls[index].finalPrice=  (this.devisArticls[index].prixU - (this.devisArticls[index].prixU * (Number(this.devisArticls[index].remise)) / 100)).toFixed(3)  
          
              this.devisArticls[index].montant_HT = ((Number(this.devisArticls[index].prixU) * Number(this.devisArticls[index].quantite)) * (1 - (Number(this.devisArticls[index].remise)) / 100)).toFixed(3);
              this.devisArticls[index].qprixU = Number(this.Prix).toFixed(3);
              this.Montant_Fodec = (this.devisArticls[index].montant_HT * this.devisArticls[index].fodec) / 100;
              this.devisArticls[index].montant_Fodec = Number(this.Montant_Fodec).toFixed(3);
      
              this.Montant_TVA = Number(this.devisArticls[index].finalPrice) * Number((this.devisArticls[index].tva)/ 100) ;
              this.devisArticls[index].montant_TVA = Number(this.Montant_TVA).toFixed(3);
      
              this.devisArticls[index].montant_TVA = Number(this.Montant_TVA).toFixed(3);
              this.devisArticls[index].prix_U_TTC = (((Number(this.devisArticls[index].finalPrice) + Number((this.devisArticls[index].montant_Fodec)/this.devisArticls[index].quantite) + Number(this.devisArticls[index].montant_TVA)))).toFixed(3);;
              this.devisArticls[index].montant_TTC = Number(this.devisArticls[index].prix_U_TTC) * Number(this.devisArticls[index].quantite);
              this.devisArticls[index].total_TVA = ((Number(this.devisArticls[index].montant_TVA)) / (Number(this.devisArticls[index].quantite))).toFixed(3);
              this.Totale_TTC = Number((this.devisArticls[index].prix_U_TTC*this.devisArticls[index].quantite)).toFixed(3)
              this.devisArticls[index].totale_TTC = this.Totale_TTC;
              this.Total_HT = Number(this.devisArticls[index].finalPrice * this.devisArticls[index].quantite); 
              this.devisArticls[index].total_HT = Number(this.Total_HT).toFixed(3);        
              this.devisArticls[index].ch_Globale = Number(this.Ch_Globale);
              this.devisArticls[index].etat = 'Dispo.';
              this.calculTotal();
              this.calculAssiettes();
              this.getProdId= false;
             }  
            }
          }); 

        }
  }
  
  //** Get Article By Code A Bare */
  async getProuduitByCode(){ 
      this.getProdCode = true;
      this.devisService.getArrByCodeBare(this.code).subscribe((res: any)=>{
        if((res.body === null) || (this.code = undefined)){
          Swal.fire({
            title: 'Il n\'y a pas de produit avec ce code!',
            icon: 'warning', 
            showCancelButton : true, 
            confirmButtonText: 'Ok',
          });
          this.getProdCode = false;
        }
        else{
          if(parseInt(res.body.tva) ===0){
            Swal.fire({
              title: 'Désolé, vous ne pouvez pas ajouter ce produit! avec TVA = 0',
              icon: 'warning',
              showCancelButton : true, 
              confirmButtonText: 'Ok',
            });
            this.getProdCode = false;
          }else{
            this.newAttribute = {};   
            this.last_ID=res.body.id_Produit;  
            let index = this.devisArticls.findIndex(((x: any)=>parseInt(x.id_Produit) === parseInt(this.last_ID))); 
            if(index === -1){      
            let idProd = res.body.id_Produit;
            this.devisService.getArticleById(idProd).subscribe((res) => {
              this.dataArticle = res.body; 
              this.newAttribute.id_Produit = idProd;
              this.newAttribute.nom_Produit = this.dataArticle.nom_Produit;
              this.newAttribute.n_Imei = this.dataArticle.n_Imei;
              this.newAttribute.n_Serie = this.dataArticle.n_Serie;
              this.newAttribute.tva = this.dataArticle.tva;
              this.tva = this.newAttribute.tva;
              this.newAttribute.ch = this.Ch;
              this.newAttribute.chargeTr = this.ChargeTransport;
              this.newAttribute.autreCharge = this.Autre_Charge_Fixe;
              this.newAttribute.quantite = Number(this.Quantite);
              this.newAttribute.remise = Number(this.Remise);
      
              if (this.dataArticle.fodec == "Sans_Fodec") {
                this.newAttribute.fodec = 0;
              }
              else {
                this.newAttribute.fodec = 1;
              }
              this.fodec = this.newAttribute.fodec;
              // get Prix U HT
              this.devisService.getInfoProductByIdFromStock(idProd).subscribe((result : any) => {
                if ((result.body)===null) {
                  Swal.fire("ce produit est hors stock", '','warning');
                }
                else {
                  this.qteStock= result.body.quantite; 
                // check availability
                if(this.qteStock<this.newAttribute.quantite){
                  Swal.fire('vous ne pouvez pas ajouter ce produit','Qte de stock < Qte demandé ', 'warning'); 
                }else{
                    this.newAttribute.prixU = Number(result.body.prix).toFixed(3); 
                    this.newAttribute.finalPrice=  (this.newAttribute.prixU - (this.newAttribute.prixU * (Number(this.newAttribute.remise)) / 100)).toFixed(3)  
    
                    this.newAttribute.montant_HT = ((Number(this.newAttribute.prixU) * Number(this.newAttribute.quantite)) * (1 - (Number(this.newAttribute.remise)) / 100)).toFixed(3);
                    this.newAttribute.qprixU = Number(this.Prix).toFixed(3);
                    this.Montant_Fodec = (this.newAttribute.montant_HT * this.newAttribute.fodec) / 100;
                    this.newAttribute.montant_Fodec = Number(this.Montant_Fodec).toFixed(3);
        
                    // Montant Tva u = (prix*tva)/100
                    this.Montant_TVA = Number(this.newAttribute.finalPrice) * Number((this.newAttribute.tva)/ 100) ;
                    this.newAttribute.montant_TVA = Number(this.Montant_TVA).toFixed(3);
                    // Total ht = prix * qt
                    this.Total_HT = Number(this.newAttribute.finalPrice * this.newAttribute.quantite); 
                    this.newAttribute.total_HT = Number(this.Total_HT).toFixed(3);
                    //  prix u ttc = prix u  + montant tva u 
                    this.newAttribute.prix_U_TTC = (((Number(this.newAttribute.finalPrice) + Number((this.newAttribute.montant_Fodec)/this.newAttribute.quantite) + Number(this.newAttribute.montant_TVA)))).toFixed(3);;
        
                    this.newAttribute.montant_TTC = Number(this.newAttribute.prix_U_TTC) * Number(this.newAttribute.quantite);
                    this.newAttribute.total_TVA = ((Number(this.newAttribute.montant_TVA)) / (Number(this.newAttribute.quantite))).toFixed(3);
                    //  total ttc = prix u ttc * qte / remise
                    this.Totale_TTC = Number(this.newAttribute.prix_U_TTC * this.newAttribute.quantite * (1 - (Number(this.newAttribute.remise)) / 100)).toFixed(3)
                    this.newAttribute.totale_TTC = this.Totale_TTC;
    
                    this.newAttribute.total_TVA = ((Number(this.newAttribute.montant_TVA)) / (Number(this.newAttribute.quantite))).toFixed(3);
                    this.newAttribute.ch_Globale = Number(this.Ch_Globale);
    
                    this.newAttribute.etatEntree = "Entrée Stock Non Accompli";
                    this.newAttribute.fichierSimple = "";
                    this.newAttribute.fichierSerie = "";
                    this.newAttribute.fichier4G = "";
                    this.newAttribute.produitsSeries = "";
                    this.newAttribute.produits4g = ""; 
                    this.newAttribute.etat = 'Dispo.'
                    this.devisArticls.push(this.newAttribute);
                    this.calculTotal();
                    this.calculAssiettes();
                    this.devisArticls.sort = this.sort;
                    this.devisArticls.paginator = this.paginator;  
                 }
              }     
              });   
              this.getProdCode = false;      
            });
            this.code = ''; 
            // if this product exist
            }else{
              this.devisService.getInfoProductByIdFromStock(this.last_ID).subscribe((result : any) => {
                if ((result.body)===null){
                  Swal.fire("ce produit est hors stock", '','warning');
                }else{
                  this.qteStock= result.body.quantite; 
                  let qte: any;
                  qte = parseInt(this.devisArticls[index].quantite);
                  qte +=1;
                  // Check availibility 
                  if(this.qteStock<qte){
                    Swal.fire('vous ne pouvez pas ajouter ce produit','Qte de stock < Qte demandé ', 'warning'); 
                    this.getProdCode = false; 
                  }else{
                    this.devisArticls[index].quantite = parseInt(this.devisArticls[index].quantite)+1;
                    this.devisArticls[index].prixU =Number(this.devisArticls[index].prixU).toFixed(3);     
                    this.devisArticls[index].finalPrice=  (this.devisArticls[index].prixU - (this.devisArticls[index].prixU * (Number(this.devisArticls[index].remise)) / 100)).toFixed(3)  
         
                    this.devisArticls[index].montant_HT = ((Number(this.devisArticls[index].prixU) * Number(this.devisArticls[index].quantite)) * (1 - (Number(this.devisArticls[index].remise)) / 100)).toFixed(3);
                    this.devisArticls[index].qprixU = Number(this.Prix).toFixed(3);
                    this.Montant_Fodec = (this.devisArticls[index].montant_HT * this.devisArticls[index].fodec) / 100;
                    this.devisArticls[index].montant_Fodec = Number(this.Montant_Fodec).toFixed(3);
        
                    this.Montant_TVA = Number(this.devisArticls[index].finalPrice) * Number((this.devisArticls[index].tva)/ 100) ;
                    this.devisArticls[index].montant_TVA = Number(this.Montant_TVA).toFixed(3);
        
                    this.devisArticls[index].prix_U_TTC = (((Number(this.devisArticls[index].finalPrice) + Number((this.devisArticls[index].montant_Fodec)/this.devisArticls[index].quantite) + Number(this.devisArticls[index].montant_TVA)))).toFixed(3);;
                    this.devisArticls[index].montant_TTC = Number(this.devisArticls[index].prix_U_TTC) * Number(this.devisArticls[index].quantite);
                    this.devisArticls[index].total_TVA = ((Number(this.devisArticls[index].montant_TVA)) / (Number(this.devisArticls[index].quantite))).toFixed(3);
                    this.Totale_TTC = Number((this.devisArticls[index].prix_U_TTC*this.devisArticls[index].quantite)* (1 - (Number(this.devisArticls[index].remise)) / 100)).toFixed(3)
                    this.devisArticls[index].totale_TTC = this.Totale_TTC;
                    
                    this.Total_HT = Number(this.devisArticls[index].finalPrice) * this.devisArticls[index].quantite;
                    this.devisArticls[index].total_HT = Number(this.Total_HT).toFixed(3);        
                    this.devisArticls[index].ch_Globale = Number(this.Ch_Globale);
      
                      this.devisArticls[index].etat = 'Dispo.';
                   
                     this.calculTotal();
                     this.calculAssiettes();
                     this.getProdCode= false;
                  }
                }
              });
            }
          }
      }
      },(err : any)=>{
        console.log(err);
        Swal.fire({
          title: 'Il n\'y a pas de produit avec ce code!',
          icon: 'warning',
          showCancelButton : true, 
          confirmButtonText: 'Ok',
        });
        this.getProdCode = false;
      }
      );
  }
  
  //** Delete Item from the Table */
  deleteItemValue(index : any){
    Swal.fire({
      title: 'Êtes-vous sûr?',
      icon: 'warning',
      showCancelButton : true, 
      confirmButtonText: 'Oui, supprimez le',
      cancelButtonText: 'Non, garde le'
    }).then((res)=> {
      if(res.value){
        this.devisArticls.splice(index, 1);
        this.calculTotal();
        this.calculAssiettes();
      } else if (res.dismiss === Swal.DismissReason.cancel) {
        Swal.fire(
          'Annulé',
          '',
          'error'
        )
      }
    }
    );
    this.calculTotal();
    this.calculAssiettes();
  }

  //** Go Forward  */
  goForward(stepper : MatStepper){
    stepper.next();
  }

  //** open Dialog */
  openDialog(){
    const dialogRef = this.dialog.open(DialogContentAddArticleDialogComponent,{
      width: '100%',data: {
        fromPage : this.devisArticls
      }});
      dialogRef.afterClosed().subscribe(res => { 
        //** Check if the product is in the previous table  */
        if(res != undefined){
          for(let i= 0 ;i < res.data.length; i++){
            let index = this.devisArticls.findIndex(((x: any)=>parseInt(x.id_Produit) === parseInt(res.data[i].id_Produit))); 
            if(index != -1){
              this.devisService.getInfoProductByIdFromStock(res.data[i].id_Produit).subscribe((result : any) => {
                this.qteStock= result.body.quantite; 
                let qte: any ; 
                qte = parseInt(this.devisArticls[index].quantite);
                qte +=1; 
               // Check availibility 
               if(this.qteStock<qte){
                Swal.fire('vous ne pouvez pas ajouter ce produit n°'+ res.data[i].id_Produit ,'Qte de stock < Qte demandé ', 'warning');
              }else{
                this.devisArticls[index].quantite= this.devisArticls[index].quantite+1;
                this.devisArticls[index].prixU =Number(this.devisArticls[index].prixU).toFixed(3); 
                this.devisArticls[index].finalPrice=  (this.devisArticls[index].prixU - (this.devisArticls[index].prixU * (Number(this.devisArticls[index].remise)) / 100)).toFixed(3)  
                this.devisArticls[index].montant_HT = ((Number(this.devisArticls[index].prixU) * Number(this.devisArticls[index].quantite)) * (1 - (Number(this.devisArticls[index].remise)) / 100)).toFixed(3);
                this.devisArticls[index].qprixU = Number(this.Prix).toFixed(3);
                this.Montant_Fodec = (this.devisArticls[index].montant_HT * this.devisArticls[index].fodec) / 100;
                this.devisArticls[index].montant_Fodec = Number(this.Montant_Fodec).toFixed(3);
                this.Montant_TVA = Number(this.devisArticls[index].finalPrice) * Number((this.devisArticls[index].tva)/ 100) ;
                this.devisArticls[index].montant_TVA = Number(this.Montant_TVA).toFixed(3);
                this.Total_HT = Number(this.devisArticls[index].finalPrice) * this.devisArticls[index].quantite;
                this.devisArticls[index].prix_U_TTC = (((Number(this.devisArticls[index].finalPrice) + Number((this.devisArticls[index].montant_Fodec)/this.devisArticls[index].quantite) + Number(this.devisArticls[index].montant_TVA)))).toFixed(3);;
                this.devisArticls[index].montant_TTC = Number(this.devisArticls[index].prix_U_TTC) * Number(this.devisArticls[index].quantite);
                this.devisArticls[index].total_TVA = ((Number(this.devisArticls[index].montant_TVA)) / (Number(this.devisArticls[index].quantite))).toFixed(3);
                this.Totale_TTC = Number((this.devisArticls[index].prix_U_TTC*this.devisArticls[index].quantite)).toFixed(3)
                this.devisArticls[index].totale_TTC = this.Totale_TTC;
                this.devisArticls[index].total_HT = Number(this.Total_HT).toFixed(3);        
                this.devisArticls[index].ch_Globale = Number(this.Ch_Globale);
  
                this.calculTotal();
                this.calculAssiettes();
                this.devisArticls[index].etat = 'Dispo.';
               }  
              }) 
 


            }else{
              this.devisService.getInfoProductByIdFromStock(res.data[i].id_Produit).subscribe((result : any) => {
                if ((result.body)===null){
                  Swal.fire("ce produit est hors stock", '','warning');
                  this.devisArticls.sort = this.sort;
                  this.devisArticls.paginator = this.paginator;
                }else{
                  this.devisArticls.push(res.data[i]);
                  this.calculTotal();
                  this.calculAssiettes();
                }
              })

            }
          }
        }

      });
  }
  //** Plz choose at least one product in the next step */
  nextStep(stepper : MatStepper){
    let addPrice : any = 0 
    this.isNull = false;
    if((this.totalTTc !=0)){
      let totalTTc_reg = 0;
      for(let i= 0 ; i < this.devisArticls.length; i++){
        totalTTc_reg +=Number(this.devisArticls[i].totale_TTC);
      }
      addPrice =   Number(totalTTc_reg - this.totalTTc_reg).toFixed(3);
      if(addPrice<0){
        this.addReglementFormGroup.controls['valueOne'].setValue(Number(totalTTc_reg).toFixed(3));
        this.addReglementFormGroup.controls['valueTwo'].setValue(Number(0).toFixed(3))
      }
      else if(addPrice> this.addReglementFormGroup.get('valueTwo').value){
        this.addReglementFormGroup.controls['valueTwo'].setValue(addPrice)
      }else{
        this.addReglementFormGroup.controls['valueTwo'].setValue(addPrice)
      }
      
      this.addArticleFormGroup.controls['lengthTableDevis'].setValue(this.devisArticls.length);
      this.goForward(stepper); 
      this.isNull = true;
    }else{
      this.isNull = false;
      Swal.fire( 
        'Veuillez choisir au moins un produit');
    }
  }
  //** Ckeck Total TTC in the reglement step */
  checkTotalTTC(stepper : MatStepper){
    this.isCompleted= false;
    this.sum= (Number((this.addReglementFormGroup.get('valueOne').value))+Number((this.addReglementFormGroup.get('valueTwo').value))+Number((this.addReglementFormGroup.get('valueTree').value)));            
    if(Number(this.sum).toFixed(3)!=Number(this.totalTTc).toFixed(3)){
      this.isCompleted= false;
      Swal.fire( 
      'Attention! vérifiez le totale',
      'Total TTC!',
      'error');
    }else{
      this.isCompleted= true;
      this.goForward(stepper)
    }
  }
  // get price of the Reglement one 
  getvalueModePaiement(ev: any){
    this.price = Number(ev).toFixed(3)
    if(this.price != undefined){
      let rest
      this.visibel= true;
      if(parseInt(this.price) <= parseInt(this.totalTTc)){   
        rest = Number(this.totalTTc - this.price).toFixed(3);
        this.secondValue = rest;
        this.addReglementFormGroup.controls['valueTwo'].setValue(rest);

    }else{
      this.visibel = false; 
    }    
  }
}
  //** Get the Second value */
  getvalueModePaiementTwo(ev: any){
    this.secondValue = ev
    let rest_Two ; 
    this.ligneTwo= true;
    rest_Two = Number((this.totalTTc)-(this.price)- (this.secondValue)).toFixed(3);
    this.addReglementFormGroup.controls['valueTree'].setValue(rest_Two);
  }
  //** addReglement */
  addReglement(){
    let rest ; 
    (this.show<0)? this.show=0 : console.log(this.sum);
    this.show++;
    if (this.show == 1){
      this.ligneOne = true;
      if(parseInt(this.price) <= parseInt(this.totalTTc)){   
        rest = Number(this.totalTTc - this.price).toFixed(3);
        this.addReglementFormGroup.controls['valueTwo'].setValue(rest);
      }else{
        Swal.fire( 
          'Attention! vérifiez le totale',
          'Total TTC!',
          'error');
      }
    }  
    if (this.show == 2) {  
      let rest_Two ; 
      this.ligneTwo= true;
      rest_Two = Number((this.totalTTc)-(this.price)- (this.secondValue)).toFixed(3);
      this.addReglementFormGroup.controls['valueTree'].setValue(rest_Two);
    } 
  }

  // * DeleteReglement */
  deleteReglement(l:string){    
      if(l=='1') {
        this.ligneOne = false;
        this.isCompleted= false;
        this.sum -=Number((this.addReglementFormGroup.get('valueTwo').value)); 
        this.addReglementFormGroup.controls['valueTwo'].setValue(0);
        this.addReglementFormGroup.controls['typeRegTwo'].setValue('');
        (this.sum == this.totalTTc)? this.isCompleted= true : this.isCompleted= false;
      }
      if(l=='2') {
        this.ligneTwo = false; 
        this.sum -=Number((this.addReglementFormGroup.get('valueTree').value));   
        this.addReglementFormGroup.controls['valueTree'].setValue(0);
        this.addReglementFormGroup.controls['typeRegTree'].setValue('');
        (this.sum == this.totalTTc)? this.isCompleted= true : this.isCompleted= false;
      }
      if((this.ligneOne == false) || (this.ligneTwo == false)) this.show--;
  }
  //** Product is in stock  */
  isInStock(id : any){
    this.devisService.getInfoProductByIdFromStock(id).subscribe((res : any)=>{
      var existInStoc = false;
      if(res.body != null){
          existInStoc = true; 
      }else{
          existInStoc = false; 
      }
      this.existInStoc = existInStoc;
    });
  }
  //** Update item from the Table  */
  async ouvreDialogueArticle(index : number, item: any , table : any ){
  
      const dialogRef = this.dialog.open(UpdateDialogOverviewArticleDialogComponent, {
        width: '500px',
        data: { index: index, ligne: item, table: table}
      });
      dialogRef.afterClosed().subscribe(res => {  
                  
        this.devisService.getInfoProductByIdFromStock(res.Id_Produit).subscribe((result : any) => {
          this.qteStock = result.body.quantite; 
          if(this.qteStock<res.qte_modifier){
            Swal.fire('vous ne pouvez pas ajouter ce produit','Qte de stock < Qte demandé ', 'warning'); 
          }else{
            item.quantite = res.qte_modifier;   
            item.quantite = parseInt(item.quantite); 
            item.prixU = res.prixU_modifier;
            item.remise = res.remise_modifier;
            item.finalPrice=  (item.prixU - (item.prixU * (Number(item.remise)) / 100)).toFixed(3)  
            item.montant_HT = ((Number(item.prixU) * Number(item.quantite)) * (1 - (Number(item.remise)) / 100)).toFixed(3);
            this.Montant_Fodec = (item.montant_HT * item.fodec) / 100;      
            item.montant_Fodec = Number(this.Montant_Fodec).toFixed(3);
    
            this.Montant_TVA = Number(item.finalPrice) * Number((item.tva)/ 100) ;
            item.montant_TVA = Number(this.Montant_TVA).toFixed(3);
            
            item.prix_U_TTC = (((Number(item.finalPrice) + Number((item.montant_Fodec)/item.quantite) + Number(item.montant_TVA)))).toFixed(3);;
           
            item.total_TVA = ((Number(item.montant_TVA)) / (Number(item.quantite))).toFixed(3);
            
            item.montant_TTC = Number(item.prix_U_TTC) * Number(item.quantite);
            item.ch = ((((Number(item.PrixU)) / Number(item.totalFacture)) * 100) * Number(item.quantite)).toFixed(3);
            item.ch_Piece = (((((Number(item.chargeTr) + Number(item.autreCharge)) * Number(item.ch)) / 100)) / (Number(item.quantite))).toFixed(3);
            item.prixRevientU = (Number(item.prixU) + Number(item.ch_Piece)).toFixed(3);
            
            item.total_HT = Number(item.finalPrice * item.quantite).toFixed(3);
            this.Totale_TTC = Number(((Number(item.prix_U_TTC) * item.quantite))).toFixed(3)
            item.totale_TTC = this.Totale_TTC;
            item.etat = 'Dispo.'
          } 
          this.calculTotal();
          this.calculAssiettes();
        });     
      });
   
    this.calculTotal();
    this.calculAssiettes();
  }

  //** The XML structure */
  createXMLStructure(url: string , data : any){
    var doc = document.implementation.createDocument(url, 'Devis', null);
    var etatElement = doc.createElement("Etat");
    var infoElement = doc.createElement("Informations-Generales");
    var total = doc.createElement('Total'); 
    var typeElement = doc.createElement("Type");
    var idFrElement = doc.createElement("Id_Fr");
    var idCLTElement = doc.createElement("Id_Clt");
    var typeDevise = doc.createElement('Devise')
    var adress = doc.createElement("Local"); 
    var modepaiement = doc.createElement("Mode_Paiement");
    var totalHTBrut = doc.createElement("TotalHTBrut");
    var totalRemise = doc.createElement("TotalRemise");
    var totalHTNet = doc.createElement("TotalHTNet");
    var totalFodec = doc.createElement("TotalFodec");
    var totalTVA = doc.createElement("TotalTVA");
    var totalTTC = doc.createElement("TotalTTC");
    var Produits = doc.createElement('Produits')
    var Produits_Series = doc.createElement('Produits_Series')
    var Produits_4Gs = doc.createElement('Produits_4Gs')
    var Produits_Simples  = doc.createElement('Produits_Simples')
    var signaler_Probleme = doc.createElement("Signaler_Probleme");

    //** TVA* */
    var Taxes = doc.createElement("Taxes");
    var TVA = doc.createElement("TVA");

    var TVA19 = doc.createElement("TVA19"); TVA19.innerHTML = this.assiette19;
    var TVA7 = doc.createElement("TVA7"); TVA7.innerHTML = this.assiette7;
    var TVA13 = doc.createElement("TVA13"); TVA13.innerHTML = this.assiette13;
    var Fodec = doc.createElement("Fodec"); Fodec.innerHTML = this.totalFodec

    TVA.appendChild(TVA19);
    TVA.appendChild(TVA13);
    TVA.appendChild(TVA7);

    Taxes.appendChild(TVA);
    Taxes.appendChild(Fodec);
    //** Montant tva */
    var Montant_TVA = doc.createElement("Montant_TVA");

    var Montant_TVA19 = doc.createElement("Montant_TVA19"); Montant_TVA19.innerHTML = this.montant19;
    var Montant_TVA7 = doc.createElement("Montant_TVA7"); Montant_TVA7.innerHTML = this.montant7;
    var Montant_TVA13 = doc.createElement("Montant_TVA13"); Montant_TVA13.innerHTML = this.montant13;

    Montant_TVA.appendChild(Montant_TVA19);
    Montant_TVA.appendChild(Montant_TVA7);
    Montant_TVA.appendChild(Montant_TVA13);

   //** Type de reglement  */
   var Type_Reglement = doc.createElement("Type_Reglement");

   var typeRegOne = doc.createElement("TypeRegOne"); typeRegOne.innerHTML = this.infoFormGroup.get('modePaiement').value; 
   var typeRegTwo = doc.createElement("TypeRegTwo"); typeRegTwo.innerHTML= this.addReglementFormGroup.get('typeRegTwo').value;
   var typeRegTree = doc.createElement("TypeRegTree");typeRegTree.innerHTML= this.addReglementFormGroup.get('typeRegTree').value;

   var valueRegOne = doc.createElement("ValueRegOne"); valueRegOne.innerHTML =  this.price; 
   var valueRegTwo = doc.createElement("ValueRegTwo"); valueRegTwo.innerHTML= this.addReglementFormGroup.get('valueTwo').value;
   var valueRegTree = doc.createElement("ValueRegTree");valueRegTree.innerHTML= this.addReglementFormGroup.get('valueTree').value; 
   
   Type_Reglement.appendChild(typeRegOne);
   Type_Reglement.appendChild(typeRegTwo);
   Type_Reglement.appendChild(typeRegTree);
   Type_Reglement.appendChild(valueRegOne);
   Type_Reglement.appendChild(valueRegTwo);
   Type_Reglement.appendChild(valueRegTree);

   //******* */
    Produits.setAttribute('Fournisseur','InfoNet');
    Produits.setAttribute('Local', this.infoFormGroup.get('adresse').value);
    
    var nameEtat ="En cours";
    var typeName = "Devis";
    var devise = this.infoFormGroup.get('devise').value;
    var signaler_Prob = doc.createTextNode("True");
    var modepaiementName = doc.createTextNode(this.infoFormGroup.get('modePaiement').value)
    var adressName = doc.createTextNode(this.infoFormGroup.get('adresse').value)
    var id_Clt = doc.createTextNode(this.infoFormGroup.get('custemerName').value.id_Clt);
    var id_Fr = doc.createTextNode('1');


    var totalHTBrutName =doc.createTextNode(this.totalHTBrut);
    var totalRemisetName =doc.createTextNode(this.remiseDiff);
    var totalHTNetName =doc.createTextNode(this.totalHT);
    var totalFodecName =doc.createTextNode(this.totalMontantFodec);
    var totalTVAName =doc.createTextNode(this.totalMontantTVA);
    var totalTTCName =doc.createTextNode(this.totalTTc);
    //******* */
    signaler_Probleme.appendChild(signaler_Prob)
    etatElement.innerHTML = nameEtat;
    idCLTElement.appendChild(id_Clt);
    idFrElement.appendChild(id_Fr);
    typeElement.innerHTML = typeName;
    typeDevise.innerHTML=devise
    adress.appendChild(adressName);
    modepaiement.appendChild(modepaiementName);

    totalHTBrut.appendChild(totalHTBrutName);
    totalRemise.appendChild(totalRemisetName);
    totalHTNet.appendChild(totalHTNetName);
    totalFodec.appendChild(totalFodecName);
    totalTVA.appendChild(totalTVAName);
    totalTTC.appendChild(totalTTCName);

    infoElement.appendChild(idCLTElement);
    infoElement.appendChild(idFrElement);
    infoElement.appendChild(typeElement);
    infoElement.appendChild(adress);
    infoElement.appendChild(modepaiement);
    infoElement.appendChild(typeDevise);

    total.appendChild(totalHTBrut);
    total.appendChild(totalRemise);
    total.appendChild(totalHTNet);
    total.appendChild(totalTVA);
    total.appendChild(totalTTC);
    total.appendChild(totalFodec);

    //** Add Produits */
    for (let i = 0; i < this.devisArticls.length; i++) {
      if (this.devisArticls[i].n_Imei == "true") {
        this.devisArticls[i].signaler_probleme= true; 
        var Produit = doc.createElement('Produit')
        var id = doc.createElement('Id'); id.innerHTML = this.devisArticls[i].id_Produit
        var Nom = doc.createElement('Nom'); Nom.innerHTML = this.devisArticls[i].nom_Produit
        var Etat = doc.createElement('Etat'); Etat.innerHTML = this.devisArticls[i].etat;
        var dn_Imei = doc.createElement('n_Imei'); dn_Imei.innerHTML = this.devisArticls[i].n_Imei;
        var dn_Serie = doc.createElement('n_Serie'); dn_Serie.innerHTML = this.devisArticls[i].n_Serie;
        var produits_simple = doc.createElement('produits_simple');  produits_simple.innerHTML = this.devisArticls[i].produits_simple;
        var Signaler_probleme = doc.createElement('Signaler_probleme'); Signaler_probleme.innerHTML = this.devisArticls[i].signaler_probleme
        var Qte = doc.createElement('Qte'); Qte.innerHTML = this.devisArticls[i].quantite
        var Tva = doc.createElement('Tva'); Tva.innerHTML = this.devisArticls[i].tva
        var m_Tva = doc.createElement('Montant_Tva'); m_Tva.innerHTML = this.devisArticls[i].montant_TVA
        var fodec = doc.createElement('fodec'); fodec.innerHTML = this.devisArticls[i].fodec
        var Charge = doc.createElement('Charge'); Charge.innerHTML = this.devisArticls[i].ch
        var  PrixU = doc.createElement('PrixU'); PrixU.innerHTML = this.devisArticls[i].prixU
        var Remise = doc.createElement('Remise'); Remise.innerHTML = this.devisArticls[i].remise
        var TotalFacture = doc.createElement('TotalFacture'); TotalFacture.innerHTML = this.devisArticls[i].totale_TTC
        var vProduit_4Gs = doc.createElement('Produit_4Gs');
        var Prix_U_TTC= doc.createElement('PrixUTTC'); Prix_U_TTC.innerHTML= this.devisArticls[i].prix_U_TTC;
        var Total_HT = doc.createElement('Total_HT');Total_HT.innerHTML = this.devisArticls[i].total_HT;

        
        if(this.devisArticls[i].tableaux_produits_emie != undefined){
          for (let j = 0; j < this.devisArticls[i].tableaux_produits_emie.length; j++) {
            var Produit_4G = doc.createElement('Produit_4G');
            var N_Serie = doc.createElement('N_Serie'); N_Serie.innerHTML = this.devisArticls[i].tableaux_produits_emie[j].n_serie
            var E1 = doc.createElement('E1'); E1.innerHTML = this.devisArticls[i].tableaux_produits_emie[j].e1
            var E2 = doc.createElement('E2'); E2.innerHTML = this.devisArticls[i].tableaux_produits_emie[j].e2
            Produit_4G.appendChild(N_Serie);
            Produit_4G.appendChild(E1);
            Produit_4G.appendChild(E2);
            vProduit_4Gs.appendChild(Produit_4G);
          }
        }else {
          var Produit_4G = doc.createElement('Produit_4G');
            var N_Serie = doc.createElement('N_Serie'); N_Serie.innerHTML = '0'
            var E1 = doc.createElement('E1'); E1.innerHTML = '0'
            var E2 = doc.createElement('E2'); E2.innerHTML = '0'
            Produit_4G.appendChild(N_Serie);
            Produit_4G.appendChild(E1);
            Produit_4G.appendChild(E2);
            vProduit_4Gs.appendChild(Produit_4G);
        }
    

        Produit.appendChild(id);
        Produit.appendChild(Nom);
        Produit.appendChild(Etat)
        Produit.appendChild(Prix_U_TTC);
        Produit.appendChild(Total_HT);
        Produit.appendChild(Remise);
        Produit.appendChild(dn_Serie);
        Produit.appendChild(dn_Imei);
        Produit.appendChild(produits_simple);
        Produit.appendChild(Signaler_probleme);
        Produit.appendChild(Qte);
        Produit.appendChild(Tva);
        Produit.appendChild(m_Tva);
        Produit.appendChild(fodec);
        Produit.appendChild(Charge);
        Produit.appendChild(vProduit_4Gs);
        Produit.appendChild( PrixU)
        Produit.appendChild( TotalFacture )   
        Produit.appendChild( PrixU )
        Produits_4Gs.appendChild(Produit);
      }
      else if (this.devisArticls[i].N_Serie == "true") {
        this.devisArticls[i].signaler_probleme= true; 
        var Produit = doc.createElement('Produit')
        var id = doc.createElement('Id'); id.innerHTML = this.devisArticls[i].id_Produit;
        var Nom = doc.createElement('Nom'); Nom.innerHTML = this.devisArticls[i].nom_Produit; 
        var Etat = doc.createElement('Etat'); Etat.innerHTML = this.devisArticls[i].etat;       
        var dn_Imei = doc.createElement('n_Imei'); dn_Imei.innerHTML = this.devisArticls[i].n_Imei;
        var dn_Serie = doc.createElement('n_Serie'); dn_Serie.innerHTML = this.devisArticls[i].n_Serie;
        var produits_simple = doc.createElement('produits_simple');  produits_simple.innerHTML = this.devisArticls[i].produits_simple;
        var Signaler_probleme = doc.createElement('Signaler_probleme'); Signaler_probleme.innerHTML = this.devisArticls[i].signaler_probleme
        var Qte = doc.createElement('Qte'); Qte.innerHTML = this.devisArticls[i].quantite
        var Tva = doc.createElement('Tva'); Tva.innerHTML = this.devisArticls[i].tva
        var m_Tva = doc.createElement('Montant_Tva'); m_Tva.innerHTML = this.devisArticls[i].M_TVA
        var fodec = doc.createElement('fodec'); fodec.innerHTML = this.devisArticls[i].fodec
        var Charge = doc.createElement('Charge'); Charge.innerHTML = this.devisArticls[i].ch
        var  PrixU = doc.createElement('PrixU'); PrixU.innerHTML = this.devisArticls[i].prixU
        var Remise = doc.createElement('Remise'); Remise.innerHTML = this.devisArticls[i].remise;
        var TotalFacture = doc.createElement('TotalFacture'); TotalFacture.innerHTML = this.devisArticls[i].totale_TTC
        var vN_Series = doc.createElement('N_Series');
        var Prix_U_TTC= doc.createElement('PrixUTTC'); Prix_U_TTC.innerHTML= this.devisArticls[i].prix_U_TTC;
        var Total_HT = doc.createElement('Total_HT');Total_HT.innerHTML = this.devisArticls[i].total_HT;


        if(this.devisArticls[i].tableaux_produits_serie != undefined){
          for (let j = 0; j < this.devisArticls[i].tableaux_produits_serie.length; j++) {
            var N_Serie = doc.createElement('N_Serie'); N_Serie.innerHTML = this.devisArticls[i].tableaux_produits_serie[j]
            vN_Series.appendChild(N_Serie);
          }
        }else{
          var N_Serie = doc.createElement('N_Serie'); N_Serie.innerHTML = '0'
            vN_Series.appendChild(N_Serie);
        }


        Produit.appendChild(id);
        Produit.appendChild(Nom);
        Produit.appendChild(Etat);
        Produit.appendChild(Prix_U_TTC);
        Produit.appendChild(Total_HT);
        Produit.appendChild(Remise);
        Produit.appendChild(dn_Serie);
        Produit.appendChild(dn_Imei);
        Produit.appendChild(produits_simple);
        Produit.appendChild(Signaler_probleme);
        Produit.appendChild(Qte);
        Produit.appendChild(Tva);
        Produit.appendChild(m_Tva);
        Produit.appendChild(fodec);
        Produit.appendChild(Charge);
        Produit.appendChild(vN_Series)
        Produit.appendChild(PrixU)
        Produit.appendChild( TotalFacture ) 

        Produits_Series.appendChild(Produit);
      }
      else {
        this.devisArticls[i].signaler_probleme= true; 
        var Produit = doc.createElement('Produit')
        var id = doc.createElement('Id'); id.innerHTML = this.devisArticls[i].id_Produit;
        var Nom = doc.createElement('Nom'); Nom.innerHTML = this.devisArticls[i].nom_Produit;
        var Etat = doc.createElement('Etat'); Etat.innerHTML = this.devisArticls[i].etat;
        var Remise = doc.createElement('Remise'); Remise.innerHTML = this.devisArticls[i].remise;
        var dn_Imei = doc.createElement('n_Imei'); dn_Imei.innerHTML = this.devisArticls[i].n_Imei;
        var dn_Serie = doc.createElement('n_Serie'); dn_Serie.innerHTML = this.devisArticls[i].n_Serie;
        var produits_simple = doc.createElement('produits_simple');  produits_simple.innerHTML = this.devisArticls[i].produits_simple;
        var Signaler_probleme = doc.createElement('Signaler_probleme'); Signaler_probleme.innerHTML = this.devisArticls[i].signaler_probleme
        var Qte = doc.createElement('Qte'); Qte.innerHTML = this.devisArticls[i].quantite
        var Tva = doc.createElement('Tva'); Tva.innerHTML = this.devisArticls[i].tva
        var m_Tva = doc.createElement('Montant_Tva'); m_Tva.innerHTML = this.devisArticls[i].montant_TVA
        var fodec = doc.createElement('fodec'); fodec.innerHTML = this.devisArticls[i].fodec
        var  PrixU = doc.createElement('PrixU'); PrixU.innerHTML = this.devisArticls[i].prixU
        var Charge = doc.createElement('charge'); Charge.innerHTML = this.devisArticls[i].ch
        var TotalFacture = doc.createElement('TotalFacture'); TotalFacture.innerHTML =this.devisArticls[i].totale_TTC   
        var Prix_U_TTC= doc.createElement('PrixUTTC'); Prix_U_TTC.innerHTML= this.devisArticls[i].prix_U_TTC;
        var Total_HT = doc.createElement('Total_HT');Total_HT.innerHTML = this.devisArticls[i].total_HT;



        Produit.appendChild(id);
        Produit.appendChild(Nom);
        Produit.appendChild(Etat);
        Produit.appendChild(Prix_U_TTC);
        Produit.appendChild(Total_HT);
        Produit.appendChild(Remise);
        Produit.appendChild(dn_Serie);
        Produit.appendChild(dn_Imei);
        Produit.appendChild(produits_simple);
        Produit.appendChild(Signaler_probleme);
        Produit.appendChild(Qte);
        Produit.appendChild(Tva);
        Produit.appendChild(m_Tva);
        Produit.appendChild(fodec);
        Produit.appendChild(Charge);
        Produit.appendChild( TotalFacture )
        Produit.appendChild( PrixU )

        Produits_Simples.appendChild(Produit);
      }
    }
    Produits.appendChild(Produits_Simples);
    Produits.appendChild(Produits_Series);
    Produits.appendChild(Produits_4Gs);


    //******* */
    doc.documentElement.appendChild(etatElement);
    doc.documentElement.appendChild(infoElement);
    doc.documentElement.appendChild(total); 
    doc.documentElement.appendChild(signaler_Probleme);
    doc.documentElement.appendChild(Produits);
    doc.documentElement.appendChild(Taxes);
    doc.documentElement.appendChild(Montant_TVA);
    doc.documentElement.appendChild(Type_Reglement);
    return doc
  }
  convertFileXml(theBlob: Blob, fileName: string): File {
    var b: any = theBlob;
    b.lastModifiedDate = new Date();
    b.name = fileName;
    return <File>theBlob;
  }
  contenuTable(data: any, columns: any) {
    var body = [];
    
    body.push(columns);
    this.devisArticls.forEach((row: any)=> {
      var dataRow: any = [];
    // ['id_Produit', 'nom_Produit', 'prixU', 'remise', 'quantite', 'tva', 'total_HT']   
    this.columns.forEach((column: any) =>{
        dataRow.push(row[column]);
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
    //** Generate the PDF file  */
  async generatePDF(id :any){
        this.bLservice.getBlByID(id).subscribe((res: any)=>{        
          this.date =  this.datepipe.transform(res.body.date_Creation, 'dd/MM/YYYY'); 
      }); 
           // check type de reglement 
           let typeRegTwo : any ; 
           let typeRegTree: any ; 
           if(this.addReglementFormGroup.get('typeRegTwo').value=='4')
              typeRegTwo ='Espèces';
           else if (this.addReglementFormGroup.get('typeRegTwo').value=='1'){
              typeRegTwo ='Virement';
           }else if (this.addReglementFormGroup.get('typeRegTwo').value=='2'){
              typeRegTwo ='Chèque';
           }else if (this.addReglementFormGroup.get('typeRegTwo').value=='3'){
                            typeRegTwo ='Monétique';
           }
             if(this.addReglementFormGroup.get('typeRegTree').value=='4')
                typeRegTree ='Espèces';
             else if (this.addReglementFormGroup.get('typeRegTree').value=='1'){
                typeRegTree ='Virement';
             }else if (this.addReglementFormGroup.get('typeRegTree').value=='2'){
                typeRegTree ='Chèque';
             }else if (this.addReglementFormGroup.get('typeRegTree').value=='3'){
               typeRegTree ='Monétique';
             } 
       setTimeout(async ()=>{
        //** Generate the pdf file */ 
        let pdf_devis = {
          background: [
            {
              image: await this.getBase64ImageFromURL("../../../assets/images/Fiche_bl_page.jpg"), width: 600
            }
          ],
          content: [
            { columns : [
              {
                text:'BL n° ' +id+' | '+ '\t' + this.date+ '\n\n',
                fontSize: 15,
                alignment: 'left',
                color: 'black',
                bold: true
              },
              ]},
              {
                text: '\n'
              },
            {
              columns: [
                {   
                  text: 
                  'Devis ' +this.typeDevis + ' n° '+this.devis_ID + '- BL n° '+ id + '\n' 
                  + 'Édité par :' + '\t' + '' + '\n\n'
                ,
                fontSize: 12,
                alignment: 'left',
                color: 'black',
              },
                {
                  text: '\t'
                },
                {   
                  text: 
                  'Code Client :' + '\t' + this.client_id + '\n'
                  + 'Nom Client :' + '\t' + this.nom_client + '\n',
                  fontSize: 12,
                  alignment: 'left',
                  color: 'black'
                }
              ]
            },
            {
              text: '\n'
            },
            {
              text: 'Modalité du paiement:' ,
              fontSize: 20,
              alignment: 'left',
              color: 'black',
              bold: true
            },
            {
              text: '\t'
            },
            {
              columns: [
                {
                  ul : [
                  this.infoFormGroup.get('modePaiement').value +' : '+ Number(this.addReglementFormGroup.get('valueOne').value).toFixed(3)  +'\n'
                  ]
                },{
                  ul : [
                    (typeRegTwo !== undefined)?
                    typeRegTwo +' : '+Number( this.addReglementFormGroup.get('valueTwo').value).toFixed(3)+'\n' : 
                    ''
                    ]
                },{
                  ul:[
                    (typeRegTree !==  undefined)?
                    typeRegTree +' : '+ Number(this.addReglementFormGroup.get('valueTree').value).toFixed(3)+'\n' : 
                    ''
                  ]
                }
              ]
            },
            {
              text: '\n\n'
            },
            {
              text: 'Détails :' + '\t',
              fontSize: 20,
              alignment: 'left',
              color: 'black',
              bold: true
            },
            {
              text: '\n\n'
            },
            this.generateTable(this.devisArticls, ['Id_Produit', 'Nom_Produit', 'Prix U HT ('+this.infoFormGroup.get('devise').value+')', 'Remise', 'Quantite', 'TVA', 'Total_HT']),
            {
              text: '\n\n\n'
            },
            , {
              columns: [
                {
                  table: {
                    alignment: 'right',
                    body: [
                      [{ text: 'T.V.A %', alignment: 'left' }, '7%', '13%', '19%'],
                      [{ text: 'Assiette', alignment: 'left' }, this.assiette7, this.assiette13, this.assiette19],
                      [{ text: 'Montant', alignment: 'left' }, this.montant7, this.montant13, this.montant19],
                    ]
                  },
                  layout: 'lightHorizontalLines',
                  alignment: 'right',
                },
                {
                  style: 'tableExample',
                  table: {
                    heights: [20],
                    body: [
                      [{ text: 'Total H.T Brut', alignment: 'left' }, { text: this.totalHTBrut +' ' +this.infoFormGroup.get('devise').value, alignment: 'right' }],
                      [{ text: 'Total Remise', alignment: 'left' }, { text: this.remiseDiff+' ' +this.infoFormGroup.get('devise').value, alignment: 'right' }],
                      [{ text: 'Total H.T Net', alignment: 'left' }, { text: this.totalHT+' ' +this.infoFormGroup.get('devise').value, alignment: 'right' }],
                      [{ text: 'Total Fodec', alignment: 'left' }, { text: this.totalMontantFodec +' ' +this.infoFormGroup.get('devise').value, alignment: 'right' }],
                      [{ text: 'Total T.V.A', alignment: 'left' }, { text: this.totalMontantTVA+' ' +this.infoFormGroup.get('devise').value, alignment: 'right' }],
                      [{ text: 'Total T.T.C', alignment: 'left' }, { text: this.totalTTc+' ' +this.infoFormGroup.get('devise').value, alignment: 'right' }],
                    ]
                  },
                  layout: 'lightHorizontalLines',
                }]
            },
          ],
          footer: function (currentPage: any, pageCount: any) {
            return {
              margin: 35,
              columns: [
                {
                  fontSize: 9,
                  text: [
                    {
                      text: currentPage.toString() + '/' + pageCount,
                    }
                  ],
                  alignment: 'center'
                }
              ]
            };
          },
          pageMargins: [30, 125, 40, 60],
        };
        pdfMake.createPdf(pdf_devis).open();
       },1000)   


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
  gererateDevisBL(){
    let formData : any = new FormData();
    let url = "assets/BL.xml";
    //** Generate the file XML */
    //** Create an XmlHttpRequest */
    let doc_ = this.createXMLStructure(url,this.devisArticls);
    fetch(url).then(res => res.text).then(()=>{
      // convert xml file to blob 
      let xmlFile = new XMLSerializer().serializeToString(doc_.documentElement);
      var myBlob = new Blob([xmlFile], { type: 'application/xml' });
      var myDetail = this.convertFileXml(myBlob,url);

      formData.append('Id_Devis', this.devis_ID);
      formData.append('Total_Retunes', this.totalTTc);
      formData.append('Detail',myDetail );

      this.bLservice.gererateBL(formData).subscribe((res : any)=>{
        Swal.fire(
          {title :"BL géneré avec succés.",
      }).then((result) => {
        if (result.isConfirmed) {
          Swal.fire({
            title: 'Voulez vous imprimer le BL',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Oui',
            cancelButtonText: 'Non',
          }).then((result) => {
            if (result.isConfirmed) {  
              console.log(res.id_Bl);
              
              this.generatePDF(res.id_Bl);
              this.router.navigate(['Menu/Menu-BonLivraison/Lister-BL']);
            } else if (result.isDismissed) {
              console.log('Clicked No, File is safe!');
            }
          });
        }});
      }, (err : any)=> {
          console.log(err)
      });  
  });
  } 
}
