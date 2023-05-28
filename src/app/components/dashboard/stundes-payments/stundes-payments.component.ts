import { Component, OnInit } from '@angular/core';
import { AdminService } from 'src/app/service/admin.service';
import { GLOBAL } from 'src/app/service/GLOBAL';
import { ConfigService } from 'src/app/service/config.service';
import { TableUtil } from '../tableUtil';
import * as XLSX from 'xlsx';
import * as pako from 'pako';
import { saveAs } from 'file-saver';
declare var $: any;
interface Retirado {
	matricula: number;
	paga_mat: number;
	meses: number;
	condicion_beca: string;
	_id: string;
	idestudiante: {
	  estado: string;
	  _id: string;
	  nombres: string;
	  apellidos: string;
	  anio_desac: string;
	  f_desac: string;
	};
	val_beca:any,
	desc_beca:any,
	num_mes_res:any,
	num_mes_beca:any,
	anio_lectivo: string;
	curso: string;
	paralelo: string;
  }
@Component({
  selector: 'app-stundes-payments',
  templateUrl: './stundes-payments.component.html',
  styleUrls: ['./stundes-payments.component.scss']
})
export class StundesPaymentsComponent implements OnInit {
  public config: any = [];
  public meses = new Array(
		'Enero',
		'Febrero',
		'Marzo',
		'Abril',
		'Mayo',
		'Junio',
		'Julio',
		'Agosto',
		'Septiembre',
		'Octubre',
		'Noviembre',
		'Diciembre'
	);
  public active: any;
  public actualizar_dashest=false;
  public nmt = 0;
  public pdffecha = '';
  public fbeca = '';
  public pagado = 0;
	public porpagar = 0;
  public pagospension: any = [];
  public cursos: any = [];
	public cursos2: any = [];
  public casharray:any=['item','ref1','cedula','modena','valor','ref2','ref3','concepto','ref4','cedula2','alumno'];
	public deteconomico: any = [];
  public pagos_estudiante: Array<any> = [];
  public estudiantes: Array<any> = [];
  public arr_becas: Array<any> = [];
  public penest: any = [];
  public detalles: any = {};
  public pagopension: Array<any> = [];
  public pensionesestudiantearmado: Array<any> = [];
  public auxbecares = 0;
  public total_pagar = 0;

  public page = 1;
	public pageSize = 10;
  public pageSize2 = 10;
  constructor(private _adminService: AdminService, private _configService:ConfigService) {}

  private config_sistem=this._configService.getConfig()as { imagen: string, identity: string, token: string , rol:string};

  ngOnInit(): void {
   
    this._adminService.obtener_config_admin(localStorage.getItem('token')).subscribe((responese) => {
      this.config = responese.data.map((item:any)=>{
        return{
          anio_lectivo:item.anio_lectivo,
          extrapagos:item.extrapagos,
          label:item.label,
          matricula:item.matricula,
          mescompleto	:item.mescompleto,
          numpension :item.numpension,
          pension	:item.pension,
          _id: item._id
        }
      });
      
      
      this.config.forEach((element:any) => {
        element.label=this.meses[new Date(element.anio_lectivo).getMonth()] +
        ' ' +
        new Date(element.anio_lectivo).getFullYear() +
        '-' +
        new Date(
          new Date(element.anio_lectivo).setFullYear(
            new Date(element.anio_lectivo).getFullYear() + 1
          )
        ).getFullYear()
      });
      this.active = -1;
      this.detalle_data(0);
    });
}
actualizar_estudiante(){
  this.actualizar_dashest=true;
  this.active=-1;
  console.log("Actualizar");
  this.detalle_data(0);
}
public horaact:any;
detalle_data(val: any) {
  if (this.active != val) {
    this.active = val;

    this.nmt = 0;
    this.nmt = this.config[val].numpension
    this.pdffecha = (
      this.meses[new Date(this.config[val].anio_lectivo).getMonth()] +
      ' ' +
      new Date(this.config[val].anio_lectivo).getFullYear() +
      '-' +
      new Date(
        new Date(this.config[val].anio_lectivo).setFullYear(
          new Date(this.config[val].anio_lectivo).getFullYear() + 1
        )
      ).getFullYear()
    ).toString();
    
    this.fbeca = this.config[val].anio_lectivo;

    
    this.pagado = 0;
    this.porpagar = 0;
    this.pagospension = [];
    this.cursos = [];
    this.deteconomico = [];
    let costopension = 0;
    let costomatricula = 0;
    let costosextrapagos=0;
    costopension = this.config[val].pension;
    if(this.config[val].extrapagos){
      var extrapagos= JSON.parse(this.config[val].extrapagos);
      extrapagos.forEach((element:any) => {
        costosextrapagos+=element.valor;
      });
    }
    
    this.generarMeses();
    costomatricula = this.config[val].matricula;
    if(this.actualizar_dashest==false&&this.active==0){
      let sigu=true;
      //console.log(localStorage.getItem('dia'));
      if(localStorage.getItem('dia')){

        this.horaact=new Date(JSON.parse(localStorage.getItem('dia')||''));
        //console.log(this.horaact);
        if((new Date().getTime()-new Date(this.horaact).getTime())<3600000&&
          localStorage.getItem('pagos_estudiante')&&
          localStorage.getItem('estudiantes')&&
          localStorage.getItem('arr_becas')&&
          localStorage.getItem('penest')&&
          localStorage.getItem('cursos')&&
          localStorage.getItem('pagospension')&&
          localStorage.getItem('porpagar')&&
          localStorage.getItem('pagado')&&
          localStorage.getItem('cursos2')&&
          localStorage.getItem('deteconomico')&&
          localStorage.getItem('pagospension')){

      

          this.pagos_estudiante = JSON.parse( pako.inflate(new Uint8Array(atob(localStorage.getItem('pagos_estudiante')||'').split('').map(char => char.charCodeAt(0))), { to: 'string' }) );
          //console.log(this.pagos_estudiante);
          this.estudiantes = JSON.parse( pako.inflate(new Uint8Array(atob(localStorage.getItem('estudiantes')||'').split('').map(char => char.charCodeAt(0))), { to: 'string' }) );
          //console.log(this.estudiantes);
          this.arr_becas = JSON.parse( pako.inflate(new Uint8Array(atob(localStorage.getItem('arr_becas')||'').split('').map(char => char.charCodeAt(0))), { to: 'string' }) );
          //console.log(this.arr_becas);
          this.penest = JSON.parse( pako.inflate(new Uint8Array(atob(localStorage.getItem('penest')||'').split('').map(char => char.charCodeAt(0))), { to: 'string' }) );
          //console.log(this.penest);
          this.cursos = JSON.parse( pako.inflate(new Uint8Array(atob(localStorage.getItem('cursos')||'').split('').map(char => char.charCodeAt(0))), { to: 'string' }) );
          //console.log(this.cursos);
          this.pagospension = JSON.parse( pako.inflate(new Uint8Array(atob(localStorage.getItem('pagospension')||'').split('').map(char => char.charCodeAt(0))), { to: 'string' }) );
          //console.log(this.pagospension);
          this.porpagar = JSON.parse( pako.inflate(new Uint8Array(atob(localStorage.getItem('porpagar')||'').split('').map(char => char.charCodeAt(0))), { to: 'string' }) );
          //console.log(this.porpagar);
          this.pagado = JSON.parse( pako.inflate(new Uint8Array(atob(localStorage.getItem('pagado')||'').split('').map(char => char.charCodeAt(0))), { to: 'string' }) );
          //console.log(this.pagado);
          this.cursos2 = JSON.parse( pako.inflate(new Uint8Array(atob(localStorage.getItem('cursos2')||'').split('').map(char => char.charCodeAt(0))), { to: 'string' }) );
          //console.log(this.cursos2);
          this.deteconomico = JSON.parse( pako.inflate(new Uint8Array(atob(localStorage.getItem('deteconomico')||'').split('').map(char => char.charCodeAt(0))), { to: 'string' }) );
          //console.log(this.deteconomico);
          this.pagospension = JSON.parse( pako.inflate(new Uint8Array(atob(localStorage.getItem('pagospension')||'').split('').map(char => char.charCodeAt(0))), { to: 'string' }) );
          //console.log(this.pagospension);
          sigu=false;
          this.cargar_canvas3(costosextrapagos)
        }
      }
      //console.log(sigu);
      if(sigu){
        this._adminService.getDashboar_estudiante(localStorage.getItem('token')).subscribe(response=>{
        
          if(response.obj!=''&&response.ms=='' &&(new Date().getTime()-new Date(response.obj.dia).getTime())<3600000){
            //console.log(response.obj.hora);
            this.horaact=new Date(response.obj.dia);
            this.pagos_estudiante=response.obj.pagos_estudiante;
            this.estudiantes=response.obj.estudiantes;
            this.arr_becas=response.obj.arr_becas;
            this.penest=response.obj.penest;
            this.cursos=response.obj.cursos;
            this.pagospension=response.obj.pagospension;
            this.porpagar=response.obj.porpagar;
            this.pagado=response.obj.pagado;
            this.cursos2=response.obj.cursos2;
            this.deteconomico=response.obj.deteconomico;
            this.pagospension=response.obj.pagospension;
  
            this.cargar_canvas3(costosextrapagos)
          }else{
            this.actualizar_dashest=true
            
            this.armado_matriz(val,costosextrapagos,costopension,costomatricula);
            

        
          }
          
        });
      }
      
    }else{
      this.actualizar_dashest=true;
      this.armado_matriz(val,costosextrapagos,costopension,costomatricula);
    }
    

    
    

  }
}
ismeses(numes:any){
  var aux = new Date(this.config[this.active].anio_lectivo).getMonth();
  aux=aux+numes;

  if(aux==12){
    aux=0
  }else if(aux>12){
    aux=aux-11
  }
  return this.meses[aux];
}
armado_matriz(val:any,costosextrapagos:any,costopension:any,costomatricula:any){
  if(this.actualizar_dashest==true){
    this._adminService
    .obtener_detallespagos_admin(localStorage.getItem('token'), this.config[val].anio_lectivo)
    .subscribe((response) => {
      this.estudiantes = response.data.map((item:any)=>{
        return{
          abono:item.abono,
          documento:item.documento,
          estado:item.estado,
          estudiante:item.estudiante,
          idpension:{
            anio_lectivo:item.idpension.anio_lectivo,
            condicion_beca:item.idpension.condicion_beca,
            curso:item.idpension.curso,
            extrapagos:item.idpension.extrapagos,
            idanio_lectivo:item.idpension.idanio_lectivo,
            idestudiante:item.idpension.idestudiante,
            matricula:item.idpension.matricula,
            meses:item.idpension.meses,
            paga_mat:item.idpension.paga_mat,
            paralelo:item.idpension.paralelo,
            _id:item.idpension._id,
          },
          pago :{
            estado:item.pago.estado,
            _id:item.pago._id,
          },
          tipo:item.tipo,
          valor: item.valor
        }
      });
      //console.log(this.estudiantes[1]);
        
        //this.nmt=10;
        this._adminService.obtener_becas_conf(this.config[val]._id, localStorage.getItem('token'))
        .subscribe((response) => {
          this.arr_becas=response.becas.map((item:any)=>{
            return{
              etiqueta:item.etiqueta,
              _id:item._id,
              usado:item.usado,
              idpension:{
                _id:item.idpension._id,
              }
            }
          });
          this._adminService.listar_pensiones_estudiantes_tienda(localStorage.getItem('token'),this.config[val].anio_lectivo).subscribe((response) => {
            //console.log(response.data[109],response.data[1]);
            this.penest = response.data.map((item:any)=>{
              return{
                curso:item.curso,
                paralelo:item.paralelo,
                anio_lectivo:item.anio_lectivo,
                condicion_beca:item.condicion_beca,
                idestudiante:{
                  apellidos:item.idestudiante.apellidos,
                  nombres:item.idestudiante.nombres,
                  f_desac:item.idestudiante.f_desac,
                  estado:item.idestudiante.estado,
                  genero:item.idestudiante.genero,
                  dni:item.idestudiante.dni,
                  _id:item.idestudiante._id,
                  anio_desac:item.idestudiante.anio_desac
                },
                _id:item._id,
                val_beca:item.val_beca,
                desc_beca:item.desc_beca,
                paga_mat:item.paga_mat,
                matricula:item.matricula,
                meses:item.meses,
                num_mes_beca:item.num_mes_beca,
                num_mes_res:item.num_mes_res,
              }
            });
            if (this.penest != undefined) {
              //Armado de matriz
              this.penest.forEach((element: any) => {
                  var con = -1;
                  for (var i = 0; i < this.pagospension.length; i++) {
                    if (this.pagospension[i].label == element.curso + element.paralelo) {
                      con = i;
                    }
                  }
                  if (con == -1) {
                    if (!this.cursos.includes(element.curso)) {
                      this.cursos.push(element.curso);
                    }

                    this.pagospension.push({
                      label: element.curso + element.paralelo,
                      num: 0,
                      data: [0, 0],
                      genero: [0, 0,0],
                    });
                    
                  }
                
              });
              //Conteo de Estudiantes
              this.detalles = this.estudiantes;
              this.pagos_estudiante= [];
              
              this.penest.forEach((elementpent: any) => {							
                if (elementpent.idestudiante.estado != 'Desactivado') {
                  var f = elementpent.anio_lectivo;
                    let auxpagos = this.pagospension.find((elementpp:any)=>elementpp.label==elementpent.curso + elementpent.paralelo);
                    if(auxpagos!=undefined){
                      
                      if(elementpent.idestudiante.genero=="Masculino"){
                        auxpagos.genero[0]++
                      }else if(elementpent.idestudiante.genero=="Femenino"){
                        auxpagos.genero[1]++
                      }else{
                        auxpagos.genero[2]++
                      }
                      auxpagos.num = auxpagos.num + 1;
                      
                      this.pagopension = [];
                      for(var i=0;i<=10;i++){
                        let valor=0;
                        let porpagar=0
                        let tipo:any;
                        if(i==0){
                          if(costosextrapagos>0){
                            porpagar=costosextrapagos;
                            valor = 0;
                            tipo = 'rubro';
                            this.detalles.find((element:any)=>{
                              if(element.tipo>20&&element.idpension._id==elementpent._id){
                                valor=valor+element.valor
                                porpagar=porpagar-element.valor
                              }
                            });
                            this.pagopension.push({
                              date: "Rubro",
                              valor: valor,
                              tipo: tipo,
                              porpagar: porpagar,
                            });
                            this.porpagar+=porpagar;
                            this.pagado +=valor;
                            auxpagos.data[1]+=porpagar;
                            auxpagos.data[0]+= valor;
                          }
                          if(elementpent.condicion_beca != 'Si' || elementpent.paga_mat==1){
                            valor=0;
                            porpagar=this.config[this.active].matricula;
                            tipo=i;
                            this.detalles.find((element:any)=>{
                              if(element.tipo==0&&element.idpension._id==elementpent._id){
                                valor=valor+element.valor
                                porpagar=porpagar-element.valor
                              }
                            });
                            this.pagopension.push({
                              date: "Matricula",
                              valor: valor,
                              tipo: tipo,
                              porpagar: porpagar,
                            });
                            this.porpagar+=porpagar;
                            this.pagado +=valor;
                            auxpagos.data[1]+=porpagar;
                            auxpagos.data[0]+= valor;
                          }else{
                            porpagar=0;
                            valor=0;
                            this.pagopension.push({
                              date: "Matricula",
                              valor: 0,
                              tipo: 0,
                              porpagar: 0,
                            });
                          }

                        }else{
                          valor=0;
                          porpagar=0;
                          tipo=i;
                          
                          if(elementpent.condicion_beca == 'Si'){
                            if (this.arr_becas.find(elementbecas=>elementbecas.idpension._id==elementpent._id&&elementbecas.etiqueta==(tipo).toString())!=undefined) {
                              porpagar = elementpent.val_beca;
                            } else {
                              porpagar = this.config[this.active].pension;
                            }
                          }else{
                            porpagar = this.config[this.active].pension;
                          }

                          this.detalles.find((element:any)=>{
                            if(element.tipo==tipo&&element.idpension._id==elementpent._id){
                              valor=valor+element.valor
                              porpagar=porpagar-element.valor
                            }
                          });
                          this.pagopension.push({
                            date: new Date(f).setMonth(new Date(f).getMonth() + i - 1),
                            valor: valor,
                            tipo: tipo,
                            porpagar: porpagar,
                          });

                          if(i<= this.nmt){
                            this.porpagar+=porpagar;
                            this.pagado +=valor;
                            auxpagos.data[1]+=porpagar;
                            auxpagos.data[0]+= valor;
                          }
                        }
                        
                      }
                      this.pagos_estudiante.push({
                        nombres: (elementpent.idestudiante.apellidos + ' ' + elementpent.idestudiante.nombres).toString(),
                        curso: elementpent.curso,
                        paralelo: elementpent.paralelo,
                        detalle: this.pagopension,
                        estado: elementpent.idestudiante.estado,
                        dni:elementpent.idestudiante.dni
                      });
                      
                    }
                    
                  
                }
              });
              this.cursos = this.cursos.sort(function (a: any, b: any) {
                if (parseInt(a) > parseInt(b)) {
                  return 1;
                }
                if (parseInt(a) < parseInt(b)) {
                  return -1;
                }
                return 0;
              });
              this.cursos2 = [];
              this.cursos2.push('descr');
              this.cursos.forEach((element:any) => {
                this.cursos2.push(element);
              });
              
              var datos1: any = [];
              var datos2: any = [];
              var datos3: any = [];
              this.cursos.forEach((element: any) => {
                datos1.push(0);
                datos2.push(0);
                datos3.push(0);
              });
              this.deteconomico.push({
                label: 'N° de Estudiantes',
                data: datos1,
                backgroundColor: 'rgba(0,214,217,0.5)',
                borderColor: 'rgba(0,214,217,1)',
                borderWidth: 2,
              });

              this.deteconomico.push({
                label: 'Valor Recaudado',
                data: datos2,
                backgroundColor: 'rgba(0,217,97,0.5)',
                borderColor: 'rgba(0,217,97,1)',
                borderWidth: 2,
              });
              this.deteconomico.push({
                label: 'Valor por Pagar',
                data: datos3,
                backgroundColor: 'rgba(218,0,16,0.5)',
                borderColor: 'rgba(218,0,16,1)',
                borderWidth: 2,
              });

              this.pagospension.forEach((elementp: any) => {
                for (var i = 0; i < this.cursos.length; i++) {
                  var aux = elementp.label.substring(0, elementp.label.length - 1);
                  if (aux == this.cursos[i]) {
                    
                    this.deteconomico.forEach((elementde: any) => {
                      if (elementde.label == 'N° de Estudiantes') {
                        
                        elementde.data[i] = elementde.data[i] + elementp.num;
                      } else if (elementde.label == 'Valor Recaudado') {
                        
                        elementde.data[i] = elementde.data[i] + elementp.data[0];
                      } else {
                        
                        elementde.data[i] = elementde.data[i] + elementp.data[1];
                      }
                    });
                    i = this.cursos.length;
                  }
                }
              });
            } 

            this.cargar_canvas3(costosextrapagos);

          });
        });
      


    });
  }
  
}
cargar_canvas3(costosextrapagos:any){

  this._configService.setLabels(this.cursos);
    this._configService.setData(this.deteconomico);


  
    //this.myChart3.update();
  

  
  if(this.actualizar_dashest==true){
    this.pagospension = this.pagospension.sort(function (a: any, b: any) {
      if (a.label > b.label) {
        return 1;
      }
      if (a.label < b.label) {
        return -1;
      }
      // a must be equal to b
      return 0;
    });
  }
  

  /*
  this.deteconomico.forEach((element: any) => {
    this.myChart3.data.datasets.push(element);
  });*/
  
  //this.pagospension = this.pagospension;
  this.armado(10, this.active,costosextrapagos);
  
  
}


isNumber(val:any): boolean {
  return typeof val === 'number';
}
armado(tiempo: any, idxconfi: any,costosextrapagos:any) {
  
    this.pensionesestudiantearmado = this.penest;
    this.detalles = this.estudiantes;
    this.auxbecares = 0;
    this.total_pagar = 0;

    this.pagos_estudiante = this.pagos_estudiante.sort(function (a, b) {
      if (parseInt(a.curso)< parseInt(b.curso) ) {
        return -1; // a debe aparecer antes que b
        } else if (parseInt(a.curso)> parseInt(b.curso) ) {
        return 1; // b debe aparecer antes que a
        } else {
        if (a.paralelo < b.paralelo) {
          return -1; // a debe aparecer antes que b
        } else if (a.paralelo > b.paralelo) {
          return 1; // b debe aparecer antes que a
        } else {						
          return a.nombres.localeCompare(b.nombres, 'es', { sensitivity: 'base' });
         // return 0; // a y b son iguales
        }
        }
    });

  if(this.actualizar_dashest==true){

    
    let contador=1,paralelo='';

    this.pagos_estudiante.forEach((element:any) => {
      if(paralelo==''){
        paralelo=element.curso+element.paralelo;
        element.indice=contador;
        contador++;
      }else if(element.curso+element.paralelo==paralelo){
        element.indice=contador;
        contador++;
      }else{
        paralelo=element.curso+element.paralelo;
        contador=1;
        element.indice=contador;
        contador++;
      }
      
    });
    let pagos_cursos:any[]=[];
    this.pagos_estudiante.forEach(pago => {
      const cursoParalelo = pago.curso+pago.paralelo;
    
      // Verificar si el curso+paralelo ya existe en el objeto de agrupación
      if (pagos_cursos[cursoParalelo]) {
        // Si existe, agregar el pago al array correspondiente
        pagos_cursos[cursoParalelo].push(pago);
      } else {
        // Si no existe, crear un nuevo array con el primer pago
        pagos_cursos[cursoParalelo] = [pago];
      }
    });
    console.log(pagos_cursos);
    
    
    this.guardardashboard_estudiante();
  }
  this.retirados();
  //console.log(this.pagos_estudiante);
  

}
public arr_meses:any=[];
generarMeses() {
  this.arr_meses=[];
  //const meses = [];
  const anioActual = new Date(this.config[this.active].anio_lectivo).getMonth();
  for (let i = 0; i < 10; i++) {
    const mes = new Date( new Date().setMonth(anioActual+i)).getMonth();
    this.arr_meses.push({ numero: i+1, nombre: this.meses[mes] });
  }
  //return meses;
  }
  

public retirados_arr:Retirado[]= [] ;
ordenarPor(columna: string): void {
  //this.load_data_est = true;
  if(columna=='curso'){
    this.retirados_arr.sort((a:any, b:any) => {
      if (parseInt(a[columna])< parseInt(b[columna]) ) {
        return -1; // a debe aparecer antes que b
        } else if (parseInt(a[columna])> parseInt(b[columna]) ) {
        return 1; // b debe aparecer antes que a
        } else {
        if (a.paralelo < b.paralelo) {
          return -1; // a debe aparecer antes que b
        } else if (a.paralelo > b.paralelo) {
          return 1; // b debe aparecer antes que a
        } else {
          return 0; // a y b son iguales
        }
        }
      });
  }else if(columna=='f_desac'){
    this.retirados_arr.sort((a:any, b:any) => {
      if ( a.idestudiante[columna]!=undefined && b.idestudiante[columna]!=undefined && new Date( a.idestudiante[columna] ).getTime()>new Date(b.idestudiante[columna]).getTime() ) {
        return 1;
      } else if (a.idestudiante[columna]!=undefined && b.idestudiante[columna]!=undefined &&new Date( a.idestudiante[columna] ).getTime() < new Date(b.idestudiante[columna]).getTime()) {
        return -1;
      } else {
        return 0;
      }
      });
  }else{
    this.retirados_arr.sort((a:any, b:any) => {
      if ( a.idestudiante[columna]!=undefined && b.idestudiante[columna]!=undefined && a.idestudiante[columna] > b.idestudiante[columna]) {
        return 1;
      } else if (a.idestudiante[columna]!=undefined && b.idestudiante[columna]!=undefined && a.idestudiante[columna] < b.idestudiante[columna]) {
        return -1;
      } else {
        return 0;
      }
      });
  }

  //this.load_data_est = false;
  }

retirados(){
  this.retirados_arr=[]as any;
  this.penest.forEach((element:any) => {
    if(new Date(element.anio_lectivo).getTime() == new Date(this.fbeca).getTime()
     &&	element.idestudiante.estado == 'Desactivado' &&	new Date(element.anio_lectivo).getTime()
      ==new Date(element.idestudiante.anio_desac).getTime()
    ){
      this.retirados_arr.push(element);
    }
  });
  //console.log(this.retirados_arr);
}

exportarcash(){
  const json:any=[]
  var j=1;
  //console.log(this.pagos_estudiante);
  this.pagos_estudiante.forEach((element:any) => {
    if(this.sumarcash(element.detalle)>0 &&element.estado!='Desactivado'){
      var auxsuma=this.sumarcash(element.detalle)
      auxsuma= parseFloat((auxsuma).toFixed(2))*100
      json.push({'Item':j,'Ref':'CO','Cedula':element.dni,'Modena':'USD','Valor':auxsuma,'Ref1':'REC','Ref2':'','Ref3':'','Concepto':'PENSION DE '+ (this.meses[ new Date(new Date(this.fbeca).setMonth( new Date(this.fbeca).getMonth()+this.mcash-1)).getMonth()]).toUpperCase(),'Ref4':'C','Cedula2':element.dni,'Alumno':element.nombres});
      j++;
    }
  });
  
  //= this.pagos_estudiante; // Reemplaza "this.data" con el nombre de tu variable que contiene los datos en formato JSON
  const worksheet = XLSX.utils.json_to_sheet(json);
  const workbook = { Sheets: { 'cash': worksheet }, SheetNames: ['cash'] };
  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  const fileName = 'cash_'+this.meses[new Date().getMonth()]+'_'+this.pdffecha+'('+this.mcash+').xlsx';
  saveAs(blob, fileName); // La función saveAs es parte de la librería "file-saver", debes instalarla e importarla para que funcione.
  $('#modalGenerarCash').modal('hide');
  }
  public auxdasboarestudiante: any = {};
guardardashboard_estudiante(){
  if(this.active==0){
    /*if (navigator.storage && navigator.storage.estimate) {
      navigator.storage.estimate().then((estimate) => {
        console.log(`El almacenamiento disponible es de ${estimate.quota} bytes.`);
        console.log(`Se están utilizando ${estimate.usage} bytes.`);
      });
      } else {
      console.log('El API de storage no está disponible en este navegador.');
      }*/
    this.horaact=new Date();
    this.auxdasboarestudiante.dia=new Date();
    this.auxdasboarestudiante.pagos_estudiante=this.pagos_estudiante;
    //console.log(this.estudiantes);
    this.auxdasboarestudiante.estudiantes=this.estudiantes;
    this.auxdasboarestudiante.arr_becas=this.arr_becas;
    this.auxdasboarestudiante.penest=this.penest;
    this.auxdasboarestudiante.cursos=this.cursos;
    this.auxdasboarestudiante.pagospension=this.pagospension;
    this.auxdasboarestudiante.porpagar=this.porpagar;
    this.auxdasboarestudiante.pagado=this.pagado;
    
    this.auxdasboarestudiante.cursos2=this.cursos2;
    this.auxdasboarestudiante.deteconomico=this.deteconomico;
    this.auxdasboarestudiante.pagospension=this.pagospension;
    
    let fileContent =JSON.stringify(this.auxdasboarestudiante);
    // Convertir objeto a string JSON
    
    

    localStorage.setItem('dia',JSON.stringify(this.auxdasboarestudiante.dia));

    localStorage.setItem('pagos_estudiante',btoa(String.fromCharCode.apply(null,Array.from(pako.deflate(JSON.stringify(this.auxdasboarestudiante.pagos_estudiante))))));

    localStorage.setItem('estudiantes',btoa(String.fromCharCode.apply(null, Array.from(pako.deflate(JSON.stringify(this.auxdasboarestudiante.estudiantes))))) );

    localStorage.setItem('arr_becas',btoa(String.fromCharCode.apply(null, Array.from(pako.deflate(JSON.stringify(this.auxdasboarestudiante.arr_becas))))) );

    localStorage.setItem('penest',btoa(String.fromCharCode.apply(null, Array.from(pako.deflate(JSON.stringify(this.auxdasboarestudiante.penest))))) );

    localStorage.setItem('cursos',btoa(String.fromCharCode.apply(null, Array.from(pako.deflate(JSON.stringify(this.auxdasboarestudiante.cursos))))) );

    localStorage.setItem('pagospension', btoa(String.fromCharCode.apply(null, Array.from(pako.deflate(JSON.stringify(this.auxdasboarestudiante.pagospension))))));

    localStorage.setItem('porpagar',btoa(String.fromCharCode.apply(null, Array.from(pako.deflate(JSON.stringify(this.auxdasboarestudiante.porpagar))))));
    
    localStorage.setItem('pagado', btoa(String.fromCharCode.apply(null, Array.from(pako.deflate(JSON.stringify(this.auxdasboarestudiante.pagado))))));

    localStorage.setItem('cursos2',btoa(String.fromCharCode.apply(null, Array.from(pako.deflate(JSON.stringify(this.auxdasboarestudiante.cursos2))))) );

    localStorage.setItem('deteconomico',btoa(String.fromCharCode.apply(null, Array.from(pako.deflate(JSON.stringify(this.auxdasboarestudiante.deteconomico))))) );

    localStorage.setItem('pagospension',btoa(String.fromCharCode.apply(null, Array.from(pako.deflate(JSON.stringify(this.auxdasboarestudiante.pagospension))))) );
    
    
    this._adminService.actualizzas_dash(localStorage.getItem('token'),this.auxdasboarestudiante).subscribe(response=>{
      
      console.log("Guardado",response)
      if(response.message=='Guardado con exito'){
        this.horaact=new Date();
      }
    });
  }
  
}

public url = GLOBAL.url;
public mostar=1;
exportTabletotal(val: any) {
  let admtitulo='';

  if(this.config_sistem.rol == 'admin'){
    admtitulo="Administrador(a)";
  }else if(this.config_sistem.rol == 'direc'){
    admtitulo="Director(a)";
  }else if(this.config_sistem.rol == 'delegado'){
    admtitulo="Delegado";
  }else{
    admtitulo="Colectora(a)";
  }
  this.mostar=0;
  setTimeout(() => {
    this.cursos.forEach((element: any) => {
      var btn1=document.getElementById('btncursos' + element);
      if(btn1){
        btn1.style.display = 'none';
      }
      var btn2=document.getElementById(element);
      if(btn2){
        btn2.style.borderCollapse = 'collapse';
        btn2.style.width = '100%';
        btn2.style.textAlign = 'center';
      }
    });

    
    
    var btn1 = document.getElementById('btncvs');
    var btn2 =document.getElementById('btnxlsx');
    var btn3 =document.getElementById('btnpdf');
    var btn4 =document.getElementById('btncash');
    var btn5 =document.getElementById('modalGenerarCash');
    var btn6 =document.getElementById('detalleeconomico');
    if(btn1){
      btn1.style.display = 'none';
    }
    if(btn2){
      btn2.style.display = 'none';
    }
    if(btn3){
      btn3.style.display = 'none';
    }
    if(btn4){
      btn4.style.display = 'none';
    }
    if(btn5){
      btn5.style.display = 'none';
    }
    if(btn6){
      btn6.style.borderCollapse = 'collapse';
      btn6.style.width = '100%';
    }

    

    TableUtil.exportToPdftotal(
      val.toString(),
      this.pdffecha.toString(),
      this._configService.getDirector(),
      this._configService.getDelegado(),
      this._configService.getAdmin(),
      new Intl.DateTimeFormat('es-US', { month: 'long' }).format(new Date()),
      (this.url + 'obtener_portada/' + this.config_sistem.imagen).toString(),
      admtitulo
    );

  
  }, 100);
  setTimeout(() => {
    this.mostar=1;
    this.cursos.forEach((element: any) => {
      var btn1=document.getElementById('btncursos' + element);
      if(btn1){
        btn1.style.display = '';
      }
      var btn2=document.getElementById(element);
      if(btn2){
        btn2.style.borderCollapse = '';
        btn2.style.tableLayout = '';
        btn2.style.marginLeft = '';
      }
    });
    var btn1 = document.getElementById('btncvs');
    var btn2 =document.getElementById('btnxlsx');
    var btn3 =document.getElementById('btnpdf');
    var btn4 =document.getElementById('btncash');
    var btn5 =document.getElementById('modalGenerarCash');
    var btn6 =document.getElementById('detalleeconomico');
    if(btn1){
      btn1.style.display = '';
    }
    if(btn2){
      btn2.style.display = '';
    }
    if(btn3){
      btn3.style.display = '';
    }
    if(btn4){
      btn4.style.display = '';
    }
    if(btn5){
      btn5.style.display = '';
    }
    if(btn6){
      btn6.style.borderCollapse = '';
      btn6.style.tableLayout = '';
    }

  }, 100);
  
}

exportTable(val: any,genero?:any) {
  let admtitulo='';

  if(this.config_sistem.rol == 'admin'){
    admtitulo="Administrador(a)";
  }else if(this.config_sistem.rol == 'direc'){
    admtitulo="Director(a)";
  }else if(this.config_sistem.rol == 'delegado'){
    admtitulo="Delegado";
  }else{
    admtitulo="Colectora(a)";
  }
  
  if (val == 'detalleeconomico') {
    let genero={0:0,1:0,2:0}
    this.pagospension.forEach((element:any) => {
      genero[0]=genero[0]+element.genero[0];
      genero[1]=genero[1]+element.genero[1];
      genero[2]=genero[2]+element.genero[2];
    });
    this.mostar=0;
    //$('#btncursos'+val).hide();
    this.pagospension.forEach((element: any) => {
      $('#' + element.label).hide();
      var btn=document.getElementById(element.label);
      if(btn){
        btn.style.display = 'none';
      }
    });

    TableUtil.exportToPdf(
      val.toString(),
      this.pdffecha.toString(),
      'Detalle Economico de pensiones',
      this._configService.getDirector(),
      this._configService.getDelegado(),
      this._configService.getAdmin(),
      new Intl.DateTimeFormat('es-US', { month: 'long' }).format(new Date()),
      (this.url + 'obtener_portada/' + this.config_sistem.imagen).toString(),
      admtitulo,
      genero
    );
    //$('#btncursos'+val).show();
    this.pagospension.forEach((element: any) => {
      $('#' + element.label).show();
      var btn=document.getElementById(element.label);
      if(btn){
        btn.style.display = 'block';
      }
    });
  } else {
    
    if (val == 'becados') {
     let  genero={0:0,1:0,2:0}
    this.penest.forEach((element:any) => {
      
      if(element.condicion_beca=='Si'){
        if(element.idestudiante.genero=='Masculino'){
          
        genero[0]++;
        }else if(element.idestudiante.genero=='Femenino'){
          genero[1]++;
        }else{
        genero[2]++;
        }
      }
      

    });
      TableUtil.exportToPdf(
        val.toString(),
        this.pdffecha.toString(),
        'Becados: ' + this.pdffecha,
        this._configService.getDirector(),
        this._configService.getDelegado(),
        this._configService.getAdmin(),
        new Intl.DateTimeFormat('es-US', { month: 'long' }).format(new Date()),
        (this.url + 'obtener_portada/' + this.config_sistem.imagen).toString(),
        admtitulo,
        genero
      );
    } else if (val == 'eliminados') {
      
     let genero={0:0,1:0,2:0}
      this.retirados_arr.forEach((element:any) => {
        if(element.idestudiante.genero=='Masculino'){
          genero[0]++;
        }else if(element.idestudiante.genero=='Femenino'){
          genero[1]++;
        }else{
          genero[2]++;
        }
      });
      TableUtil.exportToPdf(
        val.toString(),
        this.pdffecha.toString(),
        'Estudiantes Retirados: ' + this.pdffecha,
        this._configService.getDirector(),
        this._configService.getDelegado(),
        this._configService.getAdmin(),
        new Intl.DateTimeFormat('es-US', { month: 'long' }).format(new Date()),
        (this.url + 'obtener_portada/' + this.config_sistem.imagen).toString(),
        admtitulo,
        genero
      );
    } else {
      if(val.includes('A')||val.includes('B')||val.includes('C')||val.includes('D')||val.includes('E')||val.includes('F')){
        $('#btncursos' + val).hide();
        TableUtil.exportToPdf(
          val.toString(),
          this.pdffecha.toString(),
          'Curso: ' + val,
          this._configService.getDirector(),
          this._configService.getDelegado(),
          this._configService.getAdmin(),
          new Intl.DateTimeFormat('es-US', { month: 'long' }).format(new Date()),
          (this.url + 'obtener_portada/' + this.config_sistem.imagen).toString(),
          admtitulo,
          genero
        );
        $('#btncursos' + val).show();

      }else{

        this.mostar=0;
        $('#btncursos' + val).hide();
        genero={0:0,1:0,2:0}
        this.pagospension.forEach((element:any) => {
          if(element.label==val+'A'||element.label==val+'B'||element.label==val+'C'||element.label==val+'D'||element.label==val+'E'||element.label==val+'F'){
            genero[0]=genero[0]+element.genero[0];
            genero[1]=genero[1]+element.genero[1];
            genero[2]=genero[2]+element.genero[2];
          }
        });
        setTimeout(() => {
          TableUtil.exportToPdf(
            val.toString(),
            this.pdffecha.toString(),
            'Curso: ' + val,
            this._configService.getDirector(),
            this._configService.getDelegado(),
            this._configService.getAdmin(),
            new Intl.DateTimeFormat('es-US', { month: 'long' }).format(new Date()),
            (this.url + 'obtener_portada/' + this.config_sistem.imagen).toString(),
            admtitulo,
            genero
          );
        }, 100);
        
        setTimeout(() => {
            
        $('#btncursos' + val).show();
        this.mostar=1;
        }, 100);
      }
      
    }
  }
}
getCount(name:any) {
  var aux=Object.assign(this.pagos_estudiante);
  //console.log(aux[0],name,aux[0].curso+aux[0].paralelo,aux[0].detalle[0], (aux[0].curso+aux[0].paralelo).toString() === name);
  return aux.filter((o:any) => (o.curso+o.paralelo).toString() === name&&o.detalle[1].porpagar==0).length;
  }
  getCountno(name:any) {
  var aux=Object.assign(this.pagos_estudiante);
  return aux.filter((o:any) => (o.curso+o.paralelo).toString() === name&&o.detalle[1].porpagar!=0).length;
  }
  getCountTotal(name:any) {
  var aux=Object.assign(this.pagos_estudiante);
  return aux.filter((o:any) => (o.curso).toString() === name&&o.detalle[1].porpagar==0).length;
  }
  getCountnoTotal(name:any) {
  
  var aux=Object.assign(this.pagos_estudiante);
  return aux.filter((o:any) => (o.curso).toString() === name&&o.detalle[1].porpagar!=0).length;
  }
  sumarvalores(valores:any){
  var suma=0;
  valores.forEach((element:any) => {
    if(this.isNumber(element.valor)){
      suma=element.valor+suma;
    }
  });
  return suma
  }
  public mcash=0;
  sumarcash(valores:any){
  var suma=0;
  for(var i=0; i<=this.mcash+1;i++){
    suma=valores[i].porpagar+suma;
  }
  return suma
  }
  onCash(): void {
    this.mcash=Number(this.mcash);
    this.exportarcash();
    }
  sumarrecuadado(indice:any, label:any){
  var suma=0;
  var aux=Object.assign(this.pagos_estudiante);
  if(indice!=12){
    aux.forEach((element:any) => {
      
      try {
        if((element.curso+element.paralelo).toString() === label && element.detalle[indice] && element.detalle[indice].valor>=0){
          suma=element.detalle[indice].valor+suma;
        }	
      } catch (error) {
        //console.log(element);
      }
      
    });
  }else{
    aux.forEach((element:any) => {
    
      if((element.curso+element.paralelo).toString() === label ){
        element.detalle.forEach((elementdt:any) => {
          
          suma=elementdt.valor+suma;
        });
        
      }
    });
  }
  
  return suma
  }

}

