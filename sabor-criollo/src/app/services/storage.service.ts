import { Injectable, inject } from '@angular/core';
import { Storage, getDownloadURL, ref, uploadBytesResumable, uploadString } from '@angular/fire/storage';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private storage:Storage = inject(Storage)
  // private dirUsers:string = 'users/'

  constructor() { }

  getFormattedDate(): string {
    const date = new Date();
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Los meses en JavaScript son de 0 a 11
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    
    return `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;
  }

  async subirFotoAdjuntada(name:string, directorio:string, foto:any){
    const filepath = directorio + name + '_' + this.getFormattedDate();
    const fileref = ref(this.storage, filepath);

    let url:string = '';

    await uploadBytesResumable(fileref, foto).then(async () => {
      url = await getDownloadURL(fileref);
    });

    return url
  }

  async subirFotoBase64(name:string, directorio:string, foto:any){
    const filepath = directorio + name + '_' + this.getFormattedDate() + '.png';
    const fileref = ref(this.storage, filepath);
    const uploadFile = uploadString(fileref, foto.base64String!, 'base64', {
      contentType: 'image/png',
    });
    
    const url:string = await uploadFile.then( async (data) => {
      return await getDownloadURL(fileref);
    });

    return url;
  }


}