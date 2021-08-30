import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ActivatedRoute, Router } from '@angular/router';
import { BonCommandeFournisseurService } from 'src/app/bon-commande-fournisseur.service';

@Component({
  selector: 'app-lister-bon-commande',
  templateUrl: './lister-bon-commande.component.html',
  styleUrls: ['./lister-bon-commande.component.scss']
})
export class ListerBonCommandeComponent implements OnInit {
  displayedColumns: string[] = ['modifier', 'id_Bon_Commande', 'id_Fr', 'date_Livraison', 'Remise_Globale', 'Famille', 'Sous_Famille', 'des', 'supprimer', 'exporter_pdf','Voir_pdf'];
  @ViewChild(MatPaginator) paginator: any = MatPaginator;
  @ViewChild(MatSort) sort: any = MatSort;
  constructor(public bonCommandeService: BonCommandeFournisseurService) { }
  ngOnInit(): void {
  }

}
