import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ActivatedRoute, Router } from '@angular/router';
import { BonEntreeImportationService } from '../bon-entree-importation.service';

@Component({
  selector: 'app-lister-bon-entree-importation',
  templateUrl: './lister-bon-entree-importation.component.html',
  styleUrls: ['./lister-bon-entree-importation.component.scss']
})
export class ListerBonEntreeImportationComponent implements OnInit {
  displayedColumns: string[] = ['modifier', 'id_Bon_Entree_Local', 'type', 'n_Facture', 'date', 'id_Fr', 'local', 'mode_Paiement', 'ag_Transport', 'charge_Transport', 'autre_Charge_Fixe', 'des', 'supprimer', 'exporter_pdf','Voir_pdf'];
  @ViewChild(MatPaginator) paginator: any = MatPaginator;
  @ViewChild(MatSort) sort: any = MatSort;
  constructor(public bonEntreeService: BonEntreeImportationService, private route: ActivatedRoute, private router: Router, private http: HttpClient, private fb: FormBuilder) { }

  ngOnInit(): void {
  }

}
