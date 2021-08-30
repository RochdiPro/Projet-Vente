import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
const infonet = '/ERP/';
@Injectable({
  providedIn: 'root'
})
export class DepotServiceService {
  constructor(private http: HttpClient) { }
  //Récupérer local par Id
  Local(id: any): Observable<any> {
    return this.http.get(infonet + 'Local/'
      , {
        params: {
          Id_Local: id
        }, observe: 'body'
      }).pipe(catchError(this.handleError))
  }
  //Lister tous locaux
  Locals(): Observable<any> {
    return this.http.get(infonet + 'Locals').pipe(
      catchError(this.handleError)
    );
  }
  //Ajouter local
  ajouterLocal(local: any) {
    this.http.post(infonet + 'Creer_Local', local).subscribe(
      (response) => console.log(),
      (error) => console.log(error))
  }
  //Modifier local 
  modifierLocal(local: any): Observable<any> {
    return this.http.put(infonet + 'Modifier_Local', local).pipe(
      catchError(this.handleError)
    );
  }
  //Supprimer local
  supprimerLocal(id: any) {
    return this.http.delete<any>(infonet + 'Supprimer_Local/', {
      params: {
        Id_Local: id
      }, observe: 'response'
    }).toPromise()
      .then(response => {
      })
      .catch(console.log)
  }
  //Obtenir la categorie du local 
  obtenirCategorieLocal(): Observable<any> {
    return this.http.get(infonet + 'Categorie_Local', { observe: 'body' }).pipe(catchError(this.handleError)
    );
  }
  //Obtenir la liste des champs du fiche local 
  obtenirListeChampsLocal(): Observable<any> {
    return this.http.get(infonet + 'Liste_Champs_Local', { observe: 'body' }).pipe(catchError(this.handleError)
    );
  }
  //Filtrer local par champ du type string 
  filtrerLocal(champ: any, valeur: any): Observable<any> {
    return this.http.get(infonet + 'Filtre_Fiche_Local/', {
      params: {
        Champ: champ,
        Valeur: valeur
      }, observe: 'body'
    }).pipe(catchError(this.handleError))
  }
  //Afficher message d'erreur
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.log(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }
}
