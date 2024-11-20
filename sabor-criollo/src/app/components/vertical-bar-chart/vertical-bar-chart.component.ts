import { Component, Input,OnInit } from '@angular/core';
import { LegendPosition, NgxChartsModule } from '@swimlane/ngx-charts';

@Component({
  selector: 'app-vertical-bar-chart',
  templateUrl: './vertical-bar-chart.component.html',
  styleUrls: ['./vertical-bar-chart.component.scss'],
  standalone: true,
  imports: [NgxChartsModule]
})
export class VerticalBarChartComponent  implements OnInit {

  showXAxis = true;
  showYAxis = true;
  gradient = false; 
  showLegend = true; 
  showXAxisLabel = true;
  xAxisLabel = 'Calificación de la Carta';
  showYAxisLabel = true; 
  yAxisLabel = 'Cantidad'; 

  @Input() view:any;
  @Input() legendPosition = LegendPosition.Below;
  @Input() encuestasMalas!: number;
  @Input() encuestasRegular!: number;
  @Input() encuestasBuenas!: number;

  colorScheme: any = {
    domain: ['#5AA454', '#C7B42C', '#FE0000','#A10A28', '#AAAAAA']
  };
  single: any[] = [];

  constructor() { }

  ngOnInit() {
    this.single = [
      {
        "name":"Buena",
        "value": this.encuestasBuenas
      },
      {
        "name":"Regular",
        "value": this.encuestasRegular
      },
      {
        "name":"Mala",
        "value": this.encuestasMalas
      }
    ];
  }

  onSelect(event:any) {
    console.log(event);
  }
}