import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators, ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonList, IonToolbar, IonImg, IonIcon, IonFabButton, IonFabList, IonFab, IonRow, IonItem, IonButton, IonCol, IonInput, IonLabel, IonText } from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { UsuarioModel } from 'src/app/models/usuario.component';
import { CamaraService } from 'src/app/services/camara.service';
import { Barcode, BarcodeScanner } from '@capacitor-mlkit/barcode-scanning';
import { AlertController } from '@ionic/angular';
import { QrService } from 'src/app/services/qr.service';

@Component({
  selector: 'app-alta-cliente',
  templateUrl: './alta-cliente.page.html',
  styleUrls: ['./alta-cliente.page.scss'],
  standalone: true,
  imports: [IonText, IonLabel, IonInput, IonCol, IonList, IonButton, IonItem, IonRow, IonFab, IonFabList, IonFabButton, IonIcon, IonImg, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, CommonModule, ReactiveFormsModule]
})
export class AltaClientePage implements OnInit {

  private camaraService:CamaraService = inject(CamaraService);
  private qrService:QrService = inject(QrService);

  scannedCode: any | null = null;
  qrScanner: boolean = false;
  datos: Barcode[] = []

  isSupported = false;
  barcodes: Barcode[] = [];

  constructor(private alertController: AlertController) {}

  ngOnInit() {

    BarcodeScanner.isSupported().then((result) => {
      this.isSupported = result.supported;
    });
  }

  form: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)/*Validators.pattern()*/]),
    passwordConfirm: new FormControl('', [Validators.required, Validators.minLength(6)/*Validators.pattern()*/]),
    nombre: new FormControl('', [Validators.required, Validators.minLength(2), Validators.pattern('^[a-zA-ZáéíóúÁÉÍÓÚñÑ ]+$')]),
    apellido: new FormControl('', [Validators.required, Validators.minLength(2), Validators.pattern('^[a-zA-ZáéíóúÁÉÍÓÚñÑ ]+$')]),
    dni: new FormControl('', [Validators.required, Validators.minLength(7), Validators.maxLength(9), Validators.pattern(/^[0-9]+$/)]),
    photo: new FormControl('', [Validators.required])
  }, { validators: this.PasswordsMatchValidator() });

  async sacarFoto() {
    try {
      const foto = await this.camaraService.tomarFoto(); 
      if (foto) {
        this.form.controls['photo'].setValue(foto);
      }
    } catch (error) {
      alert('Error al sacar foto.');
    }
  }

  PasswordsMatchValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const password = control.get('password')?.value;
      const passwordConfirm = control.get('passwordConfirm')?.value;
  
      if (password && passwordConfirm && password !== passwordConfirm) {
        return { mismatch: true };
      }
      return null;
    };
  }

  ///////////////* SCANER *///////////////

  async escanear(){
    this.datos = await this.qrService.scan(); 
    //const informacion = result.ScanResult.split('@');

    this.form.patchValue({
      apellido: this.datos[1],
      nombre: this.datos[2],
      dni: this.datos[4]
    });
  }
/*
  async scan(): Promise<void> {
    const granted = await this.requestPermissions();
    if (!granted) {
      this.presentAlert();
      return;
    }
    const { barcodes } = await BarcodeScanner.scan();
    
    this.barcodes.push(...barcodes);
    const informacion = this.barcodes[0].split('@'); // Extrae y divide el primer código

    

  }*/

    async scan(): Promise<void> {
      const granted = await this.requestPermissions();
      if (!granted) {
        this.presentAlert();
        return;
      }
      this.barcodes = []; 
      const { barcodes } = await BarcodeScanner.scan();
      this.barcodes.push(...barcodes);
  
      if (this.barcodes.length > 0) {
          const informacion = JSON.stringify(this.barcodes[0]).split('@');
          this.form.patchValue({
              apellido: informacion[1],
              nombre: informacion[2],
              dni: informacion[4]
          });
      } else {
          console.warn('No se encontró ningún código en el escaneo.');
      }
  }
  
  

  async requestPermissions(): Promise<boolean> {
    const { camera } = await BarcodeScanner.requestPermissions();
    return camera === 'granted' || camera === 'limited';
  }

  async presentAlert(): Promise<void> {
    const alert = await this.alertController.create({
      header: 'Permission denied',
      message: 'Please grant camera permission to use the barcode scanner.',
      buttons: ['OK'],
    });
    await alert.present();
  }

  /*
      <ion-list>
        <ion-item *ngFor="let barcode of barcodes">
          <ion-label position="stacked">{{ barcode.format }}</ion-label>
          <ion-input type="text" [value]="barcode.rawValue"></ion-input>
        </ion-item>
      </ion-list>

  */




}
