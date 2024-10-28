import { Injectable, inject } from '@angular/core';
import { CollectionReference, Firestore, collection, deleteDoc, getDocs, collectionData, doc, query, setDoc, where, updateDoc } from '@angular/fire/firestore';
import { map, take } from 'rxjs';
import { UsuarioModel } from '../models/usuario.component';
import { Observable } from 'rxjs'; 


@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private db:Firestore = inject(Firestore);
  private usuariosCollection!:CollectionReference;

  constructor() {
    this.usuariosCollection = collection(this.db, 'usuarios');
  }

  getUsuarioPorUid(uid:string){
    let qry = query(
      this.usuariosCollection,
      where('uid', '==', uid)
    );
    return collectionData(qry).pipe( take(1),
      map( usuarios => usuarios[0] as UsuarioModel ));
  }

  getUsuarioPorEmail(email:string){
    let qry = query(
      this.usuariosCollection,
      where('email', '==', email)
    );
    return collectionData(qry).pipe( 
      map( usuarios => usuarios[0] as UsuarioModel ));
  }

  setUsuario(usuario:UsuarioModel){
    debugger;
    if(usuario){
      const tupla = doc(this.usuariosCollection);
      usuario.id = tupla.id;
      return setDoc(tupla, usuario)
    }
    else{
      throw new Error('No se ha cargado ningun usuario a registrar');
    }
  }
  
  getUsuariosNoAdmitidos(): Observable<UsuarioModel[]> {
    let qry = query(
      this.usuariosCollection,
      where('rol', '==', 'cliente'),
      where('admitido', '==', null),
    );
    return collectionData(qry).pipe(
      map(usuarios => usuarios as UsuarioModel[])
    );

  }

  getUsuariosEnListaDeEspera(): Observable<UsuarioModel[]> {
    let qry = query(
      this.usuariosCollection,
      where('rol', '==', 'cliente'),
      where('enListaDeEspera', '==', true),
    );
    return collectionData(qry).pipe(
      map(usuarios => usuarios as UsuarioModel[])
    );

  }


  updateUsuario(usuario: UsuarioModel): Promise<void> {
    const registro = doc(this.usuariosCollection, usuario.id!);
    return setDoc(registro, usuario);
  }
  
  
  updateUsuarioAdmitido(usuario: UsuarioModel, admitido: string): Promise<void> {
    const registro = doc(this.usuariosCollection, usuario.id!);
    return updateDoc(registro, { admitido: usuario.admitido });
  }

  deleteUsuario(id: string): Promise<void> {
    const registro = doc(this.usuariosCollection, id);
    return deleteDoc(registro);
  }

  getUsuarioPorId(id:string){
    let qry = query(
      this.usuariosCollection,
      where('id', '==', id)
    );
    return collectionData(qry).pipe( take(1),
      map( usuarios => usuarios[0] as UsuarioModel ));
  }

/*
  deleteUsuarioPorEmail(usuario: UsuarioModel): Promise<void> {
    const registro = doc(this.usuariosCollection, usuario.id!);
    return deleteDoc(registro, { usuario.email });
  }*/

}