import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

const _url = "/ERP/"; 

@Injectable({
  providedIn: 'root'
})
export class BlService {

  constructor(private http : HttpClient) { }

  //** Get List All Client*/
  getAllClient(): Observable<any>{
      return this.http.get(_url+'Clients')
  }

  //** Get Client By Code/id EP */
  getClientById(id : string): Observable<any>{
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
  //** Get All BL */
  getAllBL(): Observable<any>{
    return this.http.get(_url+'Bon_Livraisons/'); 
  }

  //** Get BL by ID */  
  getBlByID(id: string) : Observable<any>{
    return this.http.get(_url+'Bon_Livraison/',{
      params: {
        Id: id
      }, observe : 'response'
    });
  }

  //** Get List of champ of BL */
  getListKeyWord(): Observable <any> {
    return this.http.get(_url+ 'Liste_Champs_Bon_Livraison/')
  }
  //** Filter BL */ 
  filterByChampValeur(champ : string , value : string ) : Observable<any>{
    return this.http.get(_url+ 'Filtre_Bon_Livraison/', {
      params : {
        Champ: champ, 
        Valeur: value
      }, observe: 'response'
    })
  }
  //** Create un nouneau BL */
  createBL (formData : any ): Observable <any>{
    return this.http.post(_url+ 'Creer_Bon_Livraison/', formData);
  }  
  //** convertir BL */
  convertirBL(id:any):Observable<any>{    
    return this.http.post(_url +'Convertire_Devis_en_Bon_Livraison/',id);
  }
  //** delete BL  */
  deleteBL(id:any): Observable <any>{
    return this.http.delete(_url+'Supprimer_Bon_Livraison',{
      params: {
        Id: id 
      },observe : 'response'
    });
  }

  //** Generate BL a partir dun devis  */
  gererateBL(fromData : any): Observable<any>{
    return this.http.post(_url +'Generate_Bon_Livraison_A_Partire_Devis', fromData); 
  }
  //** detail of BL */
  detail(id : string): Observable<any>{
    return this.http.get(_url+ 'Detail_Bon_Livraison/',{
      params:{
        Id_BL: id
      }, observe:'response', responseType : 'blob'
    })
  }

  //** Update BL */
  updateBL(formData : any ): Observable<any>{
    return this.http.post(_url+'Modifier_Bon_Livraison/', formData);
  }
  //** Detail_Produit_4G_En_Json */
  detailProdFourG(id: any){
    return this.http.get(_url+'Detail_Produit_4G_En_Json/',{
      params:{
        Id: id, 
      },observe:'response'
    });
  }
}
