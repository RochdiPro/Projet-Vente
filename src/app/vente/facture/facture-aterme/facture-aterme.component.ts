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
import { FactureService } from '../../services/facture.service';

const pdfMake = require("pdfmake/build/pdfmake");


@Component({
  selector: 'app-facture-aterme',
  templateUrl: './facture-aterme.component.html',
  styleUrls: ['./facture-aterme.component.scss']
})
export class FactureATermeComponent implements OnInit {

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
  newAttributeBL : any = {};
  newAttribute: any = {};
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
  dateRangeStart : any ;
  dateRangeEnd: any; 
  blArticlsGeneral: any = [];
  liste_Produit: any = []; 
  date1: any ; 
  date2: any ;
  showResult: boolean = false; 
  typeRegOne: any; 
  typeRegTwo: any 
  typeRegTree : any 
  valueRegTree: any ;
  id_modeP_typeTree: any ; 
  modePaiement:any; 

  data: any // get the Detail_BLs_en_Facture 

  columns : any = ['ID', 'Nom', 'Prix_U', 'Remise', 'Quantité', 'TVA', 'Total_HT'];
  displayedColumns: string[] = ['checkbox','id_Bl', 'type', 'date_Creation', 'total_ttc' ,'Voir_pdf'];

  @ViewChild(MatPaginator) paginator: any = MatPaginator;
  @ViewChild(MatSort) sort: any = MatSort;

  // @Output() listBl = new EventEmitter();
  
  constructor(private _formBuilder: FormBuilder ,private factureService : FactureService,private blService: BlService, public datepipe: DatePipe,private router: Router) { 
    this.infoFormGroup = this._formBuilder.group({
      lengthOfListBl : ['', Validators.required]
    })
  }

  ngOnInit(): void {
    //** INIT */
    this.getKeyWordQuote();
  }
    // dateRangeChange
  dateRangeChangeDateOne(d : any){
      this.date1= this.datepipe.transform(d.value, 'YYYY/MM/dd');    
  }
  dateRangeChangeDateTwo(d : any){
        this.date2= this.datepipe.transform(d.value, 'YYYY/MM/dd')
  }

  //** Lister Clients  */
  getKeyWordQuote(){
    this.factureService.getAllClient().subscribe((res:any)=>{
      this.keyValues = res});
      }
  //** Get Value */
  onChange(ev : any){
    this.champ = ev.target.value;
  }
  getValue(ev: any){    
  } 

  //** Filter By Champ */
  filterByChamp(){
    this.loading = true ; 
    this.dataSourceBl =[]
    if(this.champ == ''){
      Swal.fire('S\'il vous plaît sélectionner un client','','info')
    }else{
      this.blService.filterBLByRangeDate(this.champ, this.date1, this.date2).subscribe((data : any)=>{
        this.getClientId(this.champ);
        this.dataSourceBl= new MatTableDataSource(data.body);    
        this.dataSourceBl.sort = this.sort; 
        this.dataSourceBl.paginator = this.paginator;
        this.loading = false ; 
        this.showResult= true; 
      });
    }

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
     this.loading= true;
    this.factureService.getClientById(id.toString()).subscribe((res: any ) => {
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
    // this.factureService.detail(devis.id_Bl.toString()).subscribe((detail: any)=>{
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
      // generate EP Detail_BLs_en_Facture
      let char = '';
      for(let i =0; i<this.listBlCheched.length; i++){
        
        char+=this.listBlCheched[i].id_Bl+'/'
      }
      // char = id_Bl1/id_Bl2../
      let newListeDate : any = new FormData(); 
      newListeDate.append('Liste', char)
      this.factureService.getDetailsBls(newListeDate).subscribe((detail: any)=>{
        //** Parsing an XML file unisng  'xml2js' lebraby*/
        const fileReader = new FileReader(); 
        // Convert blob to base64 with onloadend function
        fileReader.onloadend = () =>{
          this.detail = fileReader.result; // data: application/xml in base64
          let data : any; 
          xml2js.parseString(atob(this.detail.substr(28)),(err: any , res : any)=>{
            data = res.Facture;
            console.log(data);
            // general info 
            if(data.Produits[0].Produits_Simples[0].Produit!= undefined){
              for (let i = 0; i < data.Produits[0].Produits_Simples[0].Produit.length; i++) 
              { 
                this.newAttribute = {};
                this.newAttribute.id_Produit=(data.Produits[0].Produits_Simples[0].Produit[i].Id[0]); 
                this.newAttribute.nom_Produit =(data.Produits[0].Produits_Simples[0].Produit[i].Nom[0]); 
                this.newAttribute.Signaler_probleme=(data.Produits[0].Produits_Simples[0].Produit[i].Signaler_probleme); 
                this.newAttribute.quantite=(data.Produits[0].Produits_Simples[0].Produit[i].Qte[0]); 
                this.newAttribute.fodec=(data.Produits[0].Produits_Simples[0].Produit[i].fodec[0]);
                this.newAttribute.n_Imei = (data.Produits[0].Produits_Simples[0].Produit[i].n_Imei); 
                this.newAttribute.n_Serie = (data.Produits[0].Produits_Simples[0].Produit[i].n_Serie); 
                this.newAttribute.produits_simple = (data.Produits[0].Produits_Simples[0].Produit[i].produits_simple);           
                this.newAttribute.remise= (data.Produits[0].Produits_Simples[0].Produit[i].Remise[0]);
                this.newAttribute.prix_U_TTC= (data.Produits[0].Produits_Simples[0].Produit[i].PrixUTTC[0]);
                this.newAttribute.total_HT= (data.Produits[0].Produits_Simples[0].Produit[i].Total_HT[0]);
                this.newAttribute.prixU = (data.Produits[0].Produits_Simples[0].Produit[i].PrixU[0])
                this.newAttribute.totale_TTC = (data.Produits[0].Produits_Simples[0].Produit[i].Total_HT[0]);
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
                this.calculTotal();
                this.calculAssiettes();
              }
              }
              
              if(data.Produits[0].Produits_4Gs[0].Produit!= undefined){
                for (let i = 0; i < data.Produits[0].Produits_4Gs[0].Produit.length; i++) 
                { 
                  this.newAttribute = {};
                  this.newAttribute.id_Produit=(data.Produits[0].Produits_4Gs[0].Produit[i].Id[0]); 
                  this.newAttribute.nom_Produit =(data.Produits[0].Produits_4Gs[0].Produit[i].Nom[0]); 
                  this.newAttribute.Signaler_probleme=(data.Produits[0].Produits_4Gs[0].Produit[i].Signaler_probleme); 
                  this.newAttribute.quantite=(data.Produits[0].Produits_4Gs[0].Produit[i].Qte[0]); 
                  
                  this.newAttribute.fodec=(data.Produits[0].Produits_4Gs[0].Produit[i].fodec[0]);
                  this.newAttribute.n_Imei = (data.Produits[0].Produits_4Gs[0].Produit[i].n_Imei); 
                  this.newAttribute.n_Serie = (data.Produits[0].Produits_4Gs[0].Produit[i].n_Serie); 
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
                  this.newAttribute.totale_TTC = (data.Produits[0].Produits_4Gs[0].Produit[i].Total_HT[0]);
                  this.newAttribute.total_TVA = ((Number(this.newAttribute.montant_TVA)) / (Number(this.newAttribute.quantite))).toFixed(3); 
                
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
                  this.newAttribute.nom_Produit =(data.Produits[0].Produits_Series[0].Produit[i].Nom); 
                  this.newAttribute.Signaler_probleme=(data.Produits[0].Produits_Series[0].Produit[i].Signaler_probleme); 
                  this.newAttribute.quantite=(data.Produits[0].Produits_Series[0].Produit[i].Qte[0]); 
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
                this.newAttribute.totale_TTC = (data.Produits[0].Produits_Series[0].Produit[i].Total_HT[0]);
                this.newAttribute.total_TVA = ((Number(this.newAttribute.montant_TVA)) / (Number(this.newAttribute.quantite))).toFixed(3);              
                this.blArticlsGeneral.push(this.newAttribute)
                this.calculTotal();
                this.calculAssiettes();
                }
              }
              
            // Details 
            if(data.Liste_Produit[0].BL != undefined){
              for (let i = 0; i < data.Liste_Produit[0].BL.length; i++) {
                console.log(i, data.Liste_Produit[0].BL[i].Id_BL[0]);
                
                  if(data.Liste_Produit[0].BL[i].Produits[0].Produits_Simples[0].Produit!= undefined){
                    for (let j = 0; j < data.Liste_Produit[0].BL[i].Produits[0].Produits_Simples[0].Produit.length; j++) 
                    { 
                      this.newAttribute = {};
                      this.newAttribute.id_Bl = data.Liste_Produit[0].BL[i].Id_BL[0]
                      this.newAttribute.id_Produit=(data.Liste_Produit[0].BL[i].Produits[0].Produits_Simples[0].Produit[j].Id[0]); 
                      this.newAttribute.nom_Produit =(data.Liste_Produit[0].BL[i].Produits[0].Produits_Simples[0].Produit[j].Nom[0]); 
                      this.newAttribute.Signaler_probleme=(data.Liste_Produit[0].BL[i].Produits[0].Produits_Simples[0].Produit[j].Signaler_probleme); 
                      this.newAttribute.quantite=(data.Liste_Produit[0].BL[i].Produits[0].Produits_Simples[0].Produit[j].Qte[0]); 
                      this.newAttribute.fodec=(data.Liste_Produit[0].BL[i].Produits[0].Produits_Simples[0].Produit[j].fodec[0]);
                      this.newAttribute.N_Imei = (data.Liste_Produit[0].BL[i].Produits[0].Produits_Simples[0].Produit[j].n_Imei); 
                      this.newAttribute.N_Serie = (data.Liste_Produit[0].BL[i].Produits[0].Produits_Simples[0].Produit[j].n_Serie); 
                      this.newAttribute.produits_simple = (data.Liste_Produit[0].BL[i].Produits[0].Produits_Simples[0].Produit[j].produits_simple);           
                      this.newAttribute.remise= (data.Liste_Produit[0].BL[i].Produits[0].Produits_Simples[0].Produit[j].Remise[0]);
                      this.newAttribute.prix_U_TTC= (data.Liste_Produit[0].BL[i].Produits[0].Produits_Simples[0].Produit[j].PrixUTTC[0]);
                      this.newAttribute.total_HT= (data.Liste_Produit[0].BL[i].Produits[0].Produits_Simples[0].Produit[j].Total_HT[0]);
                      this.newAttribute.prixU = (data.Liste_Produit[0].BL[i].Produits[0].Produits_Simples[0].Produit[j].PrixU[0])
                      this.newAttribute.totale_TTC = (data.Liste_Produit[0].BL[i].Produits[0].Produits_Simples[0].Produit[j].Total_HT[0]);
                      this.newAttribute.tva = data.Liste_Produit[0].BL[i].Produits[0].Produits_Simples[0].Produit[j].Tva[0];
                      // Montant Tva u = (prix*tva)/100
                      this.newAttribute.finalPrice=  (this.newAttribute.prixU - (this.newAttribute.prixU * (Number(this.newAttribute.remise)) / 100)).toFixed(3)  
                      this.Montant_TVA = Number(this.newAttribute.finalPrice) * Number((this.newAttribute.tva)/ 100) ;
                      this.newAttribute.montant_TVA = Number(this.Montant_TVA).toFixed(3);
          
                      this.newAttribute.total_TVA = ((Number(this.newAttribute.montant_TVA)) / (Number(this.newAttribute.quantite))).toFixed(3);    
                      this.newAttribute.montant_HT = ((Number(this.newAttribute.prixU) * Number(this.newAttribute.quantite)) * (1 - (Number(this.newAttribute.remise)) / 100)).toFixed(3);       
                      this.Montant_Fodec = (this.newAttribute.montant_HT * this.newAttribute.fodec) / 100;
                      this.newAttribute.montant_Fodec = Number(this.Montant_Fodec);
                      
                     this.blArticls.push(this.newAttribute);
                              
                    }
                    }
                  
                  if(data.Liste_Produit[0].BL[i].Produits[0].Produits_4Gs[0].Produit!= undefined){
                    for (let j = 0; j < data.Liste_Produit[0].BL[i].Produits[0].Produits_4Gs[0].Produit.length; j++) 
                    { 
                      this.newAttribute = {};
                      this.newAttribute.id_Bl = data.Liste_Produit[0].BL[i].Id_BL[0]
                      this.newAttribute.id_Produit=(data.Liste_Produit[0].BL[i].Produits[0].Produits_4Gs[0].Produit[j].Id[0]); 
                      this.newAttribute.nom_Produit =(data.Liste_Produit[0].BL[i].Produits[0].Produits_4Gs[0].Produit[j].Nom[0]); 
                      this.newAttribute.Signaler_probleme=(data.Liste_Produit[0].BL[i].Produits[0].Produits_4Gs[0].Produit[j].Signaler_probleme); 
                      this.newAttribute.quantite=(data.Liste_Produit[0].BL[i].Produits[0].Produits_4Gs[0].Produit[j].Qte[0]); 
                      
                      this.newAttribute.fodec=(data.Liste_Produit[0].BL[i].Produits[0].Produits_4Gs[0].Produit[j].fodec[0]);
                      this.newAttribute.N_Imei = (data.Liste_Produit[0].BL[i].Produits[0].Produits_4Gs[0].Produit[j].n_Imei); 
                      this.newAttribute.N_Serie = (data.Liste_Produit[0].BL[i].Produits[0].Produits_4Gs[0].Produit[j].n_Serie); 
                      this.newAttribute.produits_simple = (data.Liste_Produit[0].BL[i].Produits[0].Produits_4Gs[0].Produit[j].produits_simple); 
                      this.newAttribute.tva = data.Liste_Produit[0].BL[i].Produits[0].Produits_4Gs[0].Produit[j].Tva[0];          
                      let tableaux_produits_emie = []
                      for (let k = 0; k < data.Liste_Produit[0].BL[i].Produits[0].Produits_4Gs[0].Produit[0].Produit_4Gs[0].Produit_4G.length; k++) {
                        let elem_4g : any = {};
                        elem_4g.n_serie = data.Liste_Produit[0].BL[i].Produits[0].Produits_4Gs[0].Produit[0].Produit_4Gs[0].Produit_4G[k].N_Serie;
                        elem_4g.e1 = data.Liste_Produit[0].BL[i].Produits[0].Produits_4Gs[0].Produit[0].Produit_4Gs[0].Produit_4G[k].E1
                        elem_4g.e2 = data.Liste_Produit[0].BL[i].Produits[0].Produits_4Gs[0].Produit[0].Produit_4Gs[0].Produit_4G[k].E2   
                        tableaux_produits_emie.push(elem_4g)
                      }
                      this.newAttribute.remise= (data.Liste_Produit[0].BL[i].Produits[0].Produits_4Gs[0].Produit[j].Remise[0]);
                      this.newAttribute.tableaux_produits_emie=tableaux_produits_emie;
                      this.newAttribute.prixU = (data.Liste_Produit[0].BL[i].Produits[0].Produits_4Gs[0].Produit[j].PrixU[0]);
        
                      // Montant Tva u = (prix*tva)/100
                      this.newAttribute.finalPrice=  (this.newAttribute.prixU - (this.newAttribute.prixU * (Number(this.newAttribute.remise)) / 100)).toFixed(3)  
                      this.Montant_TVA = Number(this.newAttribute.finalPrice) * Number((this.newAttribute.tva)/ 100) ;
                      this.newAttribute.montant_TVA = Number(this.Montant_TVA).toFixed(3);
                    
                      this.newAttribute.montant_HT = ((Number(this.newAttribute.prixU) * Number(this.newAttribute.quantite)) * (1 - (Number(this.newAttribute.remise)) / 100)).toFixed(3);
                      this.Montant_Fodec = (this.newAttribute.montant_HT * this.newAttribute.fodec) / 100;
                      this.newAttribute.montant_Fodec = Number(this.Montant_Fodec);
                      this.newAttribute.prix_U_TTC= (data.Liste_Produit[0].BL[i].Produits[0].Produits_4Gs[0].Produit[j].PrixUTTC[0]);
                      this.newAttribute.total_HT= (data.Liste_Produit[0].BL[i].Produits[0].Produits_4Gs[0].Produit[j].Total_HT[0]);
                      this.newAttribute.totale_TTC = (data.Liste_Produit[0].BL[i].Produits[0].Produits_4Gs[0].Produit[j].Total_HT[0]);
                      this.newAttribute.total_TVA = ((Number(this.newAttribute.montant_TVA)) / (Number(this.newAttribute.quantite))).toFixed(3); 
                    
                     this.blArticls.push(this.newAttribute);
                    
                    }
                  }

                  if(data.Liste_Produit[0].BL[i].Produits[0].Produits_Series[0].Produit!= undefined){
                    for (let j = 0; j < data.Liste_Produit[0].BL[i].Produits[0].Produits_Series[0].Produit.length; j++) 
                    {
                      this.newAttribute = {};
                      this.newAttribute.id_Bl = data.Liste_Produit[0].BL[i].Id_BL[0]
                      this.newAttribute.id_Produit=(data.Liste_Produit[0].BL[i].Produits[0].Produits_Series[0].Produit[j].Id[0]); 
                      this.newAttribute.nom_Produit =(data.Liste_Produit[0].BL[i].Produits[0].Produits_Series[0].Produit[j].Nom); 
                      this.newAttribute.Signaler_probleme=(data.Liste_Produit[0].BL[i].Produits[0].Produits_Series[0].Produit[j].Signaler_probleme); 
                      this.newAttribute.quantite=(data.Liste_Produit[0].BL[i].Produits[0].Produits_Series[0].Produit[j].Qte[0]); 
                      this.newAttribute.fodec=(data.Liste_Produit[0].BL[i].Produits[0].Produits_Series[0].Produit[j].fodec);              
                      this.newAttribute.N_Imei = (data.Liste_Produit[0].BL[i].Produits[0].Produits_Series[0].Produit[j].n_Imei); 
                      this.newAttribute.N_Serie = (data.Liste_Produit[0].BL[i].Produits[0].Produits_Series[0].Produit[j].n_Serie); 
                      this.newAttribute.produits_simple = (data.Liste_Produit[0].BL[i].Produits[0].Produits_Series[0].Produit[j].produits_simple);           
                      this.newAttribute.tva = data.Liste_Produit[0].BL[i].Produits[0].Produits_Series[0].Produit[j].Tva[0]; 
                      let tableaux_produits_serie = []
                     
                      for (let k = 0; k< data.Liste_Produit[0].BL[i].Produits[0].Produits_Series[0].Produit[0].N_Series[0].N_Serie.length; k++) {
                        tableaux_produits_serie.push( data.Liste_Produit[0].BL[i].Produits[0].Produits_Series[0].Produit[0].N_Series[0].N_Serie[k])
                    }  
                    this.newAttribute.remise= (data.Liste_Produit[0].BL[i].Produits[0].Produits_Series[0].Produit[j].Remise[0]);      
                    this.newAttribute.tableaux_produits_serie=tableaux_produits_serie;
                    this.newAttribute.prixU = (data.Liste_Produit[0].BL[i].Produits[0].Produits_Series[0].Produit[j].PrixU[0]);
                    
                    // Montant Tva u = (prix*tva)/100
                    this.newAttribute.finalPrice=  (this.newAttribute.prixU - (this.newAttribute.prixU * (Number(this.newAttribute.remise)) / 100)).toFixed(3)  
                    this.Montant_TVA = Number(this.newAttribute.finalPrice) * Number((this.newAttribute.tva)/ 100) ;
                    this.newAttribute.montant_TVA = Number(this.Montant_TVA).toFixed(3);
        
                    this.newAttribute.montant_HT = ((Number(this.newAttribute.prixU) * Number(this.newAttribute.quantite)) * (1 - (Number(this.newAttribute.remise)) / 100)).toFixed(3);
                    this.Montant_Fodec = (this.newAttribute.montant_HT * this.newAttribute.fodec) / 100;
                    this.newAttribute.montant_Fodec = Number(this.Montant_Fodec);
                    
                    this.newAttribute.prix_U_TTC= (data.Liste_Produit[0].BL[i].Produits[0].Produits_Series[0].Produit[j].PrixUTTC[0]);
                    this.newAttribute.total_HT= (data.Liste_Produit[0].BL[i].Produits[0].Produits_Series[0].Produit[j].Total_HT[0]);
                    this.newAttribute.totale_TTC = (data.Liste_Produit[0].BL[i].Produits[0].Produits_Series[0].Produit[j].Total_HT[0]);
                    this.newAttribute.total_TVA = ((Number(this.newAttribute.montant_TVA)) / (Number(this.newAttribute.quantite))).toFixed(3);
                  
                    this.blArticls.push(this.newAttribute);
                  
                    }
                  }
                  console.log("...",this.blArticls);
              }
            }  
           })}
           
           
           fileReader.readAsDataURL(detail.body);
            this.loadingGeneral = false; 
      });

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
