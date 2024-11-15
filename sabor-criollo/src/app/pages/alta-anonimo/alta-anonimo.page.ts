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
  selector: 'app-alta-anonimo',
  templateUrl: './alta-anonimo.page.html',
  styleUrls: ['./alta-anonimo.page.scss'],
  standalone: true,
  imports: [ IonSelect, IonImg, IonFabButton, IonFab, IonButton, IonRow, IonItem, IonCol, IonContent, IonHeader, IonTitle, IonToolbar, IonSelectOption, IonInput, CommonModule, FormsModule, CommonModule, ReactiveFormsModule]
})
export class AltaAnonimoPage implements OnInit {

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

 
  get nombre(){
    return this.form.get('nombre')?.value;
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
      this.error = '';
      const foto = await this.camaraService.tomarFoto();
      this.foto = await this.storageService.subirFotoBase64(this.nombre, 'anonimos/', foto);
      this.switchFotoSubida();

  }
/*
  async registrar(){
    if(this.realizarComprobaciones()){

      await this.authService.loginAnonymously().then((data:any) => {



        const nuevoUsuario = <UsuarioModel>{
          id: '',
          uid: 'AaJPlmyQ8naWuyogw68xoPQYY9s1',
          email: 'anonimo@sabor-criollo.com',
          //clave: this.password,
          nombre: this.nombre,
          //apellido: this.apellido,
          //dni: this.dni,
          rol: this.rol,
          enListaDeEspera: null,
          admitido: true,
          foto: this.foto,
          mesa: null,
          tokenNotification: null,
        }
        
        //this.usuarioService.setUsuario(nuevoUsuario);
        this.usuarioService.personaLogeada = nuevoUsuario;


        
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
  }*/
/*
    async registrar() {
      if (this.realizarComprobaciones()) {
        const uid = await this.authService.loginAnonymously().then((data:any) => {



        }
    
          
        const nuevoUsuario = <UsuarioModel>{
          id: '',
          uid: uid,  
          //email: this.email,
          //clave: this.password,
          nombre: this.nombre,
          //apellido: this.apellido,
          //dni: this.dni,
          rol: this.rol,
          enListaDeEspera: null,
          admitido: true,
          foto: this.foto,
          mesa: null,
          tokenNotification: null,
        }
    //alert(uid);
        this.usuarioService.setUsuario(nuevoUsuario);
        Swal.fire({
          icon: 'success',
          title: "Alta generada con éxito",
          toast: true,
          position: 'center'
        }).then(() => {
          this.form.reset();
          this.router.navigateByUrl('/home');
        });
      }
    }*/
    
      async ingresar(){
          await this.authService.login('anonimo@sabor-criollo.com', '123456')
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
    this.router.navigateByUrl('/home-cliente');
  }






}