import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonContent, IonSelect, IonSelectOption, IonInputPasswordToggle, IonHeader, IonTitle, IonToolbar, IonImg, IonIcon, IonFabButton, IonFabList, IonFab, IonRow, IonItem, IonButton, IonCol, IonInput, IonLabel, IonList } from '@ionic/angular/standalone';
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
  selector: 'app-alta-empleado',
  templateUrl: './alta-empleado.page.html',
  styleUrls: ['./alta-empleado.page.scss'],
  standalone: true,
  imports: [IonList, IonLabel,
    IonInput, IonSelect, IonSelectOption, IonInputPasswordToggle, IonCol, IonButton, IonItem, IonRow, IonFab, IonFabList, IonFabButton, IonIcon, IonImg, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, CommonModule, ReactiveFormsModule
  ]
})
export class AltaEmpleadoPage implements OnInit {

  private usuarioServ:UsuarioService = inject(UsuarioService);
  private authServ:AuthService = inject(AuthService);
  private router:Router = inject(Router);
  private storageServ: StorageService = inject(StorageService);
  private qrServ:QrService = inject(QrService);
  private camaraServ:CamaraService = inject(CamaraService);
  private toastServ:ToastService = inject(ToastService);
  //private toast2Serv:ToastService = inject(ToastService);

  protected error: string = '';

  protected form: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
    nombre: new FormControl('', [Validators.required, Validators.pattern("^(?!\\s*$)[a-zA-ZÀ-ÿ\\s]+$")]),
    apellido: new FormControl('', [Validators.required, Validators.pattern("^(?!\\s*$)[a-zA-ZÀ-ÿ\\s]+$")]),
    dni: new FormControl('', [Validators.required, Validators.minLength(7), Validators.maxLength(8)]),
    cuil: new FormControl('', [Validators.required, Validators.minLength(11), Validators.maxLength(11)]),
    rol: new FormControl('', [Validators.required]),
    confirmPassword: new FormControl('', [Validators.required]),
    }, {
      validators: [
        //confirmarClaveValidator(),
      ]
  });

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

  async registrar(){
    if(this.form.valid){
      const foto = await this.camaraServ.tomarFoto();
      const urlFoto = await this.storageServ.subirFotoBase64(this.cuil, 'empleados/', foto);
      await this.authServ.register(this.email, this.password, this.dni)
        .then( (data:any) => {
          const nuevoUsuario = <UsuarioModel>{
            id: '',
            uid: '',//data!.uid,
            email: this.email,
            clave: this.password,
            nombre: this.nombre,
            apellido: this.apellido,
            dni: this.dni,
            cuil: this.cuil,
            rol: this.rol,
            enListaDeEspera: null,
            admitido: true,
            foto: urlFoto!,
            mesa: null,
            tokenNotification: null,
          }
          //console.log(nuevoUsuario);
          this.usuarioServ.setUsuario(nuevoUsuario);
        })
        .catch( (error) => {
          // this.toastServ.presentToast('bottom', error.message, 'danger', 3000);
          this.toastServ.presentToast('bottom', error.message, 'red', 3000);
          console.error(error);
        });

        await Swal.fire({
          title: "Redireccionando al menú principal",
          timer: 2000,
          toast: true,
          position: 'center'
        })
        .then( () => {
          this.router.navigateByUrl('/home');
        });
      }
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
}