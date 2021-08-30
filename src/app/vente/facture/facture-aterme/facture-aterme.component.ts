import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { BlService } from '../../services/bl.service';
import { DevisService } from '../../services/devis.service';

const pdfMake = require("pdfmake/build/pdfmake");


@Component({
  selector: 'app-facture-aterme',
  templateUrl: './facture-aterme.component.html',
  styleUrls: ['./facture-aterme.component.scss']
})
export class FactureATermeComponent implements OnInit {

  champ : string = '';
  value: string = '';
  keyValues: any = [];
  dataSourceDevis : any = [];
  devisChecked : any ; 
  loading : boolean = false; 
  dsiable : boolean = true;
  date : any;  
  clt : any;
  detail: any;
  xmldata : any

  columns : any = ['ID', 'Nom', 'Prix_U', 'Remise', 'Quantité', 'TVA', 'Total_HT'];
  displayedColumns: string[] = ['checkbox','id_Devis', 'type', 'date_Creation', 'id_Responsable', 'mode_Paiement', 'total_ttc' ,'Voir_pdf'];

  @ViewChild(MatPaginator) paginator: any = MatPaginator;
  @ViewChild(MatSort) sort: any = MatSort;
  
  constructor(private bLService : BlService, public datepipe: DatePipe, private devisService : DevisService) { }

  ngOnInit(): void {
    //** INIT */
    this.getKeyWordQuote();
    this.getAllDeviss();
  }
      //** Get All Quote (Deviss) */
      async getAllDeviss(){
        this.loading = true; 
        this.devisService.getAllDevis().subscribe((res: any)=>{
          let devis_en_cours : any = []
          let data : any = []
          data = res
          data.map((ele: any)=>{ 
            if (ele.etat ==='En cours')
            return devis_en_cours.unshift(ele)
          });  
          // res = res.sort((a:any , b : any )=> b.id_Devis -a.id_Devis);
        this.dataSourceDevis= new MatTableDataSource(devis_en_cours);   
        this.dataSourceDevis.sort = this.sort; 
        this.dataSourceDevis.paginator = this.paginator;
        this.loading = false; 
        });
      }
  //** Lister les champ Devis */
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
    this.dataSourceDevis =[]
    this.bLService.filterByChampValeur(this.champ, this.value).subscribe((data : any)=>{
      console.log(data.body);
      data.body.total_TTC= Number(data.body.total_TTC).toFixed(3)
      this.dataSourceDevis= new MatTableDataSource(data.body);    
      this.dataSourceDevis.sort = this.sort; 
      this.dataSourceDevis.paginator = this.paginator;
      this.loading = false ; 
    });
  }
  //** Get Data (Devis) */
  checkCheckBoxvalue(event : any , devis : any){
    if(event.target.checked) {
      this.devisChecked = devis; 
      this.dsiable = false;
    }
  }
   //** Get Client by ID */
   getClientId(id : any): any{
    this.bLService.getClientById(id.toString()).subscribe(res => {
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
  viewPDF(devis: any){
    this.getClientId(devis.id_Clt);
    this.date =  this.datepipe.transform(devis.date_Creation, 'dd/MM/YYYY');
    // this.bLService.detail(devis.id_Devis.toString()).subscribe((detail: any)=>{
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
}
