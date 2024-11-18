import { CommonModule, formatDate } from '@angular/common';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonImg, IonRow, IonButton, IonCol, IonInput, IonLabel, IonItem, IonGrid, IonRadioGroup, IonRadio, IonBackButton, IonFabButton, IonFab, IonFabList, IonCardContent, IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonText } from '@ionic/angular/standalone';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProductoModel } from "../../models/producto.component";
import { Component, inject, OnInit, ViewChild  } from '@angular/core';
import { UsuarioModel } from "../../models/usuario.component";
import { UsuarioService } from 'src/app/services/usuario.service';
import { MesaService } from 'src/app/services/mesa.service';

import { ProductoService } from 'src/app/services/producto.service';
import { PedidoService } from 'src/app/services/pedido.service';

import { AuthService } from 'src/app/services/auth.service';
import { ToastService } from 'src/app/services/toast.service';
import { AlertController } from '@ionic/angular';
import { Roles } from "../../models/type.component";
import { CamaraService } from 'src/app/services/camara.service';
import { QrService } from 'src/app/services/qr.service';
import { StorageService } from 'src/app/services/storage.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { PedidoModel } from 'src/app/models/pedido.component';
import { PedidoProducto } from 'src/app/models/pedido-producto.component';
//import { NotificationPushService } from 'src/app/services/notification-push.service';
import { MesaModel } from 'src/app/models/mesa.component';
@Component({
  selector: 'app-cuenta',
  templateUrl: './cuenta.page.html',
  styleUrls: ['./cuenta.page.scss'],
  standalone: true,
  imports: [IonText, IonCardSubtitle, IonCardTitle, IonCardHeader, IonCard, IonCardContent, IonFabList, IonFab, IonFabButton, IonBackButton, 
    IonRadio, IonRadioGroup, IonGrid, IonItem, IonLabel, IonInput, IonCol, 
    IonButton, IonImg, IonButtons, IonHeader, IonToolbar, IonTitle, IonContent, 
    IonRow, CommonModule, FormsModule, CommonModule, ReactiveFormsModule],})

export class CuentaPage implements OnInit {
  //private pushNotifServ:NotificationPushService = inject(NotificationPushService);
  private qrServ:QrService = inject(QrService);
  
  usuario!: UsuarioModel;
  pedido!: PedidoModel;
  cliente!: UsuarioModel;
  mesa!:MesaModel;
  propina:number = 0;
  total_propina = 0;
  subtotal = 0;


  constructor(private userService: UsuarioService, private productoService: ProductoService, 
    private pedidoService: PedidoService, private router: Router,
    private authService: AuthService, private toastService: ToastService, private mesaService: MesaService) { }

  ngOnInit() {
    this.usuario = this.authService.usuario!;
    if (!this.usuario) {
      this.authService.user$.subscribe((data) => {
        if (data) {
          this.userService.getUsuarioPorUid(data.uid!).then((usuario) => {
            this.usuario = usuario!;
            //alert(this.usuario.id);
            this.cargarUltimoPedido(this.usuario.id);

          });
        }
      });
    }

  }

  cargarUltimoPedido(id: string): void {
    console.log('id del usuario: ' + id);
    //alert(id);
    this.pedidoService.getUltimoPedidoUsuario(id).subscribe(
      (pedido) => {
        //this.pedido = pedido;
        console.log('Último pedido:', this.pedido);
        this.pedido = pedido.sort((a, b)=>{return a.fecha! > b.fecha! ? -1 : 1})[0];

        this.mesaService.getMesaUsuario(this.pedido.idMesa!, this.pedido.idCliente).subscribe( data => {
          this.mesa = data;
        });

        this.userService.getUsuarioPorId(this.pedido.idCliente).subscribe( data => {
          this.cliente = data;          
        })
        this.subtotal = this.pedido.importeTotal;
      }
    );
  }

  async escanearQRPropina() {
    try {
     // this.propina = Number.parseInt(await this.qrServ.escanearQR());
      this.total_propina = (this.pedido.importeTotal * this.propina) / 100
      
      this.pedido.importeTotal = this.subtotal + this.total_propina;

    } catch (error) {
      console.error('Error al escanear el QR:', error);
    }
  }



  async pagar(){

    //this.mesaService.getMesaUsuario(this.usuario.mesa, this.usuario.id);

    this.cliente.mesa = null;
    await this.userService.updateUsuario(this.cliente);

    // this.mesa.estado = 'Disponible';
    // this.mesa.cliente = null;
    // await this.mesaService.updateMesa(this.mesa)

    this.pedido.estado = 'Pagado';
    await this.pedidoService.updatePedido(this.pedido);

    // this.pushNotifServ.emitPushNotificationPorRol('Solicitando cuenta - Mesa: ' + this.pedido.idMesa , "El cliente está solicitando pagar su cuenta.", 'mozo');
    
    this.router.navigate(['/home'])
  }
  
  goHome(){
    this.router.navigateByUrl('/home');
  }

}