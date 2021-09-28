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
    return this.http.get(_url+ 'Filtre_Bon_Livraison_Par_Client_Date/', {
      params : {
        client: champ, 
        date: value
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

  //** Detail_Produit_Nserie_En_Json */
  getAllInfoSerie(id : any){
    return this.http.get(_url+'Detail_Produit_Nserie_En_Json/',{
      params:{
        Id: id, 
      },observe:'response'
    });
  }
  
  //** Detail_Bon_Livraison */
  getDetailBLByProd(id: any ){
    return this.http.get(_url+'Detail_Bon_Livraison/',{
      params: {
        Id_BL: id ,
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
  //** Detail_Produit_par_Numero_Serie */
  getDetailProdByNserie(n_serie: any, id : any):Observable<any>{
    return this.http.get(_url+'Detail_Produit_par_Numero_Serie/',{
      params:{
        Id: id,
        N_Serie: n_serie,
      },observe: 'response'
    });
  }
  //** Filtre_Devis_Par_Client_Date1_Date2 */
  filterDevisByRangeDate(client : any , date1: any , date2: any ):Observable<any>{
    return this.http.get(_url+"Filtre_Devis_Par_Client_Date1_Date2/",{
      params:{
        client: client,
        date1: date1,
        date2: date2
      },observe: 'response'
    });
  }
    //** Filtre_Devis_Par_Client_Date1_Date2 */
    filterBLByRangeDate(client : any , date1: any , date2: any ):Observable<any>{
      return this.http.get(_url+"Filtre_Bon_Livraison_Par_Client_Date1_Date2/",{
        params:{
          Client: client,
          Date1: date1,
          Date2: date2
        },observe: 'response'
      });
    }
  
    abandonnerBL(id: any ):Observable<any>{
      return this.http.post(_url+"Abandonner_BL", id); 
    }
}
