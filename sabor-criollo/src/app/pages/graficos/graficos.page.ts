import { Component, OnInit, HostListener, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonCard } from '@ionic/angular/standalone';
import { Platform } from '@ionic/angular'
import { VerticalBarChartComponent } from 'src/app/components/vertical-bar-chart/vertical-bar-chart.component';
import { TortaChartComponent } from 'src/app/components/torta-chart/torta-chart.component';
import { EncuestaService } from 'src/app/services/encuesta.service';


@Component({
  selector: 'app-graficos',
  templateUrl: './graficos.page.html',
  styleUrls: ['./graficos.page.scss'],
  standalone: true,
  imports: [IonCard,IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule,VerticalBarChartComponent,TortaChartComponent],
})
export class GraficosPage implements OnInit {

  view: any;
  ok:boolean=false;

  private encuestaSer:EncuestaService = inject(EncuestaService);

  encuentasMalas:number = 0;
  encuentasRegular: number = 0;
  encuentasBuenas: number = 0;

  constructor(
    private platform: Platform
  ) {
    this.encuestaSer.getTodasEncuestas().subscribe(data =>{
      if(data!=null && data.length>0){
        this.encuentasMalas=data.filter((item)=>{
         return item.cartaEstablecimiento=='Mala'
        }).length;
        this.encuentasRegular=data.filter((item)=>{
          return item.cartaEstablecimiento=='Regular'
        }).length;
        this.encuentasBuenas=data.filter((item)=>{
          return item.cartaEstablecimiento=='Buena'
        }).length;

        this.ok=true;
        //console.log(this.encuentasMalas);
      }
    });
    //this.encuestaSer.cargarEncuestasDePrueba();

  }



  ngOnInit() {
  }

  @HostListener('window:resize',['$event'])
  onResize(event: any) {
    this.handleScreenSizeChange();
  }

  handleScreenSizeChange(){
    const width = this.platform.width();
    const height = this.platform.height();
    console.log(width, height)
    if (width > height) {
      this.view = [0.9 * width, 0.9 * height];
    } else {
      this.view = [0.9 * width, 0.9 * height];
    }
  }

  
  

}