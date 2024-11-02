import { Injectable, inject } from '@angular/core';
import { Auth, authState, createUserWithEmailAndPassword, sendEmailVerification, signInWithEmailAndPassword, signOut, user } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { UsuarioService } from './usuario.service';
import { UsuarioModel } from '../models/usuario.component';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  registerUser(email: any, password: any) {
    throw new Error('Method not implemented.');
  }
  private auth:Auth = inject(Auth);
  private router:Router = inject(Router);
  private usuarioServ:UsuarioService = inject(UsuarioService);

  user$ = user(this.auth);
  state$ = authState(this.auth);
  currentUser:any | null = null;
  usuario:UsuarioModel | null = null;

  constructor() {
    this.state$.subscribe( userState => {
      if(userState != null ){
        if(this.usuario && this.usuario.uid != userState.uid){
          const getUsuario$ = this.usuarioServ.getUsuarioPorUid(userState?.uid!)
          getUsuario$.subscribe( data => {
            this.usuario = data;
          });
          this.currentUser = userState;
        }
      }
    });

  }

  async loguearUsuario(email: string, password: string){

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
  }

  private async reloguearUsuario(usuario:UsuarioModel){
    return await signInWithEmailAndPassword(this.auth, usuario.email, usuario.clave);
  }


  async registrarUsuario(email:string, password:string){
    return createUserWithEmailAndPassword(this.auth, email, password).then( (ret) => {
      return ret
    });
  }

  async crearCuentaUsuarioATerceros(email:string, password:string){
    const usuarioLogueado = this.usuario;
    const res = await createUserWithEmailAndPassword(this.auth, email, password);
    await this.cerrarSesionUsuario();

    this.usuario = usuarioLogueado;
    this.currentUser = await this.reloguearUsuario(usuarioLogueado!);

    return res.user;
  }


  enviarCorreoAutenticacion(user:any){
    return sendEmailVerification(user);
  }

  async cerrarSesionUsuario(){
    this.currentUser = null;
    this.usuario = null;

    return await signOut(this.auth);
  }

  isMailVerificated() : boolean{
    return this.auth.currentUser?.emailVerified!;
  }
}