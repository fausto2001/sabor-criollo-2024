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

  constructor() { }

  ngOnInit() {
    this.rol = this.usuarioService.personaLogeada.rol;
  }

  cerrarSesion(){
    this.authService.logout();
  }
}