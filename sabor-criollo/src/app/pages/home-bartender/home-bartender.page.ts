import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonCol, IonRow, IonImg } from '@ionic/angular/standalone';
import { UsuarioModel } from 'src/app/models/usuario.component';
import { AuthService } from 'src/app/services/auth.service';
//import { NotificationPushService } from 'src/app/services/notification-push.service';
import { QrService } from 'src/app/services/qr.service';
import { ToastService } from 'src/app/services/toast.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-home-bartender',
  templateUrl: './home-bartender.page.html',
  styleUrls: ['./home-bartender.page.scss'],
  standalone: true,
  imports: [IonImg, IonRow, IonCol, IonButton, IonHeader, IonToolbar, IonTitle, IonContent, RouterLink, FormsModule, ReactiveFormsModule, CommonModule],
})
export class HomeBartenderPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
