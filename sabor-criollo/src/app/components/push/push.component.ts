import { Component, OnInit, inject } from '@angular/core';
import { Capacitor } from '@capacitor/core';
import { Platform } from '@ionic/angular/standalone';
import { lastValueFrom } from 'rxjs';
import { Preferences } from '@capacitor/preferences';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { OnesignalService } from 'src/app/services/onesignal.service';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonCol, IonRow, IonImg } from '@ionic/angular/standalone';

@Component({
  selector: 'app-push',
  templateUrl: './push.component.html',
  styleUrls: ['./push.component.scss'],
  standalone: true,
  imports: [IonImg, IonRow, IonCol, IonButton, IonHeader, IonToolbar, IonTitle, IonContent],

})
export class PushComponent  implements OnInit {

  
  protected error: string = '';
  private authService: AuthService = inject(AuthService);
  private router: Router = inject(Router);
  private onesignal = inject(OnesignalService);
  private platform = inject(Platform);


  constructor() {

    this.platform.ready().then(() => {
      if(Capacitor.getPlatform() != 'web') this.onesignal.OneSignalInit();
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
      if(!data || !data?.value) {
        this.createUserAndLogin();
        return;
      }
      console.log('external id: ', data.value);
      const response = await lastValueFrom(this.onesignal.checkOneSignalUserIdentity(data.value));
      if(!response) {
        this.createUserAndLogin();
      } else {
        const { identity } = response;
        console.log('identity: ', identity);
        if(!identity?.external_id) {
          this.createUserAndLogin();
        } else {
          this.onesignal.login(identity?.external_id);
          alert('User already registered in onesignal');
        }
      }
    } catch(e) {
      console.log(e);
    }
  }

  async createUserAndLogin() {
    try {
      const randomNumber = this.generateRandomString(20);
      console.log('stored number: ', randomNumber);
      await lastValueFrom(this.onesignal.createOneSignalUser(randomNumber));
      await Preferences.set({ key: 'auth', value: randomNumber });
      this.onesignal.login(randomNumber);
      alert('User created in onesignal');
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
      console.log('external id: ', data.value);
      const response = await lastValueFrom(this.onesignal.checkOneSignalUserIdentity(data.value));
      const { identity } = response;
      console.log('identity: ', identity);
      await lastValueFrom(this.onesignal.deleteOneSignalUser(identity?.external_id));
      alert('User deleted from onesignal');
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
            'This is a test message',
            'Test message',
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
          'This is a test message to all users',
          'Test message for users',
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
          'This is a test message',
          'Test message',
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
