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
  selector: 'app-alta-cliente',
  templateUrl: './alta-cliente.page.html',
  styleUrls: ['./alta-cliente.page.scss'],
  standalone: true,
  imports: [ IonSelect, IonImg, IonFabButton, IonFab, IonButton, IonRow, IonItem, IonCol, IonContent, IonHeader, IonTitle, IonToolbar, IonSelectOption, IonInput, CommonModule, FormsModule, CommonModule, ReactiveFormsModule]
})
export class AltaClientePage implements OnInit {

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
  private anonimo: boolean = false;

  constructor() {
    this.form = new FormGroup ({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(6)]),
      confirmPassword: new FormControl('', [Validators.required]),
      nombre: new FormControl('', [Validators.required, Validators.pattern("^(?!\\s*$)[a-zA-ZÀ-ÿ\\s]+$")]),
      apellido: new FormControl('', [Validators.required, Validators.pattern("^(?!\\s*$)[a-zA-ZÀ-ÿ\\s]+$")]),
      dni: new FormControl('', [Validators.required, Validators.minLength(7), Validators.maxLength(8)]),
      rol: new FormControl('cliente', [Validators.required]),
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
    if(this.form.get('dni')?.valid){
      this.error = '';
      const foto = await this.camaraService.tomarFoto();
      this.foto = await this.storageService.subirFotoBase64(this.dni, 'clientes/', foto);
      this.switchFotoSubida();
    }else{
      this.error = 'Primero ingrese un DNI válido';
    }
  }
/*
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
          rol: this.rol,
          enListaDeEspera: null,
          admitido: null,
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
          this.router.navigateByUrl('/login');
        });
      });
    }
  }*/

    async registrar() {
      if (this.realizarComprobaciones()) {
        const resultado = await this.authService.register(this.email, this.password, this.dni);
    
        this.error = resultado.error;
    
        if (this.error !== '') {
          return;
        }
    
        
        const nuevoUsuario = <UsuarioModel>{
          id: '',
          uid: resultado.uid,  
          email: this.email,
          clave: this.password,
          nombre: this.nombre,
          apellido: this.apellido,
          dni: this.dni,
          rol: this.rol,
          enListaDeEspera: null,
          admitido: null,
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
        }).then(() => {
          this.form.reset();
          this.router.navigateByUrl('/login');
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

  entrarAnonimo(){
    this.router.navigateByUrl('/alta-anonimo');
  }

































  /* private camaraService:CamaraService = inject(CamaraService);
  private qrService:QrService = inject(QrService);
  private storageService:StorageService = inject(StorageService);
  private authServ: AuthService = inject(AuthService);
  private usuarioServ: UsuarioService = inject(UsuarioService);
  private toastServ: ToastService = inject(ToastService);
  private router: Router = inject(Router);
  protected fotoSubida: string = 'false';  
  protected foto : any = null;
  
  protected error: string = '';

  protected scannedCode: any | null = null;
  protected qrScanner: boolean = false;
  protected datos: Barcode[] = []

  protected isSupported = false;
  protected barcodes: Barcode[] = [];
  alertController: AlertController = inject(AlertController);

  constructor() {}

  ngOnInit() {

    BarcodeScanner.isSupported().then((result) => {
      this.isSupported = result.supported;
    });
  }

  form: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
    passwordConfirm: new FormControl('', [Validators.required, Validators.minLength(6)]),
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
  
  noCoinciden(){
    return this.password != this.form.get('confirmPassword')?.value && (this.form.get('confirmPassword')?.touched || this.form.get('confirmPassword')?.dirty);
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

  async registrar() {
    if(this.form.valid) {
      const urlFoto = await this.storageService.subirFotoBase64(this.dni, 'clientes/', this.foto);
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
            enListaDeEspera: null,
            admitido: null,
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

  async abrirCamara(){
    const foto = await this.camaraService.tomarFoto();
    this.foto = await this.storageService.subirFotoBase64(this.cuil, 'duenios-supervisores/', foto);
    this.switchFotoSubida();
  }

  async escanear(){
    this.datos = await this.qrService.scan(); 

    this.form.patchValue({
      apellido: this.datos[1],
      nombre: this.datos[2],
      dni: this.datos[4]
    });
  }

  entrarAnonimo(){
    this.router.navigateByUrl('/home-cliente');
  }

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

    goHome(){
      this.router.navigateByUrl('/home');
    }

    switchFotoSubida(){
      if(this.foto!=''){
        this.fotoSubida = 'true';
      }    
    } */
}