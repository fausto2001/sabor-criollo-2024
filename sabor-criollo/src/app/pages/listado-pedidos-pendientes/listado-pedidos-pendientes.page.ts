import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonHeader, IonToolbar, IonTitle, IonImg, IonRow, IonButton, IonGrid, IonCardContent, IonCard } from '@ionic/angular/standalone';
import { UsuarioModel } from "../../models/usuario.component";
import { UsuarioService } from 'src/app/services/usuario.service';
import { MesaModel } from "../../models/mesa.component";
import { MesaService } from 'src/app/services/mesa.service';
import { PedidoModel } from "../../models/pedido.component";
import { PedidoService } from 'src/app/services/pedido.service';
import { AuthService } from 'src/app/services/auth.service';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { PushService } from 'src/app/services/push.service';

@Component({
  selector: 'app-listado-pedidos-pendientes',
  templateUrl: './listado-pedidos-pendientes.page.html',
  styleUrls: ['./listado-pedidos-pendientes.page.scss'],
  standalone: true,
  imports: [ IonImg, IonButton, IonGrid, IonCardContent, IonRow, IonCard, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule ]
})
export class ListadoPedidosPendientesPage implements OnInit {
  private authServ:AuthService = inject(AuthService)
  private pushService: PushService = inject(PushService); 

  usuario!: UsuarioModel;
  mesas!: MesaModel[];
  hayMesas: boolean = true;
  pedidos: PedidoModel[] = []; 
  ultimoPedidos!: PedidoModel[];
  pedido!: PedidoModel;

  constructor(
    private userService: UsuarioService,
    private pedidoService: PedidoService,
    private router: Router,
    private mesaService: MesaService
  ) {}

  ngOnInit() {

    this.usuario = this.authServ.usuario!;
    if (!this.usuario) {
      this.authServ.user$.subscribe((data) => {
        if (data) {
          this.userService.getUsuarioPorUid(data.uid!).then((usuario) => {
            this.usuario = usuario!;
          });
        }
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
      return;
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
          this.pushService.sendNotificationtoSpecificDevice('El bartender terminó su parte.', '¡Actualización del pedido en Sabor Criollo!', 'samsunga33')
          pedido.estadoBartender = 'Finalizado';
          } 
        if(this.usuario.rol == 'cocinero' && pedido.estadoCocinero != 'No tiene'){
          this.pushService.sendNotificationtoSpecificDevice('El cocinero terminó su parte.', '¡Actualización del pedido en Sabor Criollo!', 'samsunga33')
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