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

  // options
  showXAxis = true;
  showYAxis = true;
  gradient = false; // hace un degradado si esta en true
  showLegend = true; //Cartel a la derecha
  showXAxisLabel = true;
  xAxisLabel = 'Calificación de la Carta';//'Country';
  showYAxisLabel = true; // es el titulo horizontal en nuestro caso Tipo de Clientes
  yAxisLabel = 'Cantidad'; //'Population';

  @Input() view:any;
  @Input() legendPosition = LegendPosition.Below;
  @Input() encuestasMalas!: number;
  @Input() encuestasRegular!: number;
  @Input() encuestasBuenas!: number;

  colorScheme: any = {
    domain: ['#5AA454', '#C7B42C', '#FE0000','#A10A28', '#AAAAAA']
  };
  single: any[] = [];
  //cantidadBuena:number=15;
  //cantidadRegular:number=4;
  //cantidadMala:number=2;

  constructor() { }

  ngOnInit() {
    //console.log('this.encuestasMalas: ',this.encuestasMalas);
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