import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonHeader, IonToolbar, IonTitle, IonImg, IonRow, IonButton, IonGrid, IonCardContent, IonCard } from '@ionic/angular/standalone';
import { UsuarioModel } from "../../models/usuario.component";
import { UsuarioService } from 'src/app/services/usuario.service';
import { MesaModel } from "../../models/mesa.component";
import { MesaService } from 'src/app/services/mesa.service';
import { PedidoModel } from "../../models/pedido.component";
import { PedidoService } from 'src/app/services/pedido.service';
import { AuthService } from 'src/app/services/auth.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { PushService } from 'src/app/services/push.service';
@Component({
  selector: 'app-estado-mesas',
  templateUrl: './estado-mesas.page.html',
  styleUrls: ['./estado-mesas.page.scss'],
  standalone: true,
  imports: [ IonCard, IonCardContent, IonGrid, IonButton, IonImg, IonHeader, IonToolbar, IonTitle, IonRow, CommonModule, FormsModule, ReactiveFormsModule ],
})
export class EstadoMesasPage implements OnInit {

  private pushService: PushService = inject(PushService);
  mesas!: MesaModel[];
  hayMesas: boolean = true;
  pedidos: PedidoModel[] = [];
  ultimoPedidos!: PedidoModel[];
  pedido!: PedidoModel;
  usuario!:UsuarioModel;
  cliente!:UsuarioModel;

  constructor(
    private userService: UsuarioService,
    private pedidoService: PedidoService,
    private router: Router,
    private authService: AuthService,
    private mesaService: MesaService
  ) {}

  ngOnInit() {

    this.usuario = this.authService.usuario!;
    if (!this.usuario) {
      this.authService.user$.subscribe((data) => {
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
      return;
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
        } 
        if(pedido.estadoCocinero != 'No tiene'){
          pedido.estadoCocinero = 'En proceso';
        }
        this.pushService.sendNotificationtoSpecificDevice('Hay un nuevo pedido a la espera', '¡Nuevo pedido en Sabor Criollo!', 'samsunga33')// ngXfl09St1tkmB48AxYk fausto samsung a 04s

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
      return;
      //pedidoText = 'No hay productos en el pedido.';
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
      return;
      //pedidoText = 'No hay productos en el pedido.';
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
            pedido.estado = 'Cobrado';
            this.pedidoService.updatePedido(pedido);

          }
        });

      }
    });
  }

  goHome(){
    this.router.navigateByUrl('/home');
  }
}