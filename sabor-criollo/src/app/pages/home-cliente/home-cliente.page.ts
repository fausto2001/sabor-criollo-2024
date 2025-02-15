import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonCol, IonRow, IonImg } from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { UsuarioModel } from 'src/app/models/usuario.component';
import { AuthService } from 'src/app/services/auth.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { Barcode, BarcodeScanner } from '@capacitor-mlkit/barcode-scanning';
import { PushService } from 'src/app/services/push.service';

import Swal from 'sweetalert2';
@Component({
  selector: 'app-home-cliente',
  templateUrl: './home-cliente.page.html',
  styleUrls: ['./home-cliente.page.scss'],
  standalone: true,
  imports: [IonImg, IonRow, IonCol, IonButton, IonHeader, IonToolbar, IonTitle, IonContent, FormsModule, CommonModule],
})
export class HomeClientePage implements OnInit {

  private authServ:AuthService = inject(AuthService)
  private usuarioServ:UsuarioService = inject(UsuarioService); 
  private router: Router = inject(Router);
  private pushService: PushService = inject(PushService);
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

    this.authServ.user$.subscribe((data) => {
      if (data) {
        this.usuarioServ.getUsuarioPorUid(data.uid!).then((usuario) => {
          this.usuario = usuario!;
        });
      } else {
        this.usuario = null;
      }
    });

    setInterval(() =>{
      this.usuarioServ.getUsuarioPorUid(this.usuarioServ.personaLogeada.uid).then((usuario) =>{
        this.usuario!.enListaDeEspera = usuario!.enListaDeEspera;
        this.usuario!.mesa = usuario!.mesa;
      })
    }, 500)
  }

  async pedirMesaScan(): Promise<void> {

    const granted = await this.requestPermissions();
    if (!granted) {
      return;
    }
    this.barcodes = []; 
    const { barcodes } = await BarcodeScanner.scan();
    this.barcodes.push(...barcodes);

    if (this.barcodes.length > 0) {

      if(this.barcodes[0].rawValue == 'espera'){
        this.usuario!.enListaDeEspera = true;
        this.usuarioServ.updateUsuario(this.usuario!);
        this.pushService.sendNotificationtoSpecificDevice('Un cliente está esperando una mesa. ¡Atiende la solicitud ahora!', '¡Nueva solicitud en Sabor Criollo!', 'motoe40')// ngXfl09St1tkmB48AxYk fausto samsung a 04s

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
        Swal
          .fire({
            position: 'center',
            toast: true,
            title: 'Error',
            text: 'QR incorrecto. Debes escanear la mesa ' + this.usuario?.mesa,
            icon: 'error',
            showConfirmButton: true,
            confirmButtonText: 'Aceptar',
          });
        //alert('QR incorrecto. Debes escanear la mesa ' + this.usuario?.mesa);
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

  /* async presentAlert(): Promise<void> {
    const alert = await this.alertController.create({
      header: 'Permission denied',
      message: 'Please grant camera permission to use the barcode scanner.',
      buttons: ['OK'],
    });
    await alert.present();
  } */

  goChat(){
    this.router.navigateByUrl('/chat');
  }

  verEstadisticas(){
    this.router.navigateByUrl('/graficos');
  }

  goHome(){
    this.router.navigateByUrl('/home');
  }
}
