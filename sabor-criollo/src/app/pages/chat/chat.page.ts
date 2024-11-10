import { AfterViewInit, Component, inject, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonFooter, IonInput, IonImg, IonFab, IonFabButton, IonIcon, IonCard, IonCardContent, IonCardSubtitle, IonCardHeader, IonCardTitle, IonText, IonTextarea  } from '@ionic/angular/standalone';
import { ChatService } from 'src/app/services/chat.service';
import { Chat } from 'src/app/models/chat.component';
import { UsuarioService } from 'src/app/services/usuario.service';
import { UsuarioModel } from 'src/app/models/usuario.component';
import { AuthService } from 'src/app/services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { TStoDatePipe } from "../../pipes/tsto-date.pipe";
//import { NotificationPushService } from 'src/app/services/notification-push.service';

@Component({
    selector: 'app-chat',
    templateUrl: './chat.page.html',
    styleUrls: ['./chat.page.scss'],
    standalone: true,
    imports: [IonText, IonCardTitle, IonCardHeader, IonCardSubtitle, IonCardContent, IonCard, IonIcon, IonFabButton, IonFab, IonImg, IonInput, IonFooter, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, ReactiveFormsModule, IonTextarea, TStoDatePipe]
})
export class ChatPage implements OnInit, AfterViewInit {
  private chatServ:ChatService = inject(ChatService);
  private authServ:AuthService = inject(AuthService);
  private userServ:UsuarioService = inject(UsuarioService);
  //private pushNotifServ:NotificationPushService = inject(NotificationPushService)
  private actRoute:ActivatedRoute = inject(ActivatedRoute);
  private router:Router = inject(Router);


  mensajes:Chat[] = [];
  usuario!:UsuarioModel | null;
  id_mesa!:string;
  
  constructor(){
    this.usuario = this.authServ.usuario!
  }
  ngAfterViewInit(): void {
    this.scrollToBottom();

  }
 
  sendMensaje:string = '';
  @ViewChild(IonContent, { static: false }) content!: IonContent;

  scrollToBottom() {
    setTimeout(() => {
      this.content.scrollToBottom(0);
    }, 10);
  }

  determinarClaseMensaje(mensaje: Chat): string {
    return mensaje.uid_usuario === this.usuario!.uid ? 'send' : 'received';
  }

  determinarUsuarioMensaje(mensaje: Chat): boolean {
    return mensaje.uid_usuario === this.usuario!.uid ? true : false;
  }


  enviarMensaje(){
    if(this.sendMensaje != ''){
      const nuevoMensaje:Chat = <Chat>{
        uid_usuario: this.usuario!.uid,
        nombre: this.usuario!.nombre,
        rol: this.usuario!.rol,
        mensaje: this.sendMensaje,
        fecha: new Date(),
        mesa: this.usuario?.rol == 'cliente'? this.usuario.mesa : null
      }
      this.chatServ.guardarMensaje(nuevoMensaje);
      if(this.usuario?.rol == 'cliente'){
        //this.pushNotifServ.emitPushNotificationPorRol('Nuevo mensaje - Mesa: ' + this.usuario!.mesa, this.sendMensaje, 'mozo');
      }
      
      setTimeout(() => {
        this.sendMensaje = "";
        this.scrollToBottom();
      }, 10);
    }
  }


  ngOnInit() {
    this.id_mesa = this.actRoute.snapshot.params['id_mesa'];
    this.chatServ.cargarMensajes().subscribe(data => {
      this.mensajes = data;
      this.scrollToBottom();
    });
  
    if (!this.usuario) {
      this.authServ.user$.subscribe((data) => {
        if (data) {
          this.userServ.getUsuarioPorCorreo(data.email!).then((usuario) => {
            this.usuario = usuario;
          });
        }
      });
    }
  }
  
}