import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonCol, IonRow, IonImg } from '@ionic/angular/standalone';
import { RouterLink, Router } from '@angular/router';
import { UsuarioModel } from 'src/app/models/usuario.component';
import { AuthService } from 'src/app/services/auth.service';
//import { NotificationPushService } from 'src/app/services/notification-push.service';
import { QrService } from 'src/app/services/qr.service';
import { ToastService } from 'src/app/services/toast.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { Barcode, BarcodeScanner } from '@capacitor-mlkit/barcode-scanning';

@Component({
  selector: 'app-home-mozo',
  templateUrl: './home-mozo.page.html',
  styleUrls: ['./home-mozo.page.scss'],
  standalone: true,
  imports: [IonImg, IonRow, IonCol, IonButton, IonHeader, IonToolbar, IonTitle, IonContent, RouterLink, FormsModule, CommonModule],
})
export class HomeMozoPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
