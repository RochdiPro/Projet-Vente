import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import Swal from 'sweetalert2';
// XML to JavaScript object converter.
import * as xml2js from 'xml2js';
import { BlService } from '../../services/bl.service';
import { DevisService } from '../../services/devis.service';
const pdfMake = require("pdfmake/build/pdfmake");

@Component({
  selector: 'app-lister-bl',
  templateUrl: './lister-bl.component.html',
  styleUrls: ['./lister-bl.component.scss']
})
export class ListerBlComponent implements OnInit {

  detail: any;
  xmldata : any
  champ : string; 
  value: string; 
  keyValues: any = []; 
  dataSourceBl : any = [];
  loading : boolean = true; 
  date : any;  
  clt : any;

  columns : any = ['ID', 'Nom', 'Prix_U', 'Remise', 'Quantité', 'TVA', 'Total_HT'];
  displayedColumns: string[] = ['modifier','id_Bl', 'etat', 'date_Creation', 'mode_Paiement', 'total_ttc', 'supprimer', 'exporter_pdf','Voir_pdf'];
  @ViewChild(MatPaginator) paginator: any = MatPaginator;
  @ViewChild(MatSort) sort: any = MatSort;

  constructor(private blService : BlService,public datepipe: DatePipe, private devisService : DevisService) {
        //** INIT */
        this.getAllBLs();
        this.getKeyWordBL(); 
   }
  //** Get All  (BL) */
  async getAllBLs(){
    this.loading = true; 
    this.blService.getAllBL().subscribe((res: any)=>{
      res = res.sort((a:any , b : any )=> b.id_Bl -a.id_Bl);
    this.dataSourceBl= new MatTableDataSource(res);   
    this.dataSourceBl.sort = this.sort; 
    this.dataSourceBl.paginator = this.paginator;
    this.loading = false; 
    });
    
  }
  //** Lister les champ BL */
  getKeyWordBL(){
    this.blService.getListKeyWord().subscribe((res:any)=>this.keyValues = res);
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
    this.dataSourceBl =[]
    this.blService.filterByChampValeur(this.champ, this.value).subscribe((data : any)=>{
      data.body = data.body.sort((a:any , b : any )=> b.id_Bl -a.id_Bl);
      this.dataSourceBl= new MatTableDataSource(data.body);    
      this.dataSourceBl.sort = this.sort; 
      this.dataSourceBl.paginator = this.paginator;
    });
  }

  //** Delete BL */
  deleteBL(id: any){
    Swal.fire({
      title: 'Êtes-vous sûr?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Oui, supprimez-le',
      cancelButtonText: 'Non, garde le'
    }).then((res : any)=>{
      if(res.value){
        this.blService.deleteBL(id).subscribe((res: any)=>{});
        Swal.fire('Le BL est suprimé avec succés!',
        '',
          'success'
        ).then(()=>{
          this.getAllBLs();
        })
      } else if (res.dismiss === Swal.DismissReason.cancel) {
        Swal.fire(
          'Annulé',
          '',
          'error'
        )
      }
    })
  }

  //** Get Client by ID */
  getClientId(id : any): any{
    this.blService.getClientById(id.toString()).subscribe(res => {
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
    console.log(bl);
  // check if this "Devis" is Proforma or "simple/estimatif"
    this.getClientId(bl.id_Clt);
    this.date =  this.datepipe.transform(bl.date_Creation, 'dd/MM/YYYY');
    this.blService.detail(bl.id_Bl.toString()).subscribe((detail: any)=>{
      var devisArr :any = [];
      //** Parsing an XML file unisng  'xml2js' lebraby*/
      const fileReader = new FileReader(); 
      // Convert blob to base64 with onloadend function
      fileReader.onloadend = () =>{
        this.detail = fileReader.result; // data: application/xml in base64
        let data : any; 
        xml2js.parseString(atob(this.detail.substr(28)),(err: any , res : any)=>{
          data =res.Devis;  
           
        });
        this.xmldata = data;
        // check type de reglement 
        let typeRegTwo : any ; 
        if (data.Type_Reglement[0].TypeRegTwo[0]=='4')
          typeRegTwo ='Espèces';
          else if  (data.Type_Reglement[0].TypeRegTwo[0]=='1'){
            typeRegTwo ='Virement';
          }else if  (data.Type_Reglement[0].TypeRegTwo[0]=='2'){
            typeRegTwo ='Chèque';
        }else if  (data.Type_Reglement[0].TypeRegTwo[0]=='3'){
            typeRegTwo ='monétique';
        }
        let typeRegTree : any ; 
        if (data.Type_Reglement[0].TypeRegTree[0]=='4')
          typeRegTree ='Espèces';
          else if  (data.Type_Reglement[0].TypeRegTree[0]=='1'){
            typeRegTree ='Virement';
          }else if  (data.Type_Reglement[0].TypeRegTree[0]=='2'){
            typeRegTree ='Chèque';
        }else if  (data.Type_Reglement[0].TypeRegTree[0]=='3'){
            typeRegTree ='monétique';
        }
        // 'Id_Produit', 'Nom_Produit', 'Prix', 'Remise', 'Quantite', 'TVA', 'Total_HT'
          if(data.Produits[0].Produits_Simples[0].Produit!= undefined){
          for (let i = 0; i < data.Produits[0].Produits_Simples[0].Produit.length; i++) 
          { 
             let Id_Produit: any =data.Produits[0].Produits_Simples[0].Produit[i].Id;  
             let Nom_Produit: any  =data.Produits[0].Produits_Simples[0].Produit[i].Nom;
             let Quantite: any =data.Produits[0].Produits_Simples[0].Produit[i].Qte ;
             let Prix_U: any=Number (data.Produits[0].Produits_Simples[0].Produit[i].PrixU).toFixed(3);
             let Remise : any =(data.Produits[0].Produits_Simples[0].Produit[i].Remise)
             let TVA : any = data.Produits[0].Produits_Simples[0].Produit[i].Tva;
             let Total_HT :any = data.Produits[0].Produits_Simples[0].Produit[i].Total_HT
             devisArr.push(
              {
                ID:  Id_Produit,
                Nom:  Nom_Produit,
                Quantité: Quantite,
                Prix_U:  Prix_U,
                Remise:Remise,
                TVA:TVA,
                Total_HT: Total_HT
              });
            
          }
           }
          if(data.Produits[0].Produits_4Gs[0].Produit!= undefined){
          for (let i = 0; i < data.Produits[0].Produits_4Gs[0].Produit.length; i++) 
          {   
           let Id_Produit: any =data.Produits[0].Produits_4Gs[0].Produit[i].Id;  
           let Nom_Produit: any  =data.Produits[0].Produits_4Gs[0].Produit[i].Nom;
           let Quantite: any =data.Produits[0].Produits_4Gs[0].Produit[i].Qte ;
           let Prix_U: any=Number (data.Produits[0].Produits_4Gs[0].Produit[i].PrixU).toFixed(3);
           let Remise : any =(data.Produits[0].Produits_4Gs[0].Produit[i].Remise)
           let TVA : any = data.Produits[0].Produits_4Gs[0].Produit[i].Tva;
           let Total_HT :any = data.Produits[0].Produits_4Gs[0].Produit[i].Total_HT
                            
            devisArr.push(
              {
                ID:  Id_Produit,
                Nom:  Nom_Produit,
                Quantité: Quantite,
                Prix_U:  Prix_U,
                Remise:Remise,
                TVA:TVA,
                Total_HT: Total_HT
              });
            
           
          }}
          if(data.Produits[0].Produits_Series[0].Produit!= undefined){
          for (let i = 0; i < data.Produits[0].Produits_Series[0].Produit.length; i++) 
          { 
            let Id_Produit: any =data.Produits[0].Produits_Series[0].Produit[i].Id;  
            let Nom_Produit: any  =data.Produits[0].Produits_Series[0].Produit[i].Nom;
            let Quantite: any =data.Produits[0].Produits_Series[0].Produit[i].Qte ;
            let Prix_U: any=Number (data.Produits[0].Produits_Series[0].Produit[i].PrixU).toFixed(3);
            let Remise : any =(data.Produits[0].Produits_Series[0].Produit[i].Remise)
            let TVA : any = data.Produits[0].Produits_Series[0].Produit[i].Tva;
            let Total_HT :any = data.Produits[0].Produits_Series[0].Produit[i].Total_HT
          
            devisArr.push(
              {
                ID:  Id_Produit,
                Nom:  Nom_Produit,
                Quantité: Quantite,
                Prix_U:  Prix_U,
                Remise:Remise,
                TVA:TVA,
                Total_HT: Total_HT
              }); 
            
          }}
          setTimeout(async ()=>{
            //** Generate the pdf file */ 
            let pdf_BL = {
              background: [
                {
                  image: await this.getBase64ImageFromURL("../../../assets/images/Fiche_bl_page.jpg"), width: 600
                }
              ],
              content: [
                { columns : [
                  {
                    text:'BL n° ' +bl.id_Bl +' | ' +  this.date+'\n\n',
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
                    (bl.type == 'Estimatif' || bl.type=='Proforma')?
                    {   
                      text: 
                     'Type : Devis ' +bl.type + ' n° '+ bl.id_Devis+ '- BL' + '\n' 
                     + 'Nom du responsable :' + '\t' + '' + '\n\n'
                     ,
                    fontSize: 12,
                    alignment: 'left',
                    color: 'black',
                  }:
                  {   
                    text: 
                    'Nouveau Bon de Livraison'
                    + 'Nom du responsable :' + '\t' + '' + '\n\n'
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
                      'Code Client :' + '\t' + bl.id_Clt + '\n'
                      + 'Nom Client :' + '\t' + this.clt.nom_Client + '\n'
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
                  text: 'Modalité du paiement :' ,
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
                        bl.mode_Paiement +' : '+ data.Type_Reglement[0].ValueRegOne[0]  +'\n'
                      ]
                    },{
                      ul : [
                        (typeRegTwo !== undefined)?
                        typeRegTwo +' : '+Number(data.Type_Reglement[0].ValueRegTwo[0]).toFixed(3)+'\n' : 
                        ''
                        ]
                    },{
                      ul:[
                        (typeRegTree !==  undefined)?
                        typeRegTree +' : '+ Number(data.Type_Reglement[0].ValueRegTree[0]).toFixed(3) +'\n' : 
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
                this.generateTable(devisArr, ['Id_Produit', 'Nom_Produit', 'Prix U HT ('+data["Informations-Generales"][0].Devise+')',  'Remise', 'Quantite', 'TVA', 'Total_HT']),
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
                          [{ text: 'Assiette', alignment: 'left' }, data.Taxes[0].TVA[0].TVA7, data.Taxes[0].TVA[0].TVA13, data.Taxes[0].TVA[0].TVA19],
                          [{ text: 'Montant', alignment: 'left' }, data.Montant_TVA[0].Montant_TVA7, data.Montant_TVA[0].Montant_TVA13, data.Montant_TVA[0].Montant_TVA19],
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
                          [{ text: 'Total H.T Brut', alignment: 'left' }, { text: data.Total[0].TotalHTBrut[0]+' '+data["Informations-Generales"][0].Devise, alignment: 'right' }],
                          [{ text: 'Total Remise', alignment: 'left' }, { text: data.Total[0].TotalRemise[0]+' '+data["Informations-Generales"][0].Devise, alignment: 'right' }],
                          [{ text: 'Total H.T Net', alignment: 'left' }, { text: data.Total[0].TotalHTNet[0]+' '+data["Informations-Generales"][0].Devise, alignment: 'right' }],
                          [{ text: 'Total Fodec', alignment: 'left' }, { text: data.Total[0].TotalFodec[0]+' '+data["Informations-Generales"][0].Devise, alignment: 'right' }],
                          [{ text: 'Total T.V.A', alignment: 'left' }, { text: data.Total[0].TotalTVA[0]+' '+data["Informations-Generales"][0].Devise, alignment: 'right' }],
                          [{ text: 'Total T.T.C', alignment: 'left' }, { text: data.Total[0].TotalTTC[0] +' '+data["Informations-Generales"][0].Devise, alignment: 'right' }],
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
                      text: bl.description + '\n\n' 
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
            pdfMake.createPdf(pdf_BL).open();
           },1000)
      }      
      fileReader.readAsDataURL(detail.body);
    });
  }
  
  //** Download a Quote (devis) */
  download(bl:any){
    this.getClientId(bl.id_Clt);
    this.date =  this.datepipe.transform(bl.date_Creation, 'dd/MM/YYYY');
    this.blService.detail(bl.id_Bl.toString()).subscribe((detail: any)=>{
      var devisArr :any = [];
      //** Parsing an XML file unisng  'xml2js' lebraby*/
      const fileReader = new FileReader(); 
      // Convert blob to base64 with onloadend function
      fileReader.onloadend = () =>{
        this.detail = fileReader.result; // data: application/xml in base64
        let data : any; 
        xml2js.parseString(atob(this.detail.substr(28)),(err: any , res : any)=>{
          data =res.Devis;   
          console.log('data',data);  
        });
        this.xmldata = data;
       // check type de reglement 
       let typeRegTwo : any ; 
       if (data.Type_Reglement[0].TypeRegTwo[0]=='4')
         typeRegTwo ='Espèces';
         else if  (data.Type_Reglement[0].TypeRegTwo[0]=='1'){
           typeRegTwo ='Virement';
         }else if  (data.Type_Reglement[0].TypeRegTwo[0]=='2'){
           typeRegTwo ='Chèque';
       }else if  (data.Type_Reglement[0].TypeRegTwo[0]=='3'){
           typeRegTwo ='monétique';
       }
       let typeRegTree : any ; 
       if (data.Type_Reglement[0].TypeRegTree[0]=='4')
         typeRegTree ='Espèces';
         else if  (data.Type_Reglement[0].TypeRegTree[0]=='1'){
           typeRegTree ='Virement';
         }else if  (data.Type_Reglement[0].TypeRegTree[0]=='2'){
           typeRegTree ='Chèque';
       }else if  (data.Type_Reglement[0].TypeRegTree[0]=='3'){
           typeRegTree ='monétique';
       }
        // 'Id_Produit', 'Nom_Produit', 'Prix', 'Remise', 'Quantite', 'TVA', 'Total_HT'
          if(data.Produits[0].Produits_Simples[0].Produit!= undefined){
          for (let i = 0; i < data.Produits[0].Produits_Simples[0].Produit.length; i++) 
          { 
             let Id_Produit: any =data.Produits[0].Produits_Simples[0].Produit[i].Id;  
             let Nom_Produit: any  =data.Produits[0].Produits_Simples[0].Produit[i].Nom;
             let Quantite: any =data.Produits[0].Produits_Simples[0].Produit[i].Qte ;
             let Prix_U: any=Number (data.Produits[0].Produits_Simples[0].Produit[i].PrixU).toFixed(3);
             let Remise : any =(data.Produits[0].Produits_Simples[0].Produit[i].Remise)
             let TVA : any = data.Produits[0].Produits_Simples[0].Produit[i].Tva;
             let Total_HT :any = data.Produits[0].Produits_Simples[0].Produit[i].Total_HT
             devisArr.push(
              {
                ID:  Id_Produit,
                Nom:  Nom_Produit,
                Quantité: Quantite,
                Prix_U:  Prix_U,
                Remise:Remise,
                TVA:TVA,
                Total_HT: Total_HT
              });
            
          }
           }
          if(data.Produits[0].Produits_4Gs[0].Produit!= undefined){
          for (let i = 0; i < data.Produits[0].Produits_4Gs[0].Produit.length; i++) 
          {   
           let Id_Produit: any =data.Produits[0].Produits_4Gs[0].Produit[i].Id;  
           let Nom_Produit: any  =data.Produits[0].Produits_4Gs[0].Produit[i].Nom;
           let Quantite: any =data.Produits[0].Produits_4Gs[0].Produit[i].Qte ;
           let Prix_U: any=Number (data.Produits[0].Produits_4Gs[0].Produit[i].PrixU).toFixed(3);
           let Remise : any =(data.Produits[0].Produits_4Gs[0].Produit[i].Remise)
           let TVA : any = data.Produits[0].Produits_4Gs[0].Produit[i].Tva;
           let Total_HT :any = data.Produits[0].Produits_4Gs[0].Produit[i].Total_HT
                            
            devisArr.push(
              {
                ID:  Id_Produit,
                Nom:  Nom_Produit,
                Quantité: Quantite,
                Prix_U:  Prix_U,
                Remise:Remise,
                TVA:TVA,
                Total_HT: Total_HT
              });
            
           
          }}
          if(data.Produits[0].Produits_Series[0].Produit!= undefined){
          for (let i = 0; i < data.Produits[0].Produits_Series[0].Produit.length; i++) 
          { 
            let Id_Produit: any =data.Produits[0].Produits_Series[0].Produit[i].Id;  
            let Nom_Produit: any  =data.Produits[0].Produits_Series[0].Produit[i].Nom;
            let Quantite: any =data.Produits[0].Produits_Series[0].Produit[i].Qte ;
            let Prix_U: any=Number (data.Produits[0].Produits_Series[0].Produit[i].PrixU).toFixed(3);
            let Remise : any =(data.Produits[0].Produits_Series[0].Produit[i].Remise)
            let TVA : any = data.Produits[0].Produits_Series[0].Produit[i].Tva;
            let Total_HT :any = data.Produits[0].Produits_Series[0].Produit[i].Total_HT
          
            devisArr.push(
              {
                ID:  Id_Produit,
                Nom:  Nom_Produit,
                Quantité: Quantite,
                Prix_U:  Prix_U,
                Remise:Remise,
                TVA:TVA,
                Total_HT: Total_HT
              }); 
            
          }}
          setTimeout(async ()=>{
            //** Generate the pdf file */ 
            let pdf_BL = {
              background: [
                {
                  image: await this.getBase64ImageFromURL("../../../assets/images/Fiche_bl_page.jpg"), width: 600
                }
              ],
              content: [
                { columns : [
                  {
                    text:'BL n° ' +bl.id_Bl +' | ' +  this.date+'\n\n',
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
                    (bl.type == 'Estimatif' || bl.type=='Proforma')?
                    {   
                      text: 
                      'Type : Devis ' +bl.type + ' n° '+ bl.id_Devis+ '- BL' + '\n' 
                      + 'Nom du responsable :' + '\t' + '' + '\n\n'
                     ,
                    fontSize: 12,
                    alignment: 'left',
                    color: 'black',
                  }:
                  {   
                    text: 
                    'Nouveau Bon de Livraison'
                    + 'Nom du responsable :' + '\t' + '' + '\n\n'
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
                      'Code Client :' + '\t' + bl.id_Clt + '\n'
                      + 'Nom Client :' + '\t' + this.clt.nom_Client + '\n'
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
                  text: 'Modalité du paiement :' ,
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
                        bl.mode_Paiement +' : '+ data.Type_Reglement[0].ValueRegOne[0]  +'\n'
                      ]
                    },{
                      ul : [
                        (typeRegTwo !== undefined)?
                        typeRegTwo +' : '+Number(data.Type_Reglement[0].ValueRegTwo[0]).toFixed(3)+'\n' : 
                        ''
                        ]
                    },{
                      ul:[
                        (typeRegTree !==  undefined)?
                        typeRegTree +' : '+ Number(data.Type_Reglement[0].ValueRegTree[0]).toFixed(3) +'\n' : 
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
                this.generateTable(devisArr, ['Id_Produit', 'Nom_Produit', 'Prix U HT ('+data["Informations-Generales"][0].Devise+')',  'Remise', 'Quantite', 'TVA', 'Total_HT']),
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
                          [{ text: 'Assiette', alignment: 'left' }, data.Taxes[0].TVA[0].TVA7, data.Taxes[0].TVA[0].TVA13, data.Taxes[0].TVA[0].TVA19],
                          [{ text: 'Montant', alignment: 'left' }, data.Montant_TVA[0].Montant_TVA7, data.Montant_TVA[0].Montant_TVA13, data.Montant_TVA[0].Montant_TVA19],
                        ]
                      },
                      layout: 'lightHorizontalLines',
                      alignment: 'right',
                    },
                    {
                    },
                    {
                      style: 'tableExample',
                      table: {
                        heights: [20],
                        body: [
                          [{ text: 'Total H.T Brut', alignment: 'left' }, { text: data.Total[0].TotalHTBrut[0]+' '+data["Informations-Generales"][0].Devise, alignment: 'right' }],
                          [{ text: 'Total Remise', alignment: 'left' }, { text: data.Total[0].TotalRemise[0]+' '+data["Informations-Generales"][0].Devise, alignment: 'right' }],
                          [{ text: 'Total H.T Net', alignment: 'left' }, { text: data.Total[0].TotalHTNet[0]+' '+data["Informations-Generales"][0].Devise, alignment: 'right' }],
                          [{ text: 'Total Fodec', alignment: 'left' }, { text: data.Total[0].TotalFodec[0]+' '+data["Informations-Generales"][0].Devise, alignment: 'right' }],
                          [{ text: 'Total T.V.A', alignment: 'left' }, { text: data.Total[0].TotalTVA[0]+' '+data["Informations-Generales"][0].Devise, alignment: 'right' }],
                          [{ text: 'Total T.T.C', alignment: 'left' }, { text: data.Total[0].TotalTTC[0] +' '+data["Informations-Generales"][0].Devise, alignment: 'right' }],
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
                      text: bl.description + '\n\n' 
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
            pdfMake.createPdf(pdf_BL).download('BL_'+bl.id_Bl+'_' +this.date);
          },1000)
      }      
      fileReader.readAsDataURL(detail.body);
    });
  }

  ngOnInit(): void {
  }

}
