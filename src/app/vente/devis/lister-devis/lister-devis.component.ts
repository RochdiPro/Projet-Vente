import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import Swal from 'sweetalert2';
// XML to JavaScript object converter.
import * as xml2js from 'xml2js';
import { DevisService } from '../../services/devis.service';
const pdfMake = require("pdfmake/build/pdfmake");



@Component({
  selector: 'app-lister-devis',
  templateUrl: './lister-devis.component.html',
  styleUrls: ['./lister-devis.component.scss']
})
export class ListerDevisComponent implements OnInit {

  detail: any;
  xmldata : any
  champ : string; 
  value: string; 
  keyValues: any = []; 
  dataSourceDevis : any = [];
  loading : boolean = true; 
  date : any;  
  clt : any;

  columns : any = ['ID', 'Nom', 'Prix_U', 'Remise', 'Quantité', 'TVA', 'Total_HT'];
  displayedColumns: string[] = ['modifier','id_Devis', 'type', 'date_Creation',  'total_ttc', 'supprimer', 'exporter_pdf','Voir_pdf'];
  @ViewChild(MatPaginator) paginator: any = MatPaginator;
  @ViewChild(MatSort) sort: any = MatSort;

  constructor(private devisService : DevisService,public datepipe: DatePipe) {
        //** INIT */
        this.getAllDeviss();
        this.getKeyWordQuote(); 
   }
  //** Get All Quote (Deviss) */
  async getAllDeviss(){
    this.loading = true; 
    let devis_en_cours : any =[]; 
    this.devisService.getAllDevis().subscribe((res: any)=>{
      
      let data : any =[]
      data = res ; 
      data.map((ele: any)=>{ 
        if (ele.etat ==='En cours')
         devis_en_cours.unshift(ele)
      });  
      devis_en_cours = devis_en_cours.sort((a:any , b : any )=> b.id_Devis -a.id_Devis);
    this.dataSourceDevis= new MatTableDataSource(devis_en_cours);       
    this.dataSourceDevis.sort = this.sort; 
    this.dataSourceDevis.paginator = this.paginator;
    this.loading = false; 
    });
    
  }
  //** Lister les champ Devis */
  getKeyWordQuote(){
    this.devisService.getListKeyWord().subscribe((res:any)=>this.keyValues = res);
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
    this.dataSourceDevis =[]
    this.devisService.filterByChampValeur(this.champ, this.value).subscribe((data : any)=>{
      this.dataSourceDevis= new MatTableDataSource(data.body);    
      this.dataSourceDevis.sort = this.sort; 
      this.dataSourceDevis.paginator = this.paginator;
    });
  }

  //** Delete Devis */
  deleteDevis(id: any){
    Swal.fire({
      title: 'Êtes-vous sûr?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Oui, supprimez-le',
      cancelButtonText: 'Non, garde le'
    }).then((res : any)=>{
      if(res.value){
        this.devisService.deleteDevis(id).subscribe((res: any)=>{});
        Swal.fire('Le Devis est suprimé avec succés!',
        '',
          'success'
        ).then(()=>{
          this.getAllDeviss();
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
    this.devisService.getClientById(id.toString()).subscribe(res => {
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
        // check if this "Devis" is Proforma or "simple/estimatif"
        let imgUrl : string ; 
        if( devis.type === 'Estimatif'){
          imgUrl= "../../../assets/images/template_Devis.jpg"
        }else{
          imgUrl = "../../../assets/images/template-proforma.jpg"
        }
    this.getClientId(devis.id_Clt);
    this.date =  this.datepipe.transform(devis.date_Creation, 'dd/MM/YYYY');
    this.devisService.detail(devis.id_Devis.toString()).subscribe((detail: any)=>{
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
        if (data.Reglements[0].Reglement[1] !== undefined){
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
        if (data.Reglements[0].Reglement[2] !== undefined){
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
            let pdf_devis = {
              background: [
                {
                  image: await this.getBase64ImageFromURL(imgUrl), width: 600
                }
              ],
              content: [
                { columns : [
                  {
                    text:'Devis n° ' +devis.id_Devis +' | ' +  this.date+'\n\n',
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
                      'Type Devis :'+ '\t' + devis.type+ '\n' 
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
                      'Code Client :' + '\t' + devis.id_Clt + '\n'
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
                this.generateTable(devisArr, ['Id_Produit', 'Nom_Produit', 'Prix U HT ('+data["Informations-Generales"][0].Devise+')',  'Remise', 'Quantite', 'TVA', 'Total_HT']),
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
                      text: devis.description + '\n\n' 
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
      fileReader.readAsDataURL(detail.body);
    });
  }
  
  //** Download a Quote (devis) */
  download(devis:any){
            // check if this "Devis" is Proforma or "simple/estimatif"
   let imgUrl : string ; 
     if( devis.type === 'Estimatif'){
        imgUrl= "../../../assets/images/template_Devis.jpg"
    }else{
        imgUrl = "../../../assets/images/template-proforma.jpg"
    }
    this.getClientId(devis.id_Clt);
    this.date =  this.datepipe.transform(devis.date_Creation, 'dd/MM/YYYY');
    this.devisService.detail(devis.id_Devis.toString()).subscribe((detail: any)=>{
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
        if (data.Reglements[0].Reglement[1] !== undefined){
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
        if (data.Reglements[0].Reglement[2] !== undefined){
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
            let pdf_devis = {
              background: [
                {
                  image: await this.getBase64ImageFromURL(imgUrl), width: 600
                }
              ],
              content: [
                { columns : [
                  {
                    text:'Devis n° ' +devis.id_Devis +' | ' +  this.date+'\n\n',
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
                      'Type Devis :'+ '\t' + devis.type+ '\n' 
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
                      'Code Client :' + '\t' + devis.id_Clt + '\n'
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
                this.generateTable(devisArr, ['Id_Produit', 'Nom_Produit', 'Prix U HT ('+data["Informations-Generales"][0].Devise+')',  'Remise', 'Quantite', 'TVA', 'Total_HT']),
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
                      text: devis.description + '\n\n' 
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
            pdfMake.createPdf(pdf_devis).download('Devis_'+devis.id_Devis+'_' +this.date);
          },1000)
      }      
      fileReader.readAsDataURL(detail.body);
    });
  }

  ngOnInit(): void {
  }

}
