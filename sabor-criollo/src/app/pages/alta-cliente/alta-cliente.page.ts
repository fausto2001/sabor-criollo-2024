import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators, ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonImg, IonIcon, IonFabButton, IonFabList, IonFab, IonRow, IonItem, IonButton, IonCol, IonInput, IonLabel } from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { BarcodeScanningService } from 'src/app/services/barcode.service';
import { UsuarioModel } from 'src/app/models/usuario.component';
import { CamaraService } from 'src/app/services/camara.service';

@Component({
  selector: 'app-alta-cliente',
  templateUrl: './alta-cliente.page.html',
  styleUrls: ['./alta-cliente.page.scss'],
  standalone: true,
  imports: [IonLabel, IonInput, IonCol, IonButton, IonItem, IonRow, IonFab, IonFabList, IonFabButton, IonIcon, IonImg, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, CommonModule, ReactiveFormsModule]
})
export class AltaClientePage implements OnInit {

  private barcodeService:BarcodeScanningService = inject(BarcodeScanningService);
  private camaraService:CamaraService = inject(CamaraService);
  scannedCode: any | null = null;

  constructor() { }

  ngOnInit() {
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

  async startScan() {
    try {
      const cameraPermission = await this.barcodeService.requestPermissions();
      if (cameraPermission !== 'granted') {
        alert('Se requiere acceso a la cámara para escanear QR. Por favor, permití su acceso en la configuración de tu dispositivo.');
        return;
      }

      alert("Starting scan...");
      const scannedCode:any = await this.barcodeService.scanSingleBarcode();

      if (scannedCode && scannedCode.displayValue) {
        const dniData = await this.barcodeService.obtenerDatosDNI(scannedCode.displayValue);
        this.form.patchValue({
          dni: dniData.dni,
          apellido: dniData.apellido,
          nombre: dniData.nombre
        });
      } else {
        alert('No valid scanned code found.');
      }
      
      } catch (error) {
        console.error('Scan failed:', error); 
        alert('Scan failed: ' + error);
    }
  }
}
