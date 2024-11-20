import { Injectable, inject } from '@angular/core';
import { CollectionReference, Firestore, collection, collectionData, doc, query, setDoc, where } from '@angular/fire/firestore';
import { map, take } from 'rxjs';
import { MesaModel } from '../models/mesa.component';
import { Observable } from 'rxjs'; 

@Injectable({
  providedIn: 'root'
})
export class MesaService {

  private db:Firestore = inject(Firestore);
  private mesasCollection!:CollectionReference;

  constructor() {
    this.mesasCollection = collection(this.db, 'mesa');
  }


  getMesaDisponible(numero:string){
    let qry = query(
      this.mesasCollection,
      where('numero', '==', numero),
      where('estado', '==', 'Disponible')
    );
    return collectionData(qry).pipe( take(1),
      map( mesas => mesas[0] as MesaModel ));
  }

  getMesaUsuario(numero:string, cliente: string){
    let qry = query(
      this.mesasCollection,
      where('numero', '==', numero),
      where('cliente', '==', cliente)
    );
    return collectionData(qry).pipe( take(1),
      map( mesas => mesas[0] as MesaModel ));
  }

  updateMesa(mesa: MesaModel): Promise<void> {
    const registro = doc(this.mesasCollection, mesa.numero!);
    return setDoc(registro, mesa);
  }

  getMesas(): Observable<MesaModel[]> {
    let qry = query(
      this.mesasCollection,
    );
    return collectionData(qry).pipe(
      map(mesas => mesas as MesaModel[])
    );
  }

}