import { CommonModule, formatDate } from '@angular/common';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonImg, IonRow, IonButton, IonCol, IonInput, IonLabel, IonItem, IonGrid, IonRadioGroup, IonRadio, IonBackButton, IonFabButton, IonFab, IonFabList, IonCardContent, IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonText } from '@ionic/angular/standalone';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProductoModel } from "../../models/producto.component";
import { Component, inject, OnInit, ViewChild  } from '@angular/core';
import { UsuarioModel } from "../../models/usuario.component";
import { UsuarioService } from 'src/app/services/usuario.service';
import { ProductoService } from 'src/app/services/producto.service';
import { PedidoService } from 'src/app/services/pedido.service';

import { AuthService } from 'src/app/services/auth.service';
import { ToastService } from 'src/app/services/toast.service';
import { AlertController } from '@ionic/angular';
import { Roles } from "src/app/models/type.component";
import { CamaraService } from 'src/app/services/camara.service';
import { QrService } from 'src/app/services/qr.service';
import { StorageService } from 'src/app/services/storage.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { PedidoModel } from 'src/app/models/pedido.component';
import { PedidoProducto } from 'src/app/models/pedido-producto.component';


@Component({
  selector: 'app-pedido',
  templateUrl: './pedido.page.html',
  styleUrls: ['./pedido.page.scss'],
  standalone: true,
  imports: [IonText, IonCardSubtitle, IonCardTitle, IonCardHeader, IonCard, IonCardContent, IonFabList, IonFab, IonFabButton, IonBackButton, 
    IonRadio, IonRadioGroup, IonGrid, IonItem, IonLabel, IonInput, IonCol, 
    IonButton, IonImg, IonButtons, IonHeader, IonToolbar, IonTitle, IonContent, 
    IonRow, CommonModule, FormsModule, CommonModule, ReactiveFormsModule],
})
export class PedidoPage implements OnInit {
  productos: ProductoModel[] = [];
  pedido: PedidoModel = { 
    id: '100',
    pedidos: [],
    importeTotal: 0,
    tiempoTotal: 0,
    idCliente: '',
    estado: 'pendiente',
    idMesa: null,
    estadoCocinero: 'pendiente',
    estadoBartender: 'pendiente',
    fecha: null,
  };
  importeTotal: number = 0;
  tiempoTotal: number = 0;
  usuario!: UsuarioModel;
  @ViewChild('agregarBtnRef', { static: true }) agregarBtn!: IonButton;
  @ViewChild('some') imgDinamica!: IonImg;
  currentImg:number = 0;

  constructor(private userService: UsuarioService, private productoService: ProductoService, 
    private pedidoService: PedidoService, private router: Router,
    private authService: AuthService, private toastService: ToastService) { }
    //private productosPedidos: ProductoModel[] = [];

    ngOnInit() {

      this.usuario = this.authService.usuario!;
     /* if(!this.usuario){
        this.authService.user$.subscribe( (data)=> {

        });
      }*/

      if (!this.usuario) {
        this.authService.user$.subscribe((data) => {
          if (data) {
            this.userService.getUsuarioPorCorreo(data.email!).then((usuario) => {
              this.usuario = usuario!;
            });
          }
        });
      }

      this.productoService.getProductos().subscribe(
        productos => {
          this.productos = productos.map(producto => ({ ...producto, cantidad: 0 }));
        },
        error => {
          console.error('Error fetching productos: ', error);
        }
      );
    }

    actualizarCantidadPedido(producto: ProductoModel, agregar: boolean) {
      const index = this.productos.findIndex(p => p.id === producto.id);
    
      if (index !== -1) {
        if (agregar) {
          producto.cantidad++;
        } else {
          if (this.productos[index].cantidad > 0) {
            producto.cantidad--;
          }
        }
        console.log(producto.cantidad)
    
      }
    }
    
    actualizarPedido(producto: ProductoModel) {
      debugger
      const pedidoExistente = this.verificarProducto(producto.id);
      
      if (pedidoExistente) {
        this.pedido.pedidos = this.pedido.pedidos.map(p => {
          if (p.producto.id === producto.id) {
            const nuevaCantidad = producto.cantidad;

            if (nuevaCantidad > 0) {
              //return { ...p, cantidad: nuevaCantidad };
              // this.toastService.presentToast('top', 'Se actualizo el producto', 'success', 2000);
              //this.toast2Serv.showToast('Se actualizo el producto', 'short', 'top');
            }else{
              //agregarBtn.text = 'Agregar producto';
              // this.toastService.presentToast('top', 'Se elimino del carrito', 'danger', 2000);
              //this.toast2Serv.showToast('Se elimino del carrito', 'short', 'top');

            }
            return { ...p, cantidad: nuevaCantidad };

          }
          return p;
        }).filter(p => p.cantidad > 0); // Filtra los productos con cantidad mayor a 0
      } else {
        if (producto.cantidad > 0) {
          const pedido: PedidoProducto = { 
            producto: producto,
            cantidad: producto.cantidad,
            estado: 'pendiente'
          };
          //this.agregarBtn.text = 'Modificar cantidad';
          // this.toastService.presentToast('top', 'Se agrego al carrito', 'success', 2000);
          //this.toast2Serv.showToast('Se agrego al carrito', 'short', 'top');


          this.pedido.pedidos.push(pedido);
        }else{
          this.pedido.pedidos = this.pedido.pedidos.filter(p => p.producto.id !== producto.id);
        }
      }
    
      this.actualizarImporteTotal();
    }
    
    

    actualizarImporteTotal() {
      this.pedido.importeTotal = this.pedido.pedidos.reduce((total, pedidoProducto) => {
        return total + pedidoProducto.producto.precio * pedidoProducto.cantidad;
      }, 0);
  
      this.pedido.tiempoTotal = Math.max(...this.pedido.pedidos.map(p => p.producto.tiempoelavoracion));
    }

mostrarPedido() {

  let pedidoText = '';
  this.pedido.fecha = new Date();

  if (this.pedido.pedidos.length > 0) {
    this.pedido.pedidos.forEach(pedidoProducto => {
      pedidoText += `${pedidoProducto.producto.nombre}, Cantidad: ${pedidoProducto.cantidad}<br>`;
      this.pedido.idCliente = this.usuario.id;
      this.pedido.idMesa = this.usuario.mesa;
    });
  } else {
    pedidoText = 'No hay productos en el pedido.';
  }

  this.verificarPedidoPorRol();

  Swal.fire({
    title: "Tu Pedido",
    html: pedidoText,
    icon: 'info',
    // Configuración para cuando hay productos
    showCancelButton: true,
    confirmButtonText: 'Confirmar Pedido',
    cancelButtonText: 'Cancelar',
    reverseButtons: true,
    toast: true,
    position: 'center'
  }).then((result) => {
    if (result.isConfirmed) {
      Swal.fire({
        title: 'Pedido Confirmado, el mozo lo preparará lo más rápido posible',
        icon: 'success',
        timer: 2000,
        toast: true,
        position: 'center',
        showConfirmButton: false
      });
      this.pedidoService.setPedido(this.pedido);
      this.router.navigateByUrl('/lista-espera');

    } else if (result.dismiss === Swal.DismissReason.cancel) {
      Swal.fire({
        title: 'Pedido Cancelado',
        icon: 'error',
        timer: 2000,
        toast: true,
        position: 'center',
        showConfirmButton: false
      });
    }
  }, () => {
    Swal.fire({
      title: "Tu Pedido",
      html: 'No hay productos en el pedido.',
      icon: 'info',
      confirmButtonText: 'OK',
      toast: true,
      position: 'center'
    });
  });
}

  verificarProducto(productoId: string) {
    return this.pedido.pedidos.some(p => p.producto.id === productoId);
  }
  
  verificarPedidoPorRol(){
    this.pedido.estadoBartender = 'No tiene';
    this.pedido.estadoCocinero = 'No tiene';

    this.pedido.pedidos.forEach(pedidoProducto => {
      if (pedidoProducto.producto.rol === 'bartender') {
        this.pedido.estadoBartender = 'pendiente';
      } 
      if (pedidoProducto.producto.rol == 'cocinero'){
        this.pedido.estadoCocinero = 'pendiente';
      }
    });
  }


  setImage(value:number){
    let result = this.currentImg + value;
    if(result > 2){
      result = 0;
    }
    else if (result < 0){
      result = 2;
    }

    this.currentImg = result;
      
  }



}