import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonImg, IonIcon, IonFabButton, IonFabList, IonFab, IonRow, IonItem, IonButton, IonCol, IonInput } from '@ionic/angular/standalone';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
//import Swal from 'sweetalert2';
//import { ToastService } from 'src/app/services/toast.service';
//import { NotificationPushService } from 'src/app/services/notification-push.service';

//import { UsuarioService } from '../../services//usuario.service';
//import { UsuarioModel } from '../../models/usuario.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: true,
  imports: [IonInput, IonCol, IonButton, IonItem, IonRow, IonFab, IonFabList, IonFabButton, IonIcon, IonImg, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, CommonModule, ReactiveFormsModule]
})
export class LoginComponent  implements OnInit {

  //private usuarioServ:UsuarioService = inject(UsuarioService);

  protected error: string = '';
  //private toastService: ToastService = inject(ToastService);
  private authService: AuthService = inject(AuthService);
  private router: Router = inject(Router);

  protected form: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)/*Validators.pattern()*/]),
  });

  constructor() {}

  ngOnInit() {
    //this.toastService.presentToast('middle','Login','success',4000)
  }

  async ingresar(){
    if(this.form.valid){
      let email: string = this.form.get('email')!.value;
      let password: string = this.form.get('password')!.value;

      await this.authService.login(email, password)
        .then( (resultadoLogin) => {
          this.error = resultadoLogin;
          if(this.error == ''){
            this.router.navigateByUrl('/home');
          }
          /* subs.subscribe( async (data) => {
            if(data){
              this.authServ.usuario = data;
              // await this.pushNotifServ.registerNotifications();
              this.router.navigateByUrl('/home');

            }
          }) */
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }

  cargarUsuario(user:string){
    let email:string = '';
    let contraseña:string = '';

    switch(user){
      case 'dueño':
        email = 'tomasmastrapasqua3@gmail.com';
        contraseña = '123456';
        break;
      case 'metre':
        email = 'metre@gmail.com';
        contraseña = '123456';
        break;
      case 'cocinero':
        email = 'cocinero@gmail.com';
        contraseña = '123456';
        break;
      case 'mozo':
        email = 'mozo@gmail.com';
        contraseña = '123456';
        break;
      case 'bartender':
        email = 'bartender@gmail.com';
        contraseña = '123456';
        break;
      case 'cliente':
          email = 'fulano@gmail.com';
          contraseña = '123456';
          break;
    }

    this.form.patchValue({
      email: email,
      password: contraseña
    });
  }

  altaClientes(){
    this.router.navigateByUrl('/alta-cliente');
  }
}