import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonImg, IonIcon, IonFabButton, IonFabList, IonFab, IonRow, IonItem, IonButton, IonCol, IonInput } from '@ionic/angular/standalone';
//import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
//import Swal from 'sweetalert2';
//import { ToastService } from 'src/app/services/toast.service';
//import { NotificationPushService } from 'src/app/services/notification-push.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: true,
  imports: [IonInput, IonCol, IonButton, IonItem, IonRow, IonFab, IonFabList, IonFabButton, IonIcon, IonImg, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, CommonModule, ReactiveFormsModule]
})
export class LoginComponent  implements OnInit {/*
  private authServ:AuthService = inject(AuthService);
  private router:Router = inject(Router);
  private pushNotifServ:NotificationPushService = inject(NotificationPushService);*/

  error: string = '';

  form: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)/*Validators.pattern()*/]),
  });

  constructor(/*private toastService: ToastService*/) { }

  ngOnInit() {
    //this.toastService.presentToast('middle','Login','success',4000)
  }
/*
  async ingresar(){
    if(this.form.valid){
      let email: string = this.form.get('email')!.value;
      let password: string = this.form.get('password')!.value;

      await this.authServ.loguearUsuario(email, password)
        .then( (subs) => {
          subs.subscribe( async (data) => {
            if(data){
              this.authServ.usuario = data;
              // await this.pushNotifServ.registerNotifications();
              this.router.navigateByUrl('/home');
            }
          })
        })
        .catch((error) => {
          // this.error = '';
          // this.error = error;
          console.log(error)
          Swal.fire({
            title: "Usuario inexistente",
            text: "Intentelo nuevamente",
            background: '#4b4b4b',
            color: '#ffffff',
            showConfirmButton: true,
            confirmButtonText: ' OK',
            confirmButtonColor: '#ff2a96',
            icon: 'error',
            toast: true,
            position: 'center'
          });
        });
    }
  }*/

  cargarUsuario(user:string){
    let email:string = '';
    let contraseña:string = '';

    switch(user){
      case 'dueño':
        email = 'knights-code-lks@hotmail.com';
        contraseña = '123123';
        break;
      case 'metre':
        email = 'metre@gmail.com';
        contraseña = '123456';
        break;
      case 'cocinera':
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
          email = 'nina@gmail.com';
          contraseña = '123456';
          break;
    }

    this.form.patchValue({
      email: email,
      password: contraseña
    });
  }

  altaClientes(){
    //this.router.navigateByUrl('/alta-cliente');
  }

}