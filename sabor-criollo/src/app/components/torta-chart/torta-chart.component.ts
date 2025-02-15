import { Component, OnInit, Input } from '@angular/core';
import { NgxChartsModule } from '@swimlane/ngx-charts';

@Component({
  selector: 'app-torta-chart',
  templateUrl: './torta-chart.component.html',
  styleUrls: ['./torta-chart.component.scss'],
  standalone: true,
  imports: [NgxChartsModule]
})
export class TortaChartComponent  implements OnInit {

  gradient: boolean = true;
  showLegend: boolean = false;
  showLabels: boolean = true;
  isDoughnut: boolean = false;
  legendPosition: string = 'below';

  @Input() view:any;
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
}