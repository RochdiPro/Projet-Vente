import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import Swal from 'sweetalert2';
// XML to JavaScript object converter.
import * as xml2js from 'xml2js';
import { FactureService } from '../../services/facture.service';
const pdfMake = require("pdfmake/build/pdfmake");
@Component({
  selector: 'app-lister-facture',
  templateUrl: './lister-facture.component.html',
  styleUrls: ['./lister-facture.component.scss']
})
export class ListerFactureComponent implements OnInit {

  detail: any;
  xmldata : any
  champ : string; 
  value: string; 
  keyValues: any = []; 
  dataSourceFacture : any = [];
  loading : boolean = true; 
  date : any;  
  clt : any;

  columns : any = ['ID', 'Nom', 'Prix_U', 'Remise', 'Quantité', 'TVA', 'Total_HT'];
  displayedColumns: string[] = ['modifier','id_Facture', 'etat', 'date_Creation',  'total_ttc','total_Retenues','annuler', 'supprimer', 'exporter_pdf','Voir_pdf'];
  @ViewChild(MatPaginator) paginator: any = MatPaginator;
  @ViewChild(MatSort) sort: any = MatSort;

  constructor(private factureService : FactureService,public datepipe: DatePipe) {
        //** INIT */
        this.getAllFacture();
        this.getKeyWordQuote(); 
   }
  //** Get All Facture */
  async getAllFacture(){
    this.loading = true; 
    let devis_en_cours : any =[]; 
    this.factureService.getAllFacture().subscribe((res: any)=>{
      
      let data : any =[]
      data = res ; 
      data.map((ele: any)=>{ 
         devis_en_cours.unshift(ele)
      });  
      devis_en_cours = devis_en_cours.sort((a:any , b : any )=> b.id_Facture -a.id_Facture);
    this.dataSourceFacture= new MatTableDataSource(devis_en_cours);       
    this.dataSourceFacture.sort = this.sort; 
    this.dataSourceFacture.paginator = this.paginator;
    this.loading = false; 
    });
    
  }
  //** Lister les champ Devis */
  getKeyWordQuote(){
    this.factureService.getListKeyWord().subscribe((res:any)=>this.keyValues = res);
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
    this.dataSourceFacture =[]
    this.factureService.filterByChampValeur(this.champ, this.value).subscribe((data : any)=>{
      this.dataSourceFacture= new MatTableDataSource(data.body);    
      this.dataSourceFacture.sort = this.sort; 
      this.dataSourceFacture.paginator = this.paginator;
    });
  }

  //** Delete Facture */
  deleteFacture(id: any){
    Swal.fire({
      title: 'Êtes-vous sûr?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Oui, supprimez-le',
      cancelButtonText: 'Non, garde le'
    }).then((res : any)=>{
      if(res.value){
        this.factureService.deleteFacture(id).subscribe((res: any)=>{});
        Swal.fire('Le Devis est suprimé avec succés!',
        '',
          'success'
        ).then(()=>{
          this.getAllFacture();
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
    this.factureService.getClientById(id.toString()).subscribe(res => {
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
  viewPDF(facture: any){
        let imgUrl : string ; 
        imgUrl = "../../../assets/images/facture.jpeg"
    this.getClientId(facture.id_Clt);
    this.date =  this.datepipe.transform(facture.date_Creation, 'dd/MM/YYYY');
    this.factureService.detail(facture.id_Facture.toString()).subscribe((detail: any)=>{
      var factureArr :any = [];
      //** Parsing an XML file unisng  'xml2js' lebraby*/
      const fileReader = new FileReader(); 
      // Convert blob to base64 with onloadend function
      fileReader.onloadend = () =>{
        this.detail = fileReader.result; // data: application/xml in base64
        let data : any; 
        xml2js.parseString(atob(this.detail.substr(28)),(err: any , res : any)=>{
          data =res.Facture;   
        });       
        this.xmldata = data;         
         
        // check type de reglement         
        let typeRegOne : any; 
        if(data.Reglements[0].Reglement[0].code_Type_Reglement_Un[0]=='4')
          typeRegOne ='Espèces';
        else if (data.Reglements[0].Reglement[0].code_Type_Reglement_Un[0]=='1'){
          typeRegOne ='Virement';
        }else if (data.Reglements[0].Reglement[0].code_Type_Reglement_Un[0]=='2'){
          typeRegOne ='Chèque';
        }else if (data.Reglements[0].Reglement[0].code_Type_Reglement_Un[0]=='3'){
                    typeRegOne ='Monétique';
        }
        let typeRegTwo : any ; 
        if (data.Reglements[0].Reglement[1] !== ""){
          if (data.Reglements[0].Reglement[1].code_Type_Reglement_Deux[0]=='4')
          typeRegTwo ='Espèces';
          else if  (data.Reglements[0].Reglement[1].code_Type_Reglement_Deux[0]=='1'){
            typeRegTwo ='Virement';
          }else if  (data.Reglements[0].Reglement[1].code_Type_Reglement_Deux[0]=='2'){
            typeRegTwo ='Chèque';
        }else if  (data.Reglements[0].Reglement[1].code_Type_Reglement_Deux[0]=='3'){
            typeRegTwo ='Monétique';
        }
        }
        let typeRegTree : any ;
        if (data.Reglements[0].Reglement[2] !== ""){
          if (data.Reglements[0].Reglement[2].code_Type_Reglement_Trois[0]=='4')
          typeRegTree ='Espèces';
          else if  (data.Reglements[0].Reglement[2].code_Type_Reglement_Trois[0]=='1'){
            typeRegTree ='Virement';
          }else if  (data.Reglements[0].Reglement[2].code_Type_Reglement_Trois[0]=='2'){
            typeRegTree ='Chèque';
        }else if  (data.Reglements[0].Reglement[2].code_Type_Reglement_Trois[0]=='3'){
            typeRegTree ='Monétique';
        }
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
             factureArr.push(
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
                            
            factureArr.push(
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
          
            factureArr.push(
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
            let pdf_facture = {
              background: [
                {
                  image: await this.getBase64ImageFromURL(imgUrl), width: 600
                }
              ],
              content: [
                { columns : [
                  {
                    text:'Facture n° ' +facture.id_Facture +' | ' +  this.date+'\n\n',
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
                      'Nouvelle Facture '+'\n' 
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
                      'Code Client :' + '\t' + facture.id_Clt + '\n'
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
                        typeRegOne +' : '+ data.Reglements[0].Reglement[0].Value_Reglement_Un[0]  +'\n'
                      ]
                    },{
                      ul : [
                        (typeRegTwo !== undefined)?
                        typeRegTwo +' : '+Number(data.Reglements[0].Reglement[1].Value_Reglement_Deux[0]).toFixed(3)+'\n' : 
                        ''
                        ]
                    },{
                      ul:[
                        (typeRegTree !==  undefined)?
                        typeRegTree +' : '+ Number(data.Reglements[0].Reglement[2].Value_Reglement_Trois[0]).toFixed(3) +'\n' : 
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
                this.generateTable(factureArr, ['Id_Produit', 'Nom_Produit', 'Prix U HT ('+data["Informations-Generales"][0].Devise+')',  'Remise', 'Quantite', 'TVA', 'Total_HT']),
                {
                  text: '\n\n'
                },
                , {
                  columns: [
                    {
                      table: {
                        alignment: 'right',
                        body: [
                          [{ text: 'T.V.A %', alignment: 'left' }, '7%', '13%', '19%'],
                          [{ text: 'Assiette', alignment: 'left' }, data.Taxes[0].TVA[0].TVA7[0].Assiette, data.Taxes[0].TVA[0].TVA13[0].Assiette, data.Taxes[0].TVA[0].TVA19[0].Assiette],
                          [{ text: 'Montant', alignment: 'left' }, data.Taxes[0].TVA[0].TVA7[0].Montant, data.Taxes[0].TVA[0].TVA13[0].Montant, data.Taxes[0].TVA[0].TVA19[0].Montant],
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
                          [{ text: 'Total H.T Brut', alignment: 'left' }, { text: data.Total[0].TotalHTBrut[0] +' '+data["Informations-Generales"][0].Devise, alignment: 'right' }],
                          [{ text: 'Total Remise', alignment: 'left' }, { text: data.Total[0].TotalRemise[0]+' '+data["Informations-Generales"][0].Devise, alignment: 'right' }],
                          [{ text: 'Total H.T Net', alignment: 'left' }, { text: data.Total[0].TotalHTNet[0]+' '+data["Informations-Generales"][0].Devise, alignment: 'right' }],
                          [{ text: 'Total Fodec', alignment: 'left' }, { text: data.Total[0].TotalFodec[0]+' '+data["Informations-Generales"][0].Devise, alignment: 'right' }],
                          [{ text: 'Total T.V.A', alignment: 'left' }, { text: data.Total[0].TotalTVA[0]+' '+data["Informations-Generales"][0].Devise, alignment: 'right' }],
                          [{ text: 'Total T.T.C', alignment: 'left' }, { text: data.Total[0].TotalTTC[0]+' '+data["Informations-Generales"][0].Devise, alignment: 'right' }],
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
                      text: facture.description + '\n\n' 
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
            pdfMake.createPdf(pdf_facture).open();
           },1000)
      }      
      fileReader.readAsDataURL(detail.body);
    });
  }
  
  //** Download a Facture */
  download(facture:any){
    let imgUrl : string ; 
    imgUrl = "../../../assets/images/facture.jpeg"

    this.getClientId(facture.id_Clt);
    this.date =  this.datepipe.transform(facture.date_Creation, 'dd/MM/YYYY');
    this.factureService.detail(facture.id_Facture.toString()).subscribe((detail: any)=>{
      var factureArr :any = [];
      //** Parsing an XML file unisng  'xml2js' lebraby*/
      const fileReader = new FileReader(); 
      // Convert blob to base64 with onloadend function
      fileReader.onloadend = () =>{
        this.detail = fileReader.result; // data: application/xml in base64
        let data : any; 
        xml2js.parseString(atob(this.detail.substr(28)),(err: any , res : any)=>{
          data =res.Facture;   
        });
        this.xmldata = data;
        // check type de reglement               
        let typeRegOne : any; 
        if(data.Reglements[0].Reglement[0].code_Type_Reglement_Un[0]=='4')
          typeRegOne ='Espèces';
        else if (data.Reglements[0].Reglement[0].code_Type_Reglement_Un[0]=='1'){
          typeRegOne ='Virement';
        }else if (data.Reglements[0].Reglement[0].code_Type_Reglement_Un[0]=='2'){
          typeRegOne ='Chèque';
        }else if (data.Reglements[0].Reglement[0].code_Type_Reglement_Un[0]=='3'){
                    typeRegOne ='Monétique';
        }
        let typeRegTwo : any ; 
        if (data.Reglements[0].Reglement[1] !== ""){
          if (data.Reglements[0].Reglement[1].code_Type_Reglement_Deux[0]=='4')
          typeRegTwo ='Espèces';
          else if  (data.Reglements[0].Reglement[1].code_Type_Reglement_Deux[0]=='1'){
            typeRegTwo ='Virement';
          }else if  (data.Reglements[0].Reglement[1].code_Type_Reglement_Deux[0]=='2'){
            typeRegTwo ='Chèque';
        }else if  (data.Reglements[0].Reglement[1].code_Type_Reglement_Deux[0]=='3'){
            typeRegTwo ='Monétique';
        }
        }
        let typeRegTree : any ; 
        if (data.Reglements[0].Reglement[2] !== ""){
          if (data.Reglements[0].Reglement[2].code_Type_Reglement_Trois[0]=='4')
          typeRegTree ='Espèces';
          else if  (data.Reglements[0].Reglement[2].code_Type_Reglement_Trois[0]=='1'){
            typeRegTree ='Virement';
          }else if  (data.Reglements[0].Reglement[2].code_Type_Reglement_Trois[0]=='2'){
            typeRegTree ='Chèque';
        }else if  (data.Reglements[0].Reglement[2].code_Type_Reglement_Trois[0]=='3'){
            typeRegTree ='Monétique';
        }
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
             factureArr.push(
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
                            
            factureArr.push(
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
          
            factureArr.push(
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
            let pdf_facture = {
              background: [
                {
                  image: await this.getBase64ImageFromURL(imgUrl), width: 600
                }
              ],
              content: [
                { columns : [
                  {
                    text:'Facture n° ' +facture.id_Facture +' | ' +  this.date+'\n\n',
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
                      'Nouvelle Facture '+'\n' 
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
                      'Code Client :' + '\t' + facture.id_Clt + '\n'
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
                        typeRegOne +' : '+ data.Reglements[0].Reglement[0].Value_Reglement_Un[0]  +'\n'
                      ]
                    },{
                      ul : [
                        (typeRegTwo !== undefined)?
                        typeRegTwo +' : '+Number(data.Reglements[0].Reglement[1].Value_Reglement_Deux[0]).toFixed(3)+'\n' : 
                        ''
                        ]
                    },{
                      ul:[
                        (typeRegTree !==  undefined)?
                        typeRegTree +' : '+ Number(data.Reglements[0].Reglement[2].Value_Reglement_Trois[0]).toFixed(3) +'\n' : 
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
                this.generateTable(factureArr, ['Id_Produit', 'Nom_Produit', 'Prix U HT ('+data["Informations-Generales"][0].Devise+')',  'Remise', 'Quantite', 'TVA', 'Total_HT']),
                {
                  text: '\n\n'
                },
                , {
                  columns: [
                    {
                      table: {
                        alignment: 'right',
                        body: [
                          [{ text: 'T.V.A %', alignment: 'left' }, '7%', '13%', '19%'],
                          [{ text: 'Assiette', alignment: 'left' }, data.Taxes[0].TVA[0].TVA7[0].Assiette, data.Taxes[0].TVA[0].TVA13[0].Assiette, data.Taxes[0].TVA[0].TVA19[0].Assiette],
                          [{ text: 'Montant', alignment: 'left' }, data.Taxes[0].TVA[0].TVA7[0].Montant, data.Taxes[0].TVA[0].TVA13[0].Montant, data.Taxes[0].TVA[0].TVA19[0].Montant],
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
                          [{ text: 'Total H.T Brut', alignment: 'left' }, { text: data.Total[0].TotalHTBrut[0] +' '+data["Informations-Generales"][0].Devise, alignment: 'right' }],
                          [{ text: 'Total Remise', alignment: 'left' }, { text: data.Total[0].TotalRemise[0]+' '+data["Informations-Generales"][0].Devise, alignment: 'right' }],
                          [{ text: 'Total H.T Net', alignment: 'left' }, { text: data.Total[0].TotalHTNet[0]+' '+data["Informations-Generales"][0].Devise, alignment: 'right' }],
                          [{ text: 'Total Fodec', alignment: 'left' }, { text: data.Total[0].TotalFodec[0]+' '+data["Informations-Generales"][0].Devise, alignment: 'right' }],
                          [{ text: 'Total T.V.A', alignment: 'left' }, { text: data.Total[0].TotalTVA[0]+' '+data["Informations-Generales"][0].Devise, alignment: 'right' }],
                          [{ text: 'Total T.T.C', alignment: 'left' }, { text: data.Total[0].TotalTTC[0]+' '+data["Informations-Generales"][0].Devise, alignment: 'right' }],
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
                      text: facture.description + '\n\n' 
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
            pdfMake.createPdf(pdf_facture).download('Facture_'+facture.id_Facture+'_' +this.date);
          },1000)
      }      
      fileReader.readAsDataURL(detail.body);
    });
  }
  abandonnerFacture(id: any ){
    console.log(id);
    
    Swal.fire({
      title: 'Êtes-vous sûr?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Oui abandonner, -le',
      cancelButtonText: 'Non, garde le'
    }).then((res : any)=>{
      if(res.value){
        let formData : any = new FormData();  
        formData.append('Id',id );
        this.factureService.abandonnerFacture(formData).subscribe((res:any)=>{});
        Swal.fire('Le BL est abandonnée avec succés!',
        '',
          'success'
        ).then(()=>{
          this.getAllFacture();
        })
      } else if (res.dismiss === Swal.DismissReason.cancel) {
        Swal.fire(
          'Annulé',
          '',
          'error'
        )
      }
    });
  }
  ngOnInit(): void {
  }


}
