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
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { StorageService } from 'src/app/services/storage.service';
import { AuthService } from 'src/app/services/auth.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { ToastService } from 'src/app/services/toast.service';
import Swal from 'sweetalert2';

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
  private storageServ:StorageService = inject(StorageService);
  private authServ: AuthService = inject(AuthService);
  private usuarioServ: UsuarioService = inject(UsuarioService);
  private toastServ: ToastService = inject(ToastService);
  private router: Router = inject(Router);
  foto : any = null;

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

  get email(){
    return this.form.get('email')?.value;
  }
  get password(){
    return this.form.get('password')?.value;
  }
  get nombre(){
    return this.form.get('nombre')?.value;
  }
  get apellido(){
    return this.form.get('apellido')?.value;
  }
  get dni(){
    return this.form.get('dni')?.value;
  }
  get cuil(){
    return this.form.get('cuil')?.value;
  }
  get rol(){
    return this.form.get('rol')?.value;
  }

  async sacarFoto() {
    try {
      const foto = await this.camaraService.tomarFoto(); 
      if (foto) {
        this.form.controls['photo'].setValue(foto);
        this.foto = foto;
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

  async registrar() {
    if(this.form.valid) {
      const urlFoto = await this.storageServ.subirFotoBase64(this.dni, 'clientes/', this.foto);
      await this.authServ.register(this.email, this.password, this.dni)
        .then( (data:any) => {
          const nuevoUsuario = <UsuarioModel> {
            id: '',
            uid: '',
            email: this.email,
            clave: this.password,
            nombre: this.nombre,
            apellido: this.apellido,
            dni: this.dni,
            rol: 'cliente',
            enListaDeEspera: false,
            admitido: false,
            foto: urlFoto!,
            mesa: null,
            tokenNotification: null
          }
          this.usuarioServ.setUsuario(nuevoUsuario);
        })
        .catch((error) =>{
          this.toastServ.presentToast('bottom', error.message, 'red', 3000);
          console.error(error);
        })

        await Swal.fire({
          title: "Te registraste correctamente! Debes esperar confirmación. La misma llegará a tu casilla de correo electrónico.",
          timer: 4000,
          toast: true,
          position: 'center'
        })
        .then( () => {
          this.router.navigateByUrl('/login');
        })
    }
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