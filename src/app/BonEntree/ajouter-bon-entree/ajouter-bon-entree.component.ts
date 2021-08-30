import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { interval } from 'rxjs';
import Swal from 'sweetalert2';
import 'sweetalert2/src/sweetalert2.scss';
import { BonEntreeService } from '../bon-entree.service';
@Component({
  selector: 'app-ajouter-bon-entree',
  templateUrl: './ajouter-bon-entree.component.html',
  styleUrls: ['./ajouter-bon-entree.component.scss']
})
export class AjouterBonEntreeComponent implements OnInit {
  lineaire = true;
  InformationsGeneralesForm: any = FormGroup;
  ChargeForm: any = FormGroup;
  ListeArticleForm: any = FormGroup;
  locals: any = [];
  fournisseurs: any = [];
  produits: any = [];
  Id_Produit: any;
  Ref_FR: any;
  N_Facture: any;
  Quantite: any = 0;
  Remise: any = 0;
  Prix: any = 0;
  IdProduit: any;
  produitData: any;
  Montant_TVA: any = 0;
  prix: any = 0;
  ref_FR: any;
  quantite: any = 0;
  id_produit: any;
  tva: any = 0;
  fodec: any = 0;
  Totale_TTC: any = 0;
  bonEntreeLocals: any = [];
  categorie_paiement: any;
  fieldArray: Array<any> = [];
  newAttribute: any = {};
  Totale_Facture: any = 0;
  Totale_Facture_TTC: any = 0;
  Total_HT: any = 0;
  totalMontantTVA: any = 0;
  totalMontantFodec: any = 0;
  totalHT: any = 0;
  totalHTBrut: any = 0;
  totalRHT: any = 0;
  totalRemise: any = 0;
  totalFodec: any = 0;
  totalPorcentageFodec: any = 0;
  totalTTc: any = 0;
  totalRTTC: any = 0;
  Ch_Globale: any = 0;
  ChargeTransport: any = 0;
  Autre_Charge_Fixe: any = 0;
  Ch: any = 0;
  totalChGlobale: any = 0;
  PrixRevientU: any = 0;
  index: any = 0;
  data3: any = "";
  data4: any = "";
  cocher: any;
  click: boolean = true;
  totalPourcentCh: any;
  verifTotal: boolean = true;
  EntreeForm: any = FormGroup;
  showStyle: boolean;
  tableTotal_HT: any;
  Montant_Fodec: any = 0;
  Prix_U_TTC: any = 0;
  EtatEntree: any;
  fichierEtat: any;
  verif: boolean = true;
  valide: any;
  date_de_jour = new Date();
  table: number[] = [];
  tableIndex: number[] = [];
  tableCh: number[] = [];
  tvaType: any;
  assiette: any = 0;
  Montant: any = 0;
  assiette19: any = 0;
  assiette7: any = 0;
  assiette13: any = 0;
  Montant19: any = 0;
  Montant7: any = 0;
  Montant13: any = 0;
  assiettetva19 = 0;
  Montanttva19 = 0;
  assiettetva7 = 0;
  Montanttva7 = 0;
  assiettetva13 = 0;
  Montanttva13 = 0;
  fournisseur: any;
  signaler_probleme: boolean;
  Ref_FR_article: any;
  
  constructor(public bonEntreeService: BonEntreeService, private router: Router, private fb: FormBuilder, public dialog: MatDialog) {
    this.cocher = true;
    this.valide = true;
    this.signaler_probleme = true;
    //activer le calcul des totaux
    this.activerCalcul();
    //activer la verification charge total
    this.actiververifCh();
    //récupérer la liste des categories de données
    this.bonEntreeService.obtenirCategoriePaiement().subscribe((response: Response) => {
      this.categorie_paiement = response;
    });
    this.Locals();
    this.Fournisseurs();
    this.Produits();
    this.BonEntreeLocals();
    this.InformationsGeneralesForm = this.fb.group({
      Des: [''],
      DateEntree: [, Validators.required],
      N_Facture: ['', Validators.required],
      Totale_Facture: ['', Validators.required],
      Totale_Facture_TTC: [''],
      Local: ['', Validators.required],
      Ag_Ttransport: [''],
      Mode_Paiement: ['', Validators.required],
      Type: ['', Validators.required],
      Fournisseur: [''],
      ChargeTransport: [''],
      Autre_Charge_Fixe: [''],
    });
    this.ListeArticleForm = this.fb.group({
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
    });
    this.ChargeForm = this.fb.group({
      Id_article: [''],
      Ref_fournisseur: [''],
      Qte: [''],
      Prix_U: [''],
      TVA: [''],
      M_TVA: [''],
      Fodec: [''],
      Prix_HT: [''],
      Totale_TTC: [''],
      PrixRevientU: [''],
      totalRemise: [''],
      Ch: [
        "",
        [
          Validators.min(0),
          Validators.max(100)
        ]
      ],
      Ch_Globale: ['']
    });
    this.EntreeForm = this.fb.group({
      IdProduit: [''],
      Quantite: [],
      Id_Produit: [''],
      Qte: [''],
      EtatEntree: []
    });
  }
  //chaque seconde verifier le calcul
  activerCalcul() {
    interval(1000).subscribe(x => {
      this.calcul();
      this.calculAssiette();
    });
  }
  //activer/desactiver la step entree
  verificationCh(event: any) {
    let total1 = 0;
    for (let i = 0; i < this.fieldArray.length; i++) {
      this.verif = this.fieldArray[i].verifCh;
      total1 += Number(this.fieldArray[i].Ch);
      if (total1 != 100.000 || total1 != 100) {
        this.fieldArray[i].verifCh = true;
      }
      else {
        this.fieldArray[i].verifCh = false;
      }
    }
  }
  //dialogue modifier ligne table articles
  ouvreDialogueArticle(indice: any, fieldArray: any, field: any): void {
    const dialogRef = this.dialog.open(DialogOverviewArticleDialog, {
      width: '500px',
      data: { index: indice, ligne_tableau: fieldArray, table: field }
    });
    dialogRef.afterClosed().subscribe(result => {    
      fieldArray.Quantite = result.qte_modifier;
      fieldArray.PrixU = result.prixU_modifier;
      fieldArray.Remise = result.remise_modifier;
      fieldArray.Montant_HT = ((Number(fieldArray.PrixU) * Number(fieldArray.Quantite)) * (1 - (Number(fieldArray.Remise)) / 100)).toFixed(3);
      this.Montant_Fodec = (fieldArray.Montant_HT * fieldArray.Fodec) / 100;      
      fieldArray.Montant_Fodec = Number(this.Montant_Fodec);
      this.Montant_TVA = ((Number(fieldArray.Montant_HT) + Number(fieldArray.Montant_Fodec)) * fieldArray.Tva) / 100;
      fieldArray.Montant_TVA = Number(this.Montant_TVA);
      fieldArray.Prix_U_TTC = (((Number(fieldArray.Montant_HT) + Number(fieldArray.Montant_Fodec) + Number(fieldArray.Montant_TVA))) / Number(fieldArray.Quantite)).toFixed(3);
      fieldArray.Total_TVA = ((Number(fieldArray.Montant_TVA)) / (Number(fieldArray.Quantite))).toFixed(3);
      fieldArray.Montant_TTC = Number(fieldArray.Prix_U_TTC) * Number(fieldArray.Quantite);
      fieldArray.Ch = ((((Number(fieldArray.PrixU)) / Number(fieldArray.TotalFacture)) * 100) * Number(fieldArray.Quantite)).toFixed(3);
      fieldArray.Ch_Piece = (((((Number(fieldArray.ChargeTr) + Number(fieldArray.AutreCharge)) * Number(fieldArray.Ch)) / 100)) / (Number(fieldArray.Quantite))).toFixed(3);
      fieldArray.PrixRevientU = (Number(fieldArray.PrixU) + Number(fieldArray.Ch_Piece)).toFixed(3);
    });
  }
  //dialogue modifier ligne table charge
  ouvreDialogCharge(indice: any, fieldArray: any, field: any): void {
    const dialogRef = this.dialog.open(DialogOverviewChargeDialog, {
      width: '500px',
      data: { index: indice, ligne_tableau: fieldArray, table: field }
    });
    dialogRef.afterClosed().subscribe(result => {
      fieldArray.Quantite = result.qte_modifier_ch;
      fieldArray.PrixU = result.prixU_modifier_ch;
      fieldArray.Remise = result.remise_modifier_ch;
      fieldArray.Montant_HT = ((Number(fieldArray.PrixU) * Number(fieldArray.Quantite)) * (1 - (Number(fieldArray.Remise)) / 100)).toFixed(3);
      this.Montant_Fodec = (fieldArray.Montant_HT * fieldArray.Fodec) / 100;
      fieldArray.Montant_Fodec = Number(this.Montant_Fodec);
      this.Montant_TVA = ((Number(fieldArray.Montant_HT) + Number(fieldArray.Montant_Fodec)) * fieldArray.Tva) / 100;
      fieldArray.Montant_TVA = Number(this.Montant_TVA);
      fieldArray.Prix_U_TTC = (((Number(fieldArray.Montant_HT) + Number(fieldArray.Montant_Fodec) + Number(fieldArray.Montant_TVA))) / Number(fieldArray.Quantite)).toFixed(3);
      fieldArray.Total_TVA = ((Number(fieldArray.Montant_TVA)) / (Number(fieldArray.Quantite))).toFixed(3);
      fieldArray.Montant_TTC = Number(fieldArray.Prix_U_TTC) * Number(fieldArray.Quantite);
      fieldArray.Ch = ((((Number(fieldArray.PrixU)) / Number(fieldArray.TotalFacture)) * 100) * Number(fieldArray.Quantite)).toFixed(3);
      fieldArray.Ch_Piece = (((((Number(fieldArray.ChargeTr) + Number(fieldArray.AutreCharge)) * Number(fieldArray.Ch)) / 100)) / (Number(fieldArray.Quantite))).toFixed(3);
      fieldArray.PrixRevientU = (Number(fieldArray.PrixU) + Number(fieldArray.Ch)).toFixed(3);
    });
  }
  //dialogue produit type simple
  ouvreDialogSimple(indice: any, fieldArray: any, field: any): void {
    const dialogRef = this.dialog.open(DialogOverviewSimpleDialog, {
      width: '400px',
      data: { index: indice, ligne_tableau: fieldArray, table: field }
    });
    dialogRef.afterClosed().subscribe(result => {
    });
  }
  //dialogue produit type serie
  ouvreDialogSerie(indice: any, fieldArray: any, field: any): void {
    const dialogRef = this.dialog.open(DialogOverviewSerieDialog, {
      width: '400px',
      data: { index: indice, ligne_tableau: fieldArray, table: field }
    });
    dialogRef.afterClosed().subscribe(result => {
    });
  }
  //dialogue produit type 4G
  ouvreDialog4g(indice: any, fieldArray: any, field: any): void {
    const dialogRef = this.dialog.open(DialogOverview4gDialog, {
      width: '800px',
      data: { index: indice, ligne_tableau: fieldArray, table: field }
    });
    dialogRef.afterClosed().subscribe(result => {
    });
  }
  //Selon type produit l'ouverture du dialogue 
  testerType(index: any) {
    if (this.fieldArray[index].N_Imei == "true") {
      this.ouvreDialog4g(index, this.fieldArray[index], this.fieldArray);
    }
    else if (this.fieldArray[index].N_Serie == "true") {
      this.ouvreDialogSerie(index, this.fieldArray[index], this.fieldArray);
    }
    else {
      this.ouvreDialogSimple(index, this.fieldArray[index], this.fieldArray);
    }
  }
  ngOnInit(): void {
  }
  //modifier charge
  modifCharge(event: any, index: any) {
    if (event.checked == false) {
      this.fieldArray[index].valide = false;
      this.table = [];
      this.tableIndex.push(index);
      for (let i = 0; i < this.fieldArray.length; i++) {
        for (let j = 0; j < this.tableIndex.length; j++)
          if (i != this.tableIndex[j]) {
            this.tableCh.push(i);
          }
      }      
    }
  }
  //Calculer charge par piéce
  calculChPiece(index: any) {
    let PourcentageCh: any = 0;
    let TotalFact: any = 0;
    this.fieldArray[index].PrixRevientU = (Number(this.fieldArray[index].PrixU) + Number(this.fieldArray[index].Ch_Piece)).toFixed(3);
    this.fieldArray[index].Ch_Piece = (((((Number(this.ChargeTransport) + Number(this.Autre_Charge_Fixe)) * Number(this.fieldArray[index].Ch)) / 100)) / (Number(this.fieldArray[index].Quantite))).toFixed(3);
    this.modifCharge(event, index);
    PourcentageCh = Number(this.fieldArray[index].Ch);
    TotalFact = (Number(this.fieldArray[index].PrixU) * (Number(this.fieldArray[index].Quantite))); 
    for (let j of this.tableCh) {
      this.fieldArray[j].Ch = ((((Number(this.fieldArray[j].PrixU)) / (Number(this.InformationsGeneralesForm.get('Totale_Facture').value) - TotalFact)) * (100 - PourcentageCh)) * Number(this.fieldArray[j].Quantite)).toFixed(3);
      this.fieldArray[j].Ch_Piece = (((((Number(this.ChargeTransport) + Number(this.Autre_Charge_Fixe)) * Number(this.fieldArray[j].Ch)) / (100 - PourcentageCh))) / (Number(this.fieldArray[j].Quantite))).toFixed(3);
      this.fieldArray[j].PrixRevientU = (Number(this.fieldArray[j].PrixU) + Number(this.fieldArray[j].Ch_Piece)).toFixed(3);
    }     
  }
  //calculer les totaux
  calcul() {
    let total1 = 0;
    let total2 = 0;
    let total3 = 0;
    let total4 = 0;
    let total5 = 0;
    let total6 = 0;
    let total7 = 0;
    let total8 = 0;
    let total9 = 0;
    let total10 = 0;
    let total11 = 0;
    for (var i = 0; i < this.fieldArray.length; i++) {
      total1 += (Number(this.fieldArray[i].Montant_TVA))
      this.totalMontantTVA = total1.toFixed(3);
      total2 += (Number(this.fieldArray[i].Montant_HT));
      this.totalHT = total2.toFixed(3);
      total3 += (Number(this.fieldArray[i].Prix_U_TTC)) * (Number(this.fieldArray[i].Quantite));
      this.totalTTc = total3.toFixed(3);
      total4 += Number(this.fieldArray[i].Ch_Globale);
      this.totalChGlobale = total4;
      total5 += (Number(this.fieldArray[i].Remise) * Number(this.fieldArray[i].PrixU) * Number(this.fieldArray[i].Quantite)) / 100;
      this.totalRemise = total5.toFixed(3);
      total9 += (Number(this.fieldArray[i].Fodec) * (Number(this.fieldArray[i].Quantite)));
      this.totalPorcentageFodec = total9;
      total6 += ((Number(this.fieldArray[i].PrixRevientU)) * (Number(this.fieldArray[i].Quantite)));
      this.totalRHT = total6.toFixed(3);
      total7 += ((Number(this.fieldArray[i].PrixRevientU)) * (Number(this.fieldArray[i].Quantite)) + Number(this.fieldArray[i].Montant_TVA) + Number(this.fieldArray[i].Montant_Fodec));
      this.totalRTTC = total7.toFixed(3);
      total8 += Number(this.fieldArray[i].Ch);
      this.totalPourcentCh = total8;
      this.newAttribute.totalPourcentCh = this.totalPourcentCh;
      total10 += this.fieldArray[i].Montant_Fodec;
      total11 += (Number(this.fieldArray[i].PrixU) * Number(this.fieldArray[i].Quantite));
      this.totalHTBrut = total11.toFixed(3);
      this.totalMontantFodec = total10.toFixed(3);
      this.totalMontantTVA = total1.toFixed(3);
    }
  }
  //Récuperer tous locaux
  Locals() {
    this.bonEntreeService.Locals().subscribe((data: any) => {
      this.locals = data;
    });
  }
  //Récuperer tous fournisseurs
  Fournisseurs() {
    this.bonEntreeService.Fournisseurs().subscribe((data: any) => {
      this.fournisseurs = data;
    });
  }
  //Récuperer fournisseur par id
  Fournisseur() {
    this.bonEntreeService.Fournisseur((this.InformationsGeneralesForm.get('Fournisseur').value)).subscribe((data: any) => {
      this.fournisseur = data;
    });
  }
  //Récuperer tous produits
  Produits() {
    this.bonEntreeService.Produits().subscribe((data: any) => {
      this.produits = data;
    });
  }
  //Récuperer tous produits
  BonEntreeLocals() {
    this.bonEntreeService.BonEntreeLocals().subscribe((data: any) => {
      this.bonEntreeLocals = data;
    });
  }
  //Récuperer la valeur entrée Ref_FR
  Ref_FR_Valeur(event: any) {
    this.Ref_FR = event.target.value;
  }
  //Récuperer la valeur entrée Quantite
  Quantite_Valeur(event: any) {
    this.Quantite = event.target.value;
if(event.target.value==0){
  this.click=true;
}else{
  this.click=false;
}
  }
  // fonction activée lors de choix du produit
  ProduitSelectionner(event: any) {
    this.Id_Produit = event;
    if(event==null){
      this.click = true;
    }
    else{ this.click = false;
    let j = 0;
    this.bonEntreeService.Ref_FR_Article(this.Id_Produit).subscribe((data: any) => {
      this.Ref_FR_article = data;
      for (var i = 0; i < this.fieldArray.length; i++) {
        if (this.fieldArray[i].Id_Produit == this.Id_Produit) {
          j = i;
          Swal.fire({
            title: 'Article existe déja! Le Mettre à jour?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Oui, modifier-le',
            cancelButtonText: 'Non'
          }).then((result) => {
            if (result.value) {
              this.ouvreDialogueArticle(j, this.fieldArray[j], this.fieldArray);
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
    })};
  }
  //Récuperer la valeur entrée Prix unitaire
  Prix_Valeur(event: any) {
    this.Prix = event.target.value;
  }
  //Récuperer la valeur entrée Prix HT
  PrixRevientU_Valeur(event: any) {
    this.PrixRevientU = event.target.value;
  }
  //Récuperer la valeur entrée Remise
  Remise_Valeur(event: any) {
    if (event.target.value == '') {
      this.Remise = 0;
    }
    this.Remise = event.target.value;
  }
  //message erreur quantité
  MessageErreurQte(){
    if (this.ListeArticleForm.get('Quantite').hasError('min')) {
      return 'La quantité ne doit pas être nulle!';
    }
    else {
      return '';
    } 
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
  //message erreur agence
  MessageErreurAgence() {
    if (this.InformationsGeneralesForm.get('Ag_Ttransport').hasError('required')) {
      return "Vous devez entrer l'agence transport!";
    }
    else {
      return '';
    }
  }
  //message erreur local
  MessageErreurLocal() {
    if (this.InformationsGeneralesForm.get('Local').hasError('required')) {
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
  //message erreur totale facture
  MessageErreurTotaleFacture() {
    if (this.InformationsGeneralesForm.get('Totale_Facture').hasError('required')) {
      return 'Vous devez entrer le total facture !';
    }
    else {
      return '';
    }
  }
  //ajouter article 
  ajouter() {
    this.click = !this.click;
    let total1 = 0;
    let total2 = 0;
    let total3 = 0;
    let total4 = 0;
    let total5 = 0;
    let total6 = 0;
    let total7 = 0;
    let total8 = 0;
    let total9 = 0;
    let total10 = 0;
    let total11 = 0;
    this.bonEntreeService.Produit(this.Id_Produit).subscribe((response: Response) => {
      this.produitData = response;
      this.newAttribute.Id_Produit = this.Id_Produit;
      this.newAttribute.Nom_Produit = this.produitData.nom_Produit;
      this.newAttribute.N_Imei = this.produitData.n_Imei;
      this.newAttribute.N_Serie = this.produitData.n_Serie;
      this.newAttribute.Tva = this.produitData.tva;
      this.tva = this.newAttribute.Tva;
      this.newAttribute.Ch = this.Ch;
      this.newAttribute.ChargeTr = this.ChargeTransport;
      this.newAttribute.AutreCharge = this.Autre_Charge_Fixe;
      if (this.produitData.fodec == "Sans_Fodec") {
        this.newAttribute.Fodec = 0;
      }
      else {
        this.newAttribute.Fodec = 1;
      }
      this.fodec = this.newAttribute.Fodec;
      this.newAttribute.PrixU = Number(this.Prix).toFixed(3);
      this.newAttribute.Quantite = Number(this.Quantite);
      this.newAttribute.Ref_FR = this.Ref_FR_article;
      this.newAttribute.Remise = Number(this.Remise);
      this.Totale_TTC = (Number(this.newAttribute.PrixU) / (1 + (Number(this.newAttribute.Tva)) / 100)).toFixed(3);
      Number(this.newAttribute.PrixU).toFixed(3);
      this.newAttribute.Montant_HT = ((Number(this.newAttribute.PrixU) * Number(this.newAttribute.Quantite)) * (1 - (Number(this.newAttribute.Remise)) / 100)).toFixed(3);
      this.Montant_Fodec = (this.newAttribute.Montant_HT * this.newAttribute.Fodec) / 100;
      this.Total_HT = Number(this.Totale_TTC) * Number((1 / this.Montant_TVA));
      this.newAttribute.Montant_Fodec = Number(this.Montant_Fodec);
      this.Montant_TVA = ((Number(this.newAttribute.Montant_HT) + Number(this.newAttribute.Montant_Fodec)) * this.newAttribute.Tva) / 100;
      this.newAttribute.Montant_TVA = Number(this.Montant_TVA);
      this.newAttribute.Prix_U_TTC = (((Number(this.newAttribute.Montant_HT) + Number(this.newAttribute.Montant_Fodec) + Number(this.newAttribute.Montant_TVA))) / Number(this.newAttribute.Quantite)).toFixed(3);
      this.newAttribute.Montant_TTC = Number(this.newAttribute.Prix_U_TTC) * Number(this.newAttribute.Quantite);
      this.newAttribute.Total_TVA = ((Number(this.newAttribute.Montant_TVA)) / (Number(this.newAttribute.Quantite))).toFixed(3);
      this.newAttribute.Totale_TTC = Number(this.Totale_TTC);
      this.newAttribute.Total_HT = Number(this.Total_HT).toFixed(3);
      this.newAttribute.Ch_Globale = Number(this.Ch_Globale);
      this.newAttribute.TotalFacture = Number(this.InformationsGeneralesForm.get('Totale_Facture').value);
      this.newAttribute.EtatEntree = "Entrée Stock Non Accompli";
      this.newAttribute.verifCh = this.verif;
      this.newAttribute.valide = this.valide;
      this.newAttribute.signaler_probleme = this.signaler_probleme;
      this.newAttribute.FichierSimple = "";
      this.newAttribute.FichierSerie = "";
      this.newAttribute.Fichier4G = "";
      this.newAttribute.ProduitsSeries = "";
      this.newAttribute.Produits4g = "";
      this.fieldArray.push(this.newAttribute);
      this.newAttribute.PrixRevientU = (Number(this.newAttribute.Montant_HT) + ((Number(this.Ch / 100)) * (Number(this.ChargeTransport) + Number(this.Autre_Charge_Fixe))) / Number(this.Quantite)).toFixed(3)
      for (let i = 0; i < this.fieldArray.length; i++) {
        this.fieldArray[i].Ch = this.Ch;
        this.fieldArray[i].Ch_Globale = this.Ch_Globale;
      }
      this.testCheck(event);
      for (var i = 0; i < this.fieldArray.length; i++) {
        total1 += (Number(this.fieldArray[i].Montant_TVA));
        this.totalMontantTVA = total1.toFixed(3);
        total2 += (Number(this.fieldArray[i].Montant_HT));
        this.totalHT = total2.toFixed(3);
        this.newAttribute.totaleHT = this.totalHT;
        total3 += (Number(this.fieldArray[i].Prix_U_TTC)) * (Number(this.fieldArray[i].Quantite));
        this.totalTTc = total3.toFixed(3);
        total4 += Number(this.fieldArray[i].Ch_Globale);
        this.totalChGlobale = total4;
        total5 += ((Number(this.fieldArray[i].Remise) * Number(this.newAttribute.PrixU) * Number(this.fieldArray[i].Quantite)) / 100);
        this.totalRemise = total5.toFixed(3);
        total9 += (Number(this.fieldArray[i].Fodec) * (Number(this.fieldArray[i].Quantite)));
        this.totalPorcentageFodec = total9;
        total6 += ((Number(this.fieldArray[i].PrixRevientU)) * (Number(this.fieldArray[i].Quantite)));
        this.totalRHT = total6.toFixed(3);
        total7 += ((Number(this.fieldArray[i].PrixRevientU)) * (Number(this.fieldArray[i].Quantite)) + Number(this.fieldArray[i].Total_TVA));
        this.totalRTTC = total7.toFixed(3);
        total8 += Number(this.fieldArray[i].Ch);
        this.totalPourcentCh = total8;
        this.newAttribute.totalPourcentCh = this.totalPourcentCh;
        total10 += this.fieldArray[i].Montant_Fodec;
        total11 += (Number(this.fieldArray[i].PrixU) * Number(this.fieldArray[i].Quantite));
        this.totalHTBrut = total11.toFixed(3);
        this.totalMontantFodec = total10.toFixed(3);
        this.totalMontantTVA = total1.toFixed(3);
      }
      this.assiettefonction();
      this.tableAssiette();
      this.newAttribute = {};
    });
  }
  //Table Tva/assiette/montant
  assiettefonction() {
    let tvaTable: number[] = [];
    tvaTable.push(this.fieldArray[0].Tva);
    for (let i = 0; i < this.fieldArray.length; i++) {
      for (let j = 0; j < tvaTable.length; j++) {
        if (this.fieldArray[i].Tva != tvaTable[j]) {
          tvaTable.push(this.fieldArray[i].Tva);
        }
      }
    }
    this.tvaType = tvaTable.filter(function (elem, index, self) {
      return index === self.indexOf(elem);
    })
    this.tvaType.sort();
  }
  tableAssiette() {
    if (this.newAttribute.Tva == 19) {
      this.assiettetva19 += (Number(Number(this.newAttribute.Montant_HT) + Number(this.totalMontantFodec)));
      this.Montanttva19 += (Number(Number(this.newAttribute.Total_TVA)) * Number(this.newAttribute.Quantite));
      this.assiette19 = this.assiettetva19.toFixed(3);
      this.Montant19 = this.Montanttva19.toFixed(3);
    }
    else if (this.newAttribute.Tva == 7) {
      this.assiettetva7 += (Number(Number(this.newAttribute.Montant_HT) + Number(this.totalMontantFodec)));
      this.Montanttva7 += (Number(Number(this.newAttribute.Total_TVA) * Number(this.newAttribute.Quantite)));
      this.assiette7 = this.assiettetva7.toFixed(3);
      this.Montant7 = this.Montanttva7.toFixed(3);
    }
    else if (this.newAttribute.Tva == 13) {
      this.assiettetva13 += (Number(Number(this.newAttribute.Montant_HT) + Number(this.totalMontantFodec)));
      this.Montanttva13 += (Number(Number(this.newAttribute.Total_TVA) * Number(this.newAttribute.Quantite)));
      this.assiette13 = this.assiettetva13.toFixed(3);
      this.Montant13 = this.Montanttva13.toFixed(3);
    }
  }
  //activer/desactiver charge automatique
  testCheck(event: any) {
    if (event.checked == false) {
      this.Ch = 0;
      this.Ch_Globale = 0;
      for (let i = 0; i < this.fieldArray.length; i++) {
        this.fieldArray[i].Ch = this.Ch;
        this.fieldArray[i].Ch_Globale = this.Ch_Globale;
        this.fieldArray[i].Ch_Piece = 0;
        this.fieldArray[i].PrixRevientU = this.fieldArray[i].PrixU;
      }
    }
    else {
      for (let i = 0; i < this.fieldArray.length; i++) {
        this.fieldArray[i].Ch = ((((Number(this.fieldArray[i].PrixU)) / Number(this.InformationsGeneralesForm.get('Totale_Facture').value)) * 100) * Number(this.fieldArray[i].Quantite)).toFixed(3);
        this.fieldArray[i].Ch_Piece = (((((Number(this.ChargeTransport) + Number(this.Autre_Charge_Fixe)) * Number(this.fieldArray[i].Ch)) / 100)) / (Number(this.fieldArray[i].Quantite))).toFixed(3);
        this.fieldArray[i].PrixRevientU = (Number(this.fieldArray[i].PrixU) + Number(this.fieldArray[i].Ch_Piece)).toFixed(3);
      }
    }
  }
  //calcul assiettes tva
  calculAssiette() {
    if (this.fieldArray.length == 0) {
      this.tvaType = [];
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
      for (let i = 0; i < this.fieldArray.length; i++) {
        if (this.fieldArray[i].Tva == 19) {
          this.assiettetva19 += (Number(Number(this.fieldArray[i].Montant_HT) + Number(this.totalMontantFodec)));
          this.Montanttva19 += (Number(Number(this.fieldArray[i].Total_TVA)) * (Number(this.fieldArray[i].Quantite)));
          this.assiette19 = this.assiettetva19.toFixed(3);
          this.Montant19 = this.Montanttva19.toFixed(3);
        }
        else if (this.fieldArray[i].Tva == 7) {
          this.assiettetva7 += (Number(Number(this.fieldArray[i].Montant_HT) + Number(this.totalMontantFodec)));
          this.Montanttva7 += (Number(Number(this.fieldArray[i].Total_TVA) * Number(this.fieldArray[i].Quantite)));
          this.assiette7 = this.assiettetva7.toFixed(3);
          this.Montant7 = this.Montanttva7.toFixed(3);
        }
        else if (this.fieldArray[i].Tva == 13) {
          this.assiettetva13 += (Number(Number(this.fieldArray[i].Montant_HT) + Number(this.totalMontantFodec)));
          this.Montanttva13 += (Number(Number(this.fieldArray[i].Total_TVA) * Number(this.fieldArray[i].Quantite)));
          this.assiette13 = this.assiettetva13.toFixed(3);
          this.Montant13 = this.Montanttva13.toFixed(3);
        }
      }
    }
  }
  //supprimer article 
  deleteFieldValue(index: any) {
    let table: number[] = [];
    Swal.fire({
      title: 'Êtes-vous sûr?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Oui, supprimez-le',
      cancelButtonText: 'Non, garde le'
    }).then((result) => {
      if (result.value) {
        this.fieldArray[index].Quantite = 0;
        this.fieldArray[index].Ch = 0;
        this.fieldArray[index].PrixU = 0;
        this.fieldArray[index].PrixRevientU = 0;
        this.fieldArray[index].Montant_TVA = 0;
        this.fieldArray[index].Montant_Fodec = 0;
        this.fieldArray[index].Remise = 0;
        this.fieldArray[index].Montant_HT = 0;
        this.fieldArray[index].Tva = 0;
        this.fieldArray[index].Fodec = 0;
        this.fieldArray[index].Total_TVA = 0;
        this.calcul();
        this.fieldArray.splice(index, 1);
        this.calculAssiette()
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
  //convertir blob à un fichier  
  convertBlobFichier = (theBlob: Blob, fileName: string): File => {
    var b: any = theBlob;
    b.lastModifiedDate = new Date();
    b.name = fileName;
    return <File>theBlob;
  }
  //ajouter bon entree local sous forme d'in fichier
  ajouterFicheBonEntreeLocal() {
    this.Fournisseur();
    if (this.InformationsGeneralesForm.get('Totale_Facture').value != Number(this.totalHT)) {
      this.verifTotal = true;
      Swal.fire(
        'Attention! Vérifier S.V.P',
        'Total_HT_Facture # Total_HT_Calculé! ',
        'error'
      )
    }
    this.verifTotal = false;
    var formData: any = new FormData();
    var parts = '';
    let url = "assets/BonEntreeLocal.xml";
    fetch(url)
      .then(response => response.text())
      .then(data => {
        let parser = new DOMParser();
        this.index = this.index + 1;
        parts = "<Produits>" + this.fieldArray[0].FichierSimple + this.fieldArray[0].FichierSerie + this.fieldArray[0].Fichier4G + "</Produits>";
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
          "<Local>" + this.InformationsGeneralesForm.get('Local').value + "</Local>" +
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
          this.totalMontantFodec +        
          "</Fodec>" +
          "</Taxes>" +
          "<Total>" +
          "<TotalHTBrut>" +
          this.totalHTBrut +
          "</TotalHTBrut>" +
          "<TotalRemise>" +
          this.totalRemise +
          "</TotalRemise>" +
          "<TotalHTNet>" +
          this.totalHT +
          "</TotalHTNet>" +
          "<TotalFodec>" +
          this.totalMontantFodec +
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
        let x = xml2.getElementsByTagName('Produits');
        x[0].setAttribute("Fournisseur", this.fournisseur.nom_Fournisseur);
        x[0].setAttribute("Local", this.InformationsGeneralesForm.get('Local').value);
        let xml2string = new XMLSerializer().serializeToString(xml2.documentElement);
        var myBlob = new Blob([xml2string], { type: 'application/xml' });
        var myFile = this.convertBlobFichier(myBlob, "assets/BonEntreeLocal.xml");
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
        formData.append('Local', this.InformationsGeneralesForm.get('Local').value);
        formData.append('id_Responsable', '');
        formData.append('Details', myFile);
        formData.append('Total_HT_Brut', this.totalHTBrut);
        formData.append('Total_Remise', this.totalRemise);
        formData.append('Total_HT_Net', this.totalHT);
        formData.append('Total_Fodec', this.totalMontantFodec);
        formData.append('Total_Tva', this.totalMontantTVA);
        formData.append('Total_TTC', this.totalTTc);
        formData.append('Total_R_HT', this.totalRHT);
        formData.append('Total_R_TTC', this.totalRTTC);
        this.bonEntreeService.ajouterBonEntreeLocal(formData);
      });
    Swal.fire("Bon d'entrée local ajouté avec succés.")
    this.router.navigate(['Menu/Menu-bon-entree/Lister-bon-entree'])
  }
  //alert en cas Total_HT_Facture # Total_HT_Calculé!
  alertDifferentTotal() {
    //this.verifierCharge(event);
    if (this.InformationsGeneralesForm.get('Totale_Facture').value != Number(this.totalHT)) {
      this.verifTotal = true;
      Swal.fire(
        'Attention!',
        'Total HT Facture # Total HT Calculé! ',
        'error'
      )
    }
    else {
      this.verifTotal = false;
    }
  }
  //activer/desactiver step charges selon total HT
  VerificationTotal() {
    if (this.InformationsGeneralesForm.get('Totale_Facture').value != Number(this.totalHT)) {
      this.verifTotal = true;
    }
    else {
      this.verifTotal = false;

    }
  }
  actiververifCh() {
    //chaque seconde verifier le calcul
    interval(500).subscribe(x => {
      this.verificationCh(event);
      this.VerificationTotal();
    });
  }
}
//component dialogue modifier article
@Component({
  selector: 'dialog-overview-article-dialog',
  templateUrl: 'dialog-overview-article-dialog.html',
})
export class DialogOverviewArticleDialog {
  ligne_table: any;
  index_ligne_table: any;
  verif: boolean = false;
  table: any;
  Montant_TVA: any = 0;
  Montant_Fodec: any = 0;
  //test modifier article 
  form_modifier_article: any = FormGroup;
  // test modifier sans confirmer
  form_article: any = FormGroup;
  constructor(
    public dialogRef: MatDialogRef<DialogOverviewArticleDialog>,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    this.ligne_table = data.ligne_tableau;
    this.index_ligne_table = data.index;
    this.table = data.table;
    // en cas de click sur fermer sans enregistrement on utilise cette formulaire pour garder les valeurs initiaux
    this.form_article = this.fb.group({
      qte_modifier: [this.ligne_table.Quantite],
      prixU_modifier: [this.ligne_table.PrixU],
      remise_modifier: [this.ligne_table.Remise],
      Fodec: [this.ligne_table.Fodec],
      Tva: [this.ligne_table.Tva],
      Ref_FR: [this.ligne_table.Ref_FR],
      Nom_Produit: [this.ligne_table.Nom_Produit],
      Id_Produit: [this.ligne_table.Id_Produit],
    });
    //pour modification
    this.form_modifier_article = this.fb.group({
      qte_modifier: [this.ligne_table.Quantite],
      prixU_modifier: [this.ligne_table.PrixU],
      remise_modifier: [this.ligne_table.Remise],
      Fodec: [{ value: this.ligne_table.Fodec, disabled: true }],
      Tva: [{ value: this.ligne_table.Tva, disabled: true }],
      Ref_FR: [{ value: this.ligne_table.Ref_FR, disabled: true }],
      Nom_Produit: [{ value: this.ligne_table.Nom_Produit, disabled: true }],
      Id_Produit: [{ value: this.ligne_table.Id_Produit, disabled: true }],
    });
    dialogRef.disableClose = true;
  }
  //fermer dialogue
  fermerDialogue() {
    this.dialogRef.close(this.form_article.value);
  }
  //modifier article
  editerLigneTable() {
    this.dialogRef.close(this.form_modifier_article.value);
    this.Montant_Fodec = (this.ligne_table.Montant_HT * this.ligne_table.Fodec) / 100;
    this.ligne_table.Montant_Fodec = Number(this.Montant_Fodec);
    (Number(this.ligne_table.Montant_HT)).toFixed(3);
    this.Montant_TVA = ((Number(this.ligne_table.Montant_HT) + Number(this.ligne_table.Montant_Fodec)) * this.ligne_table.Tva) / 100;
    this.ligne_table.Montant_TVA = Number(this.Montant_TVA);
    this.ligne_table.Prix_U_TTC = (((Number(this.ligne_table.Montant_HT) + Number(this.ligne_table.Montant_Fodec) + Number(this.ligne_table.Montant_TVA))) / Number(this.ligne_table.Quantite)).toFixed(3);
    this.ligne_table.Total_TVA = (Number(this.ligne_table.Montant_TVA)) / (Number(this.ligne_table.Quantite));
    this.ligne_table.Montant_TTC = Number(this.ligne_table.Prix_U_TTC) * Number(this.ligne_table.Quantite);
    this.ligne_table.Ch = ((((Number(this.ligne_table.PrixU)) / Number(this.ligne_table.TotalFacture)) * 100) * Number(this.ligne_table.Quantite)).toFixed(3);
    this.ligne_table.Ch_Piece = (((((Number(this.ligne_table.ChargeTr) + Number(this.ligne_table.AutreCharge)) * Number(this.ligne_table.Ch)) / 100)) / (Number(this.ligne_table.Quantite))).toFixed(3);
    this.ligne_table.PrixRevientU = (Number(this.ligne_table.PrixU) + Number(this.ligne_table.Ch_Piece)).toFixed(3);
  }
  //calculer charge
  calculCharge(event: any) {
    this.ligne_table.Ch = ((((Number(this.ligne_table.PrixU)) / Number(this.ligne_table.TotalFacture)) * 100) * Number(this.ligne_table.Quantite)).toFixed(3);
  }
}
@Component({
  selector: 'dialog-overview-charge-dialog',
  templateUrl: 'dialog-overview-charge-dialog.html',
})
export class DialogOverviewChargeDialog {
  ligne_table: any;
  index_ligne_table: any;
  verif: any;
  table: any;
  Montant_TVA: any = 0;
  Montant_Fodec: any = 0;
  //test modifier charge
  form_modifier_charge: any = FormGroup;
  // test modifier sans confirmer
  form_charge: any = FormGroup;
  constructor(
    public dialogRef: MatDialogRef<DialogOverviewChargeDialog>,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    this.ligne_table = data.ligne_tableau;
    this.index_ligne_table = data.index;
    this.table = data.table;
    // en cas de click sur fermer sans enregistrement on utilise cette formulaire pour garder les valeurs initiaux
    this.form_charge = this.fb.group({
      qte_modifier_ch: [this.ligne_table.Quantite],
      prixU_modifier_ch: [this.ligne_table.PrixU],
      remise_modifier_ch: [this.ligne_table.Remise],
      Fodec: [this.ligne_table.Fodec],
      Tva: [this.ligne_table.Tva],
      Ref_FR: [this.ligne_table.Ref_FR],
      Nom_Produit: [this.ligne_table.Nom_Produit],
      Id_Produit: [this.ligne_table.Id_Produit],
      Ch_modifier: [this.ligne_table.Ch]
    });
    //pour modification
    this.form_modifier_charge = this.fb.group({
      qte_modifier_ch: [this.ligne_table.Quantite],
      prixU_modifier_ch: [this.ligne_table.PrixU],
      remise_modifier_ch: [this.ligne_table.Remise],
      Fodec: [{ value: this.ligne_table.Fodec, disabled: true }],
      Tva: [{ value: this.ligne_table.Tva, disabled: true }],
      Ref_FR: [{ value: this.ligne_table.Ref_FR, disabled: true }],
      Nom_Produit: [{ value: this.ligne_table.Nom_Produit, disabled: true }],
      Id_Produit: [{ value: this.ligne_table.Id_Produit, disabled: true }],
      Ch_modifier: [this.ligne_table.Ch]
    });
  }
  //fermer dialogue
  fermerDialogue() {
    this.dialogRef.close(this.form_charge.value);
  }
  //modifier article
  editerLigneTable() {
    this.dialogRef.close(this.form_modifier_charge.value);
    this.ligne_table.Montant_HT = ((Number(this.ligne_table.PrixU) * Number(this.ligne_table.Quantite)) * (1 - (Number(this.ligne_table.Remise)) / 100)).toFixed(3);
    this.Montant_Fodec = (this.ligne_table.Montant_HT * this.ligne_table.Fodec) / 100;
    this.ligne_table.Montant_Fodec = Number(this.Montant_Fodec);
    this.Montant_TVA = ((Number(this.ligne_table.Montant_HT) + Number(this.ligne_table.Montant_Fodec)) * this.ligne_table.Tva) / 100;
    this.ligne_table.Montant_TVA = Number(this.Montant_TVA);
    this.ligne_table.Prix_U_TTC = (((Number(this.ligne_table.Montant_HT) + Number(this.ligne_table.Montant_Fodec) + Number(this.ligne_table.Montant_TVA))) / Number(this.ligne_table.Quantite)).toFixed(3);
    this.ligne_table.Total_TVA = (Number(this.ligne_table.Montant_TVA)) / (Number(this.ligne_table.Quantite));
    this.ligne_table.Montant_TTC = Number(this.ligne_table.Prix_U_TTC) * Number(this.ligne_table.Quantite);
    this.ligne_table.Ch_Piece = (((((Number(this.ligne_table.ChargeTr) + Number(this.ligne_table.AutreCharge)) * Number(this.ligne_table.Ch)) / 100)) / (Number(this.ligne_table.Quantite))).toFixed(3);
    this.ligne_table.PrixRevientU = (Number(this.ligne_table.PrixU) + Number(this.ligne_table.Ch_Piece)).toFixed(3);
    this.verifierCharge(event);
  }
  //calculer charge
  calculCharge(event: any) {
    this.form_modifier_charge.controls['Ch_modifier'].setValue(((((Number(this.form_modifier_charge.controls['prixU_modifier_ch'].value)) / Number(this.ligne_table.TotalFacture)) * 100) * Number(this.form_modifier_charge.controls['qte_modifier_ch'].value)));
  }
  // calcul charge automatique des autres articles
  chargeValue(event: any) {
    let table: number[] = [];
    for (let i = 0; i < this.table.length; i++) { 
      if (i != this.index_ligne_table) {
        table.push(i);
      }
    }
    for (let j of table) {
      this.table[j].Ch = (Number(this.table[j].PrixU) / (Number(this.ligne_table.TotalFacture) - Number(this.table[this.index_ligne_table].PrixU * Number(this.table[this.index_ligne_table].Quantite))) * Number(this.table[j].Quantite) * (100 - this.table[this.index_ligne_table].Ch)).toFixed(3);
      this.table[j].Ch_Piece = (((((Number(this.table[j].ChargeTr) + Number(this.table[j].AutreCharge)) * Number(this.table[j].Ch)) / 100)) / (Number(this.table[j].Quantite))).toFixed(3);
    }
  }
  //verifier pourcentage charge
  verifierCharge(event: any) {
    let total1 = 0;
    this.verif = this.table.verifCh;
    for (let i = 0; i < this.table.length; i++) {
      total1 += Number(this.table[i].Ch);
      if (total1 != 100.000 || event.target.value > 100.000 || total1 != 100) {
        this.table.verifCh = true;
        Swal.fire({
          title: "Mettre à jour automatiquement la charge d'autres articles ?",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Oui, les mettre à jour?',
          cancelButtonText: 'Non'
        }).then((result) => {
          if (result.value) {
            this.chargeValue(event);
          } else if (result.dismiss === Swal.DismissReason.cancel) {
            Swal.fire(
              'Annulé',
              '',
              'error'
            )
          }
        })        
      }
      else {
        this.table.verifCh = false;
      }
    }
    this.verif = this.table.verifCh;
  }
}
//component dialogue en cas type produit simple
@Component({
  selector: 'dialog-overview-simple-dialog',
  templateUrl: 'dialog-overview-simple-dialog.html',
})
export class DialogOverviewSimpleDialog {
  nbrQte: any = [];
  Numero_SerieS: any = [''];
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
  showStyle: boolean;
  quantiteSimple: any;
  constructor(
    public dialogRef: MatDialogRef<DialogOverviewSimpleDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    this.ligne_table = data.ligne_tableau;
    this.table = data.table;
    this.nbrQte.length = data.ligne_tableau.Quantite;
    dialogRef.disableClose = true;
  }
  //fermer dialogue
  fermerDialogue() {
    this.dialogRef.close();
  }
  //verifier si entree accompli ou non 
  VerifVide() {
    this.quantiteSimple = document.getElementById("quantiteSimple");
    if (this.quantiteSimple.value == this.ligne_table.Quantite) {
      this.ligne_table.EtatEntree = "Entrée Stock Vérifié";
      this.EntreeXml();
      this.fermerDialogue()
    }
    else {
      this.ligne_table.EtatEntree = "Entrée Stock Non Accompli";
      this.EntreeXml();
      this.fermerDialogue();
    }
  }
  //convertir blob à un fichier  
  convertBlobFichier = (theBlob: Blob, fileName: string): File => {
    var b: any = theBlob;
    b.lastModifiedDate = new Date();
    b.name = fileName;
    return <File>theBlob;
  }
  //fichier xml entree
  EntreeXml() {
    let url = "assets/Entree.xml";
    fetch(url)
      .then(response => response.text())
      .then(data => {
        for (let j = 0; j < this.table.length; j++) {
          if (this.table[j].N_Imei == "true") {
            this.typeProduit = "4G";
            this.data4Gs = this.data4;
            this.dataSeries = '';
          }
          else if (this.table[j].N_Serie == "true") {
            this.typeProduit = "Serie";
            this.data4Gs = '';
            this.dataSeries = this.data5;
          }
          else {
            this.typeProduit = "Simple";
            this.data4Gs = '';
            this.dataSeries = '';
            this.data3 = this.data3 + "<Produit>" + "<Id>" + this.table[j].Id_Produit + "</Id>"
              +"<Nom>"+this.table[j].Nom_Produit+"</Nom>"
              + "<Signaler_Probleme>" + this.table[j].signaler_probleme + "</Signaler_Probleme>"
              + "<Ref>" + this.table[j].Ref_FR + "</Ref>"
              + "<Qte>" + this.table[j].Quantite + "</Qte>"
              + "<Prix_U_HT>" + this.table[j].PrixU + "</Prix_U_HT>"
              + "<Tva>" + this.table[j].Tva + "</Tva>"
              + "<Remise>" + this.table[j].Remise + "</Remise>"
              + "<Fodec>" + this.table[j].Fodec + "</Fodec>"
              + "<Prix_U_TTC>" + this.table[j].Prix_U_TTC + "</Prix_U_TTC>"
              + "<PrixRevientU>" + this.table[j].PrixRevientU + "</PrixRevientU>"
              + "<Charge>" + this.table[j].Ch + "</Charge>"
              + "<Ch_Piece>" + this.table[j].Ch_Piece + "</Ch_Piece>"
              + "<Type>" + this.typeProduit + "</Type>"
              + "<N_Series>" + "</N_Series>" + "<Produit_4Gs>" + "</Produit_4Gs>" + "</Produit>"
          }
        }
        var parseString = require('xml2js').parseString;
        parseString(this.data3, function (err: any, result: any) {
        });
        this.table[0].FichierSimple = "<Produits_Simples>" + this.data3 + "</Produits_Simples>";
      })
  }
}
//component dialogue en cas type produit serie
@Component({
  selector: 'dialog-overview-serie-dialog',
  templateUrl: 'dialog-overview-serie-dialog.html',
})
export class DialogOverviewSerieDialog {
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
  nom:any;
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
  verifStock: boolean = false;
  found3: any = [];
  found2: any = [];
  constructor(public bonEntreeService: BonEntreeService,
    public dialogRef: MatDialogRef<DialogOverviewSerieDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    this.ligne_table = data.ligne_tableau;
    this.table = data.table;
    this.indice = data.index;
    this.nbrQte.length = data.ligne_tableau.Quantite;
    dialogRef.disableClose = true;
    this.Detail_Produit();
  }
  //fermer dialogue
  fermerDialogue() {
    this.dialogRef.close();
  }
  //convertir blob en un fichier 
  convertBlobFichier = (theBlob: Blob, fileName: string): File => {
    var b: any = theBlob;
    b.lastModifiedDate = new Date();
    b.name = fileName;
    return <File>theBlob;
  }
  //fichier xml entree
  EntreeXml() {
    let url = "assets/Entree.xml";
    fetch(url)
      .then(response => response.text())
      .then(data => {
        for (let i = 0; i < this.table[this.indice].Quantite; i++) {
          this.data5 = this.data5 + "<N_Serie>" + this.Numero_SerieS[i] + "</N_Serie>";
          this.id = this.table[this.indice].Id_Produit;
          this.signaler_probleme = this.table[this.indice].signaler_probleme;
          this.Ref_FR = this.table[this.indice].Ref_FR
          this.Quantite = this.table[this.indice].Quantite
          this.PrixU = this.table[this.indice].PrixU
          this.Tva = this.table[this.indice].Tva
          this.Remise = this.table[this.indice].Remise
          this.Fodec = this.table[this.indice].Fodec
          this.Prix_U_TTC = this.table[this.indice].Prix_U_TTC
          this.PrixRevientU = this.table[this.indice].PrixRevientU
          this.Ch = this.table[this.indice].Ch
          this.Ch_Piece = this.table[this.indice].Ch_Piece
          this.nom=this.table[this.indice].Nom_Produit
        }
        for (let j = 0; j < this.table.length; j++) {
          if (this.table[j].N_Imei == "true") {
            this.typeProduit = "4G";
            this.data4Gs = this.data4;
            this.dataSeries = '';
          }
          else if (this.table[j].N_Serie == "true") {
            this.typeProduit = "Serie";
            this.data4Gs = '';
            this.dataSeries = this.data5;
            this.data3 = "<Produit>" + "<Id>" + this.id + "</Id>"
              +"<Nom>"+this.nom+"</Nom>"
              + "<Signaler_Probleme>" + this.table[j].signaler_probleme + "</Signaler_Probleme>"
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
        let data2 = data + this.data3;
        this.table[0].ProduitsSeries += this.data3;
        var parseString = require('xml2js').parseString;
        parseString(this.data3, function (err: any, result: any) {
        });
        this.table[0].FichierSerie = "<Produits_Series>" + this.table[0].ProduitsSeries + "</Produits_Series>";
      })
  }
  //verifier si entree accompli ou non
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
  //Récupérer détail d'un produit
  Detail_Produit() {
    let N_SerieStocke: any = [];
    for (let i = 0; i < this.table.length; i++) {
      this.bonEntreeService.ProduitEnStock(this.table[i].Id_Produit).subscribe((reponse: any) => {
        this.verifProduitStock[i] = reponse;
        if (this.table[i].N_Serie === "true") {
          if (reponse === 'oui') {
            this.bonEntreeService.Detail_Produit(this.table[i].Id_Produit).subscribe((detail: any) => {
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
  //verifier si numero série saisi déjà ou non
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
  //verifier si numero saisi déjà ou non
  ElimineRedondanceN_serie(){
for(let i=0;i<this.Numero_SerieS.length;i++){
  for(let j=i+1;j<this.Numero_SerieS.length;j++){
    if(this.Numero_SerieS[i]==this.Numero_SerieS[j]){
      if(this.verifStock==false){
        this.verifStock = true;
      }
      Swal.fire("Attention! Numéro Série déjà saisi.")
    }
  }
}
  }
}
//component dialogue en cas type produit 4g
@Component({
  selector: 'dialog-overview-4g-dialog',
  templateUrl: 'dialog-overview-4g-dialog.html',
})
export class DialogOverview4gDialog {
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
  nom:any;
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
  verifStock: boolean = false;
  tableConcat1:any=[];
  tableConcat2:any=[];
  constructor(public bonEntreeService: BonEntreeService,
    public dialogRef: MatDialogRef<DialogOverview4gDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    this.ligne_table = data.ligne_tableau;
    this.table = data.table;
    this.indice = data.index;
    this.nbrQte.length = data.ligne_tableau.Quantite;
    dialogRef.disableClose = true;
    this.Detail_Produit();
  }
  //fermer dialogue
  fermerDialogue() {
    this.dialogRef.close();
  }
  VerifVide() {
    for (let i = 0; i < this.nbrQte.length; i++) {
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
  //convertir blob à un fichier  
  convertBlobFichier = (theBlob: Blob, fileName: string): File => {
    var b: any = theBlob;
    b.lastModifiedDate = new Date();
    b.name = fileName;
    return <File>theBlob;
  }
  //fichier xml entree
  EntreeXml() {
    let url = "assets/Entree.xml";
    fetch(url)
      .then(response => response.text())
      .then(data => {
        for (let i = 0; i < this.Numero_Serie.length; i++) {
          this.data4 = this.data4
            + "<Produit_4G>" + "<N_Serie>" + this.Numero_Serie[i] + "</N_Serie>" + "<E1>" + this.E1[i] + "</E1>" + "<E2>" + this.E2[i] + "</E2>" + "</Produit_4G>";
          this.id = this.table[this.indice].Id_Produit;
          this.signaler_probleme = this.table[this.indice].signaler_probleme;
          this.Ref_FR = this.table[this.indice].Ref_FR
          this.Quantite = this.table[this.indice].Quantite
          this.PrixU = this.table[this.indice].PrixU
          this.Tva = this.table[this.indice].Tva
          this.Remise = this.table[this.indice].Remise
          this.Fodec = this.table[this.indice].Fodec
          this.Prix_U_TTC = this.table[this.indice].Prix_U_TTC
          this.PrixRevientU = this.table[this.indice].PrixRevientU
          this.Ch = this.table[this.indice].Ch
          this.Ch_Piece = this.table[this.indice].Ch_Piece
          this.nom=this.table[this.indice].Nom_Produit
        }
        for (let j = 0; j < this.table.length; j++) {
          if (this.table[j].N_Imei == "true") {
            this.typeProduit = "4G";
            this.data4Gs = this.data4;
            this.dataSeries = '';
            this.data3 = "<Produit>" + "<Id>" + this.id + "</Id>"
              +"<Nom>"+this.nom+"</Nom>"
              + "<Signaler_Probleme>" + this.table[j].signaler_probleme + "</Signaler_Probleme>"
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
          else if (this.table[j].N_Serie == "true") {
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
        this.table[0].Produits4g += this.data3;
        var parseString = require('xml2js').parseString;
        parseString(this.data3, function (err: any, result: any) {
        });
        this.table[0].Fichier4G = "<Produits_4Gs>" + this.table[0].Produits4g + "</Produits_4Gs>";
      })
  }
  //Récupérer détail d'un produit
  Detail_Produit() {
    let N_SerieStocke: any = [];
    let E1Stocke: any = [];
    let E2Stocke: any = [];
    for (let i = 0; i < this.table.length; i++) {
      if (this.table[i].N_Imei == "true") {
        this.bonEntreeService.Detail_Produit(this.table[i].Id_Produit).subscribe((detail: any) => {
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
  }
  //verifier si numero série existe déjà en stock ou non
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
  //verifier si numero série saisi déjà ou non
  ElimineRedondanceN_serie(){
    for(let i=0;i<this.Numero_Serie.length;i++){
      for(let j=i+1;j<this.Numero_Serie.length;j++){
        if(this.Numero_Serie[i]==this.Numero_Serie[j]){
          if(this.verifStock==false){
            this.verifStock = true;
          }
          Swal.fire("Attention! Numéro Série déjà saisi.")
        }
      }
    }
  }
  //verifier si numero IMEI1 existe déjà en stock ou non
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
  //verifier si numero IMEI1 saisi déjà ou non
  ElimineRedondanceE1(){
    for(let i=0;i<this.E1.length;i++){
      for(let j=i+1;j<this.E1.length;j++){
        if(this.E1[i]==this.E1[j]){
          if(this.verifStock==false){
            this.verifStock = true;
          }
          else{}
          Swal.fire("Attention! Numéro IMEI 1 déjà saisi.")
        }
      }
    }
  }
  //verifier si numero IMEI2 existe déjà en stock ou non
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
  //verifier si numero IMEI2 saisi déjà ou non
  ElimineRedondanceE2(){
    for(let i=0;i<this.E2.length;i++){
      for(let j=i+1;j<this.E2.length;j++){
        if(this.E2[i]==this.E2[j]){
          if(this.verifStock==false){
            this.verifStock = true;
          }
          Swal.fire("Attention! Numéro IMEI 2 déjà saisi.")
        }
      }
    }
      }
   //verifier si numero saisi déjà ou non
  ElimineRedondance(){
        this.tableConcat1=this.E1.concat(this.E2);
        this.tableConcat2= this.tableConcat1.concat(this.Numero_Serie)
        for(let i=0;i<this.tableConcat2.length;i++){
          if(this.tableConcat2[i]==""){this.tableConcat2.splice(i,1);
          }
          else{}
          for(let j=i+1;j<this.tableConcat2.length;j++){
            if(this.tableConcat2[i]==this.tableConcat2[j]&&this.tableConcat2[i]!=""){
              if(this.verifStock==false){
                this.verifStock = true;
              }
              Swal.fire("Attention! Numéro déjà saisi.")
            }
          }
        } 
      }
}