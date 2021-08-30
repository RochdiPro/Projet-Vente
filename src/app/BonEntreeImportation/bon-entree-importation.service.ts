import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
const infonet = '/ERP/';

@Injectable({
  providedIn: 'root'
})
export class BonEntreeImportationService {

  constructor(private http: HttpClient) { }

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
//Obtenir une categorie  paiement
 obtenirCategoriePaiement(): Observable<any> {
  return this.http.get(infonet + 'Categorie_Type_Paiement', { observe: 'body' }).pipe(catchError(this.handleError)
  );
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
