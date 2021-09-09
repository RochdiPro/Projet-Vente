import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';


const _url = "/ERP/"; 


@Injectable({
  providedIn: 'root'
})
export class DevisService {

  constructor(private http : HttpClient) { }

  //** Get All Articles EP */
  getArticls() : Observable<any>{
    return this.http.get(_url+'Fiche_Produits');
  }
  //** Get Article by Id  */
  getArticleById(id:string):Observable<any> {
    return this.http.get(_url+'Fiche_Produit/',{
      params: {
        Id_Produit: id,
      },observe: 'response'
    });
  }
  //** Get Article By Code à bare EP */
  getArrByCodeBare(code : string) : Observable<any>{
    return this.http.get(_url + 'Filtre_Fiche_Produit_par_Code/', {
      params: {
        Code: code
      }, observe: 'response'
    });
  }

  //** Get Client By Code/id EP */
  getClientById(id : string): Observable<any>{
     return this.http.get(_url +'Client/',{params :{
      Id_Clt: id,
    },observe: 'response'});
  }
  //** Get List All Client*/
  getAllClient(): Observable<any>{
    return this.http.get(_url+'Clients')
  }
  //** List of Fourniseur */
  getAllFourniseur(): Observable<any>{
    return this.http.get(_url+'Fournisseurs'); 
  }

  //** Get All Devis */
  getAllDevis(): Observable<any>{
    return this.http.get(_url+'Deviss/'); 
  }

  //** Get Quate by ID */
  getQuoteByID(id: string ): Observable<any>{
    return this.http.get(_url +'Devis/',{
      params: { Id: id}, observe: 'response'
    });
  }
  //** Get all Key word from the table "Devis" */
  getListKeyWord(): Observable<any>{
   return this.http.get(_url+ 'Liste_Champs_Devis')
  }
  //** Get Info Product by Id */ 
  getInfoProductByIdFromStock(id: string): Observable<any>{
    return this.http.get(_url+'Stock/',{
      params:{Id : id },observe: 'response'
    });
  }
  //** Create a Quote "Devis" */
  createQuate(formData : any ): Observable<any>{
    return this.http.post<any>(_url+'Creer_Devis', formData); 
  }
  //** Filter By Champ */
  filterByChampValeur(champ: string , value : string) : Observable<any>{
    return this.http.get(_url + 'Filtre_Devis/', {
      params : {
        Champ: champ, 
        Valeur: value
      }, observe: 'response'
    });
  }
  //** Delete Devis by ID */
  deleteDevis( id : string ): Observable<any>{
    return this.http.delete(_url + 'Supprimer_Devis/', {
      params: {
        Id: id
      }, observe:'response'
    })
  }
  //** Get detail devis */
  detail(id: any):Observable<any>{
    return this.http.get(_url+'Detail_Devis/',{
      params: {
        Id_Devis : id
      }, observe:'response', responseType : 'blob'
    });
  }
  /** Update Quote (Modifier_Devis) */
  updateQuote(formData : any): Observable<any>{
    return this.http.post<any>(_url+'Modifier_Devis', formData); 
  }

  //** Liste_Champs_Fiche_Produit */
  getListChampsProduit(): Observable<any>{
    return this.http.get(_url+'Liste_Champs_Fiche_Produit');
  }

  //** Filtre_Fiche_Produit_par_Code2  */
  getProduitByCodeBar(code: string){
    return this.http.get(_url+'Filtre_Fiche_Produit_par_Code2/',{
      params: {
        Code: code,
      },observe:'response'
    });
  }

  //** Filter By Champ for Produit */
  filterByChampValeurForProd(champ: string , value : string) : Observable<any>{
    return this.http.get(_url + 'Filtre_Fiche_Produit/', {
        params : {
          Champ: champ, 
          Valeur: value
        }, observe: 'response'
      });
  }
  //** Get Locals */
  getLocals(): Observable<any>{
    return this.http.get(_url+'Locals/'); 
  }
  //** Quantite_Produit_Par_Stock_En_Local */
  quentiteProdLocal( id : any,local : any ){
    return this.http.get(_url+'Quantite_Produit_Par_Stock_En_Local/',{params:{
      Id: id,
      Local: local
    },observe: 'response'
  });
  }
}
