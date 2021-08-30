import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { BonEntreeService } from '../bon-entree.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import Swal from 'sweetalert2'
import 'sweetalert2/src/sweetalert2.scss'
import { DatePipe } from '@angular/common';
const pdfMake = require("pdfmake/build/pdfmake");
const pdfFonts = require("pdfmake/build/vfs_fonts");
pdfMake.vfs = pdfFonts.pdfMake.vfs;
@Component({
  selector: 'app-lister-bon-entree',
  templateUrl: './lister-bon-entree.component.html',
  styleUrls: ['./lister-bon-entree.component.scss']
})
export class ListerBonEntreeComponent implements OnInit {
  bonEntreeLocals: any = [];
  recherche: string = '';
  champ: any;
  liste_champs_bon_Entree_Local: any;
  bonEntreeLocalDetail: any;
  detail: any;
  xmlexple: any;
  modele_BEL: any;
  modeleSrc: any;
  displayedColumns: string[] = ['modifier', 'id_Bon_Entree_Local', 'type', 'n_Facture', 'date', 'id_Fr', 'depot', 'mode_Paiement', 'ag_Transport', 'charge_Transport', 'autre_Charge_Fixe', 'des', 'supprimer', 'Voir_pdf'];
  @ViewChild(MatPaginator) paginator: any = MatPaginator;
  @ViewChild(MatSort) sort: any = MatSort;
  constructor(public bonEntreeService: BonEntreeService, private http: HttpClient, public datepipe: DatePipe) {
    this.BonEntreeLocals();// Récupérer liste des bonEntreeLocals
    this.chargerModeleBEL();
    this.modelePdfBase64();
    //Récupérer la liste des champs du bon entrée local
    this.bonEntreeService.obtenirListeChampsBonEntreeLocal().subscribe((response: Response) => {
      this.liste_champs_bon_Entree_Local = response;
    });
  }
  ngOnInit(): void {
  }
  //Récuperer tous bonEntreeLocals
  BonEntreeLocals() {
    this.bonEntreeService.BonEntreeLocals().subscribe((data: any) => {
      this.bonEntreeLocals = new MatTableDataSource(data);
      this.bonEntreeLocals.paginator = this.paginator;
      this.bonEntreeLocals.sort = this.sort;
    });
  }
  //Supprimer bon entree local 
  SupprimerBonEntreeLocal(id: any) {
    Swal.fire({
      title: 'Êtes-vous sûr?',

      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Oui, supprimez-le',
      cancelButtonText: 'Non, garde le'
    }).then((result) => {
      if (result.value) {
        this.bonEntreeService.supprimerBonEntreeLocal(id);

        Swal.fire(
          'Bon Entree Local Supprimé avec succés!',
          '',
          'success'
        )
        window.location.reload();
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire(
          'Annulé',
          '',
          'error'
        )
      }
    })

  }
  //Champ selectionné pour le filtre
  onOptionsSelected(value: string) {

    this.champ = value;

  }
  //filtrer Bon Entree Local
  filtrerBonEntreeLocal() {
    if (this.champ == '' || this.recherche == '') {
      this.BonEntreeLocals();
      Swal.fire("Champ vide!")
    }
    else
      this.bonEntreeService.filtrerBonEntreeLocal(this.champ, this.recherche).subscribe((response: Response) => {
        this.bonEntreeLocals = response;
        if (this.bonEntreeLocals == '') {
          Swal.fire("Bon d'entrée local non trouvé!")
          this.BonEntreeLocals();
        }
      });
  }
  //Créer contenu du table pdf
  contenuTable(data: any, columns: any) {
    var body = [];
    body.push(columns);
    data.forEach(function (row: any) {
      var dataRow: any = [];
      columns.forEach(function (column: any) {
        dataRow.push(row[column]);
      })
      body.push(dataRow);
    });
    return body;
  }
  //tables pdf
  table(data: any, columns: any) {
    return {
      table: {
        headerRows: 1,
        body: this.contenuTable(data, columns),
        alignment: "right"
      }, layout: 'headerLineOnly',
    };
  }
  //Voir PDF
  visualiserPDF(ID_Bon: any, ID_Fr: any, Ag_Tr: any, CH_Tr: any, Autre_Ch: any, Date_BEL: any, Descrip: any, Etat: any, Id_Resp: any, Local: any, Mode_Paiement: any, N_Factur: any, Type: any) {
    var tempArr: any = [];
    this.bonEntreeService.DetailBonEntreeLocal(ID_Bon).subscribe((detail: any) => {
      const reader = new FileReader();
      let nom: any = [];
      let xmlexple: any = [];
      let xmlexple2: any = [];
      let xmlexple3: any = [];
      let xmlexple4: any = [];
      let xmlexple5: any = [];
      let xmlexple6: any = [];
      let xmlexple7: any = [];
      let xmlexple8: any = [];
      let xmlexple9: any = [];
      let xmlexple11: any = [];
      let totalBrut: any;
      let totalRemise: any;
      let totalNet: any;
      let totalFodec: any;
      let totalTva: any;
      let totalTTC: any;
      let totalRHT: any;
      let totalRTTC: any;
      let assietteTva19: any;
      let montantTva19: any;
      let assietteTva13: any;
      let montantTva13: any;
      let assietteTva7: any;
      let montantTva7: any;
      let tvaProduit: any = [];
      let remiseProduit: any = [];
      let fodecProduit: any = [];
      let prixuttcProduit: any = [];
      let prixruhtProduit: any = [];
      let chargeProduit: any = [];
      let chPieceProduit: any = [];
      let numero: any = [];
      reader.onloadend = () => {
        this.bonEntreeLocalDetail = reader.result;
        var parseString = require('xml2js').parseString;
        parseString(atob(this.bonEntreeLocalDetail.substr(28)), function (err: any, result: any) {
          totalBrut = result.Bon_Entree_Local.Total[0].TotalHTBrut;
          totalRemise = result.Bon_Entree_Local.Total[0].TotalRemise;
          totalNet = result.Bon_Entree_Local.Total[0].TotalHTNet;
          totalFodec = result.Bon_Entree_Local.Total[0].TotalFodec;
          totalTva = result.Bon_Entree_Local.Total[0].TotalTVA;
          totalTTC = result.Bon_Entree_Local.Total[0].TotalTTC;
          totalRHT = result.Bon_Entree_Local.Total[0].TotalRHT;
          totalRTTC = result.Bon_Entree_Local.Total[0].TotalRTTC;
          assietteTva19 = result.Bon_Entree_Local.Taxes[0].TVA[0].TVA19[0].Assiette;
          montantTva19 = result.Bon_Entree_Local.Taxes[0].TVA[0].TVA19[0].Montant;
          assietteTva13 = result.Bon_Entree_Local.Taxes[0].TVA[0].TVA13[0].Assiette;
          montantTva13 = result.Bon_Entree_Local.Taxes[0].TVA[0].TVA13[0].Montant;
          assietteTva7 = result.Bon_Entree_Local.Taxes[0].TVA[0].TVA7[0].Assiette;
          montantTva7 = result.Bon_Entree_Local.Taxes[0].TVA[0].TVA7[0].Montant;
          if (result.Bon_Entree_Local.Produits[0].Produits_Simples != undefined && result.Bon_Entree_Local.Produits[0].Produits_4Gs != undefined && result.Bon_Entree_Local.Produits[0].Produits_Series != undefined) {
            for (let j = 0; j < result.Bon_Entree_Local.Produits[0].Produits_Simples[0].Produit.length; j++) {
              nom.push(result.Bon_Entree_Local.Produits[0].Produits_Simples[0].Produit[j].Nom.toString());
              xmlexple.push(result.Bon_Entree_Local.Produits[0].Produits_Simples[0].Produit[j].Id.toString());
              xmlexple2.push(result.Bon_Entree_Local.Produits[0].Produits_Simples[0].Produit[j].Ref.toString());
              xmlexple3.push(result.Bon_Entree_Local.Produits[0].Produits_Simples[0].Produit[j].Qte.toString());
              xmlexple8.push(result.Bon_Entree_Local.Produits[0].Produits_Simples[0].Produit[j].Prix_U_HT.toString());
              xmlexple9.push(result.Bon_Entree_Local.Produits[0].Produits_Simples[0].Produit[j].Signaler_Probleme);
              xmlexple11.push(result.Bon_Entree_Local.Produits[0].Produits_Simples[0].Produit[j].Type);
              tvaProduit.push(result.Bon_Entree_Local.Produits[0].Produits_Simples[0].Produit[j].Tva);
              remiseProduit.push(result.Bon_Entree_Local.Produits[0].Produits_Simples[0].Produit[j].Remise);
              fodecProduit.push(result.Bon_Entree_Local.Produits[0].Produits_Simples[0].Produit[j].Fodec);
              prixuttcProduit.push(result.Bon_Entree_Local.Produits[0].Produits_Simples[0].Produit[j].Prix_U_TTC);
              prixruhtProduit.push(result.Bon_Entree_Local.Produits[0].Produits_Simples[0].Produit[j].PrixRevientU);
              chargeProduit.push(result.Bon_Entree_Local.Produits[0].Produits_Simples[0].Produit[j].Charge);
              chPieceProduit.push(result.Bon_Entree_Local.Produits[0].Produits_Simples[0].Produit[j].Ch_Piece);
              tempArr.push(
                {
                  ID: xmlexple,
                  Nom: nom,
                  Ref_FR: xmlexple2,
                  Quantité: xmlexple3,
                  Prix_U_HT: xmlexple8,
                  TVA: tvaProduit,
                  Remise: remiseProduit,
                  Prix_U_TTC: prixuttcProduit,
                }
              );
            }
            for (let j = 0; j < result.Bon_Entree_Local.Produits[0].Produits_4Gs[0].Produit.length; j++) {
              nom.push(result.Bon_Entree_Local.Produits[0].Produits_4Gs[0].Produit[j].Nom.toString());
              xmlexple.push(result.Bon_Entree_Local.Produits[0].Produits_4Gs[0].Produit[j].Id.toString());
              xmlexple2.push(result.Bon_Entree_Local.Produits[0].Produits_4Gs[0].Produit[j].Ref.toString());
              xmlexple3.push(result.Bon_Entree_Local.Produits[0].Produits_4Gs[0].Produit[j].Qte.toString());
              xmlexple8.push((result.Bon_Entree_Local.Produits[0].Produits_4Gs[0].Produit[j].Prix_U_HT).toString());
              xmlexple9.push(result.Bon_Entree_Local.Produits[0].Produits_4Gs[0].Produit[j].Signaler_Probleme);
              xmlexple11.push(result.Bon_Entree_Local.Produits[0].Produits_4Gs[0].Produit[j].Type);
              tvaProduit.push(result.Bon_Entree_Local.Produits[0].Produits_4Gs[0].Produit[j].Tva);
              remiseProduit.push(result.Bon_Entree_Local.Produits[0].Produits_4Gs[0].Produit[j].Remise);
              fodecProduit.push(result.Bon_Entree_Local.Produits[0].Produits_4Gs[0].Produit[j].Fodec);
              prixuttcProduit.push(result.Bon_Entree_Local.Produits[0].Produits_4Gs[0].Produit[j].Prix_U_TTC);
              prixruhtProduit.push(result.Bon_Entree_Local.Produits[0].Produits_4Gs[0].Produit[j].PrixRevientU);
              chargeProduit.push(result.Bon_Entree_Local.Produits[0].Produits_4Gs[0].Produit[j].Charge);
              chPieceProduit.push(result.Bon_Entree_Local.Produits[0].Produits_4Gs[0].Produit[j].Ch_Piece);
              tempArr.push(
                {
                  ID: xmlexple,
                  Nom: nom,
                  Ref_FR: xmlexple2,
                  Quantité: xmlexple3,
                  Prix_U_HT: xmlexple8,
                  TVA: tvaProduit,
                  Remise: remiseProduit,
                  Prix_U_TTC: prixuttcProduit,
                }
              );
              for (let k = 0; k < result.Bon_Entree_Local.Produits[0].Produits_4Gs[0].Produit[j].Produit_4Gs[0].Produit_4G.length; k++) {
                xmlexple5.push(result.Bon_Entree_Local.Produits[0].Produits_4Gs[0].Produit[j].Produit_4Gs[0].Produit_4G[k].E1.toString());
                xmlexple6.push(result.Bon_Entree_Local.Produits[0].Produits_4Gs[0].Produit[j].Produit_4Gs[0].Produit_4G[k].E2.toString());
                xmlexple7.push(result.Bon_Entree_Local.Produits[0].Produits_4Gs[0].Produit[j].Produit_4Gs[0].Produit_4G[k].N_Serie.toString());
              }
            }
            for (let j = 0; j < result.Bon_Entree_Local.Produits[0].Produits_Series[0].Produit.length; j++) {
              nom.push(result.Bon_Entree_Local.Produits[0].Produits_Series[0].Produit[j].Nom.toString());
              xmlexple.push(result.Bon_Entree_Local.Produits[0].Produits_Series[0].Produit[j].Id.toString());
              xmlexple2.push(result.Bon_Entree_Local.Produits[0].Produits_Series[0].Produit[j].Ref.toString());
              xmlexple3.push(result.Bon_Entree_Local.Produits[0].Produits_Series[0].Produit[j].Qte.toString());
              xmlexple8.push(result.Bon_Entree_Local.Produits[0].Produits_Series[0].Produit[j].Prix_U_HT.toString());
              xmlexple9.push(result.Bon_Entree_Local.Produits[0].Produits_Series[0].Produit[j].Signaler_Probleme);
              xmlexple11.push(result.Bon_Entree_Local.Produits[0].Produits_Series[0].Produit[j].Type);
              tvaProduit.push(result.Bon_Entree_Local.Produits[0].Produits_Series[0].Produit[j].Tva);
              remiseProduit.push(result.Bon_Entree_Local.Produits[0].Produits_Series[0].Produit[j].Remise);
              fodecProduit.push(result.Bon_Entree_Local.Produits[0].Produits_Series[0].Produit[j].Fodec);
              prixuttcProduit.push(result.Bon_Entree_Local.Produits[0].Produits_Series[0].Produit[j].Prix_U_TTC);
              prixruhtProduit.push(result.Bon_Entree_Local.Produits[0].Produits_Series[0].Produit[j].PrixRevientU);
              chargeProduit.push(result.Bon_Entree_Local.Produits[0].Produits_Series[0].Produit[j].Charge);
              chPieceProduit.push(result.Bon_Entree_Local.Produits[0].Produits_Series[0].Produit[j].Ch_Piece);
              tempArr.push(
                {
                  ID: xmlexple,
                  Nom: nom,
                  Ref_FR: xmlexple2,
                  Quantité: xmlexple3,
                  Prix_U_HT: xmlexple8,
                  TVA: tvaProduit,
                  Remise: remiseProduit,
                  Prix_U_TTC: prixuttcProduit,
                }
              );
              for (let k = 0; k < result.Bon_Entree_Local.Produits[0].Produits_Series[0].Produit[j].N_Series[0].N_Serie.length; k++) {
                numero.push(result.Bon_Entree_Local.Produits[0].Produits_Series[0].Produit[j].N_Series[0].N_Serie[k].toString());
              }
            }
          }
          else if (result.Bon_Entree_Local.Produits[0].Produits_Simples == undefined && result.Bon_Entree_Local.Produits[0].Produits_4Gs != undefined && result.Bon_Entree_Local.Produits[0].Produits_Series == undefined) {
            for (let j = 0; j < result.Bon_Entree_Local.Produits[0].Produits_4Gs[0].Produit.length; j++) {
              nom.push(result.Bon_Entree_Local.Produits[0].Produits_4Gs[0].Produit[j].Nom.toString());
              xmlexple.push(result.Bon_Entree_Local.Produits[0].Produits_4Gs[0].Produit[j].Id.toString());
              xmlexple2.push(result.Bon_Entree_Local.Produits[0].Produits_4Gs[0].Produit[j].Ref.toString());
              xmlexple3.push(result.Bon_Entree_Local.Produits[0].Produits_4Gs[0].Produit[j].Qte.toString());
              xmlexple5.push(result.Bon_Entree_Local.Produits[0].Produits_4Gs[0].Produit[j].Produit_4Gs[0].Produit_4G[j].E1.toString());
              xmlexple6.push(result.Bon_Entree_Local.Produits[0].Produits_4Gs[0].Produit[j].Produit_4Gs[0].Produit_4G[j].E2.toString());
              xmlexple7.push(result.Bon_Entree_Local.Produits[0].Produits_4Gs[0].Produit[j].Produit_4Gs[0].Produit_4G[j].N_Serie.toString());
              xmlexple8.push(result.Bon_Entree_Local.Produits[0].Produits_4Gs[0].Produit[j].Prix_U_HT.toString());
              xmlexple9.push(result.Bon_Entree_Local.Produits[0].Produits_4Gs[0].Produit[j].Signaler_Probleme);
              xmlexple11.push(result.Bon_Entree_Local.Produits[0].Produits_4Gs[0].Produit[j].Type);
              tvaProduit.push(result.Bon_Entree_Local.Produits[0].Produits_4Gs[0].Produit[j].Tva);
              remiseProduit.push(result.Bon_Entree_Local.Produits[0].Produits_4Gs[0].Produit[j].Remise);
              fodecProduit.push(result.Bon_Entree_Local.Produits[0].Produits_4Gs[0].Produit[j].Fodec);
              prixuttcProduit.push(result.Bon_Entree_Local.Produits[0].Produits_4Gs[0].Produit[j].Prix_U_TTC);
              prixruhtProduit.push(result.Bon_Entree_Local.Produits[0].Produits_4Gs[0].Produit[j].PrixRevientU);
              chargeProduit.push(result.Bon_Entree_Local.Produits[0].Produits_4Gs[0].Produit[j].Charge);
              chPieceProduit.push(result.Bon_Entree_Local.Produits[0].Produits_4Gs[0].Produit[j].Ch_Piece);
              numero = [];
              tempArr.push(
                {
                  ID: xmlexple,
                  Nom: nom,
                  Ref_FR: xmlexple2,
                  Quantité: xmlexple3,
                  Prix_U_HT: xmlexple8,
                  TVA: tvaProduit,
                  Remise: remiseProduit,
                  Prix_U_TTC: prixuttcProduit,
                }
              );
            }
          }
          else if (result.Bon_Entree_Local.Produits[0].Produits_Simples != undefined && result.Bon_Entree_Local.Produits[0].Produits_4Gs == undefined && result.Bon_Entree_Local.Produits[0].Produits_Series == undefined) {
            for (let j = 0; j < result.Bon_Entree_Local.Produits[0].Produits_Simples[0].Produit.length; j++) {
              nom.push(result.Bon_Entree_Local.Produits[0].Produits_Simples[0].Produit[j].Nom.toString());
              xmlexple.push(result.Bon_Entree_Local.Produits[0].Produits_Simples[0].Produit[j].Id.toString());
              xmlexple2.push(result.Bon_Entree_Local.Produits[0].Produits_Simples[0].Produit[j].Ref.toString());
              xmlexple3.push(result.Bon_Entree_Local.Produits[0].Produits_Simples[0].Produit[j].Qte.toString());
              xmlexple5.push(result.Bon_Entree_Local.Produits[0].Produits_Simples[0].Produit[j].N_Series[0].toString());
              xmlexple8.push(result.Bon_Entree_Local.Produits[0].Produits_Simples[0].Produit[j].Prix_U_HT.toString());
              xmlexple9.push(result.Bon_Entree_Local.Produits[0].Produits_Simples[0].Produit[j].Signaler_Probleme);
              xmlexple11 = result.Bon_Entree_Local.Produits[0].Produits_Simples[0].Produit[j].Type;
              tvaProduit.push(result.Bon_Entree_Local.Produits[0].Produits_Simples[0].Produit[j].Tva);
              remiseProduit.push(result.Bon_Entree_Local.Produits[0].Produits_Simples[0].Produit[j].Remise);
              fodecProduit.push(result.Bon_Entree_Local.Produits[0].Produits_Simples[0].Produit[j].Fodec);
              prixuttcProduit.push(result.Bon_Entree_Local.Produits[0].Produits_Simples[0].Produit[j].Prix_U_TTC);
              prixruhtProduit.push(result.Bon_Entree_Local.Produits[0].Produits_Simples[0].Produit[j].PrixRevientU);
              chargeProduit.push(result.Bon_Entree_Local.Produits[0].Produits_Simples[0].Produit[j].Charge);
              chPieceProduit.push(result.Bon_Entree_Local.Produits[0].Produits_Simples[0].Produit[j].Ch_Piece);
              xmlexple7 = [];
              numero = [];
              tempArr.push(
                {
                  ID: xmlexple,
                  Nom: nom,
                  Ref_FR: xmlexple2,
                  Quantité: xmlexple3,
                  Prix_U_HT: xmlexple8,
                  TVA: tvaProduit,
                  Remise: remiseProduit,
                  Prix_U_TTC: prixuttcProduit,
                }
              );
            }
          }
          else if (result.Bon_Entree_Local.Produits[0].Produits_Simples == undefined && result.Bon_Entree_Local.Produits[0].Produits_4Gs == undefined && result.Bon_Entree_Local.Produits[0].Produits_Series != undefined) {
            for (let j = 0; j < result.Bon_Entree_Local.Produits[0].Produits_Series[0].Produit.length; j++) {
              nom.push(result.Bon_Entree_Local.Produits[0].Produits_Series[0].Produit[j].Nom.toString());
              xmlexple.push(result.Bon_Entree_Local.Produits[0].Produits_Series[0].Produit[j].Id.toString());
              xmlexple2.push(result.Bon_Entree_Local.Produits[0].Produits_Series[0].Produit[j].Ref.toString());
              xmlexple3.push(result.Bon_Entree_Local.Produits[0].Produits_Series[0].Produit[j].Qte.toString());
              xmlexple8.push(result.Bon_Entree_Local.Produits[0].Produits_Series[0].Produit[j].Prix_U_HT.toString());
              xmlexple9.push(result.Bon_Entree_Local.Produits[0].Produits_Series[0].Produit[j].Signaler_Probleme);
              xmlexple11.push(result.Bon_Entree_Local.Produits[0].Produits_Series[0].Produit[j].Type);
              tvaProduit.push(result.Bon_Entree_Local.Produits[0].Produits_Series[0].Produit[j].Tva);
              remiseProduit.push(result.Bon_Entree_Local.Produits[0].Produits_Series[0].Produit[j].Remise);
              fodecProduit.push(result.Bon_Entree_Local.Produits[0].Produits_Series[0].Produit[j].Fodec);
              prixuttcProduit.push(result.Bon_Entree_Local.Produits[0].Produits_Series[0].Produit[j].Prix_U_TTC);
              prixruhtProduit.push(result.Bon_Entree_Local.Produits[0].Produits_Series[0].Produit[j].PrixRevientU);
              chargeProduit.push(result.Bon_Entree_Local.Produits[0].Produits_Series[0].Produit[j].Charge);
              chPieceProduit.push(result.Bon_Entree_Local.Produits[0].Produits_Series[0].Produit[j].Ch_Piece);
              xmlexple7 = [];
              tempArr.push(
                {
                  ID: xmlexple,
                  Nom: nom,
                  Ref_FR: xmlexple2,
                  Quantité: xmlexple3,
                  Prix_U_HT: xmlexple8,
                  TVA: tvaProduit,
                  Remise: remiseProduit,
                  Prix_U_TTC: prixuttcProduit,
                }
              );
              for (let k = 0; k < result.Bon_Entree_Local.Produits[0].Produits_Series[0].Produit[j].N_Series[0].N_Serie.length; k++) {
                numero.push(result.Bon_Entree_Local.Produits[0].Produits_Series[0].Produit[j].N_Series[0].N_Serie[k].toString());
              }
            }
          }
          else if (result.Bon_Entree_Local.Produits[0].Produits_Simples != undefined && result.Bon_Entree_Local.Produits[0].Produits_4Gs != undefined && result.Bon_Entree_Local.Produits[0].Produits_Series != undefined) {
            for (let j = 0; j < result.Bon_Entree_Local.Produits[0].Produits_Simples[0].Produit.length; j++) {
              nom.push(result.Bon_Entree_Local.Produits[0].Produits_Simples[0].Produit[j].Nom.toString());
              xmlexple.push(result.Bon_Entree_Local.Produits[0].Produits_Simples[0].Produit[j].Id.toString());
              xmlexple2.push(result.Bon_Entree_Local.Produits[0].Produits_Simples[0].Produit[j].Ref.toString());
              xmlexple3.push(result.Bon_Entree_Local.Produits[0].Produits_Simples[0].Produit[j].Qte.toString());
              xmlexple5.push(result.Bon_Entree_Local.Produits[0].Produits_Simples[0].Produit[j].N_Series[0].toString());
              xmlexple8.push(result.Bon_Entree_Local.Produits[0].Produits_Simples[0].Produit[j].Prix_U_HT.toString());
              xmlexple9.push(result.Bon_Entree_Local.Produits[0].Produits_Simples[0].Produit[j].Signaler_Probleme);
              xmlexple11 = result.Bon_Entree_Local.Produits[0].Produits_Simples[0].Produit[j].Type;
              tvaProduit.push(result.Bon_Entree_Local.Produits[0].Produits_Simples[0].Produit[j].Tva);
              remiseProduit.push(result.Bon_Entree_Local.Produits[0].Produits_Simples[0].Produit[j].Remise);
              fodecProduit.push(result.Bon_Entree_Local.Produits[0].Produits_Simples[0].Produit[j].Fodec);
              prixuttcProduit.push(result.Bon_Entree_Local.Produits[0].Produits_Simples[0].Produit[j].Prix_U_TTC);
              prixruhtProduit.push(result.Bon_Entree_Local.Produits[0].Produits_Simples[0].Produit[j].PrixRevientU);
              chargeProduit.push(result.Bon_Entree_Local.Produits[0].Produits_Simples[0].Produit[j].Charge);
              chPieceProduit.push(result.Bon_Entree_Local.Produits[0].Produits_Simples[0].Produit[j].Ch_Piece);
              xmlexple7 = [];
              numero = [];
              tempArr.push(
                {
                  ID: xmlexple,
                  Nom: nom,
                  Ref_FR: xmlexple2,
                  Quantité: xmlexple3,
                  Prix_U_HT: xmlexple8,
                  TVA: tvaProduit,
                  Remise: remiseProduit,
                  Prix_U_TTC: prixuttcProduit,
                }
              );
            }
            for (let j = 0; j < result.Bon_Entree_Local.Produits[0].Produits_4Gs[0].Produit.length; j++) {
              nom.push(result.Bon_Entree_Local.Produits[0].Produits_4Gs[0].Produit[j].Nom.toString());
              xmlexple.push(result.Bon_Entree_Local.Produits[0].Produits_4Gs[0].Produit[j].Id.toString());
              xmlexple2.push(result.Bon_Entree_Local.Produits[0].Produits_4Gs[0].Produit[j].Ref.toString());
              xmlexple3.push(result.Bon_Entree_Local.Produits[0].Produits_4Gs[0].Produit[j].Qte.toString());
              xmlexple5.push(result.Bon_Entree_Local.Produits[0].Produits_4Gs[0].Produit[j].Produit_4Gs[0].Produit_4G[j].E1.toString());
              xmlexple6.push(result.Bon_Entree_Local.Produits[0].Produits_4Gs[0].Produit[j].Produit_4Gs[0].Produit_4G[j].E2.toString());
              xmlexple7.push(result.Bon_Entree_Local.Produits[0].Produits_4Gs[0].Produit[j].Produit_4Gs[0].Produit_4G[j].N_Serie.toString());
              xmlexple8.push(result.Bon_Entree_Local.Produits[0].Produits_4Gs[0].Produit[j].Prix_U_HT.toString());
              xmlexple9.push(result.Bon_Entree_Local.Produits[0].Produits_4Gs[0].Produit[j].Signaler_Probleme);
              xmlexple11.push(result.Bon_Entree_Local.Produits[0].Produits_4Gs[0].Produit[j].Type);
              tvaProduit.push(result.Bon_Entree_Local.Produits[0].Produits_4Gs[0].Produit[j].Tva);
              remiseProduit.push(result.Bon_Entree_Local.Produits[0].Produits_4Gs[0].Produit[j].Remise);
              fodecProduit.push(result.Bon_Entree_Local.Produits[0].Produits_4Gs[0].Produit[j].Fodec);
              prixuttcProduit.push(result.Bon_Entree_Local.Produits[0].Produits_4Gs[0].Produit[j].Prix_U_TTC);
              prixruhtProduit.push(result.Bon_Entree_Local.Produits[0].Produits_4Gs[0].Produit[j].PrixRevientU);
              chargeProduit.push(result.Bon_Entree_Local.Produits[0].Produits_4Gs[0].Produit[j].Charge);
              chPieceProduit.push(result.Bon_Entree_Local.Produits[0].Produits_4Gs[0].Produit[j].Ch_Piece);
              numero = [];
              tempArr.push(
                {
                  ID: xmlexple,
                  Nom: nom,
                  Ref_FR: xmlexple2,
                  Quantité: xmlexple3,
                  Prix_U_HT: xmlexple8,
                  TVA: tvaProduit,
                  Remise: remiseProduit,
                  Prix_U_TTC: prixuttcProduit,
                }
              );
            }
          }
          else if (result.Bon_Entree_Local.Produits[0].Produits_Simples != undefined && result.Bon_Entree_Local.Produits[0].Produits_4Gs == undefined && result.Bon_Entree_Local.Produits[0].Produits_Series != undefined) {
            for (let j = 0; j < result.Bon_Entree_Local.Produits[0].Produits_Simples[0].Produit.length; j++) {
              nom.push(result.Bon_Entree_Local.Produits[0].Produits_Simples[0].Produit[j].Nom.toString());
              xmlexple.push(result.Bon_Entree_Local.Produits[0].Produits_Simples[0].Produit[j].Id.toString());
              xmlexple2.push(result.Bon_Entree_Local.Produits[0].Produits_Simples[0].Produit[j].Ref.toString());
              xmlexple3.push(result.Bon_Entree_Local.Produits[0].Produits_Simples[0].Produit[j].Qte.toString());
              xmlexple5.push(result.Bon_Entree_Local.Produits[0].Produits_Simples[0].Produit[j].N_Series[0].toString());
              xmlexple8.push(result.Bon_Entree_Local.Produits[0].Produits_Simples[0].Produit[j].Prix_U_HT.toString());
              xmlexple9.push(result.Bon_Entree_Local.Produits[0].Produits_Simples[0].Produit[j].Signaler_Probleme);
              xmlexple11 = result.Bon_Entree_Local.Produits[0].Produits_Simples[0].Produit[j].Type;
              tvaProduit.push(result.Bon_Entree_Local.Produits[0].Produits_Simples[0].Produit[j].Tva);
              remiseProduit.push(result.Bon_Entree_Local.Produits[0].Produits_Simples[0].Produit[j].Remise);
              fodecProduit.push(result.Bon_Entree_Local.Produits[0].Produits_Simples[0].Produit[j].Fodec);
              prixuttcProduit.push(result.Bon_Entree_Local.Produits[0].Produits_Simples[0].Produit[j].Prix_U_TTC);
              prixruhtProduit.push(result.Bon_Entree_Local.Produits[0].Produits_Simples[0].Produit[j].PrixRevientU);
              chargeProduit.push(result.Bon_Entree_Local.Produits[0].Produits_Simples[0].Produit[j].Charge);
              chPieceProduit.push(result.Bon_Entree_Local.Produits[0].Produits_Simples[0].Produit[j].Ch_Piece);
              xmlexple7 = [];
              numero = [];
              tempArr.push(
                {
                  ID: xmlexple,
                  Nom: nom,
                  Ref_FR: xmlexple2,
                  Quantité: xmlexple3,
                  Prix_U_HT: xmlexple8,
                  TVA: tvaProduit,
                  Remise: remiseProduit,
                  Prix_U_TTC: prixuttcProduit,
                }
              );
            }
            for (let j = 0; j < result.Bon_Entree_Local.Produits[0].Produits_Series[0].Produit.length; j++) {
              nom.push(result.Bon_Entree_Local.Produits[0].Produits_Series[0].Produit[j].Nom.toString());
              xmlexple.push(result.Bon_Entree_Local.Produits[0].Produits_Series[0].Produit[j].Id.toString());
              xmlexple2.push(result.Bon_Entree_Local.Produits[0].Produits_Series[0].Produit[j].Ref.toString());
              xmlexple3.push(result.Bon_Entree_Local.Produits[0].Produits_Series[0].Produit[j].Qte.toString());
              xmlexple5.push(result.Bon_Entree_Local.Produits[0].Produits_Series[0].Produit[j].Produit_4Gs[j].toString());
              xmlexple6.push(result.Bon_Entree_Local.Produits[0].Produits_Series[0].Produit[j].Produit_4Gs[j].toString());
              xmlexple8.push(result.Bon_Entree_Local.Produits[0].Produits_Series[0].Produit[j].Prix_U_HT.toString());
              xmlexple9.push(result.Bon_Entree_Local.Produits[0].Produits_Series[0].Produit[j].Signaler_Probleme);
              xmlexple11.push(result.Bon_Entree_Local.Produits[0].Produits_Series[0].Produit[j].Type);
              tvaProduit.push(result.Bon_Entree_Local.Produits[0].Produits_Series[0].Produit[j].Tva);
              remiseProduit.push(result.Bon_Entree_Local.Produits[0].Produits_Series[0].Produit[j].Remise);
              fodecProduit.push(result.Bon_Entree_Local.Produits[0].Produits_Series[0].Produit[j].Fodec);
              prixuttcProduit.push(result.Bon_Entree_Local.Produits[0].Produits_Series[0].Produit[j].Prix_U_TTC);
              prixruhtProduit.push(result.Bon_Entree_Local.Produits[0].Produits_Series[0].Produit[j].PrixRevientU);
              chargeProduit.push(result.Bon_Entree_Local.Produits[0].Produits_Series[0].Produit[j].Charge);
              chPieceProduit.push(result.Bon_Entree_Local.Produits[0].Produits_Series[0].Produit[j].Ch_Piece);
              xmlexple7 = [];
              tempArr.push(
                {
                  ID: xmlexple,
                  Nom: nom,
                  Ref_FR: xmlexple2,
                  Quantité: xmlexple3,
                  Prix_U_HT: xmlexple8,
                  TVA: tvaProduit,
                  Remise: remiseProduit,
                  Prix_U_TTC: prixuttcProduit,
                }
              );
              for (let k = 0; k < result.Bon_Entree_Local.Produits[0].Produits_Series[0].Produit[j].N_Series[0].N_Serie.length; k++) {
                numero.push(result.Bon_Entree_Local.Produits[0].Produits_Series[0].Produit[j].N_Series[0].N_Serie[k].toString());
              }

            }
          }
          else if (result.Bon_Entree_Local.Produits[0].Produits_Simples == undefined && result.Bon_Entree_Local.Produits[0].Produits_4Gs != undefined && result.Bon_Entree_Local.Produits[0].Produits_Series != undefined) {
            for (let j = 0; j < result.Bon_Entree_Local.Produits[0].Produits_4Gs[0].Produit.length; j++) {
              nom.push(result.Bon_Entree_Local.Produits[0].Produits_4Gs[0].Produit[j].Nom.toString());
              xmlexple.push(result.Bon_Entree_Local.Produits[0].Produits_4Gs[0].Produit[j].Id.toString());
              xmlexple2.push(result.Bon_Entree_Local.Produits[0].Produits_4Gs[0].Produit[j].Ref.toString());
              xmlexple3.push(result.Bon_Entree_Local.Produits[0].Produits_4Gs[0].Produit[j].Qte.toString());
              xmlexple5.push(result.Bon_Entree_Local.Produits[0].Produits_4Gs[0].Produit[j].Produit_4Gs[0].Produit_4G[j].E1.toString());
              xmlexple6.push(result.Bon_Entree_Local.Produits[0].Produits_4Gs[0].Produit[j].Produit_4Gs[0].Produit_4G[j].E2.toString());
              xmlexple8.push(result.Bon_Entree_Local.Produits[0].Produits_4Gs[0].Produit[j].Prix_U_HT.toString());
              xmlexple9.push(result.Bon_Entree_Local.Produits[0].Produits_4Gs[0].Produit[j].Signaler_Probleme);
              xmlexple11.push(result.Bon_Entree_Local.Produits[0].Produits_4Gs[0].Produit[j].Type);
              tvaProduit.push(result.Bon_Entree_Local.Produits[0].Produits_4Gs[0].Produit[j].Tva);
              remiseProduit.push(result.Bon_Entree_Local.Produits[0].Produits_4Gs[0].Produit[j].Remise);
              fodecProduit.push(result.Bon_Entree_Local.Produits[0].Produits_4Gs[0].Produit[j].Fodec);
              prixuttcProduit.push(result.Bon_Entree_Local.Produits[0].Produits_4Gs[0].Produit[j].Prix_U_TTC);
              prixruhtProduit.push(result.Bon_Entree_Local.Produits[0].Produits_4Gs[0].Produit[j].PrixRevientU);
              chargeProduit.push(result.Bon_Entree_Local.Produits[0].Produits_4Gs[0].Produit[j].Charge);
              chPieceProduit.push(result.Bon_Entree_Local.Produits[0].Produits_4Gs[0].Produit[j].Ch_Piece);
              tempArr.push(
                {
                  ID: xmlexple,
                  Nom: nom,
                  Ref_FR: xmlexple2,
                  Quantité: xmlexple3,
                  Prix_U_HT: xmlexple8,
                  TVA: tvaProduit,
                  Remise: remiseProduit,
                  Prix_U_TTC: prixuttcProduit,
                }
              );
              for (let k = 0; k < result.Bon_Entree_Local.Produits[0].Produits_4Gs[0].Produit[j].Qte; k++) {
                xmlexple7.push(result.Bon_Entree_Local.Produits[0].Produits_4Gs[0].Produit[j].Produit_4Gs[j].Produit_4G[k].N_Serie.toString());
                numero = [];
              }
            }
            for (let j = 0; j < result.Bon_Entree_Local.Produits[0].Produits_Series[0].Produit.length; j++) {
              nom.push(result.Bon_Entree_Local.Produits[0].Produits_Series[0].Produit[j].Nom.toString());
              xmlexple.push(result.Bon_Entree_Local.Produits[0].Produits_Series[0].Produit[j].Id.toString());
              xmlexple2.push(result.Bon_Entree_Local.Produits[0].Produits_Series[0].Produit[j].Ref.toString());
              xmlexple3.push(result.Bon_Entree_Local.Produits[0].Produits_Series[0].Produit[j].Qte.toString());
              xmlexple5.push(result.Bon_Entree_Local.Produits[0].Produits_Series[0].Produit[j].Produit_4Gs[j].toString());
              xmlexple6.push(result.Bon_Entree_Local.Produits[0].Produits_Series[0].Produit[j].Produit_4Gs[j].toString());
              xmlexple8.push((result.Bon_Entree_Local.Produits[0].Produits_Series[0].Produit[j].Prix_U_HT.toString()));
              xmlexple9.push(result.Bon_Entree_Local.Produits[0].Produits_Series[0].Produit[j].Signaler_Probleme);
              xmlexple11.push(result.Bon_Entree_Local.Produits[0].Produits_Series[0].Produit[j].Type);
              tvaProduit.push(result.Bon_Entree_Local.Produits[0].Produits_Series[0].Produit[j].Tva);
              remiseProduit.push(result.Bon_Entree_Local.Produits[0].Produits_Series[0].Produit[j].Remise);
              fodecProduit.push(result.Bon_Entree_Local.Produits[0].Produits_Series[0].Produit[j].Fodec);
              prixuttcProduit.push(result.Bon_Entree_Local.Produits[0].Produits_Series[0].Produit[j].Prix_U_TTC);
              prixruhtProduit.push(result.Bon_Entree_Local.Produits[0].Produits_Series[0].Produit[j].PrixRevientU);
              chargeProduit.push(result.Bon_Entree_Local.Produits[0].Produits_Series[0].Produit[j].Charge);
              chPieceProduit.push(result.Bon_Entree_Local.Produits[0].Produits_Series[0].Produit[j].Ch_Piece);
              tempArr.push(
                {
                  ID: xmlexple,
                  Nom: nom,
                  Ref_FR: xmlexple2,
                  Quantité: xmlexple3,
                  Prix_U_HT: xmlexple8,
                  TVA: tvaProduit,
                  Remise: remiseProduit,
                  Prix_U_TTC: prixuttcProduit,
                }
              );
              numero = [];
              for (let k = 0; k < result.Bon_Entree_Local.Produits[0].Produits_Series[0].Produit[j].N_Series[0].N_Serie.length; k++) {
                numero.push(result.Bon_Entree_Local.Produits[0].Produits_Series[0].Produit[j].N_Series[0].N_Serie[k].toString());
              }
            }
          }
          else {
          }
        })
        var dd = {
          background: [
            {
              image: 'data:image/jpeg;base64,' + this.modeleSrc, width: 600
            }
          ],
          content: [
            {
              text: 'Informations Générales :' + '\n\n',
              fontSize: 15,
              alignment: 'left',
              color: 'black',
              bold: true
            },
            {
              columns: [
                {
                  text: 'Id Bon Entrée Local :' + '\t' + ID_Bon + '\n\n' + 'Id Fournisseur :' + '\t' + ID_Fr + '\n\n'
                    + 'Agence Transport :' + '\t' + Ag_Tr + '\n\n' + 'Charge TTC Transport :' + '\t' + CH_Tr + '\n\n'
                    + 'Autre Charge Fixe :' + '\t' + Autre_Ch + '\n\n'
                  ,
                  fontSize: 10,
                  alignment: 'left',
                  color: 'black'
                },
                {
                  text: 'Type :' + '\t' + Type + '\n\n' + 'Local :' + '\t' + Local + '\n\n'
                    + 'Date :' + '\t' + this.datepipe.transform(Date_BEL, 'dd/MM/yyyy') + '\n\n' + 'Mode Paiement :' + '\t' + Mode_Paiement + '\n\n'
                  ,
                  fontSize: 10,
                  alignment: 'left',
                  color: 'black'
                },
              ]
            },
            {
              text: 'Note :' + '\t' + Descrip
              ,
              fontSize: 10,
              alignment: 'left',
              color: 'black'
            }
            ,
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
            this.table(tempArr, ['ID', 'Nom', 'Ref_FR', 'Quantité', 'Prix_U_HT', 'TVA', 'Remise', 'Prix_U_TTC']),
            {
              text: '\n\n\n'
            },
            , {
              columns: [
                {
                  table: {
                    alignment: 'right',
                    body: [
                      [{ text: 'T.V.A', alignment: 'left' }, 19, 7, 13],
                      [{ text: 'Assiette', alignment: 'left' }, assietteTva19, assietteTva7, assietteTva13],
                      [{ text: 'Montant', alignment: 'left' }, montantTva19, montantTva7, montantTva13],
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
                      [{ text: 'Total H.T Brut', alignment: 'left' }, { text: totalBrut, alignment: 'right' }],
                      [{ text: 'Total Remise', alignment: 'left' }, { text: totalRemise, alignment: 'right' }],
                      [{ text: 'Total H.T Net', alignment: 'left' }, { text: totalNet, alignment: 'right' }],
                      [{ text: 'Total Fodec', alignment: 'left' }, { text: totalFodec, alignment: 'right' }],
                      [{ text: 'Total T.V.A', alignment: 'left' }, { text: totalTva, alignment: 'right' }],
                      [{ text: 'Total T.T.C', alignment: 'left' }, { text: totalTTC, alignment: 'right' }],
                      [{ text: 'Total R.H.T ', alignment: 'left' }, { text: totalRHT, alignment: 'right' }],
                      [{ text: 'Total R.T.T.C ', alignment: 'left' }, { text: totalRTTC, alignment: 'right' }],
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
        pdfMake.createPdf(dd).open();
      }
      reader.readAsDataURL(detail);
    });
  }
  //temps de charger l'image du pdf
  delai(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  //definir modele pour pdf 
  async modelePdfBase64() {
    await this.delai(3000);
    const reader = new FileReader();
    reader.onloadend = () => {
      this.modeleSrc = reader.result;
      this.modeleSrc = btoa(this.modeleSrc);
      this.modeleSrc = atob(this.modeleSrc);
      this.modeleSrc = this.modeleSrc.replace(/^data:image\/[a-z]+;base64,/, "");
    }
    reader.readAsDataURL(this.modele_BEL);
  }
  //charger l'image du pdf
  async chargerModeleBEL() {
    this.http.get('.././assets/images/template_BEL.jpg', { responseType: 'blob' }).subscribe((resp: any) => {
      this.modele_BEL = resp;
      return this.modele_BEL;
    }, err => console.error(err),
      () => console.log())
  }
}
