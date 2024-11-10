import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonImg, IonSelectOption, IonRow, IonButton, IonCol, IonInput, IonLabel, IonItem, IonGrid, IonRadioGroup, IonRadio, IonBackButton, IonFabButton, IonFab, IonFabList, IonCardContent, IonCard } from '@ionic/angular/standalone';
import { UsuarioModel } from "../../models/usuario.component";
import { UsuarioService } from 'src/app/services/usuario.service';
import { MesaModel } from "../../models/mesa.component";
import { MesaService } from 'src/app/services/mesa.service';
import { PedidoModel } from "../../models/pedido.component";
import { PedidoService } from 'src/app/services/pedido.service';
import { ProductoService } from 'src/app/services/producto.service';
import { AuthService } from 'src/app/services/auth.service';
import { ToastService } from 'src/app/services/toast.service';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AlertController } from '@ionic/angular';
//import { Roles } from "../../models/types.component";
import { CamaraService } from 'src/app/services/camara.service';
import { QrService } from 'src/app/services/qr.service';
import { StorageService } from 'src/app/services/storage.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
//import { NotificationPushService } from 'src/app/services/notification-push.service';

@Component({
  selector: 'app-estado-mesas',
  templateUrl: './estado-mesas.page.html',
  styleUrls: ['./estado-mesas.page.scss'],
  standalone: true,
  imports: [IonCard, IonCardContent, IonFabList, IonFab, IonFabButton, IonBackButton, IonRadio, IonSelectOption, IonRadioGroup, IonGrid, IonItem, IonLabel, IonInput, IonCol, IonButton, IonImg, IonButtons, IonHeader, IonToolbar, IonTitle, IonContent, IonRow, CommonModule, FormsModule, ReactiveFormsModule],
})
export class EstadoMesasPage implements OnInit {
  //private pushNotifServ: NotificationPushService = inject(NotificationPushService);
  mesas!: MesaModel[];
  hayMesas: boolean = true;
  pedidos: PedidoModel[] = []; // Inicializa como un array vacío
  ultimoPedidos!: PedidoModel[];
  pedido!: PedidoModel;
  usuario!:UsuarioModel;
  cliente!:UsuarioModel;

  constructor(
    private userService: UsuarioService,
    private productoService: ProductoService,
    private pedidoService: PedidoService,
    private router: Router,
    private authService: AuthService,
    private toastService: ToastService,
    private mesaService: MesaService
  ) {}

  ngOnInit() {

    this.usuario = this.authService.usuario!;
    if(!this.usuario){
      this.authService.user$.subscribe( (data)=> {
        this.userService.getUsuarioPorUid(data!.uid).subscribe( (user) => {
          this.usuario = user;
        });
      });
    }

    this.mesaService.getMesas().subscribe(
      (mesas) => {
        this.mesas = mesas;
        if (this.mesas.length == 0) {
          this.hayMesas = false;
        }
      }
    );
    this.obtenerPedidosMesas();
    console.log(this.pedidos);
  } 

  obtenerPedidosMesas(): void {
    const numerosMesas = ['1', '2', '3', '4'];
    numerosMesas.forEach((numero) => this.obtenerPedidosMesa(numero));
  }

  obtenerPedidosMesa(numero: string): void {
    this.pedidoService.getUltimoPedidoMesaTake1(numero).subscribe(
      (pedidos) => {
        if (pedidos.length > 0) {
          const ultimoPedido = pedidos.sort((a, b) => (a.fecha! > b.fecha! ? -1 : 1))[0];
          this.pedidos.push(ultimoPedido);
        }
      }
    );
  }

  tomarPedido(pedido: PedidoModel){
    let pedidoText = '';
    if (pedido.pedidos.length > 0) {
      pedido.pedidos.forEach(pedidoProducto => {
        pedidoText += `${pedidoProducto.producto.nombre}, Cantidad: ${pedidoProducto.cantidad}\n`;
      });
    } else {
      pedidoText = 'No hay productos en el pedido.';
    }

    Swal.fire({
      title: "Tomar pedido?",
      text: pedidoText,
      width: 600,
      padding: "3em",
      toast: true,
      color: "#000000",
      background: "#fff url(../../../assets/fondo-pedido.jpeg)",
       cancelButtonText: 'Cancelar',
       cancelButtonColor: '#ff2a96',
       confirmButtonText: 'Confirmar',
       confirmButtonColor: '#ff2a96',
       showCancelButton: true,

      backdrop: `
        rgba(30,30,30,0.4)
      `
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: 'PEDIDO TOMADO',
          icon: 'success',
          timer: 2000,
          toast: true,
          position: 'center',
          showConfirmButton: false
        });

        
        if(pedido.estadoBartender != 'No tiene'){
          pedido.estadoBartender = 'En proceso';
          //this.pushNotifServ.emitPushNotificationPorRol('Nuevo pedido', "Ver lista de pendientes", 'bartender');
        } 
        if(pedido.estadoCocinero != 'No tiene'){
          pedido.estadoCocinero = 'En proceso';
          //this.pushNotifServ.emitPushNotificationPorRol('Nuevo pedido', "Ver lista de pendientes", 'cocinero');
        }
        pedido.estado = 'En proceso';
        this.pedidoService.updatePedido(pedido);


      }
    });   
  }

  entregarPedido(pedido: PedidoModel){
    let pedidoText = '';
    if (pedido.pedidos.length > 0) {
      pedido.pedidos.forEach(pedidoProducto => {
        pedidoText += `${pedidoProducto.producto.nombre}, Cantidad: ${pedidoProducto.cantidad}\n`;
      });
    } else {
      pedidoText = 'No hay productos en el pedido.';
    }

    Swal.fire({
      title: "Entregar pedido?",
      text: pedidoText,
      width: 600,
      padding: "3em",
      toast: true,
      color: "#000000",
      background: "#fff url(../../../assets/fondo-pedido.jpeg)",
       cancelButtonText: 'Cancelar',
       cancelButtonColor: '#ff2a96',
       confirmButtonText: 'Confirmar',
       confirmButtonColor: '#ff2a96',
       showCancelButton: true,
      backdrop: `
        rgba(30,30,30,0.4)
      `
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: 'PEDIDO ENTREGADO',
          icon: 'success',
          timer: 2000,
          toast: true,
          position: 'center',
          showConfirmButton: false

        });

        
        if(pedido.estado == 'Finalizado'){
          pedido.estado = 'Entregado';
        }

        this.pedidoService.updatePedido(pedido);


      }
    });
    
  }

  cobrarPedido(pedido: PedidoModel, mesa: MesaModel){
    let pedidoText = '';
    if (pedido.pedidos.length > 0) {
      pedido.pedidos.forEach(pedidoProducto => {
        pedidoText += `${pedidoProducto.producto.nombre}, Cantidad: ${pedidoProducto.cantidad}\n`;
      });

      pedidoText += `\n${pedido.importeTotal}`;
    } else {
      pedidoText = 'No hay productos en el pedido.';
    }

    Swal.fire({
      title: "Cobrar pedido?",
      text: pedidoText,
      width: 600,
      padding: "3em",
      toast: true,
      color: "#000000",
      background: "#fff url(../../assets/fondo-pedido.jpeg)",
       cancelButtonText: 'Cancelar',
       cancelButtonColor: '#ff2a96',
       confirmButtonText: 'Confirmar',
       confirmButtonColor: '#ff2a96',
       showCancelButton: true,
      backdrop: `
        rgba(30,30,30,0.4)
      `
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: 'PEDIDO COBRADO',
          icon: 'success',
          timer: 2000,
          toast: true,
          position: 'center',
          showConfirmButton: false
        });

        mesa.estado = 'Disponible';
        mesa.cliente = null;
        this.mesaService.updateMesa(mesa);

        this.userService.getUsuarioPorId(pedido.idCliente).subscribe( data => {
          if(data){
            
            data.mesa = null;
            this.userService.updateUsuario(data);
    
          }
        });
        this.pedido.estado = 'Cobrado';
        this.pedidoService.updatePedido(pedido);

      }
    });

  }
}