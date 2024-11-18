import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonSelect, IonSelectOption, IonInputPasswordToggle, IonHeader, IonTitle, IonToolbar, IonImg, IonIcon, IonFabButton, IonFabList, IonFab, IonRow, IonItem, IonButton, IonCol, IonInput, IonLabel, IonList, IonApp } from '@ionic/angular/standalone';
import { HomeBartenderPage } from '../home-bartender/home-bartender.page';
import { HomeClientePage } from '../home-cliente/home-cliente.page';
import { HomeCocineroPage } from '../home-cocinero/home-cocinero.page';
import { HomeDuenioPage } from '../home-duenio/home-duenio.page';
import { HomeMetrePage } from '../home-metre/home-metre.page';
import { HomeMozoPage } from '../home-mozo/home-mozo.page';
import { HomeSupervisorPage } from '../home-supervisor/home-supervisor.page';
import { UsuarioService } from 'src/app/services/usuario.service';
import { AuthService } from 'src/app/services/auth.service';
import { OnesignalService } from 'src/app/services/onesignal.service';
import { Capacitor } from '@capacitor/core';
import { Platform } from '@ionic/angular/standalone';
import { lastValueFrom } from 'rxjs';
import { Preferences } from '@capacitor/preferences';
import { PushService } from 'src/app/services/push.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [IonSelect, IonSelectOption, IonInputPasswordToggle, IonIcon, IonFabList, IonItem, IonButton, IonInput, IonLabel, IonList, IonRow, IonCol, IonImg, IonFabButton, IonFab, IonApp, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, HomeBartenderPage, HomeClientePage, HomeCocineroPage, HomeDuenioPage, HomeMetrePage, HomeMozoPage, HomeSupervisorPage]
})
export class HomePage implements OnInit {

  protected rol: string ='';
  private usuarioService: UsuarioService = inject(UsuarioService);
  private authService: AuthService = inject(AuthService);
  private onesignalService = inject(OnesignalService);
  private platform = inject(Platform);
  private pushService: PushService = inject(PushService);


  constructor() { 
    this.platform.ready().then(() => {
      if(Capacitor.getPlatform() != 'web') this.onesignalService.OneSignalInit();
    });
  }

  ngOnInit() {
    this.rol = this.usuarioService.personaLogeada.rol;

    if(Capacitor.getPlatform() != 'web') this.oneSignal();

    //this.onesignalService.requestPermission();
    //this.pushService.createOneSignalUser();
  }

  async oneSignal() {
    try {
      await this.onesignalService.OneSignalIOSPermission();
    } catch(e) {
      console.log(e);
    }
  }

  cerrarSesion(){
    this.authService.logout();
  }
}