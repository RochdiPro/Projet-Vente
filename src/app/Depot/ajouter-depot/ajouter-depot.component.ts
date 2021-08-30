import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DepotServiceService } from '../depot-service.service';
const pdfMake = require("pdfmake/build/pdfmake");
const pdfFonts = require("pdfmake/build/vfs_fonts");
pdfMake.vfs = pdfFonts.pdfMake.vfs;
import Swal from 'sweetalert2'
import 'sweetalert2/src/sweetalert2.scss'
import { DatePipe } from '@angular/common';
@Component({
  selector: 'app-ajouter-depot',
  templateUrl: './ajouter-depot.component.html',
  styleUrls: ['./ajouter-depot.component.scss']
})
export class AjouterDepotComponent implements OnInit {
  Lineaire = true;//form stepper linéaire
  Informations_Generales_Local: any = FormGroup;
  Categorie_Local: any = FormGroup;
  Informations_Specifiques_Local: any = FormGroup;
  cat_Local: any;
  modele_Local: any;
  modeleSrc: any;
  date_de_jour= new Date();
  date_debut:any;
  date_fin:any;
  frais:any;
  constructor(public localService: DepotServiceService, private http: HttpClient, private fb: FormBuilder,public datepipe:DatePipe) {
    this.chargerModeleLocal();
    this.modelePdfBase64();
    this.Informations_Generales_Local = this.fb.group({
      Nom: [
        "",
        [
          Validators.required,
          Validators.minLength(3)
        ]
      ],
      Categorie: ['', Validators.required],
      Adresse:['', Validators.required],
      Responsable:[''],
      Tel_Mobile:[''],
      Fax:[''],
      Email:['',Validators.email],
      Nature_Contrat:[''],
      Date_Debut_Contrat:[],
      Date_Fin_Contrat:[],
      Piece_Jointe_Contrat:[''],
      Nature_Frais:[''],
      Frais:[0],
      Latitude:[0],
      Longitude:[0]
    });
    
    this.Informations_Specifiques_Local = this.fb.group({
      Description: [''],
      Largeur: [0],
      Profondeur: [0],
      Hauteur:[0],
      Surface:[0]
    });
    this.localService.obtenirCategorieLocal().subscribe((response: Response) => {

      this.cat_Local = response;
    });
  }
  ngOnInit() {
  }


  //Afficher message d'erreur nom local
  MessageErreurNomLocal() {
    if (this.Informations_Generales_Local.get('Nom').hasError('required')) {
      return 'Vous devez entrer le nom du local!';
    }
    return this.Informations_Generales_Local.get('Nom').hasError('minlength') ?
      'Nom du local non valide! (Min 3 caractéres)' : ''
  }
  //Afficher message d'erreur catégorie local
  MessageErreurCatLocal() {
    if (this.Informations_Generales_Local.get('Categorie').hasError('required')) {
      return 'Vous devez entrer la catégorie du local!';
    }
    else {
      return '';
    }
  }
   //Afficher message d'erreur adresse local
   MessageErreurAdresseLocal() {
    if (this.Informations_Generales_Local.get('Adresse').hasError('required')) {
      return "Vous devez entrer l'adresse du local!";
    }
    else {
      return '';
    }
  }
  //Afficher message d'erreur adresse email local
  MessageErreurEmailLocal() {
    if (this.Informations_Generales_Local.get('Email').hasError('email')) {
      return 'Vous devez entrer une adresse e-mail valide!';
    }
    else {
      return '';
    }
  }
   //convertir chemin d'image au blob
   ConvertirURIAuBlob(dataURI:any) {
    const chaine_octet = window.atob(dataURI);
    const tableau_d_octet = new ArrayBuffer(chaine_octet.length);
    const int8Array = new Uint8Array(tableau_d_octet);
    for (let i = 0; i < chaine_octet.length; i++) {
      int8Array[i] = chaine_octet.charCodeAt(i);
    }
    const blob = new Blob([int8Array], { type: 'image/png' });
    return blob;
  }
  //Ajouter local
  ajouterLocal() {
     //pdf par defaut
     const pdf__par_defaut_base64 = '';
     const nom_pdf_par_defaut = 'pdf_par_defaut.pdf';
     const pdfBlobDefaut = this.ConvertirURIAuBlob(pdf__par_defaut_base64);
     const Fichier_pdf_par_defaut = new File([pdfBlobDefaut], nom_pdf_par_defaut, { type: 'application/pdf' });
    var formData: any = new FormData();
    formData.append('Nom_Local', this.Informations_Generales_Local.get('Nom').value);
    formData.append('Categorie_Local', this.Informations_Generales_Local.get('Categorie').value);
    formData.append('Description_Local', this.Informations_Specifiques_Local.get('Description').value);
    formData.append('Largeur', this.Informations_Specifiques_Local.get('Largeur').value);
    formData.append('Hauteur', this.Informations_Specifiques_Local.get('Hauteur').value);
    formData.append('Profondeur', this.Informations_Specifiques_Local.get('Profondeur').value);
    formData.append('Surface', this.Informations_Specifiques_Local.get('Surface').value);
    formData.append('Frais', this.Informations_Generales_Local.get('Frais').value);
    formData.append('Nature_Frais', this.Informations_Generales_Local.get('Nature_Frais').value);
    if (this.Informations_Generales_Local.get('Piece_Jointe_Contrat').value === '') {
      formData.append('Detail', Fichier_pdf_par_defaut);
    } else   formData.append('Detail', this.Informations_Generales_Local.get('Piece_Jointe_Contrat').value);
    formData.append('Responsable', this.Informations_Generales_Local.get('Responsable').value);
    if(this.Informations_Generales_Local.get('Date_Debut_Contrat').value==null){
      formData.append('Date_Debut', '01/01/1900');
    }else {formData.append('Date_Debut', this.Informations_Generales_Local.get('Date_Debut_Contrat').value);}
    if(this.Informations_Generales_Local.get('Date_Fin_Contrat').value==null){
      formData.append('Date_Fin', '01/01/1900');
    }else{formData.append('Date_Fin', this.Informations_Generales_Local.get('Date_Fin_Contrat').value);}
    formData.append('Latitude', this.Informations_Generales_Local.get('Latitude').value);
    formData.append('Longitude', this.Informations_Generales_Local.get('Longitude').value);
    formData.append('Email', this.Informations_Generales_Local.get('Email').value);
    formData.append('Adresse', this.Informations_Generales_Local.get('Adresse').value);
    formData.append('Tel', this.Informations_Generales_Local.get('Tel_Mobile').value);
    formData.append('Fax', this.Informations_Generales_Local.get('Fax').value);
    formData.append('Nature_Contrat', this.Informations_Generales_Local.get('Nature_Contrat').value);
    this.localService.ajouterLocal(formData);
    Swal.fire('Local ajouté avec succés.')
  }
  //Fixer le temps de chargement du modéle du Fiche
  delai(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  //Définir le modéle pour PDF
  async modelePdfBase64() {
    await this.delai(3000);
    const reader = new FileReader();
    reader.onloadend = () => {
      this.modeleSrc = reader.result;
      this.modeleSrc = btoa(this.modeleSrc);
      this.modeleSrc = atob(this.modeleSrc);
      this.modeleSrc = this.modeleSrc.replace(/^data:image\/[a-z]+;base64,/, "");
    }
    reader.readAsDataURL(this.modele_Local);
  }
  //Charger le modéle de PDF
  async chargerModeleLocal() {
    this.http.get('.././assets/images/Modele_Fiche_Local.jpg', { responseType: 'blob' }).subscribe((resp: any) => {
      this.modele_Local = resp;
      return this.modele_Local;
    }, err => console.error(err),
      () => console.log())
  }
  //Tester la nature du contrat
  NatureContratSelectionnee(valeur:any){
    var DatesContrat = document.getElementById('DatesContrat');  
if(valeur=='Location'){
  DatesContrat.hidden=false;
}
else{
  DatesContrat.hidden=true;
}
  }
}
