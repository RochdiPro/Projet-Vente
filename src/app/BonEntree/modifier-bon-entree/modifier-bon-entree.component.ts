import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2'
import 'sweetalert2/src/sweetalert2.scss'
import { BonEntreeService } from '../bon-entree.service';
import { interval } from 'rxjs';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
@Component({
  selector: 'app-modifier-bon-entree',
  templateUrl: './modifier-bon-entree.component.html',
  styleUrls: ['./modifier-bon-entree.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class ModifierBonEntreeComponent implements OnInit {
  isLinearBE = true;
  InformationsGeneralesForm: any = FormGroup;
  ChargeForm: any = FormGroup;
  ListeArticleForm: any = FormGroup;
  locals: any = [];
  fournisseurs: any = [];
  produits: any = [];
  Id_Produit: any;
  Ref_FR: any;
  Quantite: any;
  Prix: any;
  IdProduit: any
  produitData: any;
  Montant_TVA: any;
  prix: any;
  ref_FR: any;
  quantite: any;
  id_produit: any;
  Tva: any;
  tva: any;
  Fodec: any;
  fodec: any;
  Prix_HT: any;
  prixht: any;
  Totale_TTC: any;
  Totale_HT: any;
  bonEntreeLocals: any = [];
  categorie_paiement: any;
  fieldArray: Array<any> = [];
  newAttribute: any = {};
  newAttribute1: any = {};
  totalMontantTVA: any = 0;
  totalHT: any = 0;
  totalRemise: any = 0;
  totalTTc: any = 0;
  totalHTNet: any = 0;
  Ch_Globale: any = 0;
  ChargeTransport: any = 0;
  Autre_Charge_Fixe: any = 0;
  Totale_Facture: any;
  N_Facture: any;
  Ch: any;
  totalChGlobale: any = 0;
  PrixRevientU: any;
  bonEntreeLocalData: any;
  bELID: any;
  nomFR: any;
  fournisseurData: any;
  bonEntreeLocalDetail: any;
  tableCharge: any = [];
  t: any = [];
  t2: any = [];
  x: any;
  t3: any = []
  t4: any = []
  t5: any = []
  t6: any = []
  t7: any = []
  t8: any = []
  t9: any = []
  t10: any = []
  t11: any = []
  t888: any = []
  tabletva: any = []
  tableremise: any = []
  tablefodec: any = []
  tableprixuttc: any = []
  tableprixruht: any = []
  tablech: any = []
  tablenumero: any = [];
  tablenumero2: any = [];
  tablech_piece: any = []
  totalFodec: any = 0;
  totalRHT: any = 0;
  totalRTTC: any = 0;
  index: any = 0;
  newfile: any;
  data3: any;
  data4: any;
  totalHTBrut: any = 0;
  totalMontantFodec: any = 0;
  totalPorcentageFodec: any = 0;
  totalPourcentCh: any;
  date: Date;
  listeArticles: any = [];
  element: any = {};
  articles: any = [];
  articlesNonModif: any = [];
  displayedColumns: string[] = ['id', 'ref_fr', 'qte', 'prix_u_ht', 'tva', 'remise', 'fodec', 'prix_U_TTC', 'prix_R_U_HT', 'charge', 'ch_piece', 'action'];
  Columns: string[] = ['numero'];
  Columns2: string[] = ['n_serie', 'e1', 'e2'];
  fournisseur: any;
  fichierEtat: any;
  assiettetva19 = 0;
  Montanttva19 = 0;
  assiettetva7 = 0;
  Montanttva7 = 0;
  assiettetva13 = 0;
  Montanttva13 = 0;
  listeProduits: any;
  articleSimples: any = "";
  articleSeries: any = "";
  article4Gs: any = "";
  FichierSimple: any = "";
  FichierSerie: any = "";
  Fichier4G: any = "";
  assiette19: any = 0;
  assiette7: any = 0;
  assiette13: any = 0;
  Montant19: any = 0;
  Montant7: any = 0;
  Montant13: any = 0;
  numeroSerie: any = 0;
  idArticle: any;
  articlesSeries: any;
  test: any = [];
  table4g: any = [];
  nouveau: any;
  tableserie: any;
  tablee1: any;
  tablee2: any;
  parts2: any;
  e1: any = [];
  e2: any = [];
  numero: any;
  n_serie: any = "";
  n_serie4g: any = [];
  Produits4G: any = "";
  ProduitsSerie: any = "";
  ProduitsSimple: any = "";
  nom: any = [];
  expandedElement: any | null;
  @ViewChild(MatPaginator) paginator: any = MatPaginator;
  @ViewChild(MatSort) sort: any = MatSort;
  constructor(public bonEntreeService: BonEntreeService, private route: ActivatedRoute, private router: Router, private http: HttpClient, private fb: FormBuilder, public dialog: MatDialog) {
    //activer le calcul des totaux
    this.activerCalcul();
    //recuperer la liste des categories de donneés
    this.bonEntreeService.obtenirCategoriePaiement().subscribe((response: Response) => {
      this.categorie_paiement = response;
    });
    //recuperer bon d'entrée local par id
    this.bEL();
    this.bonEntreeService.DetailBonEntreeLocal(this.route.snapshot.params.id).subscribe((detail: any) => {
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
              for (let k = 0; k < result.Bon_Entree_Local.Produits[0].Produits_4Gs[0].Produit[j].Produit_4Gs[0].Produit_4G.length; k++) {
                xmlexple5.push(result.Bon_Entree_Local.Produits[0].Produits_4Gs[0].Produit[j].Produit_4Gs[0].Produit_4G[k].E1.toString());
                xmlexple6.push(result.Bon_Entree_Local.Produits[0].Produits_4Gs[0].Produit[j].Produit_4Gs[0].Produit_4G[k].E2.toString());
                xmlexple7.push(result.Bon_Entree_Local.Produits[0].Produits_4Gs[0].Produit[j].Produit_4Gs[0].Produit_4G[k].N_Serie.toString());
              }
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
              xmlexple11.push(result.Bon_Entree_Local.Produits[0].Produits_Simples[0].Produit[j].Type);
              tvaProduit.push(result.Bon_Entree_Local.Produits[0].Produits_Simples[0].Produit[j].Tva);
              remiseProduit.push(result.Bon_Entree_Local.Produits[0].Produits_Simples[0].Produit[j].Remise);
              fodecProduit.push(result.Bon_Entree_Local.Produits[0].Produits_Simples[0].Produit[j].Fodec);
              prixuttcProduit.push(result.Bon_Entree_Local.Produits[0].Produits_Simples[0].Produit[j].Prix_U_TTC);
              prixruhtProduit.push(result.Bon_Entree_Local.Produits[0].Produits_Simples[0].Produit[j].PrixRevientU);
              chargeProduit.push(result.Bon_Entree_Local.Produits[0].Produits_Simples[0].Produit[j].Charge);
              chPieceProduit.push(result.Bon_Entree_Local.Produits[0].Produits_Simples[0].Produit[j].Ch_Piece);
              xmlexple7 = [];
              numero = [];
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
              for (let k = 0; k < result.Bon_Entree_Local.Produits[0].Produits_Series[0].Produit[j].N_Series[0].N_Serie.length; k++) {
                numero.push(result.Bon_Entree_Local.Produits[0].Produits_Series[0].Produit[j].N_Series[0].N_Serie[k].toString());
              }
            }
          }
          else if (result.Bon_Entree_Local.Produits[0].Produits_Simples != undefined && result.Bon_Entree_Local.Produits[0].Produits_4Gs != undefined && result.Bon_Entree_Local.Produits[0].Produits_Series == undefined) {
            for (let j = 0; j < result.Bon_Entree_Local.Produits[0].Produits_Simples[0].Produit.length; j++) {
              nom.push(result.Bon_Entree_Local.Produits[0].Produits_Simples[0].Produit[j].Nom.toString());
              xmlexple.push(result.Bon_Entree_Local.Produits[0].Produits_Simples[0].Produit[j].Id.toString());
              xmlexple2.push(result.Bon_Entree_Local.Produits[0].Produits_Simples[0].Produit[j].Ref.toString());
              xmlexple3.push(result.Bon_Entree_Local.Produits[0].Produits_Simples[0].Produit[j].Qte.toString());
              xmlexple5.push(result.Bon_Entree_Local.Produits[0].Produits_Simples[0].Produit[j].N_Series[0].toString());
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
              xmlexple7 = [];
              numero = [];
            }
            for (let j = 0; j < result.Bon_Entree_Local.Produits[0].Produits_4Gs[0].Produit.length; j++) {
              nom.push(result.Bon_Entree_Local.Produits[0].Produits_4Gs[0].Produit[j].Nom.toString());
              xmlexple.push(result.Bon_Entree_Local.Produits[0].Produits_4Gs[0].Produit[j].Id.toString());
              xmlexple2.push(result.Bon_Entree_Local.Produits[0].Produits_4Gs[0].Produit[j].Ref.toString());
              xmlexple3.push(result.Bon_Entree_Local.Produits[0].Produits_4Gs[0].Produit[j].Qte.toString());
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
              xmlexple11.push(result.Bon_Entree_Local.Produits[0].Produits_Simples[0].Produit[j].Type);
              tvaProduit.push(result.Bon_Entree_Local.Produits[0].Produits_Simples[0].Produit[j].Tva);
              remiseProduit.push(result.Bon_Entree_Local.Produits[0].Produits_Simples[0].Produit[j].Remise);
              fodecProduit.push(result.Bon_Entree_Local.Produits[0].Produits_Simples[0].Produit[j].Fodec);
              prixuttcProduit.push(result.Bon_Entree_Local.Produits[0].Produits_Simples[0].Produit[j].Prix_U_TTC);
              prixruhtProduit.push(result.Bon_Entree_Local.Produits[0].Produits_Simples[0].Produit[j].PrixRevientU);
              chargeProduit.push(result.Bon_Entree_Local.Produits[0].Produits_Simples[0].Produit[j].Charge);
              chPieceProduit.push(result.Bon_Entree_Local.Produits[0].Produits_Simples[0].Produit[j].Ch_Piece);
              xmlexple7 = [];
              numero = [];
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
              xmlexple7 = [];
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
              numero = [];
              for (let k = 0; k < result.Bon_Entree_Local.Produits[0].Produits_Series[0].Produit[j].N_Series[0].N_Serie.length; k++) {
                numero.push(result.Bon_Entree_Local.Produits[0].Produits_Series[0].Produit[j].N_Series[0].N_Serie[k].toString());
              }
            }
          }
          else {
          }
        })
        this.tableCharge.push(xmlexple)
        this.nom = nom;
        this.t = xmlexple;
        this.t2 = xmlexple2;
        this.t3 = xmlexple3;
        this.t4 = xmlexple4;
        this.t5 = xmlexple5;
        this.t6 = xmlexple6;
        this.t7 = xmlexple7;
        this.t888 = xmlexple8;
        this.t9 = xmlexple9;
        this.t11 = xmlexple11;
        this.tablenumero = numero;
        this.tabletva = tvaProduit;
        this.tableremise = remiseProduit;
        this.tablefodec = fodecProduit;
        this.tableprixuttc = prixuttcProduit;
        this.tableprixruht = prixruhtProduit;
        this.tablech = chargeProduit;
        this.tablech_piece = chPieceProduit;
        var jsonArr = [];
        var jsonArr2 = [];
        for (var i = 0; i < this.t.length; i++) {
          jsonArr.push({
            id: this.t[i],
            ref_fr: this.t2[i],
            qte: this.t3[i],
            prix_u_ht: this.t888[i],
            tva: this.tabletva[i],
            remise: this.tableremise[i],
            fodec: this.tablefodec[i],
            prixuttc: this.tableprixuttc[i],
            prixruht: this.tableprixruht[i],
            charge: this.tablech[i],
            ch_piece: this.tablech_piece[i],
            n_serie: this.t7[i],
            numero: this.tablenumero[i],
            e1: this.t5[i],
            e2: this.t6[i],
            type: this.t11[i].toString(),
            Signaler_Probleme: this.t9[i],
            Produits4g: "",
            Produitsserie: "",
            nom: this.nom[i]
          });
          jsonArr2.push({
            id: this.t[i],
            ref_fr: this.t2[i],
            qte: this.t3[i],
            prix_u_ht: this.t888[i],
            tva: this.tabletva[i],
            remise: this.tableremise[i],
            fodec: this.tablefodec[i],
            prixuttc: this.tableprixuttc[i],
            prixruht: this.tableprixruht[i],
            charge: this.tablech[i],
            ch_piece: this.tablech_piece[i],
            numero: this.tablenumero[i],
            n_serie: this.t7[i],
            e1: this.t5[i],
            e2: this.t6[i],
            type: this.t11[i].toString(),
            Signaler_Probleme: this.t9[i],
            Produits4g: "",
            Produitsserie: "",
            nom: this.nom[i]
          });
        }
        this.articles = new MatTableDataSource(jsonArr);
        let data: any = "";
        this.articlesNonModif = new MatTableDataSource(jsonArr2);
        for (let k = 0; k < this.articles.data.length; k++) {
          if (this.articles.data[k].type == 'Simple') {
            this.articleSimples += "<Produit>" + "<Id>" + this.articles.data[k].id + "</Id>"
              + "<Nom>" + this.articles.data[k].nom + "</Nom>"
              + "<Signaler_Probleme>" + this.articles.data[k].Signaler_Probleme + "</Signaler_Probleme>"
              + "<Ref>" + this.articles.data[k].ref_fr + "</Ref>"
              + "<Qte>" + this.articles.data[k].qte + "</Qte>"
              + "<Prix_U_HT>" + this.articles.data[k].prix_u_ht + "</Prix_U_HT>"
              + "<Tva>" + this.articles.data[k].tva + "</Tva>"
              + "<Remise>" + this.articles.data[k].remise + "</Remise>"
              + "<Fodec>" + this.articles.data[k].fodec + "</Fodec>"
              + "<Prix_U_TTC>" + this.articles.data[k].prixuttc + "</Prix_U_TTC>"
              + "<PrixRevientU>" + this.articles.data[k].prixruht + "</PrixRevientU>"
              + "<Charge>" + this.articles.data[k].charge + "</Charge>"
              + "<Ch_Piece>" + this.articles.data[k].ch_piece + "</Ch_Piece>"
              + "<Type>" + this.articles.data[k].type + "</Type>"
              + "<N_Series>" + "</N_Series>" + "<Produit_4Gs>" + "</Produit_4Gs>" + "</Produit>"
          }
          else if (this.articles.data[k].type == 'Serie') {
            this.tablenumero2=this.tablenumero
            for (let z = 0; z < this.articles.data[k].qte; z++) {
              this.n_serie += "<N_Serie>" + this.tablenumero[z] + "</N_Serie>"
            }
            this.articleSeries = "<Produit>" + "<Id>" + this.articles.data[k].id + "</Id>"
              + "<Nom>" + this.articles.data[k].nom + "</Nom>"
              + "<Signaler_Probleme>" + this.articles.data[k].Signaler_Probleme + "</Signaler_Probleme>"
              + "<Ref>" + this.articles.data[k].ref_fr + "</Ref>"
              + "<Qte>" + this.articles.data[k].qte + "</Qte>"
              + "<Prix_U_HT>" + this.articles.data[k].prix_u_ht + "</Prix_U_HT>"
              + "<Tva>" + this.articles.data[k].tva + "</Tva>"
              + "<Remise>" + this.articles.data[k].remise + "</Remise>"
              + "<Fodec>" + this.articles.data[k].fodec + "</Fodec>"
              + "<Prix_U_TTC>" + this.articles.data[k].prixuttc + "</Prix_U_TTC>"
              + "<PrixRevientU>" + this.articles.data[k].prixruht + "</PrixRevientU>"
              + "<Charge>" + this.articles.data[k].charge + "</Charge>"
              + "<Ch_Piece>" + this.articles.data[k].ch_piece + "</Ch_Piece>"
              + "<Type>" + this.articles.data[k].type + "</Type>"
              + "<N_Series>" + this.n_serie + "</N_Series>" + "<Produit_4Gs>" + "</Produit_4Gs>" + "</Produit>";
            this.articles.data[k].Produitsserie = this.articleSeries;
            //this.tablenumero.splice(0, this.articles.data[k].qte);
            this.n_serie = [];
          }
          else if (this.articles.data[k].type == '4G') {
            for (let z = 0; z < this.articles.data[k].qte; z++) {
              this.e1[z] = "<E1>" + this.t5[z] + "</E1>";
              this.e2[z] = "<E2>" + this.t6[z] + "</E2>";
              this.n_serie4g[z] = "<N_Serie>" + this.t7[z] + "</N_Serie>";
              data += "<Produit_4G>" + this.n_serie4g[z] + this.e1[z] + this.e2[z] + "</Produit_4G>"
            }
            this.article4Gs = "<Produit>" + "<Id>" + this.articles.data[k].id + "</Id>"
              + "<Nom>" + this.articles.data[k].nom + "</Nom>"
              + "<Signaler_Probleme>" + this.articles.data[k].Signaler_Probleme + "</Signaler_Probleme>"
              + "<Ref>" + this.articles.data[k].ref_fr + "</Ref>"
              + "<Qte>" + this.articles.data[k].qte + "</Qte>"
              + "<Prix_U_HT>" + this.articles.data[k].prix_u_ht + "</Prix_U_HT>"
              + "<Tva>" + this.articles.data[k].tva + "</Tva>"
              + "<Remise>" + this.articles.data[k].remise + "</Remise>"
              + "<Fodec>" + this.articles.data[k].fodec + "</Fodec>"
              + "<Prix_U_TTC>" + this.articles.data[k].prixuttc + "</Prix_U_TTC>"
              + "<PrixRevientU>" + this.articles.data[k].prixruht + "</PrixRevientU>"
              + "<Charge>" + this.articles.data[k].charge + "</Charge>"
              + "<Ch_Piece>" + this.articles.data[k].ch_piece + "</Ch_Piece>"
              + "<Type>" + this.articles.data[k].type + "</Type>"
              + "<N_Series>" + "</N_Series>" + "<Produit_4Gs>" + data + "</Produit_4Gs>" + "</Produit>"
            this.parts2 += this.articles.data[k].Produits4g;
            this.articles.data[k].Produits4g = this.article4Gs;
            this.t5.splice(0, this.articles.data[k].qte);
            this.e1 = [];
            this.t6.splice(0, this.articles.data[k].qte);
            this.e2 = [];
            this.t7.splice(0, this.articles.data[k].qte);
            this.n_serie4g = [];
            data = "";
          }
        }
        this.x = ["ID", "Ref_FR", "Qte", "Prix_U_HT", "E1", "E2", "N_Serie", "Type", ""];
      }
      reader.readAsDataURL(detail);
    })
    this.Locals();
    this.Fournisseurs();
    this.Produits();
    this.BonEntreeLocals();
    this.InformationsGeneralesForm = this.fb.group({
      Des: [''],
      DateEntree: ['', Validators.required],
      N_Facture: ['', Validators.required],
      Totale_Facture: ['', Validators.required],
      Totale_Facture_TTC: ['', Validators.required],
      Depot: ['', Validators.required],
      Ag_Ttransport: ['', Validators.required],
      Mode_Paiement: ['', Validators.required],
      Type: ['', Validators.required],
      Fournisseur: ['', Validators.required],
      ChargeTransport: ['0', Validators.required],
      Autre_Charge_Fixe: ['0'],
    });
    this.ListeArticleForm = this.fb.group({
      IdProduit: [''],
      Ref_FR: [''],
      Quantite: [],
      Prix: [''],
      Id_Produit: ['', Validators.required],
      Ref_fournisseur: ['', Validators.required],
      Qte: ['', Validators.required],
      Prix_U: [''],
      TVA: ['', Validators.required],
      M_TVA: ['', Validators.required],
      Fodec: ['', Validators.required],
      Prix_HT: [''],
      Totale_TTC: ['', Validators.required],
    });
    this.ChargeForm = this.fb.group({
      Id_article: ['', Validators.required],
      Ref_fournisseur: ['', Validators.required],
      Qte: ['', Validators.required],
      Prix_U: ['', Validators.required],
      TVA: ['', Validators.required],
      M_TVA: ['', Validators.required],
      Fodec: ['', Validators.required],
      Prix_HT: ['', Validators.required],
      Totale_TTC: ['', Validators.required],
      PrixRevientU: [''],
      Ch: [
        "",
        [
          Validators.required,
          Validators.min(0),
          Validators.max(100)
        ]
      ],
      Ch_Globale: ['', Validators.required]
    });
  }
  //Récupérer bon d'entrée local par id
  bEL() {
    this.bonEntreeService.BonEntreeLocal(this.route.snapshot.params.id).subscribe((response: Response) => {
      this.bonEntreeLocalData = response;
      this.date = new Date(this.bonEntreeLocalData.date_BEL);
    });
  }
  ngOnInit(): void {
  }
  //Editer ligne table articles
  Editer(row: any, i: any) {
    row.editable = true;
  }
  //Supprimer ligne du table articles
  supprimerLigneTable(index: number) {
    const data = this.articles.data;
    data.splice((this.paginator.pageIndex * this.paginator.pageSize) + index, 1);
    this.articles.data = data;
  }
  //Confirmer la modification
  confirmerEditionLigneTable(row: any, index: any) {
    let data: any = ""; 
    let m:number=0; 
    let z:any; 
    for (let k = 0; k < this.articles.data.length; k++) {
      if (this.articles.data[k].type == 'Simple') {
        this.articleSimples += "<Produit>" + "<Id>" + this.articles.data[k].id + "</Id>"
          + "<Nom>" + this.articles.data[k].nom + "</Nom>"
          + "<Signaler_Probleme>" + this.articles.data[k].Signaler_Probleme + "</Signaler_Probleme>"
          + "<Ref>" + this.articles.data[k].ref_fr + "</Ref>"
          + "<Qte>" + this.articles.data[k].qte + "</Qte>"
          + "<Prix_U_HT>" + this.articles.data[k].prix_u_ht + "</Prix_U_HT>"
          + "<Tva>" + this.articles.data[k].tva + "</Tva>"
          + "<Remise>" + this.articles.data[k].remise + "</Remise>"
          + "<Fodec>" + this.articles.data[k].fodec + "</Fodec>"
          + "<Prix_U_TTC>" + this.articles.data[k].prixuttc + "</Prix_U_TTC>"
          + "<PrixRevientU>" + this.articles.data[k].prixruht + "</PrixRevientU>"
          + "<Charge>" + this.articles.data[k].charge + "</Charge>"
          + "<Ch_Piece>" + this.articles.data[k].ch_piece + "</Ch_Piece>"
          + "<Type>" + this.articles.data[k].type + "</Type>"
          + "<N_Series>" + "</N_Series>" + "<Produit_4Gs>" + "</Produit_4Gs>" + "</Produit>"
      }
      else if (this.articles.data[k].type == 'Serie') {
        for ( z =0; z < this.articles.data[k].qte; z++) {
          this.n_serie += "<N_Serie>" + this.tablenumero[z] + "</N_Serie>"         
        }  
        this.articleSeries = "<Produit>" + "<Id>" + this.articles.data[k].id + "</Id>"
          + "<Nom>" + this.articles.data[k].nom + "</Nom>"
          + "<Signaler_Probleme>" + this.articles.data[k].Signaler_Probleme + "</Signaler_Probleme>"
          + "<Ref>" + this.articles.data[k].ref_fr + "</Ref>"
          + "<Qte>" + this.articles.data[k].qte + "</Qte>"
          + "<Prix_U_HT>" + this.articles.data[k].prix_u_ht + "</Prix_U_HT>"
          + "<Tva>" + this.articles.data[k].tva + "</Tva>"
          + "<Remise>" + this.articles.data[k].remise + "</Remise>"
          + "<Fodec>" + this.articles.data[k].fodec + "</Fodec>"
          + "<Prix_U_TTC>" + this.articles.data[k].prixuttc + "</Prix_U_TTC>"
          + "<PrixRevientU>" + this.articles.data[k].prixruht + "</PrixRevientU>"
          + "<Charge>" + this.articles.data[k].charge + "</Charge>"
          + "<Ch_Piece>" + this.articles.data[k].ch_piece + "</Ch_Piece>"
          + "<Type>" + this.articles.data[k].type + "</Type>"
          + "<N_Series>" + this.n_serie + "</N_Series>" + "<Produit_4Gs>" + "</Produit_4Gs>" + "</Produit>";
        this.articles.data[k].Produitsserie = this.articleSeries;
        this.n_serie = [];
        z+=this.articles.data[k].qte;
      }
      else if (this.articles.data[k].type == '4G') {
        for (let z = 0; z < this.articles.data[k].qte; z++) {
          this.e1[z] = "<E1>" + this.t5[z] + "</E1>";
          this.e2[z] = "<E2>" + this.t6[z] + "</E2>";
          this.n_serie4g[z] = "<N_Serie>" + this.t7[z] + "</N_Serie>";
          data += "<Produit_4G>" + this.n_serie4g[z] + this.e1[z] + this.e2[z] + "</Produit_4G>"
        }
        this.article4Gs = "<Produit>" + "<Id>" + this.articles.data[k].id + "</Id>"
          + "<Nom>" + this.articles.data[k].nom + "</Nom>"
          + "<Signaler_Probleme>" + this.articles.data[k].Signaler_Probleme + "</Signaler_Probleme>"
          + "<Ref>" + this.articles.data[k].ref_fr + "</Ref>"
          + "<Qte>" + this.articles.data[k].qte + "</Qte>"
          + "<Prix_U_HT>" + this.articles.data[k].prix_u_ht + "</Prix_U_HT>"
          + "<Tva>" + this.articles.data[k].tva + "</Tva>"
          + "<Remise>" + this.articles.data[k].remise + "</Remise>"
          + "<Fodec>" + this.articles.data[k].fodec + "</Fodec>"
          + "<Prix_U_TTC>" + this.articles.data[k].prixuttc + "</Prix_U_TTC>"
          + "<PrixRevientU>" + this.articles.data[k].prixruht + "</PrixRevientU>"
          + "<Charge>" + this.articles.data[k].charge + "</Charge>"
          + "<Ch_Piece>" + this.articles.data[k].ch_piece + "</Ch_Piece>"
          + "<Type>" + this.articles.data[k].type + "</Type>"
          + "<N_Series>" + "</N_Series>" + "<Produit_4Gs>" + data + "</Produit_4Gs>" + "</Produit>"
        this.parts2 += this.articles.data[k].Produits4g;
        this.articles.data[k].Produits4g = this.article4Gs;
        this.t5.splice(0, this.articles.data[k].qte);
        this.e1 = [];
        this.t6.splice(0, this.articles.data[k].qte);
        this.e2 = [];
        this.t7.splice(0, this.articles.data[k].qte);
        this.n_serie4g = [];
        data = "";
      }
    }
    row.editable = false;
    row["prixuttc"] = (((Number(((Number(row["prix_u_ht"]) * Number(row["qte"])) * (1 - (Number(row["remise"])) / 100))) + Number((((Number(row["prix_u_ht"]) * Number(row["qte"])) * (1 - (Number(row["remise"])) / 100)) * row["fodec"] / 100) + Number(((Number(((Number(row["prix_u_ht"]) * Number(row["qte"])) * (1 - (Number(row["remise"])) / 100))) + Number((((Number(row["prix_u_ht"]) * Number(row["qte"])) * (1 - (row["remise"])) / 100)) * row["fodec"]) / 100)) * row["tva"]) / 100))) / Number(row["qte"])).toFixed(3);
    row["ch_piece"] = (((((Number(this.InformationsGeneralesForm.get('ChargeTransport').value) + Number(this.InformationsGeneralesForm.get('Autre_Charge_Fixe').value)) * Number(row["charge"])) / 100)) / (Number(row["qte"]))).toFixed(3);
    Object.keys(row).forEach(item => {
      row[item] = row[item];
    });
    this.verifierCharge(event, index)
  }
  //Annuler/confimer la suppression
  Suppression(row: any, i: any) {
    if (row.editable) {
      row.editable = false;
      Object.keys(row).forEach(item => {
        row[item] = (this.articlesNonModif.data[i][item]);
      });
    }
    else {
      Swal.fire({
        title: 'Êtes-vous sûr?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Oui, supprimez-le',
        cancelButtonText: 'Non, garde le'
      }).then((result) => {
        if (result.value) {
          this.supprimerLigneTable(i);
          Swal.fire(
            'Article Supprimé avec succés!',
            '',
            'success'
          )
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          Swal.fire(
            'Annulé',
            '',
            'error'
          )
        }
      })
    }
  }
  //Filtrer la table des articles
  Filtrer(filterValue: any) {
    this.articles.filter = filterValue.target.value;
  }
  //Récupérer id article à modifier
  recupererIdArticle(idArticle: any) {
    let articlesSeries: any = [];
    let table4g: any = [];
    let n_serie: any = [];
    let e1: any = [];
    let e2: any = [];
    this.idArticle = idArticle;
    this.bonEntreeService.DetailBonEntreeLocal(this.route.snapshot.params.id).subscribe((detail: any) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        this.bonEntreeLocalDetail = reader.result;
        var parseString = require('xml2js').parseString;
        let parser = new DOMParser();
        parseString(atob(this.bonEntreeLocalDetail.substr(28)), function (err: any, result: any) {
          if (result.Bon_Entree_Local.Produits[0].Produits_Simples == undefined && result.Bon_Entree_Local.Produits[0].Produits_4Gs == undefined && result.Bon_Entree_Local.Produits[0].Produits_Series != undefined) {
            for (let m = 0; m < result.Bon_Entree_Local.Produits[0].Produits_Series[0].Produit.length; m++) {
              if (result.Bon_Entree_Local.Produits[0].Produits_Series[0].Produit[m].Id.toString() == idArticle) {
                for (let j = 0; j < result.Bon_Entree_Local.Produits[0].Produits_Series[0].Produit[m].N_Series.length; j++) {
                  for (let k = 0; k < result.Bon_Entree_Local.Produits[0].Produits_Series[0].Produit[m].N_Series[j].N_Serie.length; k++) {
                    articlesSeries.push(result.Bon_Entree_Local.Produits[0].Produits_Series[0].Produit[m].N_Series[j].N_Serie[k]);
                  }
                }
              }
            }
          }
          else if (result.Bon_Entree_Local.Produits[0].Produits_Simples != undefined && result.Bon_Entree_Local.Produits[0].Produits_4Gs == undefined && result.Bon_Entree_Local.Produits[0].Produits_Series != undefined) {
            for (let m = 0; m < result.Bon_Entree_Local.Produits[0].Produits_Series[0].Produit.length; m++) {
              if (result.Bon_Entree_Local.Produits[0].Produits_Series[0].Produit[m].Id.toString() == idArticle) {
                for (let j = 0; j < result.Bon_Entree_Local.Produits[0].Produits_Series[0].Produit[m].N_Series.length; j++) {
                  for (let k = 0; k < result.Bon_Entree_Local.Produits[0].Produits_Series[0].Produit[m].N_Series[j].N_Serie.length; k++) {
                    articlesSeries.push(result.Bon_Entree_Local.Produits[0].Produits_Series[0].Produit[m].N_Series[j].N_Serie[k]);
                  }
                }
              }
            }
          }
          else if (result.Bon_Entree_Local.Produits[0].Produits_Simples == undefined && result.Bon_Entree_Local.Produits[0].Produits_4Gs != undefined && result.Bon_Entree_Local.Produits[0].Produits_Series == undefined) {
            for (let m = 0; m < result.Bon_Entree_Local.Produits[0].Produits_4Gs[0].Produit.length; m++) {
              if (result.Bon_Entree_Local.Produits[0].Produits_4Gs[0].Produit[m].Id.toString() == idArticle) {
                for (let j = 0; j < result.Bon_Entree_Local.Produits[0].Produits_4Gs[0].Produit[m].Produit_4Gs.length; j++) {
                  for (let k = 0; k < result.Bon_Entree_Local.Produits[0].Produits_4Gs[0].Produit[m].Produit_4Gs[j].Produit_4G.length; k++) {
                    n_serie.push(result.Bon_Entree_Local.Produits[0].Produits_4Gs[0].Produit[m].Produit_4Gs[j].Produit_4G[k].N_Serie.toString());
                    e1.push(result.Bon_Entree_Local.Produits[0].Produits_4Gs[0].Produit[m].Produit_4Gs[j].Produit_4G[k].E1);
                    e2.push(result.Bon_Entree_Local.Produits[0].Produits_4Gs[0].Produit[m].Produit_4Gs[j].Produit_4G[k].E2);
                  }
                }
              }
            }
          }
          else if (result.Bon_Entree_Local.Produits[0].Produits_Simples != undefined && result.Bon_Entree_Local.Produits[0].Produits_4Gs != undefined && result.Bon_Entree_Local.Produits[0].Produits_Series == undefined) {
            for (let m = 0; m < result.Bon_Entree_Local.Produits[0].Produits_4Gs[0].Produit.length; m++) {
              if (result.Bon_Entree_Local.Produits[0].Produits_4Gs[0].Produit[m].Id.toString() == idArticle) {
                for (let j = 0; j < result.Bon_Entree_Local.Produits[0].Produits_4Gs[0].Produit[m].Produit_4Gs.length; j++) {
                  for (let k = 0; k < result.Bon_Entree_Local.Produits[0].Produits_4Gs[0].Produit[m].Produit_4Gs[j].Produit_4G.length; k++) {
                    n_serie.push(result.Bon_Entree_Local.Produits[0].Produits_4Gs[0].Produit[m].Produit_4Gs[j].Produit_4G[k].N_Serie.toString());
                    e1.push(result.Bon_Entree_Local.Produits[0].Produits_4Gs[0].Produit[m].Produit_4Gs[j].Produit_4G[k].E1);
                    e2.push(result.Bon_Entree_Local.Produits[0].Produits_4Gs[0].Produit[m].Produit_4Gs[j].Produit_4G[k].E2);
                  }
                }
              }
            }
          }
          else if (result.Bon_Entree_Local.Produits[0].Produits_Simples != undefined && result.Bon_Entree_Local.Produits[0].Produits_4Gs == undefined && result.Bon_Entree_Local.Produits[0].Produits_Series == undefined) {
            for (let m = 0; m < result.Bon_Entree_Local.Produits[0].Produits_Simples[0].Produit.length; m++) {
            }
          }
          else {
            for (let m = 0; m < result.Bon_Entree_Local.Produits[0].Produits_4Gs[0].Produit.length; m++) {
              if (result.Bon_Entree_Local.Produits[0].Produits_4Gs[0].Produit[m].Id.toString() == idArticle) {
                for (let j = 0; j < result.Bon_Entree_Local.Produits[0].Produits_4Gs[0].Produit[m].Produit_4Gs.length; j++) {
                  for (let k = 0; k < result.Bon_Entree_Local.Produits[0].Produits_4Gs[0].Produit[m].Produit_4Gs[j].Produit_4G.length; k++) {
                    n_serie.push(result.Bon_Entree_Local.Produits[0].Produits_4Gs[0].Produit[m].Produit_4Gs[j].Produit_4G[k].N_Serie.toString());
                    e1.push(result.Bon_Entree_Local.Produits[0].Produits_4Gs[0].Produit[m].Produit_4Gs[j].Produit_4G[k].E1);
                    e2.push(result.Bon_Entree_Local.Produits[0].Produits_4Gs[0].Produit[m].Produit_4Gs[j].Produit_4G[k].E2);
                  }
                }
              }
            }
            for (let m = 0; m < result.Bon_Entree_Local.Produits[0].Produits_Series[0].Produit.length; m++) {
              if (result.Bon_Entree_Local.Produits[0].Produits_Series[0].Produit[m].Id.toString() == idArticle) {
                for (let j = 0; j < result.Bon_Entree_Local.Produits[0].Produits_Series[0].Produit[m].N_Series.length; j++) {
                  for (let k = 0; k < result.Bon_Entree_Local.Produits[0].Produits_Series[0].Produit[m].N_Series[j].N_Serie.length; k++) {
                    articlesSeries.push(result.Bon_Entree_Local.Produits[0].Produits_Series[0].Produit[m].N_Series[j].N_Serie[k]);
                  }
                }
              }
            }
          }
        })
      }
      reader.readAsDataURL(detail);
    }
    )
    this.test = articlesSeries;
    this.tableserie = n_serie;
    this.tablee1 = e1;
    this.tablee2 = e2;
    this.table4g = table4g;
    let json = [];
    for (var i = 0; i < this.test.length; i++) {
      json.push({
        numero: this.test[i]
      })
    }
    this.articlesSeries = new MatTableDataSource(json);
  }
  //Calcul totaux
  calculTotaux() {
    let TotalHTBrut = 0;
    let TotalRemise = 0;
    let TotalHTNet = 0;
    let TotalFodec = 0;
    let TotalTVA = 0;
    let TotalTTC = 0;
    let TotalRHT = 0;
    let TotalRTTC = 0;
    for (let i = 0; i < this.articles.data.length; i++) {
      TotalHTBrut += Number(this.articles.data[i].qte) * Number(this.articles.data[i].prix_u_ht);
      this.totalHT = TotalHTBrut.toFixed(3);
      TotalRemise += (Number(this.articles.data[i].remise) * Number(this.articles.data[i].prix_u_ht) * Number(this.articles.data[i].qte)) / 100;
      this.totalRemise = TotalRemise.toFixed(3);
      TotalHTNet += ((Number(this.articles.data[i].prix_u_ht) * Number(this.articles.data[i].qte)) * (1 - (Number(this.articles.data[i].remise)) / 100));
      this.totalHTNet = TotalHTNet.toFixed(3);
      TotalFodec += (((Number(this.articles.data[i].prix_u_ht) * Number(this.articles.data[i].qte)) * (1 - (Number(this.articles.data[i].remise)) / 100)) * this.articles.data[i].fodec) / 100;
      this.totalFodec = TotalFodec.toFixed(3);
      TotalTVA += ((Number(((Number(this.articles.data[i].prix_u_ht) * Number(this.articles.data[i].qte)) * (1 - (Number(this.articles.data[i].remise)) / 100))) + Number((((Number(this.articles.data[i].prix_u_ht) * Number(this.articles.data[i].qte)) * (1 - (Number(this.articles.data[i].remise)) / 100)) * this.articles.data[i].fodec) / 100)) * this.articles.data[i].tva) / 100;
      this.totalMontantTVA = TotalTVA.toFixed(3);
      this.articles.data[i].prixuttc = (((Number(((Number(this.articles.data[i].prix_u_ht) * Number(this.articles.data[i].qte)) * (1 - (Number(this.articles.data[i].remise)) / 100))) + Number((((Number(this.articles.data[i].prix_u_ht) * Number(this.articles.data[i].qte)) * (1 - (Number(this.articles.data[i].remise)) / 100)) * this.articles.data[i].fodec) / 100) + Number(((Number(((Number(this.articles.data[i].prix_u_ht) * Number(this.articles.data[i].qte)) * (1 - (Number(this.articles.data[i].remise)) / 100))) + Number((((Number(this.articles.data[i].prix_u_ht) * Number(this.articles.data[i].qte)) * (1 - (Number(this.articles.data[i].remise)) / 100)) * this.articles.data[i].fodec) / 100)) * this.articles.data[i].tva) / 100))) / Number(this.articles.data[i].qte)).toFixed(3);
      TotalTTC += (Number(this.articles.data[i].prixuttc)) * (Number(this.articles.data[i].qte));
      this.totalTTc = TotalTTC.toFixed(3);
      this.articles.data[i].prixruht = (Number(this.articles.data[i].prix_u_ht) + Number(this.articles.data[i].ch_piece)).toFixed(3);;
      TotalRHT += ((Number(this.articles.data[i].prixruht)) * (Number(this.articles.data[i].qte)));
      this.totalRHT = TotalRHT.toFixed(3);
      TotalRTTC += ((Number(this.articles.data[i].prixruht)) * (Number(this.articles.data[i].qte)) + Number(((Number(((Number(this.articles.data[i].prix_u_ht) * Number(this.articles.data[i].qte)) * (1 - (Number(this.articles.data[i].remise)) / 100))) + Number((((Number(this.articles.data[i].prix_u_ht) * Number(this.articles.data[i].qte)) * (1 - (Number(this.articles.data[i].remise)) / 100)) * this.articles.data[i].fodec) / 100)) * this.articles.data[i].tva) / 100) + Number((((Number(this.articles.data[i].prix_u_ht) * Number(this.articles.data[i].qte)) * (1 - (Number(this.articles.data[i].remise)) / 100)) * this.articles.data[i].fodec) / 100))
      this.totalRTTC = TotalRTTC.toFixed(3);
    }
  }
  //Calculer assiettes TVA
  calculAssiette() {
    if (this.articles.data.length == 0) {
      this.assiettetva19 = 0;
      this.Montanttva19 = 0
      this.assiettetva7 = 0
      this.Montanttva7 = 0
      this.assiettetva13 = 0;
      this.Montanttva13 = 0;
    } else {
      this.assiettetva19 = 0;
      this.Montanttva19 = 0;
      this.assiettetva7 = 0;
      this.Montanttva7 = 0;
      this.assiettetva13 = 0;
      this.Montanttva13 = 0;
      for (let i = 0; i < this.articles.data.length; i++) {
        if (this.articles.data[i].tva == 19) {
          this.assiettetva19 += (Number(Number(((Number(this.articles.data[i].prix_u_ht) * Number(this.articles.data[i].qte)) * (1 - (Number(this.articles.data[i].remise)) / 100))) + Number(this.totalMontantFodec)));
          this.Montanttva19 += (Number(Number(((Number(((Number(((Number(this.articles.data[i].prix_u_ht) * Number(this.articles.data[i].qte)) * (1 - (Number(this.articles.data[i].remise)) / 100))) + Number((((Number(this.articles.data[i].prix_u_ht) * Number(this.articles.data[i].qte)) * (1 - (Number(this.articles.data[i].remise)) / 100)) * this.articles.data[i].fodec) / 100)) * this.articles.data[i].tva) / 100)) / (Number(this.articles.data[i].qte))))) * (Number(this.articles.data[i].qte)));
          this.assiette19 = this.assiettetva19.toFixed(3);
          this.Montant19 = this.Montanttva19.toFixed(3);
        }
        else if (this.articles.data[i].tva == 7) {
          this.assiettetva7 += (Number(Number(((Number(this.articles.data[i].prix_u_ht) * Number(this.articles.data[i].qte)) * (1 - (Number(this.articles.data[i].remise)) / 100))) + Number(this.totalMontantFodec)));
          this.Montanttva7 += (Number(Number(((Number(((Number(((Number(this.articles.data[i].prix_u_ht) * Number(this.articles.data[i].qte)) * (1 - (Number(this.articles.data[i].remise)) / 100))) + Number((((Number(this.articles.data[i].prix_u_ht) * Number(this.articles.data[i].qte)) * (1 - (Number(this.articles.data[i].remise)) / 100)) * this.articles.data[i].fodec) / 100)) * this.articles.data[i].tva) / 100)) / (Number(this.articles.data[i].qte))))) * (Number(this.articles.data[i].qte)));
          this.assiette7 = this.assiettetva7.toFixed(3);
          this.Montant7 = this.Montanttva7.toFixed(3);
        }
        else if (this.articles.data[i].tva == 13) {
          this.assiettetva13 += (Number(Number(((Number(this.articles.data[i].prix_u_ht) * Number(this.articles.data[i].qte)) * (1 - (Number(this.articles.data[i].remise)) / 100))) + Number(this.totalMontantFodec)));
          this.Montanttva13 += (Number(Number(((Number(((Number(((Number(this.articles.data[i].prix_u_ht) * Number(this.articles.data[i].qte)) * (1 - (Number(this.articles.data[i].remise)) / 100))) + Number((((Number(this.articles.data[i].prix_u_ht) * Number(this.articles.data[i].qte)) * (1 - (Number(this.articles.data[i].remise)) / 100)) * this.articles.data[i].fodec) / 100)) * this.articles.data[i].tva) / 100)) / (Number(this.articles.data[i].qte))))) * (Number(this.articles.data[i].qte)));
          this.assiette13 = this.assiettetva13.toFixed(3);
          this.Montant13 = this.Montanttva13.toFixed(3);
        }
      }
    }
  }
  //Récupérer tous locaux
  Locals() {
    this.bonEntreeService.Locals().subscribe((data: any) => {
      this.locals = data;
    });
  }
  //Récupérer tous fournisseurs
  Fournisseurs() {
    this.bonEntreeService.Fournisseurs().subscribe((data: any) => {
      this.fournisseurs = data;
    });
  }
  //Récupérer tous produits
  Produits() {
    this.bonEntreeService.Produits().subscribe((data: any) => {
      this.produits = data;
    });
  }
  //Récuperer tous bons d'entrée local
  BonEntreeLocals() {
    this.bonEntreeService.BonEntreeLocals().subscribe((data: any) => {
      this.bonEntreeLocals = data;
    });
  }
  //Fonction activée lors de choix du produit
  ProduitSelectionner(event: any) {
    this.Id_Produit = event.value;
    //Récuperer produit par id
    this.bonEntreeService.Produit(this.Id_Produit).subscribe((response: Response) => {
      this.produitData = response;
      this.Tva = this.produitData.tva
      this.Fodec = this.produitData.fodec
    });
  }
  //Récuperer la valeur entrée Ref_FR
  Ref_FR_Valeur(event: any) {
    this.Ref_FR = event.target.value;
  }
  //Récuperer la valeur entrée Quantite
  Quantite_Valeur(event: any) {
    this.Quantite = event.target.value;
  }
  //Récuperer la valeur entrée Prix unitaire
  Prix_Valeur(event: any) {
    this.Prix = event.target.value;
  }
  //Récuperer la valeur entrée Prix HT
  PrixHT_Valeur(event: any) {
    this.Prix_HT = event.target.value;
  }
  //Récupérer fournisseur par id
  Fournisseur() {
    this.bonEntreeService.Fournisseur((this.InformationsGeneralesForm.get('Fournisseur').value)).subscribe((data: any) => {
      this.fournisseur = data;
      this.nomFR = data.nom_Fournisseur;
    });
  }
  //convertir blob à un fichier
  convertirBlobAFichier = (theBlob: Blob, fileName: string): File => {
    var b: any = theBlob;
    b.lastModifiedDate = new Date();
    b.name = fileName;
    return <File>theBlob;
  }
  //modifier bon entrée local
  modifierBonEntreeLocal() {
    this.Fournisseur();
    var parts = '';
    let numero: any = [];
    let nbSerie: any = [];
    let nb4g: any = [];
    numero = this.tablenumero;
    for (let k = 0; k < this.articles.data.length; k++) {
      if (this.articles.data[k].type == '4G') {
        nb4g.push(k);
      }
      else if (this.articles.data[k].type == 'Serie') {
        nbSerie.push(k);
      }
      else if (this.articles.data[k].type == 'Simple') {
        this.FichierSimple = this.articleSimples;
        this.ProduitsSimple = "<Produits_Simples>" + this.FichierSimple + "</Produits_Simples>"
      }
      else { }
    }
    for (let j = nbSerie[0]; j <= nbSerie[nbSerie.length - 1]; j++) {
      this.articleSeries = this.articles.data[j].Produitsserie;
      this.FichierSerie += this.articles.data[j].Produitsserie;
      this.ProduitsSerie = "<Produits_Series>" + this.FichierSerie + "</Produits_Series>"
    }
    for (let j = nb4g[0]; j <= nb4g[nb4g.length - 1]; j++) {
      this.Fichier4G += this.articles.data[j].Produits4g;
      this.Produits4G = "<Produits_4Gs>" + this.Fichier4G + "</Produits_4Gs>"
    }
    var formData: any = new FormData();
    let url = "assets/BonEntreeLocal.xml";
    fetch(url)
      .then(response => response.text())
      .then(data => {
        let parser = new DOMParser();
        this.index = this.index + 1;
        parts = "<Produits>" + this.Produits4G + this.ProduitsSerie + this.ProduitsSimple + "</Produits>";
        this.fichierEtat = new Blob([parts], { type: 'application/xml' });
        for (let j = 0; j < this.fieldArray.length; j++) {
          this.data3 = this.data3 + "<TVA19>" +
            "</TVA19>";
          this.data4 = this.data4 + "<TVA7>" +
            "</TVA7>";
        }
        var data2 = data + "<Bon_Entree_Local>" +
          "<Etat>" + "En cours" + "</Etat>" +
          "<Informations-Generales>" + "<Type>" + this.InformationsGeneralesForm.get('Type').value +
          "</Type>" +
          "<Id_Fr>" + this.InformationsGeneralesForm.get('Fournisseur').value + "</Id_Fr>" +
          "<Local>" + this.InformationsGeneralesForm.get('Depot').value + "</Local>" +
          "<Charge_Transport>" + this.InformationsGeneralesForm.get('ChargeTransport').value + "</Charge_Transport>" +
          "<Mode_Paiement>" + this.InformationsGeneralesForm.get('Mode_Paiement').value + "</Mode_Paiement>" +
          "<Autre_Charge_Fixe>" + this.InformationsGeneralesForm.get('Autre_Charge_Fixe').value + "</Autre_Charge_Fixe>" +
          "<Date>" + this.InformationsGeneralesForm.get('DateEntree').value + "</Date>" +
          "<Ag_Transport>" + this.InformationsGeneralesForm.get('Ag_Ttransport').value + "</Ag_Transport>" +
          "<Description>" + this.InformationsGeneralesForm.get('Des').value + "</Description>" +
          "<Total_Facture_HT>" + this.InformationsGeneralesForm.get('Totale_Facture').value + "</Total_Facture_HT>" +
          "<Total_Facture_TTC>" + this.InformationsGeneralesForm.get('Totale_Facture_TTC').value + "</Total_Facture_TTC>" +
          "<N_Facture>" + this.InformationsGeneralesForm.get('N_Facture').value + "</N_Facture>" +
          "</Informations-Generales>" +
          "<Taxes>" +
          "<TVA>" +
          "<TVA19>" + "<Assiette>" + this.assiettetva19 + "</Assiette>" + "<Montant>" + this.Montanttva19 + "</Montant>" +
          "</TVA19>" +
          "<TVA7>" + "<Assiette>" + this.assiettetva7 + "</Assiette>" + "<Montant>" + this.Montanttva7 + "</Montant>" +
          "</TVA7>" +
          "<TVA13>" + "<Assiette>" + this.assiettetva13 + "</Assiette>" + "<Montant>" + this.Montanttva13 + "</Montant>" +
          "</TVA13>" +
          "</TVA>" +
          "<Fodec>" +
          this.totalFodec +
          "</Fodec>" +
          "</Taxes>" +
          "<Total>" +
          "<TotalHTBrut>" +
          this.totalHT +
          "</TotalHTBrut>" +
          "<TotalRemise>" +
          this.totalRemise +
          "</TotalRemise>" +
          "<TotalHTNet>" +
          this.totalHTNet +
          "</TotalHTNet>" +
          "<TotalFodec>" +
          this.totalFodec +
          "</TotalFodec>" +
          "<TotalTVA>" +
          this.totalMontantTVA +
          "</TotalTVA>" +
          "<TotalTTC>" +
          this.totalTTc +
          "</TotalTTC>" +
          "<TotalRHT>" +
          this.totalRHT +
          "</TotalRHT>" +
          "<TotalRTTC>" +
          this.totalRTTC +
          "</TotalRTTC>" +
          "</Total>" +
          parts +
          "</Bon_Entree_Local>";
        let xml2 = parser.parseFromString(data2, "application/xml");
        let x2 = xml2.getElementsByTagName('Produits');
        x2[0].setAttribute("Fournisseur", this.fournisseur.nom_Fournisseur);
        x2[0].setAttribute("Local", this.InformationsGeneralesForm.get('Depot').value);
        let xml2string = new XMLSerializer().serializeToString(xml2.documentElement);
        var myBlob = new Blob([xml2string], { type: 'application/xml' });
        var myFile = this.convertirBlobAFichier(myBlob, "assets/BonEntreeLocal.xml");
        formData.append('Id_Bon', this.route.snapshot.params.id);
        formData.append('Id_Fr', this.InformationsGeneralesForm.get('Fournisseur').value);
        formData.append('Mode_Paiement', this.InformationsGeneralesForm.get('Mode_Paiement').value);
        formData.append('Charge_Transport', this.InformationsGeneralesForm.get('ChargeTransport').value);
        formData.append('Autre_Charge_Fixe', this.InformationsGeneralesForm.get('Autre_Charge_Fixe').value);
        formData.append('Ag_Ttransport', this.InformationsGeneralesForm.get('Ag_Ttransport').value);
        formData.append('Type', this.InformationsGeneralesForm.get('Type').value);
        formData.append('N_Facture', this.InformationsGeneralesForm.get('N_Facture').value);
        formData.append('Date_BEL', this.InformationsGeneralesForm.get('DateEntree').value);
        formData.append('Etat', false);
        formData.append('Description', this.InformationsGeneralesForm.get('Des').value);
        formData.append('Local', this.InformationsGeneralesForm.get('Depot').value);
        formData.append('id_Responsable', '');
        formData.append('Details', myFile);
        formData.append('Total_HT_Brut', this.totalHT);
        formData.append('Total_Remise', this.totalRemise);
        formData.append('Total_HT_Net', this.totalHTNet);
        formData.append('Total_Fodec', this.totalMontantFodec);
        formData.append('Total_Tva', this.totalMontantTVA);
        formData.append('Total_TTC', this.totalTTc);
        formData.append('Total_R_HT', this.totalRHT);
        formData.append('Total_R_TTC', this.totalRTTC);
        Swal.fire({
          title: 'Êtes-vous sûr?',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Oui, modifiez-le',
          cancelButtonText: 'Non'
        }).then((result) => {
          if (result.value) {
            this.bonEntreeService.modifierBonEntreeLocal(formData);
            this.router.navigate(['Menu/Menu-bon-entree/Lister-bon-entree'])
            Swal.fire(
              "Bon d'entrée local modifié avec succés!",
              '',
              'success'
            )
          } else if (result.dismiss === Swal.DismissReason.cancel) {
            Swal.fire(
              'Annulé',
              '',
              'error'
            )
            this.router.navigate(['Menu/Menu-bon-entree/Lister-bon-entree'])
          }
        })
      })
  }
  //message erreur type
  MessageErreurType() {
    if (this.InformationsGeneralesForm.get('Type').hasError('required')) {
      return 'Vous devez entrer le type!';
    }
    else {
      return '';
    }
  }
  //message erreur agence transport
  MessageErreurAgence() {
    if (this.InformationsGeneralesForm.get('Ag_Ttransport').hasError('required')) {
      return "Vous devez entrer l'agence transport!";
    }
    else {
      return '';
    }
  }
  //message erreur depot
  MessageErreurLocal() {
    if (this.InformationsGeneralesForm.get('Depot').hasError('required')) {
      return 'Vous devez entrer le local!';
    }
    else {
      return '';
    }
  }
  //message erreur fournisseur
  MessageErreurFournisseur() {
    if (this.InformationsGeneralesForm.get('Fournisseur').hasError('required')) {
      return 'Vous devez entrer le fournisseur!';
    }
    else {
      return '';
    }
  }
  //message erreur date
  MessageErreurDate() {
    if (this.InformationsGeneralesForm.get('DateEntree').hasError('required')) {
      return 'Vous devez entrer la date !';
    }
    else {
      return '';
    }
  }
  //message erreur mode paiement
  MessageErreurMode() {
    if (this.InformationsGeneralesForm.get('Mode_Paiement').hasError('required')) {
      return 'Vous devez entrer la mode de paiement !';
    }
    else {
      return '';
    }
  }
  //message erreur charge
  MessageErreurCharge() {
    if (this.InformationsGeneralesForm.get('ChargeTransport').hasError('required')) {
      return 'Vous devez entrer la charge !';
    }
    else {
      return '';
    }
  }
  //message d'erreur pourcentage charge
  MessageErreurPourcentageCharge() {
    if (this.ChargeForm.get('Ch').hasError('required')) {
      return 'Vous devez entrer la pourcentage charge !';
    }
    if (this.ChargeForm.get('Ch').hasError('max')) {
      return 'Invalide : Max 100% !';
    }
    return this.ChargeForm.get('Ch').hasError('min') ?
      'Invalide : Min 0% !' : '';
  }
  //message erreur quantité
  MessageErreurQuantite() {
    if (this.ListeArticleForm.get('Quantite').hasError('required')) {
      return 'Vous devez entrer la quantité !';
    }
    return this.ListeArticleForm.get('Quantite').hasError('min') ?
      'Invalide : Min 0 !' : '';
  }
  //message erreur prix
  MessageErreurPrix() {
    if (this.ListeArticleForm.get('Prix').hasError('required')) {
      return 'Vous devez entrer le prix !';
    }
    else {
      return '';
    }
  }
  //message erreur prix HT
  MessageErreurPrixHT() {
    if (this.ListeArticleForm.get('Prix_HT').hasError('required')) {
      return 'Vous devez entrer le prix HT !';
    }
    else {
      return '';
    }
  }
  //message erreur n° facture
  MessageErreurNFacture() {
    if (this.InformationsGeneralesForm.get('N_Facture').hasError('required')) {
      return 'Vous devez entrer le numéro de facture !';
    }
    else {
      return '';
    }
  }
  //Vérifier pourcentage charge et calcul charge automatique des autres articles
  verifierCharge(event: any, index: any) {
    let total1 = 0;
    for (let i = 0; i < this.articles.data.length; i++) {
      total1 += Number(this.articles.data[i].charge);
    }
    if (total1 != 100) {
      Swal.fire({
        title: "Mettre à jour automatiquement la charge d'autres articles ?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Oui, les mettre à jour?',
        cancelButtonText: 'Non'
      }).then((result) => {
        if (result.value) {
          let table: number[] = [];
          for (let i = 0; i < this.articles.data.length; i++) {
            if (i != index) {
              table.push(i);
            }
          }
          for (let j of table) {
            this.articles.data[j].charge = (Number(this.articles.data[j].prix_u_ht) / (Number(this.InformationsGeneralesForm.get('Totale_Facture').value) - Number(this.articles.data[index].prix_u_ht * Number(this.articles.data[index].qte))) * Number(this.articles.data[j].qte) * (100 - this.articles.data[index].charge)).toFixed(3);
          }
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          Swal.fire(
            'Annulé',
            '',
            'error'
          )
        }
      })
    }
  }
  //Chaque seconde vérifier le calcul
  activerCalcul() {
    interval(1000).subscribe(x => {
      this.calculTotaux();
      this.calculAssiette();
    });
  }
  //alert en cas Total_HT_Facture # Total_HT_Calculé!
  alertDifferentTotal() {
    if (this.InformationsGeneralesForm.get('Totale_Facture').value != Number(this.totalHT)) {
      Swal.fire(
        'Attention!',
        'Total HT Facture # Total HT Calculé! ',
        'error'
      )
    }
    else {
    }
  }
  //Selon type produit l'ouverture du dialogue correspondant
  testerType(index: any) {
    this.recupererIdArticle(this.articles.data[index].id)
    if (this.articles.data[index].type == "4G") {
      this.ouvreDialog4g(index, this.articles.data[index], this.articles.data, this.tableserie, this.tablee1, this.tablee2);
    }
    else if (this.articles.data[index].type == "Serie") {
      this.ouvreDialogSerie(index, this.articles.data[index], this.articles.data, this.test);
    }
    else {
    }
  }
  //dialogue produit type 4G
  ouvreDialog4g(indice: any, fieldArray: any, field: any, tablenumero: any, tableE1: any, tableE2: any): void {
    const dialogRef = this.dialog.open(Dialog4gModifBonEntreeLocal, {
      width: '800px',
      data: { index: indice, ligne_tableau: fieldArray, table: field, tablenumero, tableE1, tableE2 }
    });
    dialogRef.afterClosed().subscribe(result => {
    });
  }
  //dialogue produit type Série
  ouvreDialogSerie(indice: any, fieldArray: any, field: any, tableNserie: any): void {
    const dialogRef = this.dialog.open(DialogSerieModifBonEntreeLocal, {
      width: '800px',
      data: { index: indice, ligne_tableau: fieldArray, table: field, tableNserie, }
    });
    dialogRef.afterClosed().subscribe(result => {
    });
  }
}
//component dialogue en cas type produit 4g
@Component({
  selector: 'dialog-4g-modif-bon-entree-local',
  templateUrl: 'dialog-4g-modif-bon-entree-local.html',
})
export class Dialog4gModifBonEntreeLocal {
  nbrQte: any = [];
  txtValue: string = '';
  message: string = '';
  Numero_Serie: any = [''];
  E1: any = [''];
  E2: any = [''];
  ligne_table: any;
  table: any;
  data3: any = "";
  data4: any = "";
  data5: any = "";
  data4Gs: any = "";
  dataSeries: any = "";
  typeProduit: any;
  DetailProduit: any;
  N_SerieStocke: any = [];
  E1Stocke: any = [];
  E2Stocke: any = [];
  id: any;
  signaler_probleme: any;
  Ref_FR: any;
  Quantite: any;
  PrixU: any;
  Remise: any;
  Fodec: any;
  Prix_U_TTC: any;
  PrixRevientU: any;
  Ch: any;
  Ch_Piece: any;
  Tva: any;
  indice: any;
  tableNserie: any = [];
  QuantiteArticle: any;
  verifStock: boolean = false;
  verifProduitStock: any = [];
  nom: any;
  tableConcat1: any = [];
  tableConcat2: any = [];
  constructor(public bonEntreeService: BonEntreeService,
    public dialogRef: MatDialogRef<Dialog4gModifBonEntreeLocal>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    this.ligne_table = data.ligne_tableau;
    this.table = data.table;
    this.indice = data.index;
    this.nbrQte.length = data.ligne_tableau.qte;
    dialogRef.disableClose = true;
    this.Detail_Produit();
    this.tableNserie = data.tablenumero;
    this.E1 = data.tableE1;
    this.E2 = data.tableE2;
  }
  //fermer dialogue
  fermerDialogue() {
    this.dialogRef.close();
  }
  //Vérifier si entrée stock accompli ou non
  VerifVide() {
    for (let i = 0; i < this.ligne_table.qte; i++) {
      if (this.Numero_Serie[i] == '' || this.Numero_Serie[i] == undefined) {
        this.ligne_table.EtatEntree = "Entrée Stock Non Accompli";
      }
      else {
        this.ligne_table.EtatEntree = "Entrée Stock Vérifié";
      }
      this.dialogRef.close();
    }
    this.EntreeXml();
  }
  //Création du fichier xml du produit série
  EntreeXml() {
    let url = "assets/Entree.xml";
    fetch(url)
      .then(response => response.text())
      .then(data => {
        let parser = new DOMParser();
        for (let i = 0; i < this.tableNserie.length; i++) {
          this.data4 = this.data4
            + "<Produit_4G>" + "<N_Serie>" + this.tableNserie[i] + "</N_Serie>" + "<E1>" + this.E1[i] + "</E1>" + "<E2>" + this.E2[i] + "</E2>" + "</Produit_4G>";
          this.id = this.table[this.indice].id;
          this.nom = this.table[this.indice].nom;
          this.signaler_probleme = this.table[this.indice].Signaler_Probleme
          this.Ref_FR = this.table[this.indice].ref_fr
          this.Quantite = this.table[this.indice].qte
          this.PrixU = this.table[this.indice].prix_u_ht
          this.Tva = this.table[this.indice].tva
          this.Remise = this.table[this.indice].remise
          this.Fodec = this.table[this.indice].fodec
          this.Prix_U_TTC = this.table[this.indice].prixuttc
          this.PrixRevientU = this.table[this.indice].prixruht
          this.Ch = this.table[this.indice].charge
          this.Ch_Piece = this.table[this.indice].ch_piece
        }
        for (let j = 0; j < this.table.length; j++) {
          if (this.table[j].type == "4G") {
            this.typeProduit = "4G";
            this.data4Gs = this.data4;
            this.dataSeries = '';
            this.data3 = "<Produit>" + "<Id>" + this.id + "</Id>"
              + "<Nom>" + this.nom + "</Nom>"
              + "<Signaler_Probleme>" + this.signaler_probleme + "</Signaler_Probleme>"
              + "<Ref>" + this.Ref_FR + "</Ref>"
              + "<Qte>" + this.Quantite + "</Qte>"
              + "<Prix_U_HT>" + this.PrixU + "</Prix_U_HT>"
              + "<Tva>" + this.Tva + "</Tva>"
              + "<Remise>" + this.Remise + "</Remise>"
              + "<Fodec>" + this.Fodec + "</Fodec>"
              + "<Prix_U_TTC>" + this.Prix_U_TTC + "</Prix_U_TTC>"
              + "<PrixRevientU>" + this.PrixRevientU + "</PrixRevientU>"
              + "<Charge>" + this.Ch + "</Charge>"
              + "<Ch_Piece>" + this.Ch_Piece + "</Ch_Piece>"
              + "<Type>" + this.typeProduit + "</Type>"
              + "<N_Series>" + this.dataSeries + "</N_Series>" + "<Produit_4Gs>" + this.data4Gs + "</Produit_4Gs>" + "</Produit>"
          }
          else if (this.table[j].type == "Serie") {
            this.typeProduit = "Serie";
            this.data4Gs = '';
            this.dataSeries = this.data5;
          }
          else {
            this.typeProduit = "Simple";
            this.data4Gs = '';
            this.dataSeries = '';
          }
        }
        this.table[this.indice].Produits4g = this.data3;
        var parseString = require('xml2js').parseString;
        parseString(this.data3, function (err: any, result: any) {
        });
        this.table[0].Fichier4G = "<Produits_4Gs>" + this.table[0].Produits4g + "</Produits_4Gs>";
      })
    this.dialogRef.close();
  }
  //Vérifier si produit en stock ou non.Si oui lire ses détails.
  Detail_Produit() {
    let N_SerieStocke: any = [];
    let E1Stocke: any = [];
    let E2Stocke: any = [];
    for (let i = 0; i < this.table.length; i++) {
      this.bonEntreeService.ProduitEnStock(this.table[i].id).subscribe((reponse: any) => {
        this.verifProduitStock[i] = reponse;
        if (this.table[i].type == "4G") {
          if (reponse === 'oui') {
            this.bonEntreeService.Detail_Produit(this.table[i].id).subscribe((detail: any) => {
              const reader = new FileReader();
              reader.onloadend = () => {
                this.DetailProduit = reader.result;
                var parseString = require('xml2js').parseString;
                parseString(atob(this.DetailProduit.substr(28)), function (err: any, result: any) {
                  for (let k = 0; k < result.Produits.Produit_4G.length; k++) {
                    N_SerieStocke.push(result.Produits.Produit_4G[k].N_Serie.toString());
                    E1Stocke.push(result.Produits.Produit_4G[k].E1.toString());
                    E2Stocke.push(result.Produits.Produit_4G[k].E2.toString());
                  }
                })
                this.N_SerieStocke = N_SerieStocke;
                this.E1Stocke = E1Stocke;
                this.E2Stocke = E2Stocke;
              }
              reader.readAsDataURL(detail);
            })
          }
        }
      })
    }
  }
  //Vérifier si numéro série existe déjà en stock ou non.Si oui afficher une alerte et bloquer la validation 
  verifN_serieProduit(event: any) {
    const found = this.N_SerieStocke.find((element: any) => element == event.target.value);
    if (found != undefined) {
      this.verifStock = true;
      Swal.fire("Attention! Numéro Série existe déjà dans le stock.");
    }
    else {
      this.verifStock = false;
    }
    this.ElimineRedondanceN_serie();
    this.ElimineRedondance();
  }
  //Vérifier si numéro série saisi déjà ou non.Si oui afficher une alerte et bloquer la validation 
  ElimineRedondanceN_serie() {
    for (let i = 0; i < this.Numero_Serie.length; i++) {
      for (let j = i + 1; j < this.Numero_Serie.length; j++) {
        if (this.Numero_Serie[i] == this.Numero_Serie[j]) {
          if (this.verifStock == false) {
            this.verifStock = true;
          }
          Swal.fire("Attention! Numéro Série déjà saisi.")
        }
      }
    }
  }
  //Vérifier si numéro IMEI1 existe déjà en stock ou non.Si oui afficher une alerte et bloquer la validation 
  verifE1Produit(event: any) {
    const found = this.E1Stocke.find((element: any) => element == event.target.value);
    if (found != undefined) {
      this.verifStock = true;
      Swal.fire("Attention! Numéro IMEI 1 existe déjà dans le stock.");
    }
    else {
      this.verifStock = false;
    }
    this.ElimineRedondanceE1();
    this.ElimineRedondance();
  }
  //Vérifier si numéro IMEI1 saisi déjà ou non.Si oui afficher une alerte et bloquer la validation 
  ElimineRedondanceE1() {
    for (let i = 0; i < this.E1.length; i++) {
      for (let j = i + 1; j < this.E1.length; j++) {
        if (this.E1[i] == this.E1[j]) {
          if (this.verifStock == false) {
            this.verifStock = true;
          }
          else { }
          Swal.fire("Attention! Numéro IMEI 1 déjà saisi.")
        }
      }
    }
  }
  //Vérifier si numéro IMEI2 existe déjà en stock ou non.Si oui afficher une alerte et bloquer la validation    
  verifE2Produit(event: any) {
    const found = this.E2Stocke.find((element: any) => element == event.target.value);
    if (found != undefined) {
      this.verifStock = true;
      Swal.fire("Attention! Numéro IMEI 2 existe déjà dans le stock.");
    }
    else {
      this.verifStock = false;
    }
    this.ElimineRedondanceE2();
    this.ElimineRedondance();
  }
  //Vérifier si numéro IMEI2 saisi déjà ou non.Si oui afficher une alerte et bloquer la validation 
  ElimineRedondanceE2() {
    for (let i = 0; i < this.E2.length; i++) {
      for (let j = i + 1; j < this.E2.length; j++) {
        if (this.E2[i] == this.E2[j]) {
          if (this.verifStock == false) {
            this.verifStock = true;
          }
          Swal.fire("Attention! Numéro IMEI 2 déjà saisi.")
        }
      }
    }
  }
  //Vérifier si numéro saisi déjà ou non.Si oui afficher une alerte et bloquer la validation 
  ElimineRedondance() {
    this.tableConcat1 = this.E1.concat(this.E2);
    this.tableConcat2 = this.tableConcat1.concat(this.tableNserie)
    for (let i = 0; i < this.tableConcat2.length; i++) {
      if (this.tableConcat2[i] == "") {
        this.tableConcat2.splice(i, 1);
      } else { }
      for (let j = i + 1; j < this.tableConcat2.length; j++) {
        if (this.tableConcat2[i] == this.tableConcat2[j] && this.tableConcat2[i] != "") {
          if (this.verifStock == false) {
            this.verifStock = true;
          }
          Swal.fire("Attention! Numéro déjà saisi.")
        }
      }
    }
  }
}
//component dialogue en cas type produit série
@Component({
  selector: 'dialog-serie-modif-bon-entree-local',
  templateUrl: 'dialog-serie-modif-bon-entree-local.html',
})
export class DialogSerieModifBonEntreeLocal {
  nbrQte: any = [];
  Numero_SerieS: any = [''];
  E1: any = [''];
  E2: any = [''];
  ligne_table: any;
  table: any;
  data3: string = '';
  data4: any = '';
  data5: any = [];
  data4Gs: any = '';
  dataSeries: any = [];
  typeProduit: any;
  DetailProduit: any;
  N_SerieStocke: any;
  verifProduitStock: any = [];
  id: any;
  nom: any;
  signaler_probleme: any;
  Ref_FR: any;
  Quantite: any;
  PrixU: any;
  Remise: any;
  Fodec: any;
  Prix_U_TTC: any;
  PrixRevientU: any;
  Ch: any;
  Ch_Piece: any;
  Tva: any;
  indice: any;
  tableNserie: any = [];
  verifStock: boolean = false;
  constructor(public bonEntreeService: BonEntreeService,
    public dialogRef: MatDialogRef<DialogSerieModifBonEntreeLocal>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    this.ligne_table = data.ligne_tableau;
    this.table = data.table;
    this.indice = data.index;
    this.tableNserie = data.tableNserie;
    this.nbrQte.length = data.ligne_tableau.qte;
    dialogRef.disableClose = true;
    this.Detail_Produit();
  }
  //fermer dialogue
  fermerDialogue() {
    this.dialogRef.close();
  }
  //fichier xml entree
  EntreeXml() {
    let url = "assets/Entree.xml";
    fetch(url)
      .then(response => response.text())
      .then(data => {
        for (let i = 0; i < this.table[this.indice].qte; i++) {
          this.data5 = this.data5 + "<N_Serie>" + this.tableNserie[i] + "</N_Serie>";
          this.id = this.table[this.indice].id;
          this.nom = this.table[this.indice].nom;
          this.signaler_probleme = this.table[this.indice].Signaler_Probleme
          this.Ref_FR = this.table[this.indice].ref_fr
          this.Quantite = this.table[this.indice].qte
          this.PrixU = this.table[this.indice].prix_u_ht
          this.Tva = this.table[this.indice].tva
          this.Remise = this.table[this.indice].remise
          this.Fodec = this.table[this.indice].fodec
          this.Prix_U_TTC = this.table[this.indice].prixuttc
          this.PrixRevientU = this.table[this.indice].prixruht
          this.Ch = this.table[this.indice].charge
          this.Ch_Piece = this.table[this.indice].ch_piece
        }
        for (let j = 0; j < this.table.length; j++) {
          if (this.table[j].type == "4G") {
            this.typeProduit = "4G";
            this.data4Gs = this.data4;
            this.dataSeries = '';
          }
          else if (this.table[j].type == "Serie") {
            this.typeProduit = "Serie";
            this.data4Gs = '';
            this.dataSeries = this.data5;
            this.data3 = "<Produit>" + "<Id>" + this.id + "</Id>"
              + "<Nom>" + this.nom + "</Nom>"
              + "<Signaler_Probleme>" + this.signaler_probleme + "</Signaler_Probleme>"
              + "<Ref>" + this.Ref_FR + "</Ref>"
              + "<Qte>" + this.Quantite + "</Qte>"
              + "<Prix_U_HT>" + this.PrixU + "</Prix_U_HT>"
              + "<Tva>" + this.Tva + "</Tva>"
              + "<Remise>" + this.Remise + "</Remise>"
              + "<Fodec>" + this.Fodec + "</Fodec>"
              + "<Prix_U_TTC>" + this.Prix_U_TTC + "</Prix_U_TTC>"
              + "<PrixRevientU>" + this.PrixRevientU + "</PrixRevientU>"
              + "<Charge>" + this.Ch + "</Charge>"
              + "<Ch_Piece>" + this.Ch_Piece + "</Ch_Piece>"
              + "<Type>" + this.typeProduit + "</Type>"
              + "<N_Series>" + this.dataSeries + "</N_Series>" + "<Produit_4Gs>" + this.data4Gs + "</Produit_4Gs>" + "</Produit>";
          }
          else {
            this.typeProduit = "Simple";
            this.data4Gs = '';
            this.dataSeries = '';
          }
        }
        this.table[this.indice].Produitsserie = this.data3;
        this.table[0].Produitsserie = this.data3;
        var parseString = require('xml2js').parseString;
        parseString(this.data3, function (err: any, result: any) {
        });
        this.table[0].FichierSerie = "<Produits_Series>" + this.table[0].Produitsserie + "</Produits_Series>";
      })
    this.dialogRef.close();
  }
  //Vérifier si entrée stock accompli ou non
  VerifVide() {
    for (let i = 0; i < this.nbrQte.length; i++) {
      if (this.Numero_SerieS[i] != '') {
        this.ligne_table.EtatEntree = "Entrée Stock Vérifié";
      }
      else if (this.Numero_SerieS[i] == 'undefined') {
        this.ligne_table.EtatEntree = "Entrée Stock Non Accompli";
      }
      this.dialogRef.close();
    }
    this.EntreeXml();
  }
  //Vérifier si produit en stock ou non.Si oui lire ses détails.
  Detail_Produit() {
    let N_SerieStocke: any = [];
    for (let i = 0; i < this.table.length; i++) {
      this.bonEntreeService.ProduitEnStock(this.table[i].id).subscribe((reponse: any) => {
        this.verifProduitStock[i] = reponse;
        if (this.table[i].type === "Serie") {
          if (reponse === 'oui') {
            this.bonEntreeService.Detail_Produit(this.table[i].id).subscribe((detail: any) => {
              const reader = new FileReader();
              reader.onloadend = () => {
                this.DetailProduit = reader.result;
                var parseString = require('xml2js').parseString;
                parseString(atob(this.DetailProduit.substr(28)), function (err: any, result: any) {
                  for (let k = 0; k < result.Produits.N_Serie.length; k++) {
                    N_SerieStocke.push(result.Produits.N_Serie[k].Numero.toString());
                  }
                })
                this.N_SerieStocke = N_SerieStocke;
              }
              reader.readAsDataURL(detail);
            })
          }
        }
      })
    }
  }
  //Vérifier si numéro série existe déjà en stock ou non.Si oui afficher une alerte et bloquer la validation 
  verifN_serieProduit(event: any, index: any) {
    const found = this.N_SerieStocke.find((element: any) => element == event.target.value);
    if (found != undefined) {
      this.verifStock = true;
      Swal.fire("Attention! Numéro Série existe déjà dans le stock.");
    }
    else {
      this.verifStock = false;
    }
    this.ElimineRedondanceN_serie()
  }
  //Vérifier si numéro série saisi déjà ou non.Si oui afficher une alerte et bloquer la validation 
  ElimineRedondanceN_serie() {
    for (let i = 0; i < this.tableNserie.length; i++) {
      for (let j = i + 1; j < this.tableNserie.length; j++) {
        if (this.tableNserie[i] == this.tableNserie[j]) {
          if (this.verifStock == false) {
            this.verifStock = true;
          }
          Swal.fire("Attention! Numéro Série déjà saisi.")
        }
      }
    }
  }
}