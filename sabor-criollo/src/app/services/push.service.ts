import { Injectable } from '@angular/core';
import { Component, OnInit, inject } from '@angular/core';
import { Capacitor } from '@capacitor/core';
import { Platform } from '@ionic/angular/standalone';
import { lastValueFrom } from 'rxjs';
import { Preferences } from '@capacitor/preferences';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { OnesignalService } from 'src/app/services/onesignal.service';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonCol, IonRow, IonImg } from '@ionic/angular/standalone';
import { UsuarioModel } from 'src/app/models/usuario.component';
import { UsuarioService } from 'src/app/services/usuario.service';
@Injectable({
  providedIn: 'root'
})
export class PushService {

  protected error: string = '';
  private authService: AuthService = inject(AuthService);
  private router: Router = inject(Router);
  private onesignal = inject(OnesignalService);
  private platform = inject(Platform);
  private usuarioService = inject(UsuarioService);
  private authServ = inject(AuthService);
  
  private usuario: UsuarioModel | null;
  private id_notificacion: any;

  constructor() {

    this.platform.ready().then(() => {
      if(Capacitor.getPlatform() != 'web') this.onesignal.OneSignalInit();
    });
    /*this.usuario = this.usuarioService.personaLogeada;*/

    this.usuario = this.authServ.usuario;
    this.authServ.user$.subscribe((data) => {
      if (data && data.email) {
        this.usuarioService.getUsuarioPorCorreoObservable(data.email).subscribe((user) => {
          this.usuario = user;
        });
      }
    });

    //if(Capacitor.getPlatform() != 'web') this.onesignal.OneSignalInit();
  }

  ngOnInit() {
    console.log('ngoninit');
    //this.onesignal.OneSignalIOSPermission();
    if(Capacitor.getPlatform() != 'web') this.oneSignal();
  }

  
  async oneSignal() {
    try {
      await this.onesignal.OneSignalIOSPermission();
    } catch(e) {
      console.log(e);
    }
  }

  async createOneSignalUser() {
    try {
      const data = await this.getStorage('auth');
      console.log('stored data: ', data);
      //alert('1. JSON: '+ data.value)
      this.id_notificacion = data.value;
      if(!data || !data?.value) {
        this.createUserAndLogin();

        this.id_notificacion = data.value;
        //alert('2. data: '+ data.value)

        this.usuario!.tokenNotification = this.id_notificacion;
        this.usuarioService.updateUsuario(this.usuario!);
        return;
      }
      //console.log('external id: ', data.value);
      const response = await lastValueFrom(this.onesignal.checkOneSignalUserIdentity(data.value));

      if(!response) {
        this.createUserAndLogin();
      } else {
        const { identity } = response;
        //console.log('identity: ', identity);
        if(!identity?.external_id) {
          this.id_notificacion = !identity?.external_id;/**/ 
          //alert('3. identify: '+ !identity?.external_id)

          this.usuario!.tokenNotification = this.id_notificacion;
          this.usuarioService.updateUsuario(this.usuario!);
          this.createUserAndLogin();
        } else {
          this.onesignal.login(identity?.external_id);
          this.id_notificacion = identity?.external_id;/**/ 
          //alert('4. identify: '+ identity?.external_id)

          this.usuario!.tokenNotification = this.id_notificacion;
          this.usuarioService.updateUsuario(this.usuario!);
          //alert('User already registered in onesignal');
        }
      }
    } catch(e) {
      console.log(e);
    }

    this.usuario!.tokenNotification = this.id_notificacion;
    this.usuarioService.updateUsuario(this.usuario!);
  }
/*
    async createOneSignalUser() {
      try {
        const data = await this.getStorage('auth');
        alert("Data obtenida del storage: " + JSON.stringify(data)); // 1er alert para ver data del storage
        console.log('stored data: ', data);
    
        if (!data || !data?.value) {
          this.createUserAndLogin();
          

          this.id_notificacion = data.value;

          return;
        }
        this.id_notificacion = data.value;
    //aca guardar id
        alert('external id: ' +  data.value);
        
        // 3er alert al recibir respuesta de OneSignal para verificar el 'identity'
        const response = await lastValueFrom(this.onesignal.checkOneSignalUserIdentity(data.value));
        console.log("Respuesta de OneSignal: ", JSON.stringify(response));
    
        this.usuario.tokenNotification = data.value; 
        this.usuarioService.updateUsuario(this.usuario); 
        if (!response) {
          this.createUserAndLogin();
        } else {
          const { identity } = response;
          alert('2. identity: '+ identity);
          this.usuario.tokenNotification = data.value || identity.external_id; 
          this.usuarioService.updateUsuario(this.usuario); 
          this.id_notificacion = identity?.external_id;

          if (!identity?.external_id) {
            this.createUserAndLogin();
            this.usuario.tokenNotification = data.value || identity.external_id; 
            this.usuarioService.updateUsuario(this.usuario); 
          } else {
            this.onesignal.login(identity?.external_id);
            
            this.usuario.tokenNotification = data.value || identity.external_id; 
            this.usuarioService.updateUsuario(this.usuario); 

            // 4to alert cuando el usuario ya está registrado en OneSignal
            alert("4. Usuario ya registrado en OneSignal con ID: " + identity.external_id);
          }
        }
      } catch (e) {
        console.log(e);
      }
      this.usuario.tokenNotification = this.id_notificacion;
      this.usuarioService.updateUsuario(this.usuario); 
    }*/
    

  async createUserAndLogin() {
    try {
      const randomNumber = this.generateRandomString(20);
      console.log('Número almacenado: ', randomNumber);
      await lastValueFrom(this.onesignal.createOneSignalUser(randomNumber));
      await Preferences.set({ key: 'auth', value: randomNumber });
      this.onesignal.login(randomNumber);
      //alert('Usuario creado en onesignal');
    } catch(e) {
      throw(e);
    }
  }
  
  /*async showToast(msg: string, color: string = 'success', duration = 3000) {
    const toast = await this.toastCtrl.create({
      message: msg,
      duration: duration,
      color: color,
      position: 'bottom'
    });
    toast.present();
  }*/

  generateRandomString(length: number): string {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
  
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      result += characters.charAt(randomIndex);
    }
  
    return result;
  }  

  async deleteOneSignalUser() {
    try {
      const data = await this.getStorage('auth');
      if(!data?.value) return;
      console.log('ID externo: ', data.value);
      const response = await lastValueFrom(this.onesignal.checkOneSignalUserIdentity(data.value));
      const { identity } = response;
      console.log('Identidad: ', identity);
      await lastValueFrom(this.onesignal.deleteOneSignalUser(identity?.external_id));
      //alert('Usuario eliminado de onesignal');
    } catch(e) {
      console.log(e);
    }
  }
 
  getStorage(key: string) {
    return Preferences.get({ key: key });
  }
//mensaje, titulo, email, dispositivo
  async sendNotificationtoSpecificDevice(mensaje: string, titulo: string, email: any, dispositivo: any) {
    try {
      const data = await this.getStorage('auth');
      this.usuario = await this.usuarioService.getUsuarioPorCorreo(email);
      if (data?.value) {
        alert(data.value);
        await lastValueFrom(
          this.onesignal.sendNotification(
            'Notificacion para usuario especifico',
            mensaje,
            { type: 'user1' },
           // [data.value]//aca va el id del usuario
           [this.usuario?.tokenNotification, dispositivo]//BLZ3xKG0QgwxiXqJzX2k
          )
        );
      }
      console.log(data);
    } catch (e) {
      console.log(e);
    }
  }

  async sendNotificationtoAllUsers() {
    try {
      await lastValueFrom(
        this.onesignal.sendNotification(
          'Este es un mensaje de prueba para todo el mundo',
          'Mensaje de prueba',
          { type: 'user12' }
        )
      );
    } catch (e) {
      console.log(e);
    }
  }

  async sendNotificationtoSpecificDeviceFromWeb() {
    try {
      await lastValueFrom(
        this.onesignal.sendNotification(
          'Esto es una prueba',
          'Mensaje de prueba',
          { type: 'user1' },
          [
            'coHcnUkQifwJunY37EgT',
            'eATuiZAy7iJ5IE1YLxvK'
          ]
        )
      );
    } catch (e) {
      console.log(e);
    }
  }

  goHome(){
    this.router.navigateByUrl('/home');
  }  
}
