import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonContent, IonSelect, IonSelectOption, IonHeader, IonTitle, IonToolbar, IonImg, IonFabButton, IonFab, IonRow, IonItem, IonButton, IonCol, IonInput } from '@ionic/angular/standalone';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { UsuarioService } from 'src/app/services/usuario.service';
import Swal from 'sweetalert2';
import { CamaraService } from 'src/app/services/camara.service';
import { StorageService } from 'src/app/services/storage.service';
import { UsuarioModel } from 'src/app/models/usuario.component';

@Component({
  selector: 'app-alta-empleado',
  templateUrl: './alta-empleado.page.html',
  styleUrls: ['./alta-empleado.page.scss'],
  standalone: true,
  imports: [ IonSelect, IonImg, IonFabButton, IonFab, IonButton, IonRow, IonItem, IonCol, IonContent, IonHeader, IonTitle, IonToolbar, IonSelectOption, IonInput, CommonModule, FormsModule, CommonModule, ReactiveFormsModule ]
})
export class AltaEmpleadoPage implements OnInit {

  private usuarioService:UsuarioService = inject(UsuarioService);
  private authService:AuthService = inject(AuthService);
  private router:Router = inject(Router);
  private storageServ: StorageService = inject(StorageService);
  private camaraServ:CamaraService = inject(CamaraService);
  protected fotoSubida: string = 'false';

  protected error: string = '';

  protected form: FormGroup;

  constructor() {
    this.form = new FormGroup ({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(6)]),
      nombre: new FormControl('', [Validators.required, Validators.pattern("^(?!\\s*$)[a-zA-ZÀ-ÿ\\s]+$")]),
      apellido: new FormControl('', [Validators.required, Validators.pattern("^(?!\\s*$)[a-zA-ZÀ-ÿ\\s]+$")]),
      dni: new FormControl('', [Validators.required, Validators.minLength(7), Validators.maxLength(8), Validators.pattern("^[0-9]+$")]),
      cuil: new FormControl('', [Validators.required, Validators.minLength(11), Validators.maxLength(11), Validators.pattern("^[0-9]+$")]),
      rol: new FormControl('', [Validators.required]),
      confirmPassword: new FormControl('', [Validators.required]),
      foto: new FormControl('', [Validators.required]),
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
      const foto = await this.camaraServ.tomarFoto();
      this.foto = await this.storageServ.subirFotoBase64(this.cuil, 'duenios-supervisores/', foto);
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
          position: 'center',
          confirmButtonText: 'Aceptar',
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
    if(this.password != this.form.get('confirmPassword')?.value){
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

  /*
  async escanear(){
    const result = await this.qrServ.escanearDNI();

    this.form.patchValue({
      nombre: result.nombre,
      apellido: result.apellido,
      dni: result.dni
    });
  }*/

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
