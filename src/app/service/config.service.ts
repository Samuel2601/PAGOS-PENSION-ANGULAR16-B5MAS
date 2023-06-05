import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  private imagen = JSON.parse(localStorage.getItem('user_data')||'any').portada;
  private rol = JSON.parse(localStorage.getItem('user_data')||'any').rol;
  private identity = localStorage.getItem('identity');
  private token = localStorage.getItem('token');
  private progress: number = 0;
  private naadmin=JSON.parse(localStorage.getItem('user_data')||'any').nombres + ' ' + JSON.parse(localStorage.getItem('user_data')||'any').apellidos;;
  private nadirector='';
  private nadelegado='';

  
  constructor(private _http: HttpClient) {

  }
  private dataSubject = new Subject<any[]>();
  private labelsSubject = new Subject<any[]>();

  data$ = this.dataSubject.asObservable();
  labels$ = this.labelsSubject.asObservable();
  getData(){
    return this.dataSubject;
  }
  getLabels(){
    return this.labelsSubject;
  }

  setData(data: any[]) {
    this.dataSubject.next(data);
  }

  setLabels(labels: any[]) {
    this.labelsSubject.next(labels);
  }

  getProgress(): number {
    return this.progress;
  }
  getAdmin():string{
    return this.naadmin
  }
  getDirector():string{
    return this.nadirector
  }
  getDelegado():string{
    return this.nadelegado
  }
  setDirector(value: string):void{
    this.nadirector=value;
  }
  setDelegado(value: string):void{
    this.nadelegado=value;
  }

  setProgress(value: number): void {
    this.progress = value;
  }


  getConfig(): {} {
    return {imagen:this.imagen,identity:this.identity,token:this.token,rol:this.rol};
  }

  setConfig(imagen:any,identity:any,token:any,rol:any): void {
    this.imagen = imagen;
    this.identity = identity;
    this.token = token;
    this.rol=rol
  }

  getsri():Observable<any>{
		return this._http.get('./assets/sri.json');
	}

}
