import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  constructor(private toastController: ToastController) { }

  async showToast(message: string, duration = 5000) {
    const toast = await this.toastController.create({
      message,
      duration,
      position: 'top',
    });

    await toast.present();
  }

  //Colores referencia: "primary" , "secondary" , "tertiary" , "success" , "warning" , "danger" , "light"
  async presentToast(position: 'top' | 'middle' | 'bottom', mensaje:string, color: string,tiempo:number) {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: tiempo,
      position: position,
      color: color
    });
    await toast.present();
  }
}