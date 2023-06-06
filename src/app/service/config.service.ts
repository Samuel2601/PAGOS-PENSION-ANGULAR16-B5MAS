import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { GLOBAL } from './GLOBAL';
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
  public url;
  
  constructor(private _http: HttpClient) {
    this.url = GLOBAL.url;
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

  actualizar_conf_facturacion(data: any,file:any,token:any): Observable<any> {
		let headers = new HttpHeaders({
			Authorization: token,
		});
		const fd = new FormData();
		fd.append('ruc', data.ruc);
		fd.append('dirMatriz', data.dirMatriz);
		fd.append('razonSocial', data.razonSocial);
		fd.append('nombreComercial', data.nombreComercial);
		fd.append('telefono', data.telefono);
		fd.append('ambiente', data.ambiente);
		fd.append('codDoc', data.codDoc);
		fd.append('estab', data.estab);
		fd.append('ptoEmi', data.ptoEmi);
		fd.append('secuencial', data.secuencial);
		fd.append('serie', data.serie);
		fd.append('codnum', data.codnum);
		fd.append('password', data.password);
		fd.append('correo', data.correo);
		fd.append('correo_password', data.correo_password);
    fd.append('archivo_name', data.archivo_name);
		fd.append('archivo', file);

		return this._http.post(this.url + 'actualizar_conf_facturacion',{data:data,file:file}, { headers: headers });
	}

  get_conf_facturacion(token: any): Observable<any> {
		let headers = new HttpHeaders({
			'Content-Type': 'application/json',
			Authorization: token,
		});
		return this._http.get(this.url + 'get_conf_facturacion', { headers: headers });
	}
}
