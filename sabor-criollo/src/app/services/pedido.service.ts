import { Injectable, inject } from '@angular/core';
import { CollectionReference, Firestore, collection, collectionData, doc, query, setDoc, where } from '@angular/fire/firestore';
import { map, take } from 'rxjs';
import { Observable } from 'rxjs'; 
import { PedidoModel } from '../models/pedido.component';
@Injectable({
  providedIn: 'root'
})
export class PedidoService {

  private db:Firestore = inject(Firestore);
  private pedidosCollection!:CollectionReference;

  constructor() {
    this.pedidosCollection = collection(this.db, 'pedidos');
  }

  getPedidos(): Observable<PedidoModel[]> {
    let qry = query(
      this.pedidosCollection,
    );
    return collectionData(qry).pipe(
      map(usuarios => usuarios as PedidoModel[])
    );

  }

  getPedidosPorId(id: string): Observable<PedidoModel[]> {
    let qry = query(
      this.pedidosCollection,
      where('id', '==', id),
    );
    return collectionData(qry).pipe(
      map(usuarios => usuarios as PedidoModel[])
    );
  }

  getUltimoPedidoUsuario(cliente: string) {
    let qry = query(
      this.pedidosCollection,
      where('idCliente', '==', cliente),
    );
    return collectionData(qry).pipe(
      map((pedidos) => pedidos as PedidoModel[])
    );
  }

  getPedidosPendientes(estado: string): Observable<PedidoModel[]> {
    let qry = query(
      this.pedidosCollection,
      where('estado', '==', estado),
    );
    return collectionData(qry).pipe(
      map(usuarios => usuarios as PedidoModel[])
    );
  }

  getUltimoPedidoMesa(numero:string){
    let qry = query(
      this.pedidosCollection,
      where('idMesa', '==', numero),
    );
    return collectionData(qry).pipe(
      map(usuarios => usuarios as PedidoModel[]))
  }

  getPedidoPorId(id:string){
    let qry = query(
      this.pedidosCollection,
      where('id', '==', id)
    );
    return collectionData(qry).pipe( take(1),
      map( pedidos => pedidos[0] as PedidoModel  ));
  }

  getUltimoPedidoMesaTake1(numero:string){
    let qry = query(
      this.pedidosCollection,
      where('idMesa', '==', numero),
    );
    return collectionData(qry).pipe( take(1),
      map(usuarios => usuarios as PedidoModel[]))
  }

  setPedido(pedido:PedidoModel){
    if(pedido){
      const tupla = doc(this.pedidosCollection);
      pedido.id = tupla.id;
      setDoc(tupla, pedido)
    }
    else{
      throw new Error('No se ha cargado ningun producto');
    }
  }

  updatePedido(pedido: PedidoModel): Promise<void> {
    const registro = doc(this.pedidosCollection, pedido.id!);
    return setDoc(registro, pedido);
  }
}