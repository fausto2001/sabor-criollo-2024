import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonIcon, IonImg, IonCol, IonRow, IonGrid } from '@ionic/angular/standalone';
import { UsuarioModel } from "../../models/usuario.component";
import { UsuarioService } from 'src/app/services/usuario.service';
import { MesaService } from 'src/app/services/mesa.service';
import { RouterLink, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { ToastService } from 'src/app/services/toast.service';
import { Observable } from 'rxjs';
//import { EmailService } from 'src/app/services/email.service';
import Swal from 'sweetalert2';
import { QrService } from 'src/app/services/qr.service';
import { PedidoService } from 'src/app/services/pedido.service';
import { PedidoModel } from 'src/app/models/pedido.component';
@Component({
  selector: 'app-home-pedido',
  templateUrl: './home-pedido.page.html',
  styleUrls: ['./home-pedido.page.scss'],
  standalone: true,
  imports: [IonGrid, IonContent, IonHeader, IonTitle, IonRow, IonCol, 
    IonButton, IonToolbar, CommonModule, FormsModule, RouterLink, IonIcon, IonImg]
})
export class HomePedidoPage implements OnInit {
  private authServ:AuthService = inject(AuthService)
  private usuarioServ:UsuarioService = inject(UsuarioService); 
  private mesaService:MesaService = inject(MesaService); 
  private pedidoService:PedidoService = inject(PedidoService); 
  private qrServ:QrService = inject(QrService);
  private router: Router = inject(Router);

  usuario!: UsuarioModel;
  pedido!:PedidoModel;
  constructor() { }

  ngOnInit() {
    this.usuario = this.authServ.usuario!;
    if (!this.usuario) {
      this.authServ.user$.subscribe((data) => {
        if (data) {
          this.usuarioServ.getUsuarioPorUid(data.uid!).then((usuario) => {
            this.usuario = usuario!;
          });
        }
      });
    }
    this.cargarUltimoPedido(this.usuario.id);

  }

  cargarUltimoPedido(id: string): void {
    console.log('id del usuario: ' + id);
    this.pedidoService.getUltimoPedidoUsuario(id).subscribe(
      (pedido) => {
        //this.pedido = pedido;
        console.log('Último pedido:', this.pedido);
        this.pedido = pedido[0];
      }
    );
  }

  goTo(path: string){
    this.router.navigate([path]);
  }

  goHome(){
    this.router.navigateByUrl('/home');
  }
}