import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonImg, IonIcon, IonFabButton, IonFabList, IonFab, IonRow, IonItem, IonButton, IonCol, IonInput } from '@ionic/angular/standalone';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { OnesignalService } from 'src/app/services/onesignal.service';
import { Capacitor } from '@capacitor/core';
import { Platform } from '@ionic/angular/standalone';
import { lastValueFrom } from 'rxjs';
import { Preferences } from '@capacitor/preferences';

//import { PushNotificationService } from 'src/app/services/push-notification.service';
//import Swal from 'sweetalert2';
//import { ToastService } from 'src/app/services/toast.service';
//import { NotificationPushService } from 'src/app/services/notification-push.service';

//import { UsuarioService } from '../../services//usuario.service';
//import { UsuarioModel } from '../../models/usuario.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: true,
  imports: [IonInput, IonCol, IonButton, IonItem, IonRow, IonFab, IonFabList, IonFabButton, IonIcon, IonImg, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, CommonModule, ReactiveFormsModule]
})
export class LoginComponent  implements OnInit {

  //private usuarioServ:UsuarioService = inject(UsuarioService);

  protected error: string = '';
  //private toastService: ToastService = inject(ToastService);
  private authService: AuthService = inject(AuthService);
  private router: Router = inject(Router);
  private onesignal = inject(OnesignalService);
  private platform = inject(Platform);
  //private pushNotifServ: PushNotificationService = inject(PushNotificationService);

  protected form: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)/*Validators.pattern()*/]),
  });

  constructor() {
    /*
    this.platform.ready().then(() => {
      if(Capacitor.getPlatform() != 'web') this.onesignal.OneSignalInit();
    });
    //this.authService.loginAnonymously();

    //if(Capacitor.getPlatform() != 'web') this.onesignal.OneSignalInit();*/
  }

  ngOnInit() {
    //console.log('ngoninit');

    //this.onesignal.OneSignalIOSPermission();
    //if(Capacitor.getPlatform() != 'web') this.oneSignal();
  }
/*
  async oneSignal() {
    await this.onesignal.OneSignalIOSPermission();
    const randomNumber  = {Math.random()}.toString;

    Preferences.set{{key: 'auth', value: randomNumber}};

    await lastValueFrom(this.onesignal.createOneSignalUser(randomNumber.toString()));

  }

  getStorage(key){
    return Preferences.get{{key: key}};
  }*/

  async ingresar(){

    if(this.form.valid){
      let email: string = this.form.get('email')!.value;
      let password: string = this.form.get('password')!.value;

      await this.authService.login(email, password)
        .then( (resultadoLogin) => {
          //this.pushNotifServ.promptForNotificationPermission();
          this.error = resultadoLogin;
          if(this.error == ''){
            //this.router.navigateByUrl('/home');
          }
          /* subs.subscribe( async (data) => {
            if(data){
              this.authServ.usuario = data;
              // await this.pushNotifServ.registerNotifications();
              this.router.navigateByUrl('/home');

            }
          }) */

            
            //this.createOneSignalUser();
            //this.sendNotificationtoAllUsers();
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }

  cargarUsuario(user:string){
    let email:string = '';
    let contraseña:string = '';

    switch(user){
      case 'dueño':
        email = 'tomasmastrapasqua3@gmail.com';
        contraseña = '123456';
        break;
      case 'metre':
        email = 'metre@gmail.com';
        contraseña = '123456';
        break;
      case 'cocinero':
        email = 'cocinero@gmail.com';
        contraseña = '123456';
        break;
      case 'mozo':
        email = 'mozo@gmail.com';
        contraseña = '123456';
        break;
      case 'bartender':
        email = 'bartender@gmail.com';
        contraseña = '123456';
        break;
      case 'cliente':
          email = 'fulano@gmail.com';
          contraseña = '123456';
          break;
    }

    this.form.patchValue({
      email: email,
      password: contraseña
    });
  }

  altaClientes(){
    this.router.navigateByUrl('/alta-cliente');
  }

  //////////////////

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
      console.log('Datos almacenados: ', data);
      if(!data || !data?.value) {
        this.createUserAndLogin();
        return;
      }
      console.log('ID Externa: ', data.value);
      const response = await lastValueFrom(this.onesignal.checkOneSignalUserIdentity(data.value));
      if(!response) {
        this.createUserAndLogin();
      } else {
        const { identity } = response;
        console.log('Identidad: ', identity);
        if(!identity?.external_id) {
          this.createUserAndLogin();
        } else {
          this.onesignal.login(identity?.external_id);
          //alert('Usuario ya existe en onesignal');
        }
      }
    } catch(e) {
      console.log(e);
    }
  }

  async createUserAndLogin() {
    try {
      const randomNumber = this.generateRandomString(20);
      console.log('número almacenado: ', randomNumber);
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

  async sendNotificationtoSpecificDevice() {
    try {
      const data = await this.getStorage('auth');

      if (data?.value) {
        await lastValueFrom(
          this.onesignal.sendNotification(
            'Este es un mensaje de prueba',
            'Mensaje de prueba',
            { type: 'user1' },
            [data.value]
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
          'Este es un mensaje para todo el mundo',
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
          'Este es un mensaje de prueba',
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
}