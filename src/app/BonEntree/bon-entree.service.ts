import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
const infonet = '/ERP/';
@Injectable({
  providedIn: 'root'
})
export class BonEntreeService {
  
  constructor(private http: HttpClient) {
  }
  //Obtenir la categorie du local 
  obtenirCategorieDepot(): Observable<any> {
    return this.http.get(infonet + 'Categorie_Depot', { observe: 'body' }).pipe(catchError(this.handleError)
    );
  }
  //Lister tous locaux
  Locals(): Observable<any> {
    return this.http.get(infonet + 'Locals').pipe(
      catchError(this.handleError)
    );
  }
  //Lister tous fournisseurs
  Fournisseurs(): Observable<any> {
    return this.http.get(infonet + 'Fournisseurs').pipe(
      catchError(this.handleError)
    );
  }
  //Lister tous produits
  Produits(): Observable<any> {
    return this.http.get(infonet + 'Fiche_Produits').pipe(
      catchError(this.handleError)
    );
  }
  //Récupérer produit par Id
  Produit(id: any): Observable<any> {
    return this.http.get(infonet + 'Fiche_Produit/'
      , {
        params: {
          Id_Produit: id
        }, observe: 'body'
      }).pipe(catchError(this.handleError))

  }
  //Récupérer fouenisseur par Id
  Fournisseur(id: any): Observable<any> {
    return this.http.get(infonet + 'Fournisseur/'
      , {
        params: {
          Id_Fr: id
        }, observe: 'body'
      }).pipe(catchError(this.handleError))

  }
  //Lister tous bons d'entrée local
  BonEntreeLocals(): Observable<any> {
    return this.http.get(infonet + 'Fiche_Bon_Entree_Locals').pipe(
      catchError(this.handleError)
    );
  }
  //Récupérer bon d'entrée local par Id
  BonEntreeLocal(id: any): Observable<any> {
    return this.http.get(infonet + 'Fiche_Bon_Entree_Local/'
      , {
        params: {
          Id_Bon: id
        }, observe: 'body'
      }).pipe(catchError(this.handleError))
  }
  //Ajouter bon d'entrée local
  ajouterBonEntreeLocal(bonEntreeLocal: any) {
    this.http.post(infonet + 'Creer_Fiche_Bon_Entree_Local', bonEntreeLocal).subscribe(
      (response) => console.log(),
      (error) => console.log(error))
  }
  //Modifier bon d'entrée local
  modifierBonEntreeLocal(bonEntreeLocal: any) {
    this.http.post(infonet + 'Modifier_Fiche_Bon_Entree_Local', bonEntreeLocal).subscribe(
      (response) => console.log(),
      (error) => console.log(error))
  }
  //Supprimer bon d'entrée local
  supprimerBonEntreeLocal(id: any) {
    return this.http.delete<any>(infonet + 'Supprimer_Fiche_Bon_Entree_Local/', {
      params: {
        Id_Bon: id
      }, observe: 'response'
    }).toPromise()
      .then(response => {
        console.log()
      })
      .catch(console.log)
  }
  //recuperer détails fiche bon d'entrée local
  DetailBonEntreeLocal(id: any): Observable<any> {

    return this.http.get(infonet + 'Detail_Fiche_Bon_Entree_Local/'
      , {
        params: {
          Id_Bon: id
        }, responseType: 'blob'
      }).pipe(catchError(this.handleError))

  }
  //Obtenir une categorie  paiement
  obtenirCategoriePaiement(): Observable<any> {
    return this.http.get(infonet + 'Categorie_Type_Paiement', { observe: 'body' }).pipe(catchError(this.handleError)
    );
  }
  //Obtenir la liste des champs du fiche bon entree local 
  obtenirListeChampsBonEntreeLocal(): Observable<any> {
    return this.http.get(infonet + 'Liste_Champs_Fiche_Bon_Entree_Local', { observe: 'body' }).pipe(catchError(this.handleError)
    );
  }
  //Filtrer bon d'entrée local par champ du type string 
  filtrerBonEntreeLocal(champ: any, valeur: any): Observable<any> {
    return this.http.get(infonet + 'Filtre_Fiche_Bon_Entree_Local/', {
      params: {
        Champ: champ,
        Valeur: valeur
      }, observe: 'body'
    }).pipe(catchError(this.handleError))

  }
  //Récupérer détails produit
  Detail_Produit(Id: any): Observable<any> {

    return this.http.get(infonet + 'Detail_Produit/'
      , {
        params: {
          Id: Id
        }, responseType: 'blob'
      }).pipe(catchError(this.handleError))
  }
  //Tester si produit en stock ou non
  ProduitEnStock(Id: any): Observable<any> {
    return this.http.get(infonet + 'Produit_en_Stock/'
      , {
        params: {
          Id: Id
        }, responseType: 'text'
      }).pipe(catchError(this.handleError))
  }
  //Récupérer référence fournisseur par article 
  Ref_FR_Article(Id: any): Observable<any> {
    return this.http.get(infonet + 'Ref_Produit/'
      , {
        params: {
          Id: Id
        }, responseType: 'text'
      }).pipe(catchError(this.handleError))
  }
  //Message d'erreur
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      console.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
}
