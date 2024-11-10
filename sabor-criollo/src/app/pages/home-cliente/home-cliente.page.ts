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

import Swal from 'sweetalert2';
@Component({
  selector: 'app-home-cliente',
  templateUrl: './home-cliente.page.html',
  styleUrls: ['./home-cliente.page.scss'],
  standalone: true,
  imports: [IonImg, IonRow, IonCol, IonButton, IonHeader, IonToolbar, IonTitle, IonContent, RouterLink, FormsModule, CommonModule],
})
export class HomeClientePage implements OnInit {

  private authServ:AuthService = inject(AuthService)
  private usuarioServ:UsuarioService = inject(UsuarioService); 
  private qrServ:QrService = inject(QrService);
  private router: Router = inject(Router);
  private toastServ: ToastService = inject(ToastService);
  //private pushServ:NotificationPushService = inject(NotificationPushService)
  usuario!:UsuarioModel | null;

  scannedCode: any | null = null;
  qrScanner: boolean = false;
  datos: Barcode[] = []

  isSupported = false;
  barcodes: Barcode[] = [];
  constructor() { }

  ngOnInit() {

    BarcodeScanner.isSupported().then((result) => {
      this.isSupported = result.supported;
    });

    this.usuario = this.authServ.usuario;
    this.authServ.user$.subscribe((data) => {
      if (data && data.email) {
        this.usuarioServ.getUsuarioPorCorreoObservable(data.email).subscribe((user) => {
          this.usuario = user;
        });
      }
    });
  }

  // Esto hay que reformularlo para que no tenga problema con los clientes anónimos
  //verificar que esta escaneando su mesa asignada
  async pedirMesaScan(): Promise<void> {

    const granted = await this.requestPermissions();
    if (!granted) {
      this.presentAlert();
      return;
    }
    this.barcodes = []; 
    const { barcodes } = await BarcodeScanner.scan();
    this.barcodes.push(...barcodes);

    if (this.barcodes.length > 0) {

      if(this.barcodes[0].rawValue == 'espera'){
        this.usuario!.enListaDeEspera = true;
        this.usuarioServ.updateUsuario(this.usuario!);
      }else{
        alert('ERROR, QR INCORRECTO');
      }

    } else {
        console.warn('No se encontró ningún código en el escaneo.');
    }
  }

  async scanMesa()
  {

    this.usuario!.enListaDeEspera = false;
    this.usuarioServ.updateUsuario(this.usuario!);

    const granted = await this.requestPermissions();
    if (!granted) {
      this.presentAlert();
      return;
    }
    this.barcodes = []; 
    const { barcodes } = await BarcodeScanner.scan();
    this.barcodes.push(...barcodes);

    if (this.barcodes.length > 0) {

      if(this.barcodes[0].rawValue == this.usuario?.mesa){
        this.usuario!.enListaDeEspera = false;
        this.usuarioServ.updateUsuario(this.usuario!);
        this.router.navigateByUrl('/home-pedido');
      }else{
        alert('QR incorrecto. Debes escanear la mesa ' + this.usuario?.mesa);
        this.usuario!.enListaDeEspera = false;
        this.usuarioServ.updateUsuario(this.usuario!);
      }

    } else {
        console.warn('No se encontró ningún código en el escaneo.');
    }
  }

  async requestPermissions(): Promise<boolean> {
    const { camera } = await BarcodeScanner.requestPermissions();
    return camera === 'granted' || camera === 'limited';
  }

  async presentAlert(): Promise<void> {
    /*const alert = await this.alertController.create({
      header: 'Permission denied',
      message: 'Please grant camera permission to use the barcode scanner.',
      buttons: ['OK'],
    });
    await alert.present();*/
  }
}
