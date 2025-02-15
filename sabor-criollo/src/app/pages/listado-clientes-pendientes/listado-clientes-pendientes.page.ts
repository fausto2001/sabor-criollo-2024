import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonImg, IonText, IonCard, IonCardContent } from '@ionic/angular/standalone';
import { UsuarioService } from 'src/app/services/usuario.service';
import { Subscription } from 'rxjs';
import { EmailService } from 'src/app/services/email.service';
import { UsuarioModel } from 'src/app/models/usuario.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-listado-clientes-pendientes',
  templateUrl: './listado-clientes-pendientes.page.html',
  styleUrls: ['./listado-clientes-pendientes.page.scss'],
  standalone: true,
  imports: [IonCardContent, IonCard, IonText, IonImg, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule ]
})
export class ListadoClientesPendientesPage implements OnInit {
  private emailService:EmailService = inject(EmailService);
  usuariosNoAdmitidos: UsuarioModel[] = [];
  hayUsuarios: boolean = true;
  
  getUsuario$!:Subscription;
  getAdmitidos$!:Subscription;

  router: Router = inject(Router);

  constructor(private userService: UsuarioService) { }


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
              if (admitido) {//COMENTADO PORQUE HAY LIMITE DE EMAILS
                this.emailService.enviandoEmail(nombre, email, '¡Genial! Has sido aprobado exitosamente');
              } else {
                this.emailService.enviandoEmail(nombre, email, '¡Vaya! Tu solicitud ha sido rechazada');
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