import { Component,OnInit} from '@angular/core';
import { ConfigService } from 'src/app/service/config.service';
import { Chart } from 'chart.js/auto';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-grafic-sp',
  templateUrl: './grafic-sp.component.html',
  styleUrls: ['./grafic-sp.component.scss']
})
export class GraficSpComponent implements OnInit {
  private datase: any[]=[];
  private labels: any[]=[];

  constructor(private _configService:ConfigService) {}

  ngOnInit(): void {
    //console.log(this._configService.getData());
    //console.log(this._configService.getLabels());
    this._configService.labels$.subscribe(labels => {
     //console.log(labels);
      this.labels = labels;
      // Actualizar el gráfico con las nuevas etiquetas
      //this.updateChart();
    });
    this._configService.data$.subscribe(data => {
      //console.log(data);
      this.datase = data;
      
      // Actualizar el gráfico con los nuevos datos
      this.updateChart();
    });
   
  }

  updateChart(){
    //console.log(this.datase,this.labels);
    var canvas = <HTMLCanvasElement>document.getElementById('myChart3');
    var ctx: CanvasRenderingContext2D | any;
    ctx = canvas.getContext('2d');
      var myChart3 = new Chart(ctx, {
        type: 'bar',
        data: {
        labels: this.labels,
        datasets: this.datase,
        },
        options: {
        scales: {
          y: {
          beginAtZero: true,
          },
        },
        },
      });
      //myChart3.update();
  }


 
}
