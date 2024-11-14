import { Injectable, inject } from '@angular/core';
import { CollectionReference, Firestore, collection, collectionData, doc, query, setDoc, where } from '@angular/fire/firestore';
import { EncuestaModel } from '../models/encuestas.component';
import { Observable, map, take } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EncuestaService {
  private db:Firestore = inject(Firestore);
  private encuestaCollection!:CollectionReference;
  private productoCollection!:CollectionReference;   // Después sacar

  constructor() {
    this.encuestaCollection = collection(this.db,'encuestas');
    this.productoCollection = collection(this.db,'productos'); // Después sacar
  }

  async setEncuesta(encuesta:EncuestaModel){
    //debugger;
    if(encuesta){
      const tupla = doc(this.encuestaCollection);
      encuesta.id = tupla.id;
      setDoc(tupla,encuesta);
    }
    else{
      throw new Error('No se ha cargado ninguna encuesta a registrar');
    }
  }

  async setProducto(producto:any){
    //debugger;
    console.log('Llego a  grabar :', producto);
    if(producto){
      const tupla = doc(this.productoCollection);
      producto.id = tupla.id;
      setDoc(tupla,producto);
    }
    else{
      throw new Error('No se ha cargado ninguna encuesta a registrar');
    }
  }

  getEncuestas(tipo: string): Observable<EncuestaModel[]> {
    let qry = query(
      this.encuestaCollection,
      where('cartaEstablecimiento', '==', tipo),
    );
    return collectionData(qry).pipe(
      map(encuestas => encuestas as EncuestaModel[])
    );
  }

  getTodasEncuestas(): Observable<EncuestaModel[]> {
    let qry = query(
      this.encuestaCollection,
    );
    return collectionData(qry).pipe(
      map(encuestas => encuestas as EncuestaModel[])
    );
  }

  async cargarEncuestasDePrueba() {
    const encuestasDePrueba: EncuestaModel[] = [
      {
        id: '', uid_cliente: 'cliente1', id_pedido: 'pedido1',
        puntajeEstablecimiento: '5', ordenMesa: '4',
        quejaServicio: 'Ninguna', cartaEstablecimiento: 'Restaurante A',
        comentarioEstablecimiento: 'Excelente ambiente', foto1: null, foto2: null, foto3: null
      },
      {
        id: '', uid_cliente: 'cliente2', id_pedido: 'pedido2',
        puntajeEstablecimiento: '4', ordenMesa: '3',
        quejaServicio: 'Demora en la comida', cartaEstablecimiento: 'Restaurante B',
        comentarioEstablecimiento: 'Buena atención', foto1: null, foto2: null, foto3: null
      },
      {
        id: '', uid_cliente: 'cliente3', id_pedido: 'pedido3',
        puntajeEstablecimiento: '3', ordenMesa: '3',
        quejaServicio: 'Mala atención', cartaEstablecimiento: 'Restaurante C',
        comentarioEstablecimiento: 'Regular servicio', foto1: null, foto2: null, foto3: null
      },
      {
        id: '', uid_cliente: 'cliente4', id_pedido: 'pedido4',
        puntajeEstablecimiento: '2', ordenMesa: '2',
        quejaServicio: 'Comida fría', cartaEstablecimiento: 'Restaurante D',
        comentarioEstablecimiento: 'Mal ambiente', foto1: null, foto2: null, foto3: null
      },
      {
        id: '', uid_cliente: 'cliente5', id_pedido: 'pedido5',
        puntajeEstablecimiento: '5', ordenMesa: '5',
        quejaServicio: 'Ninguna', cartaEstablecimiento: 'Restaurante E',
        comentarioEstablecimiento: 'Excelente comida', foto1: null, foto2: null, foto3: null
      },
      {
        id: '', uid_cliente: 'cliente6', id_pedido: 'pedido6',
        puntajeEstablecimiento: '4', ordenMesa: '4',
        quejaServicio: 'Demora en el pedido', cartaEstablecimiento: 'Restaurante F',
        comentarioEstablecimiento: 'Buen ambiente', foto1: null, foto2: null, foto3: null
      },
      {
        id: '', uid_cliente: 'cliente7', id_pedido: 'pedido7',
        puntajeEstablecimiento: '3', ordenMesa: '3',
        quejaServicio: 'Falta de amabilidad', cartaEstablecimiento: 'Restaurante G',
        comentarioEstablecimiento: 'Ambiente tranquilo', foto1: null, foto2: null, foto3: null
      },
      {
        id: '', uid_cliente: 'cliente8', id_pedido: 'pedido8',
        puntajeEstablecimiento: '5', ordenMesa: '5',
        quejaServicio: 'Ninguna', cartaEstablecimiento: 'Restaurante H',
        comentarioEstablecimiento: 'Excelente experiencia', foto1: null, foto2: null, foto3: null
      },
      {
        id: '', uid_cliente: 'cliente9', id_pedido: 'pedido9',
        puntajeEstablecimiento: '4', ordenMesa: '4',
        quejaServicio: 'Atención lenta', cartaEstablecimiento: 'Restaurante I',
        comentarioEstablecimiento: 'Lugar acogedor', foto1: null, foto2: null, foto3: null
      },
      {
        id: '', uid_cliente: 'cliente10', id_pedido: 'pedido10',
        puntajeEstablecimiento: '3', ordenMesa: '3',
        quejaServicio: 'Demora en el servicio', cartaEstablecimiento: 'Restaurante J',
        comentarioEstablecimiento: 'Regular', foto1: null, foto2: null, foto3: null
      }
    ];
  
    for (const encuesta of encuestasDePrueba) {
      this.setEncuesta(encuesta);
    }
  }

}