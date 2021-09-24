import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatStepper } from '@angular/material/stepper';
import { Router } from '@angular/router';
import { interval, Subscription } from 'rxjs';
import Swal from 'sweetalert2';
import { DialogContentAddArticleDialogComponent } from '../../devis/ajouter-devis/dialog-content-add-article-dialog/dialog-content-add-article-dialog.component';
import { UpdateDialogOverviewArticleDialogComponent } from '../../devis/ajouter-devis/update-dialog-overview-article-dialog/update-dialog-overview-article-dialog.component';
import { VoirPlusDialogComponent } from '../../devis/ajouter-devis/voir-plus-dialog/voir-plus-dialog.component';
import { BlService } from '../../services/bl.service';
import { InfoSerieDialogComponent } from './info-serie-dialog/info-serie-dialog.component';
import { InfoSimpleDialogComponent } from './info-simple-dialog/info-simple-dialog.component';
import { InfosDialogComponent } from './infos-dialog/infos-dialog.component';

//** import pdf maker */
const pdfMake = require("pdfmake/build/pdfmake");
const pdfFonts = require("pdfmake/build/vfs_fonts");
pdfMake.vfs = pdfFonts.pdfMake.vfs;


@Component({
  selector: 'app-nouveau-bl',
  templateUrl: './nouveau-bl.component.html',
  styleUrls: ['./nouveau-bl.component.scss']
})
export class NouveauBLComponent implements OnInit {
infoFormGroup : FormGroup;
addArticleFormGroup : FormGroup;
addReglementFormGroup : FormGroup;

columns :any = ['id_Produit', 'nom_Produit', 'prixU', 'remise', 'quantite', 'tva', 'total_HT'];
modepaiement: any =[{id:'1',name:'Virement'},{id:'2',name:'Chèque'},{id:'3',name:'Carte Monétique'},{id:'4',name:'Espèces'}]; 
currency:  string []= ['Euro', 'TND', 'Dollar'];

currentDate = new Date();
clients: any ; 
clt : any; 
editable: boolean = false; 
isNull : boolean= false
isCompleted: boolean = false;
visibel : boolean = false;
ligneTwo: boolean = false;
ligneOne : boolean = false; 
getProdId : boolean = false;
getProdCode: boolean = false;
existInStoc : boolean = false;

blArticls : any = [];
newAttribute : any = {}
dataArticle : any ; 
last_ID : any ;
modePaiement : any = '4'; 
devise : any = 'TND';
latest_date: any;
subscription: Subscription;
price: any;
secondValue: any ;
tva : any ; 
qteStock : any ;
date : any;

id: string ='';
code : string = '';
show : number = 0;
Ch: any = 0;
totalTTc: any = 0;
totalTTc_reg : any =0 ;
totalMontantFodec: any = 0;
totalHT: any = 0;
totalHTBrut: any = 0;
totalRemise: any = 0;
totalFodec: any = 0;
totalPorcentageFodec: any = 0;
totalChGlobale: any = 0;
totalRHT: any = 0; 
totalRTTC: any = 0; 
totalPourcentCh : any =0; 
assiette: any = 0;
montant: any = 0;
assiette19: any = 0;
assiette7: any = 0;
assiette13: any = 0;
montant19: any = 0;
montant7: any = 0;
montant13: any = 0;
assiettetva19 :any = 0;
montanttva19 :any = 0;
assiettetva7:any = 0;
montanttva7:any = 0;
assiettetva13:any = 0;
montanttva13 :any= 0;
totalMontantTVA: any = 0;
ChargeTransport: any = 0;
sum : any = 0;
totalTTc_ : any = 0
remiseDiff : any = 0 ;
Autre_Charge_Fixe: any = 0;
Remise: any = 0;
Quantite : any = 1 ; 
fodec: any = 0;
Montant_TVA: any = 0;
Montant_Fodec: any = 0;
Total_HT: any = 0;
Ch_Globale: any = 0;
Prix: any = 0;
Totale_TTC: any = 0;
numBL : any = 0 ; 
locals: any = [];

@ViewChild(MatPaginator) paginator: any = MatPaginator;
@ViewChild(MatSort) sort: any = MatSort;

  constructor(private bLservice : BlService , private _formBuilder : FormBuilder,  public datepipe: DatePipe,public dialog: MatDialog , private router: Router) { 
    this.latest_date =this.datepipe.transform(this.currentDate, 'dd/MM/YYYY');
    this.subscription = interval(10000).subscribe((v) => {
       this.calculTotal();
       this.calculAssiettes();
       this.modePaiement = this.infoFormGroup.get('modePaiement').value;
     });
  }

  ngOnInit(): void {
    //** init*/  
    this.getAllClient();
    this.getLocals();
    
    this.infoFormGroup = this._formBuilder.group({
      numBl:[''],
      local: ['', Validators.required],
      dateBl:[''],
      modePaiement: ['',Validators.required],
      custemerName: ['', Validators.required],
      devise: ['', Validators.required],
      adresse: ['',Validators.required],
      locale: [''],
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
      lengthTableDevis : [null, [Validators.required, Validators.min(1)]]
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

  // Get Locals 
  getLocals(){
    this.bLservice.getLocals().subscribe((res: any)=>{
      this.locals = res
    })
  }
  changeLocal(event : any){
    // Delete table content if the location changes
    if(event.value){
      this.blArticls= []; 
      this.totalHTBrut = 0; 
      this.remiseDiff=0;
      this.totalHT= 0;
      this.totalMontantFodec= 0;
      this.totalMontantTVA= 0;
      this.totalTTc= 0
     } 
  }
  // viewPlus 
  viewPlus(prod: any ){
    const dialogRef = this.dialog.open(VoirPlusDialogComponent,{
      width: '100%', data : {
        formPage: prod , local : this.infoFormGroup.get('local').value.nom_Local, locals:this.locals
      }
    });
    dialogRef.afterClosed().subscribe(()=>{
      console.log('Closed');
      
    })
  }

    //** infos   */
 completezInof(prod: any , i: any , data: any ){
   console.log(data);
   
   
    //** if prod is 4G */ 
      if(this.blArticls[i].n_Imei == "true"){
        const dialogRef = this.dialog.open(InfosDialogComponent,{
          width:'100%',data : {
            formPage: prod
          }
        });
        dialogRef.afterClosed().subscribe((res: any)=>{
          if(res !=undefined){
            this.blArticls[i].tableaux_produits_emie = res.data; 
          }
        });
      }
    //** if prod serie */
      else if(this.blArticls[i].n_Serie == "true"){
        const dialogRef = this.dialog.open(InfoSerieDialogComponent,{
          width:'100%',data : {
            formPage: prod
          }
        });
        dialogRef.afterClosed().subscribe((res : any )=>{
          this.blArticls[i].tableaux_produits_serie = res.data; 
        });
      }else{
        const dialogRef = this.dialog.open(InfoSimpleDialogComponent,{
          data : {
            formPage: prod
          }
        });
        dialogRef.afterClosed().subscribe(()=>{
          console.log('Closed');
        });
      }

  }

  //** Error Message
  ErrorMessage(field: string) {
    if (this.infoFormGroup.get(field).hasError('required')) {
      return 'Vous devez entrer ';
    }
    else {
      return '';
    }
  }
  //** Get All Client  */
  getAllClient(){
      this.bLservice.getAllClient().subscribe( res => {
        this.clients = res; 
      });
    }
  //** Get Client by ID */
  getClientId(event : any){
    this.bLservice.getClientById(event.id_Clt.toString()).subscribe(res => {
      this.clt = res.body;    
      this.editable = true;   
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

  //** Product is in stock  */
  isInStock(id : any){
    this.bLservice.getInfoProductByIdFromStock(id).subscribe((res : any)=>{
      var existInStoc = false;
      if(res.body != null){
          existInStoc = true; 
      }else{
          existInStoc = false; 
      }
      this.existInStoc = existInStoc;
    });
  }  

  //** open Dialog */
  openDialog(){
    const dialogRef = this.dialog.open(DialogContentAddArticleDialogComponent,{
      width: '100%',data: {
        fromPage : this.blArticls,
        local: this.infoFormGroup.get('local').value.nom_Local
      }});
      dialogRef.afterClosed().subscribe(res => { 
        //** Check if the product is in the previous table  */
        if(res != undefined){
          for(let i= 0 ;i < res.data.length; i++){
            let index = this.blArticls.findIndex(((x: any)=>parseInt(x.id_Produit) === parseInt(res.data[i].id_Produit))); 
            if(index != -1){
              this.bLservice.quentiteProdLocal(res.data[i].id_Produit, this.infoFormGroup.get('local').value.nom_Local).subscribe((ress: any)=>{
                this.qteStock= ress.body
                let qte: any ; 
                qte = parseInt(this.blArticls[index].quantite);
                qte +=1; 
               // Check availibility 
               if(this.qteStock<qte){
                Swal.fire('vous ne pouvez pas ajouter ce produit n°'+ res.data[i].id_Produit ,'Qte de stock < Qte demandé ', 'warning');
              }else{
                this.blArticls[index].quantite= this.blArticls[index].quantite+1;
                this.blArticls[index].prixU =Number(this.blArticls[index].prixU).toFixed(3); 
                this.blArticls[index].finalPrice=  (this.blArticls[index].prixU - (this.blArticls[index].prixU * (Number(this.blArticls[index].remise)) / 100)).toFixed(3)  
                this.blArticls[index].montant_HT = ((Number(this.blArticls[index].prixU) * Number(this.blArticls[index].quantite)) * (1 - (Number(this.blArticls[index].remise)) / 100)).toFixed(3);
                this.blArticls[index].qprixU = Number(this.Prix).toFixed(3);
                this.Montant_Fodec = (this.blArticls[index].montant_HT * this.blArticls[index].fodec) / 100;
                this.blArticls[index].montant_Fodec = Number(this.Montant_Fodec).toFixed(3);
                this.Montant_TVA = Number(this.blArticls[index].finalPrice) * Number((this.blArticls[index].tva)/ 100) ;
                this.blArticls[index].montant_TVA = Number(this.Montant_TVA).toFixed(3);
                this.Total_HT = Number(this.blArticls[index].finalPrice) * this.blArticls[index].quantite;
                this.blArticls[index].prix_U_TTC = (((Number(this.blArticls[index].finalPrice) + Number((this.blArticls[index].montant_Fodec)/this.blArticls[index].quantite) + Number(this.blArticls[index].montant_TVA)))).toFixed(3);;
                this.blArticls[index].montant_TTC = Number(this.blArticls[index].prix_U_TTC) * Number(this.blArticls[index].quantite);
                this.blArticls[index].total_TVA = ((Number(this.blArticls[index].montant_TVA)) / (Number(this.blArticls[index].quantite))).toFixed(3);
                this.Totale_TTC = Number((this.blArticls[index].prix_U_TTC*this.blArticls[index].quantite)).toFixed(3)
                this.blArticls[index].totale_TTC = this.Totale_TTC;
                this.blArticls[index].total_HT = Number(this.Total_HT).toFixed(3);        
                this.blArticls[index].ch_Globale = Number(this.Ch_Globale);
  
                this.calculTotal();
                this.calculAssiettes();
                this.blArticls[index].etat = 'Dispo.';
               }  

              });
            }else{
              this.bLservice.quentiteProdLocal(res.data[i].id_Produit, this.infoFormGroup.get('local').value.nom_Local).subscribe((result : any) => {
                if ((result.body)===null){
                  Swal.fire("ce produit est hors stock", '','warning');
                  this.blArticls.sort = this.sort;
                  this.blArticls.paginator = this.paginator;
                }else{
                  this.blArticls.push(res.data[i]);
                  this.calculTotal();
                  this.calculAssiettes();
                }
              })

            }
          }
        }

      });
  }

  async getProuduitById(){
    this.getProdId = true;
    this.newAttribute = {};
    let idProd = this.id;   
    this.last_ID = this.id;   
    let index = this.blArticls.findIndex(((x: any)=>parseInt(x.id_Produit) === parseInt(this.last_ID)));     
    //** Fetch if this product is exist in blArticls or not  */ 
    if((index === -1) && (idProd != undefined)){
    this.bLservice.getArticleById(idProd).subscribe((res: any ) => {
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
          this.bLservice.getInfoProductByIdFromStock(idProd).subscribe((result : any) => {
            // if not exist in the table stocks 
            if ((result.body)===null){
              Swal.fire("ce produit est hors stock", '','warning');
              this.blArticls.sort = this.sort;
              this.blArticls.paginator = this.paginator;
            }
            else{ 
              this.bLservice.quentiteProdLocal(idProd, this.infoFormGroup.get('local').value.nom_Local).subscribe((ress: any)=>{
                this.qteStock= ress.body
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
                  console.log(this.newAttribute);
                  this.blArticls.push(this.newAttribute);
                  this.calculTotal();
                  this.calculAssiettes();
                  this.blArticls.sort = this.sort;
                  this.blArticls.paginator = this.paginator;
                }
              }); 
              
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
        this.bLservice.getInfoProductByIdFromStock(idProd).subscribe((result : any) => {
          if ((result.body)===null){
            Swal.fire("ce produit est hors stock", '','warning');
            this.blArticls.sort = this.sort;
            this.blArticls.paginator = this.paginator;
          }
          else{ 
            this.bLservice.quentiteProdLocal(idProd, this.infoFormGroup.get('local').value.nom_Local).subscribe((ress: any)=>{
              this.qteStock= ress.body;
              let qte : any ; 
            qte = parseInt(this.blArticls[index].quantite);
            qte +=1; 
          // Check availibility 
          if(this.qteStock<qte){
            Swal.fire('vous ne pouvez pas ajouter ce produit','Qte de stock < Qte demandé ', 'warning'); 
            this.getProdId= false;
          }else{
            this.blArticls[index].quantite = parseInt(this.blArticls[index].quantite)+1
            this.blArticls[index].prixU=Number(this.blArticls[index].prixU).toFixed(3);  
            this.blArticls[index].finalPrice=  (this.blArticls[index].prixU - (this.blArticls[index].prixU * (Number(this.blArticls[index].remise)) / 100)).toFixed(3)  
        
            this.blArticls[index].montant_HT = ((Number(this.blArticls[index].prixU) * Number(this.blArticls[index].quantite)) * (1 - (Number(this.blArticls[index].remise)) / 100)).toFixed(3);
            this.blArticls[index].qprixU = Number(this.Prix).toFixed(3);
            this.Montant_Fodec = (this.blArticls[index].montant_HT * this.blArticls[index].fodec) / 100;
            this.blArticls[index].montant_Fodec = Number(this.Montant_Fodec).toFixed(3);
    
            this.Montant_TVA = Number(this.blArticls[index].finalPrice) * Number((this.blArticls[index].tva)/ 100) ;
            this.blArticls[index].montant_TVA = Number(this.Montant_TVA).toFixed(3);
    
            this.blArticls[index].montant_TVA = Number(this.Montant_TVA).toFixed(3);
            this.blArticls[index].prix_U_TTC = (((Number(this.blArticls[index].finalPrice) + Number((this.blArticls[index].montant_Fodec)/this.blArticls[index].quantite) + Number(this.blArticls[index].montant_TVA)))).toFixed(3);;
            this.blArticls[index].montant_TTC = Number(this.blArticls[index].prix_U_TTC) * Number(this.blArticls[index].quantite);
            this.blArticls[index].total_TVA = ((Number(this.blArticls[index].montant_TVA)) / (Number(this.blArticls[index].quantite))).toFixed(3);
            this.Totale_TTC = Number((this.blArticls[index].prix_U_TTC*this.blArticls[index].quantite)).toFixed(3)
            this.blArticls[index].totale_TTC = this.Totale_TTC;
            this.Total_HT = Number(this.blArticls[index].finalPrice * this.blArticls[index].quantite); 
            this.blArticls[index].total_HT = Number(this.Total_HT).toFixed(3);        
            this.blArticls[index].ch_Globale = Number(this.Ch_Globale);
            this.blArticls[index].etat = 'Dispo.';
            this.calculTotal();
            this.calculAssiettes();
            this.getProdId= false;
           } 
            }); 
          }
        }); 

      }
}

//** Get Article By Code A Bare */
async getProuduitByCode(){ 
    this.getProdCode = true;
    this.bLservice.getArrByCodeBare(this.code).subscribe((res: any)=>{
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
          let index = this.blArticls.findIndex(((x: any)=>parseInt(x.id_Produit) === parseInt(this.last_ID))); 
          if(index === -1){      
          let idProd = res.body.id_Produit;
          this.bLservice.getArticleById(idProd).subscribe((res) => {
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
            this.bLservice.getInfoProductByIdFromStock(idProd).subscribe((result : any) => {
              if ((result.body)===null) {
                Swal.fire("ce produit est hors stock", '','warning');
              }
              else {
                this.bLservice.quentiteProdLocal(idProd, this.infoFormGroup.get('local').value.nom_Local).subscribe((ress: any)=>{
                  this.qteStock= ress.body;
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
                  
                  this.blArticls.push(this.newAttribute);
                  this.calculTotal();
                  this.calculAssiettes();
                  this.blArticls.sort = this.sort;
                  this.blArticls.paginator = this.paginator;  
               }
                });
            }     
            });   
            this.getProdCode = false;      
          });
          this.code = ''; 
          // if this product exist
          }else{
            this.bLservice.getInfoProductByIdFromStock(this.last_ID).subscribe((result : any) => {
              if ((result.body)===null){
                Swal.fire("ce produit est hors stock", '','warning');
              }else{
                this.bLservice.quentiteProdLocal(this.last_ID, this.infoFormGroup.get('local').value.nom_Local).subscribe((ress: any)=>{
                  this.qteStock= ress.body;
                  let qte: any;
                qte = parseInt(this.blArticls[index].quantite);
                qte +=1;
                // Check availibility 
                if(this.qteStock<qte){
                  Swal.fire('vous ne pouvez pas ajouter ce produit','Qte de stock < Qte demandé ', 'warning'); 
                  this.getProdCode = false; 
                }else{
                  this.blArticls[index].quantite = parseInt(this.blArticls[index].quantite)+1;
                  this.blArticls[index].prixU =Number(this.blArticls[index].prixU).toFixed(3);     
                  this.blArticls[index].finalPrice=  (this.blArticls[index].prixU - (this.blArticls[index].prixU * (Number(this.blArticls[index].remise)) / 100)).toFixed(3)  
       
                  this.blArticls[index].montant_HT = ((Number(this.blArticls[index].prixU) * Number(this.blArticls[index].quantite)) * (1 - (Number(this.blArticls[index].remise)) / 100)).toFixed(3);
                  this.blArticls[index].qprixU = Number(this.Prix).toFixed(3);
                  this.Montant_Fodec = (this.blArticls[index].montant_HT * this.blArticls[index].fodec) / 100;
                  this.blArticls[index].montant_Fodec = Number(this.Montant_Fodec).toFixed(3);
      
                  this.Montant_TVA = Number(this.blArticls[index].finalPrice) * Number((this.blArticls[index].tva)/ 100) ;
                  this.blArticls[index].montant_TVA = Number(this.Montant_TVA).toFixed(3);
      
                  this.blArticls[index].prix_U_TTC = (((Number(this.blArticls[index].finalPrice) + Number((this.blArticls[index].montant_Fodec)/this.blArticls[index].quantite) + Number(this.blArticls[index].montant_TVA)))).toFixed(3);;
                  this.blArticls[index].montant_TTC = Number(this.blArticls[index].prix_U_TTC) * Number(this.blArticls[index].quantite);
                  this.blArticls[index].total_TVA = ((Number(this.blArticls[index].montant_TVA)) / (Number(this.blArticls[index].quantite))).toFixed(3);
                  this.Totale_TTC = Number((this.blArticls[index].prix_U_TTC*this.blArticls[index].quantite)* (1 - (Number(this.blArticls[index].remise)) / 100)).toFixed(3)
                  this.blArticls[index].totale_TTC = this.Totale_TTC;
                  
                  this.Total_HT = Number(this.blArticls[index].finalPrice) * this.blArticls[index].quantite;
                  this.blArticls[index].total_HT = Number(this.Total_HT).toFixed(3);        
                  this.blArticls[index].ch_Globale = Number(this.Ch_Globale);
    
                    this.blArticls[index].etat = 'Dispo.';
                 
                   this.calculTotal();
                   this.calculAssiettes();
                   this.getProdCode= false;
                }
                });  
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
          this.blArticls.splice(index, 1);
          this.calculTotal();
          this.calculAssiettes();
        } else if (res.dismiss === Swal.DismissReason.cancel) {
          Swal.fire(
            'Annulé',
            '',
            'error'
          )
        }
      });
      this.calculTotal();
      this.calculAssiettes();
    }
  //** Update item from the Table  */
  async ouvreDialogueArticle(index : number, item: any , table : any ){
  
    const dialogRef = this.dialog.open(UpdateDialogOverviewArticleDialogComponent, {
      width: '500px',
      data: { index: index, ligne: item, table: table}
    });
    dialogRef.afterClosed().subscribe(res => {  
                
      this.bLservice.getInfoProductByIdFromStock(res.Id_Produit).subscribe((result : any) => {
        this.bLservice.quentiteProdLocal(res.Id_Produit, this.infoFormGroup.get('local').value.nom_Local).subscribe((ress: any)=>{
          this.qteStock = ress.body; 
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
    });
 
  this.calculTotal();
  this.calculAssiettes();
}
  //** Plz choose at least one product in the next step */
  nextStep(stepper : MatStepper){
      this.isNull = false;
      if((this.totalTTc !=0)){
        let totalTTc_reg = 0;
        for(let i= 0 ; i < this.blArticls.length; i++){
          totalTTc_reg +=Number(this.blArticls[i].totale_TTC);
        }
        this.totalTTc_reg = Number(totalTTc_reg).toFixed(3) 
        this.addArticleFormGroup.controls['lengthTableDevis'].setValue(this.blArticls.length);
        this.goForward(stepper); 
        this.isNull = true;
      }else{
        this.isNull = false;
        Swal.fire( 
          'Veuillez choisir au moins un produit');
      }
    }
  //** Go Forward  */
  goForward(stepper : MatStepper){
      stepper.next();
  }

  //** Ckeck Total TTC in the reglement step */
  checkTotalTTC(stepper : MatStepper){
        this.isCompleted= false;
        this.sum= (Number((this.addReglementFormGroup.get('valueOne').value))+Number((this.addReglementFormGroup.get('valueTwo').value))+Number((this.addReglementFormGroup.get('valueTree').value)));        
        if(this.sum!=Number(this.totalTTc)){
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

  contenuTable(data: any, columns: any) {
    var body = [];
    body.push(columns);
    this.blArticls.forEach((row: any)=> {
    var dataRow: any = [];
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

  //*************************************************** The XML structure **************************************/
  createXMLStructure(url: string , data : any){
    let typeRegUn : any ; 
    let typeRegDeux : any ; 
    let typeRegTrois: any ; 
      if(this.addReglementFormGroup.get('typeRegOne').value=='4')
      typeRegUn ='Espèces';
    else if (this.addReglementFormGroup.get('typeRegOne').value=='1'){
      typeRegUn ='Virement';
    }else if (this.addReglementFormGroup.get('typeRegOne').value=='2'){
      typeRegUn ='Chèque';
    }else if (this.addReglementFormGroup.get('typeRegOne').value=='3'){
      typeRegUn ='Monétique';
    }
    if(this.addReglementFormGroup.get('typeRegTwo').value=='4')
       typeRegDeux ='Espèces';
    else if (this.addReglementFormGroup.get('typeRegTwo').value=='1'){
      typeRegDeux ='Virement';
    }else if (this.addReglementFormGroup.get('typeRegTwo').value=='2'){
      typeRegDeux ='Chèque';
    }else if (this.addReglementFormGroup.get('typeRegTwo').value=='3'){
      typeRegDeux ='Monétique';
    }
    if(this.addReglementFormGroup.get('typeRegTree').value=='4')
    typeRegTrois ='Espèces';
    else if (this.addReglementFormGroup.get('typeRegTree').value=='1'){
      typeRegTrois ='Virement';
    }else if (this.addReglementFormGroup.get('typeRegTree').value=='2'){
      typeRegTrois ='Chèque';
    }else if (this.addReglementFormGroup.get('typeRegTree').value=='3'){
      typeRegTrois ='Monétique';
    }
var doc = document.implementation.createDocument(url, 'Bon_Livraison', null);
var etatElement = doc.createElement("Etat");
var infoElement = doc.createElement("Informations-Generales");
var total = doc.createElement('Total'); 
var typeElement = doc.createElement("Type");
var idFrElement = doc.createElement("Id_Fr");
var idCLTElement = doc.createElement("Id_Clt");
var typeDevise = doc.createElement('Devise')
var adress = doc.createElement("Local"); 
var depot = doc.createElement("Depot");
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
var reglements = doc.createElement("Reglements");

//** TVA* */
var Taxes = doc.createElement("Taxes");
var TVA = doc.createElement("TVA");

var TVA19 = doc.createElement("TVA19");
var Assiette19 = doc.createElement("Assiette"); Assiette19.innerHTML = this.assiette19;
var Montant_TVA19 = doc.createElement("Montant"); Montant_TVA19.innerHTML = this.montant19;
TVA19.appendChild(Assiette19);
TVA19.appendChild(Montant_TVA19); 

var TVA7 = doc.createElement("TVA7");
var Assiette7 = doc.createElement("Assiette"); Assiette7.innerHTML = this.assiette7;
var Montant_TVA7 = doc.createElement("Montant"); Montant_TVA7.innerHTML = this.montant7;
TVA7.appendChild(Assiette7);
TVA7.appendChild(Montant_TVA7); 

var TVA13 = doc.createElement("TVA13");
var Assiette13 = doc.createElement("Assiette"); Assiette13.innerHTML = this.assiette13;
var Montant_TVA13 = doc.createElement("Montant"); Montant_TVA13.innerHTML = this.montant13;
TVA13.appendChild(Assiette13);
TVA13.appendChild(Montant_TVA13); 


var Fodec = doc.createElement("Fodec"); Fodec.innerHTML = this.totalFodec

TVA.appendChild(TVA19);
TVA.appendChild(TVA13);
TVA.appendChild(TVA7);

Taxes.appendChild(TVA);
Taxes.appendChild(Fodec);

//** Type de reglements  */
var Type_Reglement = doc.createElement("Reglements");  
//Reglement_Un 
var reglementUn = doc.createElement("Reglement");
var codeTypaRegOne = doc.createElement("code_Type_Reglement_Un")  ; codeTypaRegOne.innerHTML = this.addReglementFormGroup.get('typeRegOne').value;
var typeRegOne = doc.createElement("Type_Reglement_Un"); typeRegOne.innerHTML = typeRegUn; 
var valueRegOne = doc.createElement("Value_Reglement_Un"); valueRegOne.innerHTML =  this.price; 
reglementUn.appendChild(codeTypaRegOne);
reglementUn.appendChild(typeRegOne);
reglementUn.appendChild(valueRegOne);
Type_Reglement.appendChild(reglementUn);
// Reglement_Deux
var reglementDeux = doc.createElement("Reglement");
if (typeRegDeux != undefined){
var codeTypaRegTwo = doc.createElement("code_Type_Reglement_Deux")  ; codeTypaRegTwo.innerHTML = this.addReglementFormGroup.get('typeRegTwo').value;
var typeRegTwo = doc.createElement("Type_Reglement_Deux"); typeRegTwo.innerHTML = typeRegDeux; 
var valueRegTwo = doc.createElement("Value_Reglement_Deux"); valueRegTwo.innerHTML =  this.addReglementFormGroup.get('valueTwo').value; 
reglementDeux.appendChild(codeTypaRegTwo);
reglementDeux.appendChild(typeRegTwo);
reglementDeux.appendChild(valueRegTwo);
Type_Reglement.appendChild(reglementDeux);
}

// Reglement_Trois
var reglementTrois = doc.createElement("Reglement");

if (typeRegTrois != undefined){
var codeTypaRegTree = doc.createElement("code_Type_Reglement_Trois")  ; codeTypaRegTree.innerHTML = this.addReglementFormGroup.get('typeRegTree').value;
var typeRegTwo = doc.createElement("Type_Reglement_Trois"); typeRegTwo.innerHTML = typeRegTrois; 
var valueRegTwo = doc.createElement("Value_Reglement_Trois"); valueRegTwo.innerHTML =  this.addReglementFormGroup.get('valueTree').value; 
reglementTrois.appendChild(codeTypaRegTree)
reglementTrois.appendChild(typeRegTwo);
reglementTrois.appendChild(valueRegTwo);
Type_Reglement.appendChild(reglementTrois);
}


//******* */

Produits.setAttribute('Fournisseur','InfoNet');
Produits.setAttribute('Local', this.infoFormGroup.get('adresse').value);

var nameEtat ="En cours";
var typeName = "Devis";
var locale_depot = this.infoFormGroup.get('local').value.id_Local;
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
depot.innerHTML =locale_depot; 
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
infoElement.appendChild(depot);

total.appendChild(totalHTBrut);
total.appendChild(totalRemise);
total.appendChild(totalHTNet);
total.appendChild(totalTVA);
total.appendChild(totalTTC);
total.appendChild(totalFodec);

    //** Add Produits */
    for (let i = 0; i < this.blArticls.length; i++) {
    
      
      if (this.blArticls[i].n_Imei == "true") {
        this.blArticls[i].signaler_probleme= true; 
        var Produit = doc.createElement('Produit')
        var id = doc.createElement('Id'); id.innerHTML = this.blArticls[i].id_Produit
        var Nom = doc.createElement('Nom'); Nom.innerHTML = this.blArticls[i].nom_Produit
        var Etat = doc.createElement('Etat'); Etat.innerHTML = this.blArticls[i].etat;
        var dn_Imei = doc.createElement('n_Imei'); dn_Imei.innerHTML = this.blArticls[i].n_Imei;
        var dn_Serie = doc.createElement('n_Serie'); dn_Serie.innerHTML = this.blArticls[i].n_Serie;
        var Signaler_probleme = doc.createElement('Signaler_probleme'); Signaler_probleme.innerHTML = this.blArticls[i].signaler_probleme
        var Qte = doc.createElement('Qte'); Qte.innerHTML = this.blArticls[i].quantite
        var Tva = doc.createElement('Tva'); Tva.innerHTML = this.blArticls[i].tva
        var m_Tva = doc.createElement('Montant_Tva'); m_Tva.innerHTML = this.blArticls[i].montant_TVA
        var fodec = doc.createElement('fodec'); fodec.innerHTML = this.blArticls[i].fodec
        var  PrixU = doc.createElement('PrixU'); PrixU.innerHTML = this.blArticls[i].prixU
        var Remise = doc.createElement('Remise'); Remise.innerHTML = this.blArticls[i].remise
        var TotalFacture = doc.createElement('TotalFacture'); TotalFacture.innerHTML = this.blArticls[i].totale_TTC
        var vProduit_4Gs = doc.createElement('Produit_4Gs');
        var Prix_U_TTC= doc.createElement('PrixUTTC'); Prix_U_TTC.innerHTML= this.blArticls[i].prix_U_TTC;
        var Total_HT = doc.createElement('Total_HT');Total_HT.innerHTML = this.blArticls[i].total_HT;

        
        if(this.blArticls[i].tableaux_produits_emie != undefined){
          for (let j = 0; j < this.blArticls[i].tableaux_produits_emie.length; j++) {
            var Produit_4G = doc.createElement('Produit_4G');
            var N_Serie = doc.createElement('N_Serie'); N_Serie.innerHTML = this.blArticls[i].tableaux_produits_emie[j].n_serie
            var E1 = doc.createElement('E1'); E1.innerHTML = this.blArticls[i].tableaux_produits_emie[j].e1
            var E2 = doc.createElement('E2'); E2.innerHTML = this.blArticls[i].tableaux_produits_emie[j].e2
            Produit_4G.appendChild(N_Serie);
            Produit_4G.appendChild(E1);
            Produit_4G.appendChild(E2);
            vProduit_4Gs.appendChild(Produit_4G);
          }
        }else {
          for (let j = 0; j < this.blArticls[i].quantite; j++) {
            let tableaux_produits_emie: any = {}; 
            var Produit_4G = doc.createElement('Produit_4G');
            tableaux_produits_emie.n_serie= '0',
            tableaux_produits_emie.e1='0';
            tableaux_produits_emie.e2='0';
            var N_Serie = doc.createElement('N_Serie'); N_Serie.innerHTML = tableaux_produits_emie.n_serie
            var E1 = doc.createElement('E1'); E1.innerHTML = tableaux_produits_emie.e1
            var E2 = doc.createElement('E2'); E2.innerHTML = tableaux_produits_emie.e2
            Produit_4G.appendChild(N_Serie);
            Produit_4G.appendChild(E1);
            Produit_4G.appendChild(E2);
            vProduit_4Gs.appendChild(Produit_4G);
          }
        }
    

        Produit.appendChild(id);
        Produit.appendChild(Nom);
        Produit.appendChild(Etat)
        Produit.appendChild(Prix_U_TTC);
        Produit.appendChild(Total_HT);
        Produit.appendChild(Remise);
        Produit.appendChild(dn_Serie);
        Produit.appendChild(dn_Imei);
        Produit.appendChild(Signaler_probleme);
        Produit.appendChild(Qte);
        Produit.appendChild(Tva);
        Produit.appendChild(m_Tva);
        Produit.appendChild(fodec);
        Produit.appendChild(vProduit_4Gs);
        Produit.appendChild( PrixU)
        Produit.appendChild( TotalFacture )   
        Produit.appendChild( PrixU )
        Produits_4Gs.appendChild(Produit);
      }
      else if (this.blArticls[i].n_Serie == "true") {
        this.blArticls[i].signaler_probleme= true; 
        var Produit = doc.createElement('Produit')
        var id = doc.createElement('Id'); id.innerHTML = this.blArticls[i].id_Produit;
        var Nom = doc.createElement('Nom'); Nom.innerHTML = this.blArticls[i].nom_Produit; 
        var Etat = doc.createElement('Etat'); Etat.innerHTML = this.blArticls[i].etat;       
        var dn_Imei = doc.createElement('n_Imei'); dn_Imei.innerHTML = this.blArticls[i].n_Imei;
        var dn_Serie = doc.createElement('n_Serie'); dn_Serie.innerHTML = this.blArticls[i].n_Serie;
        var Signaler_probleme = doc.createElement('Signaler_probleme'); Signaler_probleme.innerHTML = this.blArticls[i].signaler_probleme
        var Qte = doc.createElement('Qte'); Qte.innerHTML = this.blArticls[i].quantite
        var Tva = doc.createElement('Tva'); Tva.innerHTML = this.blArticls[i].tva
        var m_Tva = doc.createElement('Montant_Tva'); m_Tva.innerHTML = this.blArticls[i].M_TVA
        var fodec = doc.createElement('fodec'); fodec.innerHTML = this.blArticls[i].fodec
        var  PrixU = doc.createElement('PrixU'); PrixU.innerHTML = this.blArticls[i].prixU
        var Remise = doc.createElement('Remise'); Remise.innerHTML = this.blArticls[i].remise;
        var TotalFacture = doc.createElement('TotalFacture'); TotalFacture.innerHTML = this.blArticls[i].totale_TTC
        var vN_Series = doc.createElement('N_Series');
        var Prix_U_TTC= doc.createElement('PrixUTTC'); Prix_U_TTC.innerHTML= this.blArticls[i].prix_U_TTC;
        var Total_HT = doc.createElement('Total_HT');Total_HT.innerHTML = this.blArticls[i].total_HT;


        if(this.blArticls[i].tableaux_produits_serie != undefined){
          for (let j = 0; j < this.blArticls[i].tableaux_produits_serie.length; j++) {
            var N_Serie = doc.createElement('N_Serie'); N_Serie.innerHTML = this.blArticls[i].tableaux_produits_serie[j]
            vN_Series.appendChild(N_Serie);
          }
        }else{
          for (let j = 0; j < this.blArticls[i].quantite; j++) {
            let n_serie ='0'

            var N_Serie = doc.createElement('N_Serie'); N_Serie.innerHTML = n_serie
            vN_Series.appendChild(N_Serie);
          }
        }


        Produit.appendChild(id);
        Produit.appendChild(Nom);
        Produit.appendChild(Etat);
        Produit.appendChild(Prix_U_TTC);
        Produit.appendChild(Total_HT);
        Produit.appendChild(Remise);
        Produit.appendChild(dn_Serie);
        Produit.appendChild(dn_Imei);
        Produit.appendChild(Signaler_probleme);
        Produit.appendChild(Qte);
        Produit.appendChild(Tva);
        Produit.appendChild(m_Tva);
        Produit.appendChild(fodec);
        Produit.appendChild(vN_Series)
        Produit.appendChild(PrixU)
        Produit.appendChild( TotalFacture ) 

        Produits_Series.appendChild(Produit);
      }
      else {
        this.blArticls[i].signaler_probleme= true; 
        var Produit = doc.createElement('Produit')
        var id = doc.createElement('Id'); id.innerHTML = this.blArticls[i].id_Produit;
        var Nom = doc.createElement('Nom'); Nom.innerHTML = this.blArticls[i].nom_Produit;
        var Etat = doc.createElement('Etat'); Etat.innerHTML = this.blArticls[i].etat;
        var Remise = doc.createElement('Remise'); Remise.innerHTML = this.blArticls[i].remise;
        var dn_Imei = doc.createElement('n_Imei'); dn_Imei.innerHTML = this.blArticls[i].n_Imei;
        var dn_Serie = doc.createElement('n_Serie'); dn_Serie.innerHTML = this.blArticls[i].n_Serie;
        var Signaler_probleme = doc.createElement('Signaler_probleme'); Signaler_probleme.innerHTML = this.blArticls[i].signaler_probleme
        var Qte = doc.createElement('Qte'); Qte.innerHTML = this.blArticls[i].quantite
        var Tva = doc.createElement('Tva'); Tva.innerHTML = this.blArticls[i].tva
        var m_Tva = doc.createElement('Montant_Tva'); m_Tva.innerHTML = this.blArticls[i].montant_TVA
        var fodec = doc.createElement('fodec'); fodec.innerHTML = this.blArticls[i].fodec
        var  PrixU = doc.createElement('PrixU'); PrixU.innerHTML = this.blArticls[i].prixU
        var TotalFacture = doc.createElement('TotalFacture'); TotalFacture.innerHTML =this.blArticls[i].totale_TTC   
        var Prix_U_TTC= doc.createElement('PrixUTTC'); Prix_U_TTC.innerHTML= this.blArticls[i].prix_U_TTC;
        var Total_HT = doc.createElement('Total_HT');Total_HT.innerHTML = this.blArticls[i].total_HT;



        Produit.appendChild(id);
        Produit.appendChild(Nom);
        Produit.appendChild(Etat);
        Produit.appendChild(Prix_U_TTC);
        Produit.appendChild(Total_HT);
        Produit.appendChild(Remise);
        Produit.appendChild(dn_Serie);
        Produit.appendChild(dn_Imei);
        Produit.appendChild(Signaler_probleme);
        Produit.appendChild(Qte);
        Produit.appendChild(Tva);
        Produit.appendChild(m_Tva);
        Produit.appendChild(fodec);
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
doc.documentElement.appendChild(Type_Reglement);
return doc
}

convertFileXml(theBlob: Blob, fileName: string): File {
    var b: any = theBlob;
    b.lastModifiedDate = new Date();
    b.name = fileName;
    return <File>theBlob;
}

    //** Generate the PDF file  */
async generatePDF(id :any){    
        // check type de reglement 
        let typeRegOne : any ; 
        let typeRegTwo : any ; 
        let typeRegTree: any ; 
          if(this.addReglementFormGroup.get('typeRegOne').value=='4')
          typeRegOne ='Espèces';
        else if (this.addReglementFormGroup.get('typeRegOne').value=='1'){
          typeRegOne ='Virement';
        }else if (this.addReglementFormGroup.get('typeRegOne').value=='2'){
          typeRegOne ='Chèque';
        }else if (this.addReglementFormGroup.get('typeRegOne').value=='3'){
                    typeRegOne ='Monétique';
        }
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
     
     
    this.bLservice.getBlByID(id).subscribe((res: any)=>{  
          this.date =  this.datepipe.transform(res.body.date_Creation, 'dd/MM/YYYY'); 
    });   
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
                text:'BL n° ' +id + ' | ' + this.date+ '\n\n',
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
                  'Nouveau Bon de Livraison'+ '\n'
                   +'Édité par :' + '\t' + '' + '\n'
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
                  'Code Client :' + '\t' + this.infoFormGroup.get('custemerName').value.id_Clt + '\n'
                  + 'Nom Client :' + '\t' + this.infoFormGroup.get('custemerName').value.nom_Client + '\n'
                  ,
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
                    typeRegOne +' : '+ Number(this.addReglementFormGroup.get('valueOne').value).toFixed(3)  +'\n'
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
            this.generateTable(this.blArticls, ['Id_Produit', 'Nom_Produit', 'Prix U HT ('+this.infoFormGroup.get('devise').value+')', 'Remise', 'Quantite', 'TVA', 'Total_HT']),
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
                      [{ text: 'Total H.T Brut', alignment: 'left' }, { text: this.totalHTBrut+' ' +this.infoFormGroup.get('devise').value, alignment: 'right' }],
                      [{ text: 'Total Remise', alignment: 'left' }, { text: this.remiseDiff+' ' +this.infoFormGroup.get('devise').value, alignment: 'right' }],
                      [{ text: 'Total H.T Net', alignment: 'left' }, { text: this.totalHT+' ' +this.infoFormGroup.get('devise').value, alignment: 'right' }],
                      [{ text: 'Total Fodec', alignment: 'left' }, { text: this.totalMontantFodec+' ' +this.infoFormGroup.get('devise').value, alignment: 'right' }],
                      [{ text: 'Total T.V.A', alignment: 'left' }, { text: this.totalMontantTVA+' ' +this.infoFormGroup.get('devise').value, alignment: 'right' }],
                      [{ text: 'Total T.T.C', alignment: 'left' }, { text: this.totalTTc+' ' +this.infoFormGroup.get('devise').value, alignment: 'right' }],
                    ]
                  },
                  layout: 'lightHorizontalLines',
                }]
            },
            {
              text: 'Note :' + '\n\n',
              fontSize: 15,
              alignment: 'left',
              color: 'black',
              bold: true
            },
            {
              columns: [
                {   
                  text:this.addReglementFormGroup.get('note').value + '\n\n' 
                ,
                fontSize: 12,
                alignment: 'left',
                color: 'black',
              },
                {
                  text: '\t'
                },
              ]
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
   
saveBL(){
    let frais_Livraison = 0;
    let url = "assets/BL.xml";
    const formData : any = new FormData();
    //** Generate the file XML */
    //** Create an XmlHttpRequest */
    let doc_ = this.createXMLStructure(url,this.blArticls);
    fetch(url).then(res => res.text).then(()=>{
      // convert xml file to blob 
      let xmlFile = new XMLSerializer().serializeToString(doc_.documentElement);
      var myBlob = new Blob([xmlFile], { type: 'application/xml' });
      var myDetail = this.convertFileXml(myBlob,url);

      formData.append('Id_Clt',this.infoFormGroup.get('custemerName').value.id_Clt);
      formData.append('Id_Responsable','InfoNet' );
      formData.append('Type', 'BL');
      formData.append('Etat', 'En cours' );
      formData.append('Frais_Livraison', frais_Livraison);
      formData.append('Date_Creation',  this.latest_date);
      formData.append('Total_HT_Brut', this.totalHTBrut);
      formData.append('Total_Remise', this.remiseDiff);
      formData.append('Total_HT_Net', this.totalHT);
      formData.append('Total_Fodec',  this.totalMontantFodec);
      formData.append('Total_Tva', this.totalMontantTVA);
      formData.append('Total_TTC', this.totalTTc);
      // Total_Retenues !!
      formData.append('Total_Retenues', 0);
      formData.append('Mode_Paiement', this.infoFormGroup.get('modePaiement').value);
      formData.append('Description', this.addReglementFormGroup.get('note').value);
      formData.append('Detail',myDetail); 
            //** send data to the API */
            this.bLservice.createBL(formData).subscribe((res)=>{
              Swal.fire(
                {title :"BL ajouté avec succés.",
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
                    this.generatePDF(res.id_Bl);
                    this.router.navigate(['Menu/Menu-BonLivraison/Lister-BL']);
                  } else if (result.isDismissed) {
                    console.log('Clicked No, File is safe!');
                  }
                });
              }});
            }, (err)=> {
                 console.log(err)
            });
    });
}
}
 