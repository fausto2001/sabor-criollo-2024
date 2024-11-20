import { CommonModule } from '@angular/common';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonImg, IonRow, IonButton, IonGrid, IonCardContent, IonCard } from '@ionic/angular/standalone';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { UsuarioModel } from "../../models/usuario.component";
import { UsuarioService } from 'src/app/services/usuario.service';
import { MesaService } from 'src/app/services/mesa.service';
import { PedidoService } from 'src/app/services/pedido.service';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { PedidoModel } from 'src/app/models/pedido.component';
import { MesaModel } from 'src/app/models/mesa.component';
import { Barcode, BarcodeScanner } from '@capacitor-mlkit/barcode-scanning';

@Component({
  selector: 'app-cuenta',
  templateUrl: './cuenta.page.html',
  styleUrls: ['./cuenta.page.scss'],
  standalone: true,
  imports: [ IonCard, IonCardContent, IonGrid, IonButton, IonImg, IonHeader, IonToolbar, IonTitle, IonContent, IonRow, CommonModule, FormsModule, CommonModule, ReactiveFormsModule ],
})

export class CuentaPage implements OnInit {

  usuario!: UsuarioModel;
  pedido!: PedidoModel;
  cliente!: UsuarioModel;
  mesa!:MesaModel;
  propina:number = 0;
  total_propina = 0;
  subtotal = 0;

  protected isSupported = false;
  protected barcodes: Barcode[] = [];

  constructor(private userService: UsuarioService, private pedidoService: PedidoService, private router: Router, private authService: AuthService, private mesaService: MesaService) { }

    ngOnInit() {
      this.usuario = this.authService.usuario!;
      if (!this.usuario) {
        this.authService.user$.subscribe((data) => {
          if (data) {
            this.userService.getUsuarioPorUid(data.uid!).then((usuario) => {
              this.usuario = usuario!;
              if (this.usuario.id) {
                this.cargarUltimoPedido(this.usuario.id);

              }
            });
          }
        });
      } else {
        this.cargarUltimoPedido(this.usuario.id);
      }
      BarcodeScanner.isSupported().then((result) => {
        this.isSupported = result.supported;

      });
    }

  cargarUltimoPedido(id: string): void {
    console.log('id del usuario: ' + id);
    this.pedidoService.getUltimoPedidoUsuario(id).subscribe(
      (pedido) => {
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
      this.total_propina = (this.pedido.importeTotal * this.propina) / 100
      
      this.pedido.importeTotal = this.subtotal + this.total_propina;

    } catch (error) {
      console.error('Error al escanear el QR:', error);
    }
  }
  async scan(): Promise<void> {

    const granted = await this.requestPermissions();
    if (!granted) {
      return;
    }
    this.barcodes = []; 
    const { barcodes } = await BarcodeScanner.scan();

    this.barcodes.push(...barcodes);

    if (this.barcodes.length > 0) {

      this.propina = Number(this.barcodes[0].rawValue);
      this.pedido.importeTotal = (this.subtotal  * (100 + this.propina))/100
    } else {
        console.warn('No se encontró ningún código en el escaneo.');
    }
  }

  async requestPermissions(): Promise<boolean> {
    const { camera } = await BarcodeScanner.requestPermissions();
    return camera === 'granted' || camera === 'limited';
  }


  async pagar(){
    this.cliente.mesa = null;
    await this.userService.updateUsuario(this.cliente);
    this.pedido.estado = 'Pagado';
    await this.pedidoService.updatePedido(this.pedido);
    this.router.navigate(['/home'])
  }
  
  goHome(){
    this.router.navigateByUrl('/home');
  }
}