import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DepotServiceService } from '../depot-service.service';
import Swal from 'sweetalert2'
import 'sweetalert2/src/sweetalert2.scss'
@Component({
  selector: 'app-modifier-depot',
  templateUrl: './modifier-depot.component.html',
  styleUrls: ['./modifier-depot.component.scss']
})
export class ModifierDepotComponent implements OnInit {
  localID: any;
  localData: any;
  Informations_Generales_Local: any = FormGroup;
  Informations_Specifiques_Local: any = FormGroup;
  Lineaire = false;//form stepper linéaire
  cat_local: any;
  date_de_jour = new Date();
  date_Debut: any;
  date_Fin: any;
  constructor(public localService: DepotServiceService, private route: ActivatedRoute, private router: Router, private fb: FormBuilder) {
    //Récupérer local par id
    this.localService.Local(this.route.snapshot.params.id).subscribe((response: Response) => {
      this.localData = response;
    });
    this.Informations_Generales_Local = this.fb.group({
      Nom: [
        "",
        [
          Validators.required,
          Validators.minLength(3)
        ]
      ],
      Categorie: ['', Validators.required],
      Adresse: ['', Validators.required],
      Responsable: [''],
      Tel_Mobile: [''],
      Fax: [''],
      Email: ['', Validators.email],
      Nature_Contrat: [''],
      Date_Debut_Contrat: [],
      Date_Fin_Contrat: [],
      Piece_Jointe_Contrat: [''],
      Nature_Frais: [''],
      Frais: [0],
      Latitude: [0],
      Longitude: [0]

    });

    this.Informations_Specifiques_Local = this.fb.group({
      Description: [''],
      Largeur: [0],
      Profondeur: [0],
      Hauteur: [0],
      Surface: [0]
    });
    this.localService.obtenirCategorieLocal().subscribe((response: Response) => {
      this.cat_local = response;
    });
  }

  ngOnInit(): void {
  }
  //convertir chemin d'image au blob
  ConvertirURIAuBlob(dataURI: any) {
    const chaine_octet = window.atob(dataURI);
    const tableau_d_octet = new ArrayBuffer(chaine_octet.length);
    const int8Array = new Uint8Array(tableau_d_octet);
    for (let i = 0; i < chaine_octet.length; i++) {
      int8Array[i] = chaine_octet.charCodeAt(i);
    }
    const blob = new Blob([int8Array], { type: 'image/png' });
    return blob;
  }
  //Modifier local
  modifierLocal() {
    const pdf__par_defaut_base64 = '';
    const nom_pdf_par_defaut = 'pdf_par_defaut.pdf';
    const pdfBlobDefaut = this.ConvertirURIAuBlob(pdf__par_defaut_base64);
    const Fichier_pdf_par_defaut = new File([pdfBlobDefaut], nom_pdf_par_defaut, { type: 'application/pdf' });
    this.localID = this.route.snapshot.params.id;
    var formData: any = new FormData();
    console.log(new Date(this.localData.date_Debut))
    if (this.localData.date_Debut > '01-01-1900') {
      this.date_Debut = new Date(this.localData.date_Debut);
    } else { this.date_Debut = "01/01/1900"; }
    if (this.localData.date_Debut > '01-01-1900') {
      this.date_Fin = new Date(this.localData.date_Fin);
    } else { this.date_Fin = "01/01/1900"; }
    if (this.localData.detail === '') {
      formData.append('Detail', Fichier_pdf_par_defaut);
    } else formData.append('Detail', this.localData.detail);
    formData.append('Id_Local', this.localID);
    formData.append('Nom_Local', this.localData.nom_Local);
    formData.append('Categorie_Local', this.localData.categorie_Local);
    formData.append('Description_Local', this.localData.description_Local);
    formData.append('Largeur', this.localData.largeur);
    formData.append('Hauteur', this.localData.hauteur);
    formData.append('Profondeur', this.localData.profondeur);
    formData.append('Latitude', this.localData.latitude);
    formData.append('Longitude', this.localData.longitude);
    formData.append('Email', this.localData.email);
    formData.append('Adresse', this.localData.adresse);
    formData.append('Tel', this.localData.tel);
    formData.append('Fax', this.localData.fax);
    formData.append('Nature_Contrat', this.localData.nature_Contrat);
    formData.append('Frais', this.localData.frais);
    formData.append('Nature_Frais', this.localData.nature_Frais);
    formData.append('Detail', this.localData.detail);
    formData.append('Responsable', this.localData.responsable);
    formData.append('Date_Debut', this.date_Debut);
    formData.append('Date_Fin', this.date_Fin);
    Swal.fire({
      title: 'Êtes-vous sûr?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Oui, modifiez-le',
      cancelButtonText: 'Non'
    }).then((result) => {
      if (result.value) {
        this.localService.modifierLocal(formData).subscribe(data => {
          this.router.navigate(['Menu/Menu-depot/Lister-depot'])
        })
        Swal.fire(
          'Local modifié avec succés!',
          '',
          'success'
        )
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire(
          'Annulé',
          '',
          'error'
        )
        this.router.navigate(['Menu/Menu-depot/Lister-depot'])
      }
    })
  }
  //Afficher message d'erreur Nom local
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
  //Tester la nature du contrat
  NatureContratSelectionnee(valeur: any) {
    var DatesContrat = document.getElementById('DatesContrat');

    if (valeur == 'Location') {
      DatesContrat.hidden = false;
      console.log("Location")
    }
    else {
      DatesContrat.hidden = true;
    }
  }
}
