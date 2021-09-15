import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

const _url = "/ERP/";  

@Injectable({
  providedIn: 'root'
})
export class FactureService {

  constructor( private http : HttpClient) { }
  // get all the champ of facture 
  getListKeyWord(): Observable <any> {
    return this.http.get(_url+ 'Liste_Champs_Facture/')
  }
    //** Filter By Champ */
  filterByChampValeur(champ: string , value : string) : Observable<any>{
      return this.http.get(_url + 'Filtre_Facture/', {
        params : {
          Champ: champ, 
          Valeur: value
        }, observe: 'response'
      });
  }
  //** Delete Facture */
  deleteFacture( id : string ): Observable<any>{
    return this.http.delete(_url + 'Supprimer_Facture/', {
      params: {
        Id: id
      }, observe:'response'
    })
  }
  //  Get All Facture 
  getAllFacture():Observable<any>{
    return this.http.get(_url+'Factures');
  }
  //** Get Facture By ID */
  getFactureByID(id: any): Observable<any>{
    return this.http.get(_url+"Facture/",{
      params: {
        Id: id
      }, observe: 'response'
    })
  }
  
  //** Get List All Client*/
  getAllClient(): Observable<any>{
      return this.http.get(_url+'Clients')
  }

  //** Get Client By Code/id EP */
  getClientById(id : any): Observable<any>{
      return this.http.get(_url +'Client/',{params :{
       Id_Clt: id,
     },observe: 'response'});
  }
  //** Get Article by Id  */
  getArticleById(id:string):Observable<any> {
      return this.http.get(_url+'Fiche_Produit/',{
        params: {
          Id_Produit: id,
        },observe: 'response'
      });
  }
  //** Get Info Product by Id */ 
  getInfoProductByIdFromStock(id: string): Observable<any>{
    return this.http.get(_url+'Stock/',{
      params:{Id : id },observe: 'response'
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
      //** Liste_Produits_En_Local */
  listProdEnLocal (local : any ): Observable<any>{
        return this.http.get(_url+'Liste_Produits_En_Local/',{
          params: {
            Local: local,
          },observe:'response'
        });
  }
    //** Get Local by ID  */
  getLocalById(id: any ): Observable<any>{
      return this.http.get(_url+"Local/",{
        params:{
          Id_Local: id,
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

  //** createFacure  */
  createFacure(formData: any): Observable<any>{
    return this.http.post(_url+'Creer_Facture/',formData); 
  }
  detail(id: any):Observable<any>{
    return this.http.get(_url+'Detail_Facture/',{
      params: {
        Id_Facture : id
      }, observe:'response', responseType : 'blob'
    });
  }
  //** updateFacture */
  updateFacture(formData: any):Observable<any>{
    return this.http.post(_url+'Modifier_Facture/',formData);
  }
}
