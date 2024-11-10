import { Injectable, inject, signal } from '@angular/core';
import { Auth, authState, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, user } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { UsuarioService } from './usuario.service';
import { UsuarioModel } from '../models/usuario.component';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private firebaseAuth: Auth = inject(Auth);
  private router: Router = inject(Router);
  public user$ = user(this.firebaseAuth);
  public currentUserSig = signal<UsuarioModel | null | undefined>(undefined);
  public userService: UsuarioService = inject(UsuarioService);
  state$ = authState(this.firebaseAuth);
  usuario:UsuarioModel | null = null;

  constructor() {
    authState(this.firebaseAuth).subscribe(async (userState) => {
      if (userState) {
        const usuario = await firstValueFrom(this.userService.getUsuarioPorUid(userState.uid));
        this.currentUserSig.set(usuario || null);
      } else {
        this.currentUserSig.set(null);
      }
    });
  }


  async register(mail: string, password: string, nroDocumento: string): Promise<string> {

    if(await this.userService.documentoYaRegistrado(nroDocumento))
    {
      return Promise.resolve('El número de documento ya se encuentra registrado.');
    }

    return new Promise<string>((resolve) => {
      createUserWithEmailAndPassword(this.firebaseAuth, mail, password)
      .then(() => {
        resolve('');
        })
        .catch(err => {
          let mensajeError = '';
          switch (err.message) {
            case 'Firebase: Password should be at least 6 characters (auth/weak-password).':
              mensajeError = 'La contraseña debe tener al menos 6 caracteres';
              break;
            case 'Firebase: Error (auth/invalid-email).':
              mensajeError = 'Ingrese un correo válido.';
              break;
            case 'Firebase: Error (auth/email-already-in-use).':
              mensajeError = 'El correo indicado ya se encuentra registrado.';
              break;
            case 'Firebase: Error (auth/missing-password).':
              mensajeError = 'Ingrese una contraseña.';
              break;
            default:
              mensajeError = 'Error al registrar usuario: ' + err.message;
              break;
          }
          resolve(mensajeError);
        });
    });
  }

  // Login robusto, corrobora que el usuario esté habilitado, 
  // maneja errores y traduce al usuario el motivo del error
  async login(mail: string, password: string): Promise<string> {
    return new Promise<string>((resolve) => {
      signInWithEmailAndPassword(this.firebaseAuth, mail, password)
        .then(async (userCredential) => {
          if (userCredential.user) {
            const user = userCredential.user;

            await this.userService.getUsuarioPorCorreo(user.email!).then((usuario) => {
              if(usuario!= null)
              {
                this.usuario = usuario;
              }
              else
              {
                resolve('El correo no se encuentra registrado.');
              }
            });

            if(this.usuario?.admitido)
            {
              this.currentUserSig.set(this.userService.personaLogeada);
              this.router.navigate(['/home']);
              resolve('');
            } else {
              resolve('Su cuenta no se encuentra habilitada, póngase en contacto con un administrador.');
              this.logout();
            }
          }
        })
        .catch(err => {
          let mensajeError = '';
          switch (err.message) {
            case 'Firebase: Error (auth/invalid-credential).':
              mensajeError = 'Credenciales inválidas.';
              break;
            case 'Firebase: Error (auth/invalid-email).':
              mensajeError = 'Ingrese un correo válido.';
              break;
            case 'Firebase: Error (auth/missing-password).':
              mensajeError = 'Ingrese una contraseña.';
              break;
            default:
              mensajeError = 'Error al iniciar sesión.'+ err.message;
              break;
          }
          resolve(mensajeError);
        });
    });
  }

  async logout() {
    signOut(this.firebaseAuth).then(() => {
      this.usuario = null;
      this.currentUserSig.set(null);
      this.router.navigate(['/login']);
      this.userService.borrarPersonaLogeada();
    });
  }

  /* async loguearUsuario(email: string, password: string){

    try {
      const data = await signInWithEmailAndPassword(this.auth, email, password);

      this.currentUser = data.user;
      //return this.usuarioServ.getUsuarioPorUid(data.user.uid!);
      return this.currentUser;

    }
    catch (error) {
      console.error("Error during login", error);
      throw error;
    }
  } */

  // Esta función quedó del servicio anterior, ver con Tomás si se va a usar  
  /* private async reloguearUsuario(usuario:UsuarioModel){
    return await signInWithEmailAndPassword(this.auth, usuario.email, usuario.clave);
  } */


/*   async registrarUsuario(email:string, password:string){
    return createUserWithEmailAndPassword(this.auth, email, password).then( (ret) => {
      return ret
    });
  } */

// Esta función quedó del servicio anterior, ver con Tomás si se va a usar  
/*   async crearCuentaUsuarioATerceros(email:string, password:string){
    const usuarioLogueado = this.usuario;
    const res = await createUserWithEmailAndPassword(this.auth, email, password);
    await this.cerrarSesionUsuario();

    this.usuario = usuarioLogueado;
    this.currentUser = await this.reloguearUsuario(usuarioLogueado!);

    return res.user;
  } */

// Esta función quedó del servicio anterior, ver con Tomás si se va a usar  
/*   enviarCorreoAutenticacion(user:any){
    return sendEmailVerification(user);
  } */

  /* async cerrarSesionUsuario(){
    this.currentUser = null;
    this.usuario = null;

    return await signOut(this.auth);
  } */

  /* isMailVerificated() : boolean{
    return this.auth.currentUser?.emailVerified!;
  } */
}