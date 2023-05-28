import { Component, OnInit } from '@angular/core';
import { AdminService } from 'src/app/service/admin.service';
import { Chart } from 'chart.js/auto';
import { Colors } from 'chart.js';
Chart.register(Colors);
@Component({
  selector: 'app-sales-anual',
  templateUrl: './sales-anual.component.html',
  styleUrls: ['./sales-anual.component.scss']
})
export class SalesAnualComponent implements OnInit{
  public auxanio: Array<any> = [];
  public anio: Array<any> = [];
  public datosventa = {};
  public ventas: Array<any> = [];
  public totalfactual = 0;
  public pagosmes = 0;
  public totalfaux = 0;
  public factual = new Date();
  public faux = new Date().setFullYear(new Date().getFullYear() - 1);
  public auxfactual = new Date(this.factual).getMonth();
  public pagos: Array<any> = [];
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
  public page = 1;
	public pageSize = 10;

  constructor(private _adminService: AdminService) {}


  ngOnInit(): void {
		this.auxanio = [];
		this.ventas = [];
		this.anio = [];
		this.totalfactual = 0;
		this.pagosmes = 0;
		this._adminService.obtener_detallespagos_admin(localStorage.getItem('token'), null).subscribe((response) => {
			
      if(response.data){
        this.ventas = response.data;
        if (this.ventas != undefined) {
          for (var i = 0; i < this.ventas.length; i++) {
            if (
              new Date(this.ventas[i].createdAt).getFullYear() == new Date(this.faux).getFullYear() &&
              this.ventas[i].pago.estado == 'Registrado'
            ) {
              this.totalfaux = this.ventas[i].valor + this.totalfaux;
            } else if (
              new Date(this.ventas[i].createdAt).getFullYear() == new Date(this.factual).getFullYear()
            ) {
              this.totalfactual += this.ventas[i].valor;
            }
  
            if (
              i == 0 &&
              new Date(this.ventas[i].createdAt).getFullYear() == new Date(this.factual).getFullYear()
            ) {
              this.anio.push({
                label:
                  new Date(this.ventas[i].idpension.anio_lectivo).getFullYear().toString() +
                  ' ' +
                  this.ventas[i].idpension.curso +
                  this.ventas[i].idpension.paralelo,
                data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                backgroundColor: 'rgba(54,162,235,0.2)',
                borderColor: 'rgba(54,162,235,1)',
                borderWidth: 2,
              });
              this.anio[0].data[new Date(this.ventas[i].createdAt).getMonth()] =
                this.anio[0].data[new Date(this.ventas[i].createdAt).getMonth()] + this.ventas[i].valor;
            } else if (
              new Date(this.ventas[i].createdAt).getFullYear() == new Date(this.factual).getFullYear()
            ) {
              let aux =
                new Date(this.ventas[i].idpension.anio_lectivo).getFullYear().toString() +
                ' ' +
                this.ventas[i].idpension.curso +
                this.ventas[i].idpension.paralelo;
              let con = -1;
              for (var j = 0; j < this.anio.length; j++) {
                if (this.anio[j].label.toString() == aux) {
                  con = j;
                }
              }
              if (con == -1) {
                var auxcolor1 = Math.random() * 255;
                var auxcolor2 = Math.random() * 255;
  
                this.anio.push({
                  label:
                    new Date(this.ventas[i].idpension.anio_lectivo).getFullYear().toString() +
                    ' ' +
                    this.ventas[i].idpension.curso +
                    this.ventas[i].idpension.paralelo,
                  data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                  backgroundColor: 'rgba(' + auxcolor2 + ',' + auxcolor1 + ',200,0.2)',
                  borderColor: 'rgba(' + auxcolor2 + ',' + auxcolor1 + ',200,1)',
                  borderWidth: 2,
                });
                this.anio[this.anio.length - 1].data[new Date(this.ventas[i].createdAt).getMonth()] =
                  this.anio[this.anio.length - 1].data[new Date(this.ventas[i].createdAt).getMonth()] +
                  this.ventas[i].valor;
              } else {
                this.anio[con].data[new Date(this.ventas[i].createdAt).getMonth()] =
                  this.anio[con].data[new Date(this.ventas[i].createdAt).getMonth()] + this.ventas[i].valor;
              }
            }
          }
  
          if (document.getElementById('myChart2') != null) {
            this.anio.forEach((element) => {
              
              //this.myChart.data.datasets.push(element);
              this.auxanio.push(element);
  
              this.pagosmes += element.data[this.auxfactual];
              
            });
            this.pagos=[{label:'Valores Recaudados',data:{
              'Enero':0,
              'Febrero':0,
              'Marzo':0,'Abril':0,'Mayo':0,'Junio':0,'Julio':0,'Agosto':0,'Septiembre':0,'Octubre':0,'Noviembre':0,'Dicembre':0},backgroundColor
            :"rgba(54,162,235,0.2)",borderColor:"rgba(54,162,235,1)",borderWidth:2}]
            this.anio.forEach((element:any) => {
              element.data.forEach((elementdata:any, index:any) => {
                this.pagos[0].data[this.meses[index]]=this.pagos[0].data[this.meses[index]]+elementdata
              });
            });
  
            var canvas = <HTMLCanvasElement>document.getElementById('myChart2');
            var ctx: CanvasRenderingContext2D | any;
            ctx = canvas.getContext('2d');
  
            var myChart = new Chart(ctx, {
              type: 'bar',
              data: {
                labels:this.meses,
                datasets: this.pagos,
              },
              options: {
                plugins: {
                  colors: {
                    forceOverride: true
                  }
                  },
                scales: {
                  y: {
                    beginAtZero: true,
                  },
                },
              },
            });
            //console.log(this.anio);
  
            
            
            //myChart.data.datasets=this.pagos;
            //console.log(pagos);
            //console.log(this.auxfactual);
            //console.log(this.auxanio);
  
            this.ordenarmes(0);
  
            //console.log(this.auxanio);
            //myChart.update();
          }
  
        }
      }
			
		});
	}
	ordenarmes(eve:any){
		let aux=parseInt(this.auxfactual.toString());
		this.auxanio = this.auxanio.sort(function (a, b) {

			if(a.data[aux]<b.data[aux]){
				return 1
			}
			if(a.data[aux]>b.data[aux]){
				return -1
			}
			return 0;

		});
	}
}
