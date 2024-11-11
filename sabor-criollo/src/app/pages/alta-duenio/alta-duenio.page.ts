import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonContent, IonSelect, IonSelectOption, IonHeader, IonTitle, IonToolbar, IonImg, IonFabButton, IonFab, IonRow, IonItem, IonButton, IonCol, IonInput } from '@ionic/angular/standalone';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { UsuarioService } from 'src/app/services/usuario.service';
import Swal from 'sweetalert2';
import { QrService } from 'src/app/services/qr.service';
import { CamaraService } from 'src/app/services/camara.service';
import { StorageService } from 'src/app/services/storage.service';
import { UsuarioModel } from 'src/app/models/usuario.component';
import { Barcode, BarcodeScanner } from '@capacitor-mlkit/barcode-scanning';

@Component({
  selector: 'app-alta-duenio',
  templateUrl: './alta-duenio.page.html',
  styleUrls: ['./alta-duenio.page.scss'],
  standalone: true,
  imports: [ IonSelect, IonImg, IonFabButton, IonFab, IonButton, IonRow, IonItem, IonCol, IonContent, IonHeader, IonTitle, IonToolbar, IonSelectOption, IonInput, CommonModule, FormsModule, CommonModule, ReactiveFormsModule]
})
export class AltaDuenioPage implements OnInit {

  private usuarioService:UsuarioService = inject(UsuarioService);
  private authService:AuthService = inject(AuthService);
  private router:Router = inject(Router);
  private storageService: StorageService = inject(StorageService);
  private qrService:QrService = inject(QrService);
  private camaraService:CamaraService = inject(CamaraService);
  protected fotoSubida: string = 'false';  
  
  protected error: string = '';

  protected form: FormGroup;

  protected scannedCode: any | null = null;
  protected qrScanner: boolean = false;
  protected datos: Barcode[] = []

  protected isSupported = false;
  protected barcodes: Barcode[] = [];

  constructor() {
    this.form = new FormGroup ({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(6)]),
      confirmPassword: new FormControl('', [Validators.required]),
      nombre: new FormControl('', [Validators.required, Validators.pattern("^(?!\\s*$)[a-zA-ZÀ-ÿ\\s]+$")]),
      apellido: new FormControl('', [Validators.required, Validators.pattern("^(?!\\s*$)[a-zA-ZÀ-ÿ\\s]+$")]),
      dni: new FormControl('', [Validators.required, Validators.minLength(7), Validators.maxLength(8)]),
      cuil: new FormControl('', [Validators.required, Validators.minLength(11), Validators.maxLength(11)]),
      rol: new FormControl('', [Validators.required]),
      foto: new FormControl('', [Validators.required]),
    });
  }

  ngOnInit() {

    BarcodeScanner.isSupported().then((result) => {
      this.isSupported = result.supported;
    });
  }

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
  get foto(){
    return this.form.get('foto')?.value;
  }
  set foto(value: string){
    this.form.get('foto')?.setValue(value);
  }

  async abrirCamara(){
    if(this.form.get('cuil')?.valid){
      this.error = '';
      const foto = await this.camaraService.tomarFoto();
      this.foto = await this.storageService.subirFotoBase64(this.cuil, 'duenios-supervisores/', foto);
      this.switchFotoSubida();
    }else{
      this.error = 'Primero ingrese un CUIL válido';
    }
  }

  async registrar(){
    if(this.realizarComprobaciones()){

      await this.authService.register(this.email, this.password, this.dni).then((data:any) => {

        this.error = data;

        if(this.error != ''){
          return;
        }  

        const nuevoUsuario = <UsuarioModel>{
          id: '',
          uid: '',
          email: this.email,
          clave: this.password,
          nombre: this.nombre,
          apellido: this.apellido,
          dni: this.dni,
          cuil: this.cuil,
          rol: this.rol,
          enListaDeEspera: null,
          admitido: true,
          foto: this.foto,
          mesa: null,
          tokenNotification: null,
        }
        
        this.usuarioService.setUsuario(nuevoUsuario);
        Swal.fire({
          icon: 'success',
          title: "Alta generada con éxito",
          toast: true,
          position: 'center'
        }).then( () => {
          this.form.reset();
          this.router.navigateByUrl('/home');
        });
      });
    }
  }

  realizarComprobaciones(){
    let ret = false
    this.error = '';
    this.form.markAllAsTouched();
    if(this.noCoinciden()){
      this.error = 'Las contraseñas no coinciden';
      return ret;
    }
    if(this.foto == ''){
      this.error = 'La foto es requerida';
      return ret;
    }
    if(!this.form.valid){
      this.error = 'Verifique los datos ingresados';
      return ret;
    }
    return true;
  }

  noCoinciden(){
    return this.password != this.form.get('confirmPassword')?.value && (this.form.get('confirmPassword')?.touched || this.form.get('confirmPassword')?.dirty);
  }
  
  async escanear(){
    const result = await this.qrService.scan();

    this.form.patchValue({
      apellido: this.datos[1],
      nombre: this.datos[2],
      dni: this.datos[4]
    });
  }

  validateNumber(event: KeyboardEvent) {
    const char = event.key;
    if (!/[0-9]/.test(char) && char !== 'Backspace' && char !== 'Delete' && char !== 'ArrowLeft' && char !== 'ArrowRight') {
      event.preventDefault();
    }
  }

  validatePaste(event: ClipboardEvent) {
    const clipboardData = event.clipboardData || (window as any).clipboardData;
    const pastedData = clipboardData.getData('Text');
    if (!/^\d+$/.test(pastedData)) {
      event.preventDefault();
    }
  }

  goHome(){
    this.router.navigateByUrl('/home');
  }

  switchFotoSubida(){
    if(this.foto!=''){
      this.fotoSubida = 'true';
    }    
  }
}
