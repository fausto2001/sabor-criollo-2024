import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { RouterLink, Router } from '@angular/router';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonCol, IonRow, IonImg } from '@ionic/angular/standalone';
//import { UsuarioModel } from 'src/app/models/usuario';
import { AuthService } from 'src/app/services/auth.service';
//import { NotificationPushService } from 'src/app/services/notification-push.service';
import { QrService } from 'src/app/services/qr.service';
import { ToastService } from 'src/app/services/toast.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import Swal from 'sweetalert2';
//import { PushNotificationService } from 'src/app/services/push-notification.service';
@Component({
  selector: 'app-home-supervisor',
  templateUrl: './home-supervisor.page.html',
  styleUrls: ['./home-supervisor.page.scss'],
  standalone: true,
  imports: [IonImg, IonRow, IonCol, IonButton, IonHeader, IonToolbar, IonTitle, IonContent, RouterLink, FormsModule, CommonModule],
})
export class HomeSupervisorPage implements OnInit {

  //private pushNotifServ: PushNotificationService = inject(PushNotificationService);

  constructor() { }

  ngOnInit() {
    //this.pushNotifServ.checkAndPromptForSubscription().then(() => {
     // this.pushNotifServ.sendNotification("Hola :)", "esta es una notificación de prueba!!");
   // });
  }
}
