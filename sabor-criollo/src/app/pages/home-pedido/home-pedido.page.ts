import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonImg, IonCol, IonRow, IonCard, IonCardTitle } from '@ionic/angular/standalone';
import { UsuarioModel } from "../../models/usuario.component";
import { UsuarioService } from 'src/app/services/usuario.service';
import { RouterLink, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { PedidoService } from 'src/app/services/pedido.service';
import { PedidoModel } from 'src/app/models/pedido.component';
@Component({
  selector: 'app-home-pedido',
  templateUrl: './home-pedido.page.html',
  styleUrls: ['./home-pedido.page.scss'],
  standalone: true,
  imports: [IonCardTitle, IonCard, IonContent, IonHeader, IonTitle, IonRow, IonCol, IonButton, IonToolbar, CommonModule, FormsModule, RouterLink, IonImg ]
})
export class HomePedidoPage implements OnInit {
  private authServ:AuthService = inject(AuthService)
  private usuarioServ:UsuarioService = inject(UsuarioService); 
  private pedidoService:PedidoService = inject(PedidoService);
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
    this.pedidoService.getUltimoPedidoUsuario(id).subscribe(
      (pedido) => {
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