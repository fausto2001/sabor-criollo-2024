import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonContent, IonSelectOption, IonHeader, IonTitle, IonToolbar, IonImg, IonFabButton, IonFab, IonRow, IonItem, IonButton, IonCol, IonInput } from '@ionic/angular/standalone';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { UsuarioService } from 'src/app/services/usuario.service';
import Swal from 'sweetalert2';
import { QrService } from 'src/app/services/qr.service';
import { CamaraService } from 'src/app/services/camara.service';
import { StorageService } from 'src/app/services/storage.service';
import { UsuarioModel } from 'src/app/models/usuario.component';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'app-alta-duenio',
  templateUrl: './alta-duenio.page.html',
  styleUrls: ['./alta-duenio.page.scss'],
  standalone: true,
  imports: [IonImg, IonFabButton, IonFab, IonButton, IonRow, IonItem, IonCol, IonContent, IonHeader, IonTitle, IonToolbar, IonSelectOption, IonInput, CommonModule, FormsModule, CommonModule, ReactiveFormsModule]
})
export class AltaDuenioPage implements OnInit {

  private usuarioService:UsuarioService = inject(UsuarioService);
  private authServ:AuthService = inject(AuthService);
  private router:Router = inject(Router);
  private storageServ: StorageService = inject(StorageService);
  private qrServ:QrService = inject(QrService);
  private camaraServ:CamaraService = inject(CamaraService);
  private toastServ:ToastService = inject(ToastService);
  //private toast2Serv:ToastService = inject(ToastService);
  protected fotoSubida: string = 'false';

  protected error: string = '';

  protected form: FormGroup;

  constructor() {

    this.form = new FormGroup ({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(6)]),
      nombre: new FormControl('', [Validators.required, Validators.pattern("^(?!\\s*$)[a-zA-ZÀ-ÿ\\s]+$")]),
      apellido: new FormControl('', [Validators.required, Validators.pattern("^(?!\\s*$)[a-zA-ZÀ-ÿ\\s]+$")]),
      dni: new FormControl('', [Validators.required, Validators.minLength(7), Validators.maxLength(8)]),
      cuil: new FormControl('', [Validators.required, Validators.minLength(11), Validators.maxLength(11)]),
      rol: new FormControl('Supervisor', [Validators.required]),
      confirmPassword: new FormControl('', [Validators.required]),
      foto: new FormControl('', [Validators.required]),
      }, {
        validators: [
          //confirmarClaveValidator(),
        ]
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
    this.router.navigateByUrl('/home');
    const foto = await this.camaraServ.tomarFoto();
    this.foto = await this.storageServ.subirFotoBase64(this.cuil, 'duenios-supervisores/', foto);
    this.switchFotoSubida();
  }

  async registrar(){
    if(this.password != this.form.get('confirmPassword')?.value){
      this.error = 'Las contraseñas no coinciden';
      this.form.markAllAsTouched();
      return;
    }
    if(this.foto == ''){
      this.error = 'La foto es requerida';
      this.form.markAllAsTouched();
      return;
    }
    if(this.form.valid){
      await this.authServ.register(this.email, this.password, this.dni)
        .then((data:any) => {

          if(data == typeof(String)){
            this.error = data;
            return;
          }


          const nuevoUsuario = <UsuarioModel>{
            id: '',
            uid: data!.uid,
            email: this.email,
            //clave: this.password,
            nombre: this.nombre,
            apellido: this.apellido,
            dni: this.dni,
            cuil: this.cuil,
            rol: this.rol,
            enListaDeEspera: null,
            admitido: false,
            foto: this.foto,
            mesa: null,
            //tokenNotification: null,
          };
          this.usuarioService.setUsuario(nuevoUsuario).then((ret) => {
            if(ret instanceof Error){
              this.error = ret.message;
              return;
            }
            else{
              Swal.fire({
                icon: 'success',
                title: "Alta generada con éxito",
                //timer: 2000,
                toast: true,
                position: 'center'
              }).then( () => {
                this.form.reset();
                this.router.navigateByUrl('/home');
              });
            }
          });
        })
        .catch( (error) => {
          this.error = error.message;
        });
    }
    else{
      this.form.markAllAsTouched();
      this.error = 'Verifique los datos ingresados';
    }
  }

  noCoinciden(){
    return this.password != this.form.get('confirmPassword')?.value && (this.form.get('confirmPassword')?.touched || this.form.get('confirmPassword')?.dirty);
  }

  async escanear(){
    const result = await this.qrServ.escanearDNI();

    this.form.patchValue({
      nombre: result.nombre,
      apellido: result.apellido,
      dni: result.dni
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

  ngOnInit() {
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
