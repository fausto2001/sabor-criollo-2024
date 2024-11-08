import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonIcon, IonImg, IonCard, IonText, IonCardContent } from '@ionic/angular/standalone';
import { UsuarioModel } from "../../models/usuario.component";
import { UsuarioService } from 'src/app/services/usuario.service';
import { MesaService } from 'src/app/services/mesa.service';
import { AuthService } from 'src/app/services/auth.service';
import { ToastService } from 'src/app/services/toast.service';
import { Observable } from 'rxjs';
//import { EmailService } from 'src/app/services/email.service';
import Swal from 'sweetalert2';
import { MesaModel } from 'src/app/models/mesa.component';

@Component({
  selector: 'app-lista-espera',
  templateUrl: './lista-espera.page.html',
  styleUrls: ['./lista-espera.page.scss'],
  standalone: true,
  imports: [IonCardContent, IonText, IonCard, IonImg, IonIcon, IonButton, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class ListaEsperaPage implements OnInit {
  //private toast2Serv:Toast2Service = inject(Toast2Service);
  usuariosNoAdmitidos: UsuarioModel[] = [];
  hayUsuarios: boolean = true;
  mesaAsignada: boolean = false;

  constructor(private userService: UsuarioService, private authService: AuthService, 
    private toastServ: ToastService/*, private emailService: EmailService*/,
    private mesaService: MesaService) { }

  ngOnInit() {

    this.userService.getUsuariosEnListaDeEspera().subscribe(
      usuarios => {
        this.usuariosNoAdmitidos = usuarios;
        if(this.usuariosNoAdmitidos.length == 0){
          this.hayUsuarios = false;
        }
      }
    );

  }

  async aceptarUsuario(uid: string, enListaDeEspera: boolean, nombre: string) {
    //debugger;
    this.mesaAsignada = false;
    this.userService.getUsuarioPorUid(uid).subscribe(async (user: UsuarioModel) => {
      if (user) {
        ///////console.log(user);
        const numeroDeMesa = await this.asignarMesaUsuario(user);
        console.log(numeroDeMesa);
        if (numeroDeMesa !== null) {
          user.mesa = numeroDeMesa.toString();
          user.enListaDeEspera = false;
          await this.userService.updateUsuario(user);
  
          try {
            const mesaDisponible = await this.mesaService.getMesaDisponible(user.mesa).toPromise();
            if (mesaDisponible) {
              mesaDisponible.cliente = user.id;
              mesaDisponible.estado = 'Ocupada';
              await this.mesaService.updateMesa(mesaDisponible);
              // this.toastService.presentToast('top', 'Acción realizada exitosamente', 'success', 2000);
              this.toastServ.showToast('Acción realizada exitosamente', 2000);
            } else {
              // this.toastService.presentToast('bottom', 'La mesa no está disponible', 'danger', 2000);
              this.toastServ.showToast('La mesa no está disponible', 2000);
            }
          } catch (error) {
            // this.toastService.presentToast('bottom', 'Error al actualizar la mesa', 'danger', 2000);
            this.toastServ.showToast('Error al actualizar la mesa', 2000);
          }
        }
      } else {
        // this.toastService.presentToast('bottom', 'Usuario no encontrado', 'danger', 2000);
        this.toastServ.showToast('Usuario no encontrado', 2000);
      }
    });
  }
  

  async asignarMesaUsuario(user: UsuarioModel): Promise<number | null> {
    return new Promise((resolve) => {
      Swal.fire({
        title: "Tu Pedido",
        html: `
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <span>Mesa 1</span>
            <button id="asignarMesa1" class="swal2-confirm swal2-styled" style="background-color: #3085d6;">Asignar</button>
          </div>
          <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 10px;">
            <span>Mesa 2</span>
            <button id="asignarMesa2" class="swal2-confirm swal2-styled" style="background-color: #3085d6;">Asignar</button>
          </div>
          <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 10px;">
            <span>Mesa 3</span>
            <button id="asignarMesa3" class="swal2-confirm swal2-styled" style="background-color: #3085d6;">Asignar</button>
          </div>
          <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 10px;">
            <span>Mesa 4</span>
            <button id="asignarMesa4" class="swal2-confirm swal2-styled" style="background-color: #3085d6;">Asignar</button>
          </div>
        `,
        showCancelButton: true,
        cancelButtonText: 'Cancelar',
        reverseButtons: true,
        toast: true,
        position: 'center',
        showConfirmButton: false,
        didOpen: () => {
          const popup = Swal.getPopup();
          if (popup) {
            const asignarMesa1 = popup.querySelector('#asignarMesa1');
            const asignarMesa2 = popup.querySelector('#asignarMesa2');
            const asignarMesa3 = popup.querySelector('#asignarMesa3');
            const asignarMesa4 = popup.querySelector('#asignarMesa4');

            if (asignarMesa1) {
              asignarMesa1.addEventListener('click', async () => {
                const mesaDisponible = await this.mesaService.getMesaDisponible('1').toPromise();
                if (mesaDisponible) {
                  this.mesaAsignada = true;
                  Swal.fire({
                    title: 'Mesa 1 asignada',
                    icon: 'success',
                    toast: true,
                    position: 'center',
                    showConfirmButton: false,
                    timer: 2000
                  });
                  resolve(1);
                } else {
                  Swal.fire({
                    title: 'Mesa 1 no está disponible',
                    icon: 'error',
                    toast: true,
                    position: 'center',
                    showConfirmButton: false,
                    timer: 2000
                  });
                  resolve(null);
                }
              });
            }

            if (asignarMesa2) {
              asignarMesa2.addEventListener('click', async () => {
                const mesaDisponible = await this.mesaService.getMesaDisponible('2').toPromise();
                if (mesaDisponible) {
                  this.mesaAsignada = true;
                  Swal.fire({
                    title: 'Mesa 2 asignada',
                    icon: 'success',
                    toast: true,
                    position: 'center',
                    showConfirmButton: false,
                    timer: 2000
                  });
                  resolve(2);
                } else {
                  Swal.fire({
                    title: 'Mesa 2 no está disponible',
                    icon: 'error',
                    toast: true,
                    position: 'center',
                    showConfirmButton: false,
                    timer: 2000
                  });
                  resolve(null);
                }
              });
            }

            if (asignarMesa3) {
              asignarMesa3.addEventListener('click', async () => {
                const mesaDisponible = await this.mesaService.getMesaDisponible('3').toPromise();
                if (mesaDisponible) {
                  this.mesaAsignada = true;
                  Swal.fire({
                    title: 'Mesa 3 asignada',
                    icon: 'success',
                    toast: true,
                    position: 'center',
                    showConfirmButton: false,
                    timer: 2000
                  });
                  resolve(3);
                } else {
                  Swal.fire({
                    title: 'Mesa 3 no está disponible',
                    icon: 'error',
                    toast: true,
                    position: 'center',
                    showConfirmButton: false,
                    timer: 2000
                  });
                  resolve(null);
                }
              });
            }
            if (asignarMesa4) {
              asignarMesa4.addEventListener('click', async () => {
                const mesaDisponible = await this.mesaService.getMesaDisponible('4').toPromise();
                if (mesaDisponible) {
                  this.mesaAsignada = true;
                  Swal.fire({
                    title: 'Mesa 4 asignada',
                    icon: 'success',
                    toast: true,
                    position: 'center',
                    showConfirmButton: false,
                    timer: 2000
                  });
                  resolve(4);
                } else {
                  Swal.fire({
                    title: 'Mesa 4 no está disponible',
                    icon: 'error',
                    toast: true,
                    position: 'center',
                    showConfirmButton: false,
                    timer: 2000
                  });
                  resolve(null);
                }
              });
            }
          }
        }
      });
    });
  }
}
