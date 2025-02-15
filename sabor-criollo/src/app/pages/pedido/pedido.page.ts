import { CommonModule } from '@angular/common';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonImg, IonRow, IonButton, IonGrid, IonFabButton, IonFab, IonCardContent, IonCard, IonCardHeader, IonCardSubtitle, IonText } from '@ionic/angular/standalone';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProductoModel } from "../../models/producto.component";
import { Component, OnInit, ViewChild } from '@angular/core';
import { UsuarioModel } from "../../models/usuario.component";
import { UsuarioService } from 'src/app/services/usuario.service';
import { ProductoService } from 'src/app/services/producto.service';
import { PedidoService } from 'src/app/services/pedido.service';
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { PedidoModel } from 'src/app/models/pedido.component';
import { PedidoProducto } from 'src/app/models/pedido-producto.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { register } from 'swiper/element/bundle'
register();

@Component({
  selector: 'app-pedido',
  templateUrl: './pedido.page.html',
  styleUrls: ['./pedido.page.scss'],
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [ IonText, IonCardSubtitle, IonCardHeader, IonCard, IonCardContent, IonFab, IonFabButton, IonGrid, IonButton, IonImg, IonHeader, IonToolbar, IonTitle, IonContent, IonRow, CommonModule, FormsModule, CommonModule, ReactiveFormsModule ],
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
    private authService: AuthService) { }


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
    
      this.productoService.getProductos().subscribe(
        (productos) => {
          this.productos = productos.map((producto) => ({
            ...producto,
            cantidad: 0,
            imagenes: this.obtenerImagenesParaProducto(producto), // Genera las imágenes
          }));
        },
        (error) => {
          console.error('Error fetching productos: ', error);
        }
      );

/*       this.usuario = this.authService.usuario!;

        if (!this.usuario) {
          this.authService.user$.subscribe((data) => {
            if (data) {
              this.userService.getUsuarioPorUid(data.uid!).then((usuario) => {
                this.usuario = usuario!;
                //alert(this.usuario.apellido);
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
      ); */
    }

    obtenerImagenesParaProducto(producto: ProductoModel): string[] {
      const basePath = 'assets/images/';
      return [
        `${basePath}${producto.id}_1.jpg`,
        `${basePath}${producto.id}_2.jpg`,
        `${basePath}${producto.id}_3.jpg`,
      ];
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
      //debugger
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
      this.pedido.tiempoTotal = Math.max(...this.pedido.pedidos.map(p => p.producto.tiempoelaboracion));
      if(this.pedido.tiempoTotal < 0){
        this.pedido.tiempoTotal = 0;
      }
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
    return;
  }

  this.verificarPedidoPorRol();

  Swal.fire({
    title: "Tu Pedido",
    html: pedidoText,
    icon: 'info',
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
      this.router.navigateByUrl('/home');

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
      confirmButtonText: 'Aceptar',
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

  goHome(){
    this.router.navigateByUrl('/home');
  }

  goChat(){
    this.router.navigateByUrl('/chat');
  }

}