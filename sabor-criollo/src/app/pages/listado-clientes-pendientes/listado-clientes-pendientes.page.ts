import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonIcon, IonImg, IonText, IonCard, IonCardContent } from '@ionic/angular/standalone';
import { UsuarioService } from 'src/app/services/usuario.service';
import { AuthService } from 'src/app/services/auth.service';
import { ToastService } from 'src/app/services/toast.service';
import { Observable, Subscription } from 'rxjs';
//import { EmailService } from 'src/app/services/email.service';
//import { Toast2Service } from 'src/app/services/toast2.service';
import { UsuarioModel } from 'src/app/models/usuario.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-listado-clientes-pendientes',
  templateUrl: './listado-clientes-pendientes.page.html',
  styleUrls: ['./listado-clientes-pendientes.page.scss'],
  standalone: true,
  imports: [IonCardContent, IonCard, IonText, IonImg, IonIcon, IonButton, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule ]
})
export class ListadoClientesPendientesPage implements OnInit {
  //private toast2Serv:Toast2Service = inject(Toast2Service);
  usuariosNoAdmitidos: UsuarioModel[] = [];
hayUsuarios: boolean = true;
  
  getUsuario$!:Subscription;
  getAdmitidos$!:Subscription;

  router: Router = inject(Router);

  constructor(private userService: UsuarioService, private authService: AuthService, 
    private toastService: ToastService/*, private emailService: EmailService*/) { }


  async ngOnInit() {
    this.getAdmitidos$ = this.userService.getUsuariosNoAdmitidos().subscribe(
      usuarios => {
        this.usuariosNoAdmitidos = usuarios;
        this.hayUsuarios = this.usuariosNoAdmitidos.length > 0;
      },
      error => {
        console.error('Error al obtener usuarios no admitidos:', error);
      }
    );
  }

    async aceptarRechazarUsuario(email: string, admitido: boolean, nombre: string) {
      try {
        const user = await this.userService.getUsuarioPorCorreo(email);
    
        if (user) {
          user.admitido = admitido;
    
          this.userService.updateUsuario(user)
            .then(() => {
              if (admitido) {
                // this.emailService.enviandoEmail(nombre, email, '¡Genial! Has sido aprobado exitosamente');
              } else {
                // this.emailService.enviandoEmail(nombre, email, '¡Vaya! Tu solicitud ha sido rechazada');
              }
              // this.toastService.presentToast('top', 'Acción realizada exitosamente', 'success', 2000);
              // this.toast2Serv.showToast('Acción realizada exitosamente', 'short', 'top');
            })
            .catch(error => {
              console.error("Error al actualizar el usuario:", error);
              // this.toastService.presentToast('bottom', 'Error al realizar la acción', 'danger', 2000);
              // this.toast2Serv.showToast('Error al realizar la acción', 'short', 'bottom');
            });
        } else {
          console.warn("Usuario no encontrado");
          // this.toastService.presentToast('bottom', 'Usuario no encontrado', 'danger', 2000);
          // this.toast2Serv.showToast('Usuario no encontrado', 'short', 'bottom');
        }
      } catch (error) {
        console.error("Error al obtener el usuario:", error);
      }
    }
    
  

  ngOnDestroy(): void {
      this.getUsuario$.unsubscribe();
      this.getAdmitidos$.unsubscribe();
  }

  goHome(){
    this.router.navigateByUrl('/home');
  }
}