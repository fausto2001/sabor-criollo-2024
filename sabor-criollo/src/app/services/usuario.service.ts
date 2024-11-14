import { Injectable, inject } from '@angular/core';
import { CollectionReference, Firestore, onSnapshot, collection, deleteDoc, getDocs, collectionData, doc, query, setDoc, where, updateDoc } from '@angular/fire/firestore';
import { map, take, from, Observable } from 'rxjs';
import { UsuarioModel } from '../models/usuario.component';


@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  private db: Firestore = inject(Firestore);
  private usuariosCollection: CollectionReference = collection(this.db, 'usuarios');
  public personaLogeada: any;

  constructor() {}
  
  getUsuarioPorUid(uid:string){
    let qry = query(
      this.usuariosCollection,
      where('uid', '==', uid)
    );
    return collectionData(qry).pipe( take(1),
      map( usuarios => usuarios[0] as UsuarioModel ));
  }

  

  async getUsuarioPorCorreo(mail: string)
  {
    const userQuery = query(collection(this.db, 'usuarios'), where('email', '==', mail));
    const querySnapshot = await getDocs(userQuery);

    if (!querySnapshot.empty) {
      const userDoc = querySnapshot.docs[0];
      const userData = await userDoc.data() as UsuarioModel;
      this.personaLogeada = userData;

      return this.personaLogeada as UsuarioModel;
    }
    else {
      return null;
    }
  }

  getUsuarioPorCorreoObservable(mail: string): Observable<UsuarioModel | null> {
    const userQuery = query(collection(this.db, 'usuarios'), where('email', '==', mail));
    return from(getDocs(userQuery).then((querySnapshot) => {
      if (!querySnapshot.empty) {
        const userDoc = querySnapshot.docs[0];
        const userData = userDoc.data() as UsuarioModel;
        this.personaLogeada = userData;
        return this.personaLogeada as UsuarioModel;
      } else {
        return null;
      }
    }));
  }

  async setUsuario(usuario:UsuarioModel){
    if(usuario){
      const tupla = doc(this.usuariosCollection);
      usuario.id = tupla.id;
      return setDoc(tupla, usuario)
    }
    else{
      return new Error('No se ha cargado ningun usuario a registrar');
    }
  }

/*
    async getUsuariosNoAdmitidos(): Promise<UsuarioModel[]> {
      const userQuery = query(collection(this.db, 'usuarios'), where('admitido', '==', null));
      const querySnapshot = await getDocs(userQuery);
    
      const usuarios: UsuarioModel[] = [];
      
      if (!querySnapshot.empty) {
        querySnapshot.forEach(doc => {
          const userData = doc.data() as UsuarioModel;
          usuarios.push(userData);
        });
      }
      
      return usuarios;
    }*/


      getUsuariosNoAdmitidos(): Observable<UsuarioModel[]> {
        return new Observable<UsuarioModel[]>(observer => {
          const userQuery = query(collection(this.db, 'usuarios'), where('admitido', '==', null));
      
          const unsubscribe = onSnapshot(userQuery, (querySnapshot) => {
            const usuarios: UsuarioModel[] = [];
            querySnapshot.forEach(doc => {
              usuarios.push(doc.data() as UsuarioModel);
            });
            observer.next(usuarios);
          }, (error) => {
            observer.error(error);
          });
      
          return () => unsubscribe();
        });
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
 
  async documentoYaRegistrado(nroDocumento: string)
  {
    const userQuery = query(collection(this.db, 'usuarios'), where('dni', '==', nroDocumento));
    const querySnapshot = await getDocs(userQuery);

    if (!querySnapshot.empty) {
      return true;
    }
    return false;
  }

  usuarioActivo(): boolean {
    return this.personaLogeada.admitido;
  }

  borrarPersonaLogeada() {
    this.personaLogeada = null;
  }

}