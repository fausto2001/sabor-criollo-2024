import { AfterViewInit, Component, inject, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonFooter, IonImg, IonFabButton, IonCard, IonCardContent, IonCardSubtitle, IonCardHeader, IonTextarea } from '@ionic/angular/standalone';
import { ChatService } from 'src/app/services/chat.service';
import { Chat } from 'src/app/models/chat.component';
import { UsuarioService } from 'src/app/services/usuario.service';
import { UsuarioModel } from 'src/app/models/usuario.component';
import { AuthService } from 'src/app/services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { TStoDatePipe } from "../../pipes/tsto-date.pipe";
import { PushService } from 'src/app/services/push.service';

@Component({
    selector: 'app-chat',
    templateUrl: './chat.page.html',
    styleUrls: ['./chat.page.scss'],
    standalone: true,
    imports: [ IonCardHeader, IonCardSubtitle, IonCardContent, IonCard, IonFabButton, IonImg, IonFooter, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, ReactiveFormsModule, IonTextarea, TStoDatePipe]
})
export class ChatPage implements OnInit, AfterViewInit {
  private chatServ:ChatService = inject(ChatService);
  private authServ:AuthService = inject(AuthService);
  private userServ:UsuarioService = inject(UsuarioService);
  private actRoute:ActivatedRoute = inject(ActivatedRoute);
  private router:Router = inject(Router);
  private pushService: PushService = inject(PushService);

  mensajes:Chat[] = [];
  usuario!:UsuarioModel | null;
  id_mesa!:string;
  
  constructor(){
    this.usuario = this.authServ.usuario!
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
          this.userServ.getUsuarioPorUid(data.uid!).then((usuario) => {
            this.usuario = usuario!;
          });
        }
      });
    }
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
/*
  determinarClaseMensaje(mensaje: Chat): string {
    return mensaje.uid_usuario === this.usuario!.uid ? 'send' : 'received';
  }

  determinarUsuarioMensaje(mensaje: Chat): boolean {
    return mensaje!.uid_usuario === this.usuario!.uid ? true : false;
  }*/

    determinarClaseMensaje(mensaje: Chat): string {
      return mensaje.email === this.usuario!.email ? 'send' : 'received';
    }
  
    determinarUsuarioMensaje(mensaje: Chat): boolean {
      return mensaje!.email === this.usuario!.email ? true : false;
    }

  enviarMensaje(){
    if(this.sendMensaje != ''){
      const nuevoMensaje:Chat = <Chat>{
        uid_usuario: this.usuario!.uid,
        nombre: this.usuario!.nombre,
        rol: this.usuario!.rol,
        mensaje: this.sendMensaje,
        fecha: new Date(),
        mesa: this.usuario?.rol == 'cliente'? this.usuario.mesa : null,
        email: this.usuario!.email
      }
      this.chatServ.guardarMensaje(nuevoMensaje);
      if(this.usuario?.rol == 'cliente'){
        //this.pushNotifServ.emitPushNotificationPorRol('Nuevo mensaje - Mesa: ' + this.usuario!.mesa, this.sendMensaje, 'mozo');
        this.pushService.sendNotificationtoSpecificDevice('Un cliente ha realizado una consulta ¡Respondele lo antes posible!', '¡Nueva consulta en Sabor Criollo!', 'motoe40')// ngXfl09St1tkmB48AxYk fausto samsung a 04s

      }
      
      setTimeout(() => {
        this.sendMensaje = "";
        this.scrollToBottom();
      }, 10);
    }
  }

  goHome(){
    this.router.navigateByUrl('/home');
  }  
}