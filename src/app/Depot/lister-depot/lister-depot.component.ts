import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { DepotServiceService } from '../depot-service.service';
import Swal from 'sweetalert2'
import 'sweetalert2/src/sweetalert2.scss'
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { DatePipe } from '@angular/common';
const pdfMake = require("pdfmake/build/pdfmake");
const pdfFonts = require("pdfmake/build/vfs_fonts");
pdfMake.vfs = pdfFonts.pdfMake.vfs;
@Component({
  selector: 'app-lister-depot',
  templateUrl: './lister-depot.component.html',
  styleUrls: ['./lister-depot.component.scss']
})
export class ListerDepotComponent implements OnInit {
  recherche: string = '';
  id: any
  locals: any = [];
  liste_champs_local: any;
  champ: any;
  displayedColumns: string[] = ['modifier', 'id_Local', 'nom_Local', 'categorie_Local', 'adresse', 'responsable', 'tel', 'email', 'nature_contrat', 'description_Local', 'supprimer', 'exporter_pdf'];
  modele_Local: any;
  modeleSrc: any;
  date_debut: any;
  date_fin: any;
  frais: any;
  @ViewChild(MatPaginator) paginator: any = MatPaginator;
  @ViewChild(MatSort) sort: any = MatSort;
  constructor(public localService: DepotServiceService, private http: HttpClient, public datepipe: DatePipe) {
    this.recupererLocals();// Récupérer liste des Locaux
    //Charger le modéle de PDF
    this.chargerTemplateLocal();
    this.templatePdfBase64();
    //Récupérer la liste des champs du Local
    this.localService.obtenirListeChampsLocal().subscribe((response: Response) => {
      this.liste_champs_local = response;
    });
  }
  ngOnInit(): void {
  }
  //Récuperer tous Locaux
  recupererLocals() {
    this.localService.Locals().subscribe((data: any) => {
      this.locals = new MatTableDataSource(data);
      this.locals.paginator = this.paginator;
      this.locals.sort = this.sort;
    });
  }
  //Supprimer local 
  SupprimerLocal(id: any) {
    Swal.fire({
      title: 'Êtes-vous sûr?',

      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Oui, supprimez-le',
      cancelButtonText: 'Non, garde le'
    }).then((result) => {
      if (result.value) {
        this.localService.supprimerLocal(id);
        Swal.fire(
          'Local Supprimé avec succés!',
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
  //Champ selectionné
  onOptionsSelectionner(value: string) {
    this.champ = value;
  }
  //Filtrer local
  filtrerLocal() {

    if (this.champ == '' || this.recherche == '') {

      Swal.fire("Champ vide!")
      this.recupererLocals();
    }
    else
      this.localService.filtrerLocal(this.champ, this.recherche).subscribe((response: Response) => {
        this.locals = response;
        if (this.locals == '') {
          Swal.fire("Local non trouvé!")
          this.recupererLocals();
        }
      });

  }
  //Générer PDF
  genererPDF(id: any, nom: any, cat: any, des: any, largeur: any, profondeur: any, hauteur: any, adresse: any, fax: any, tel: any, date_debut: any, date_fin: any, email: any, nature_contrat: any, responsable: any, surface: any, frais: any) {
    var formData: any = new FormData();
    formData.append('Id_Local', id);
    formData.append('Nom_Local', nom);
    formData.append('Categorie_Local', cat);
    formData.append('Description_Local', des);
    formData.append('Largeur', largeur);
    formData.append('Profondeur', profondeur);
    formData.append('Hauteur', hauteur);
    formData.append('Adresse', adresse);
    if (nature_contrat == "Achat") {
      this.date_debut = "Date Début Contrat : -";
      this.date_fin = "Date Fin Contrat : -";
      this.frais = "Frais Location : -";
    }
    else if (nature_contrat == "Location") {
      this.date_debut = "Date Début Contrat :" + this.datepipe.transform(date_debut, 'dd/MM/yyyy');
      this.date_fin = "Date Fin Contrat :" + this.datepipe.transform(date_fin, 'dd/MM/yyyy');
      this.frais = "Frais Location :" + Number(frais)
    }
    var dd = {
      background: [
        {
          image: 'data:image/jpeg;base64,' + this.modeleSrc, width: 600
        }
      ],
      content: [
        {
          text: '\n\n'
        },
        {
          text: '\n\n'
        },
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
              text: 'Id Local :' + id + '\t' + '\n\n' + ' Nom Local :' + nom + '\t' + '\n\n'
                + 'Catégorie Local :' + cat + '\t' + '\n\n' + ' Adresse Local :' + adresse + '\t' + '\n\n'
                + 'Responsable :' + responsable + '\t' + '\n\n' + 'Fax :' + fax
              ,
              fontSize: 10,
              alignment: 'left',
              color: 'black'
            },
            {
              text: 'Email :' + email + '\t' + '\n\n' + 'Nature Contrat :' + nature_contrat + '\t' + '\n\n' + this.date_debut + '\t' + '\n\n' + this.date_fin + '\t' + '\n\n'
                + this.frais + '\t' + '\n\n' + 'Tél.Mobile :' + tel,
              fontSize: 10,
              alignment: 'left',
              color: 'black'
            },
          ]
        },
        {
          text: '\n\n'
        },
        {
          text: 'Informations Spécifiques :' + '\n\n',
          fontSize: 15,

          alignment: 'left',

          color: 'black',
          bold: true
        },
        {
          columns: [
            {
              text: 'Largeur(m) :' + largeur + '\t' + '\n\n' + 'Hauteur(m) :' + hauteur
              ,
              fontSize: 10,
              alignment: 'left',
              color: 'black'
            },
            {
              text: 'Profondeur(m) :' + profondeur + '\t' + '\n\n' + 'Surface(m²) :' + surface
              ,
              fontSize: 10,
              alignment: 'left',
              color: 'black'
            },
          ]
        },
        {
          text: '\n\n'
        },
        {
          text: 'Note :' + des + '\t'
          ,
          fontSize: 10,
          alignment: 'left',
          color: 'black'
        }
        ,
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
      pageMargins: [40, 125, 40, 60],
    };
    pdfMake.createPdf(dd).open();
  }
  //Fixer le temps de chargement du modéle
  delai(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  //Définir le modéle pour pdf 
  async templatePdfBase64() {
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
  async chargerTemplateLocal() {
    this.http.get('.././assets/images/Modele_Fiche_Local.jpg', { responseType: 'blob' }).subscribe((resp: any) => {
      this.modele_Local = resp;
      return this.modele_Local;
    }, err => console.error(err),
      () => console.log())
  }
}


