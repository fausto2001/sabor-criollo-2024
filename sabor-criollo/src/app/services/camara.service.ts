import { Injectable } from '@angular/core';
import { Camera, CameraResultType, CameraSource, Photo, } from '@capacitor/camera';

@Injectable({
  providedIn: 'root'
})
export class CamaraService {

  async tomarFoto(){
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.Base64,
      source: CameraSource.Camera,
    });
    return image;
  }

}