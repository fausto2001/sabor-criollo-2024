import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonImg, IonSelectOption, IonRow, IonButton, IonCol, IonInput, IonLabel, IonItem, IonGrid, IonRadioGroup, IonRadio, IonBackButton, IonFabButton, IonFab, IonFabList, IonCardContent, IonCard, IonCardHeader } from '@ionic/angular/standalone';
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
//import { confirmarClaveValidator } from '../../Validators/password.validator';
//import { NotificationPushService } from 'src/app/services/notification-push.service';

@Component({
  selector: 'app-listado-pedidos-pendientes',
  templateUrl: './listado-pedidos-pendientes.page.html',
  styleUrls: ['./listado-pedidos-pendientes.page.scss'],
  standalone: true,
  imports: [IonCardHeader, IonImg, IonButton, IonGrid, IonBackButton, IonCardContent, IonButtons, IonRow, IonCard, IonContent, IonFab, IonFabButton, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class ListadoPedidosPendientesPage implements OnInit {
  private authServ:AuthService = inject(AuthService)
  private usuarioServ:UsuarioService = inject(UsuarioService); 
  private qrServ:QrService = inject(QrService);
  //private pushNotifServ:NotificationPushService = inject(NotificationPushService);

  usuario!: UsuarioModel;
  mesas!: MesaModel[];
  hayMesas: boolean = true;
  pedidos: PedidoModel[] = []; // Inicializa como un array vacío
  ultimoPedidos!: PedidoModel[];
  pedido!: PedidoModel;

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

    this.usuario = this.authServ.usuario!;
    if(!this.usuario){
      this.authServ.user$.subscribe( (data)=> {
        this.usuarioServ.getUsuarioPorUid(data!.uid).subscribe( (user) => {
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
      },
      (error) => {
        console.error('Error fetching usuarios no admitidos: ', error);
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

  prepararPedido(pedido: PedidoModel){
    let pedidoText = '';
    const pedidosRol = pedido.pedidos.filter(pedidoProducto => pedidoProducto.producto.rol === this.usuario.rol);

    if (pedido.pedidos.length > 0) {
      pedidosRol.forEach(pedidoProducto => {
        pedidoText += `${pedidoProducto.producto.nombre}, Cantidad: ${pedidoProducto.cantidad}\n`;
      });
    } else {
      pedidoText = 'No hay productos en el pedido.';
    }

    Swal.fire({
      title: "Preparar pedido?",
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
      backdrop: `
        rgba(30,30,30,0.4)
      `
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: 'PEDIDO PREPARADO',
          icon: 'success',
          timer: 2000,
          toast: true,
          position: 'center',
          showConfirmButton: false
        });

        if(this.usuario.rol == 'bartender' && pedido.estadoBartender != 'No tiene'){
          pedido.estadoBartender = 'Finalizado';
          } 
        if(this.usuario.rol == 'cocinero' && pedido.estadoCocinero != 'No tiene'){
          pedido.estadoCocinero = 'Finalizado';
        }

        if(
          (pedido.estadoBartender == 'Finalizado' && pedido.estadoCocinero == 'No tiene') || 
          (pedido.estadoCocinero == 'Finalizado' && pedido.estadoBartender == 'No tiene') ||
          (pedido.estadoCocinero == pedido.estadoBartender)
        ){
          pedido.estado = 'Finalizado';
          //this.pushNotifServ.emitPushNotificationPorRol("Pedido Finalizado", "El pedido de la mesa: " + pedido.idMesa + " está terminado", 'mozo')          
        }




        console.log(pedido);

        this.pedidoService.updatePedido(pedido);


      }
    });
  }

  goHome(){
    this.router.navigateByUrl('/home');
  }
}