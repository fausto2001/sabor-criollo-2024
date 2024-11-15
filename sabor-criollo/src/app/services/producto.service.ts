import { Injectable, inject } from '@angular/core';
import { CollectionReference, Firestore, collection, getDocs, collectionData, doc, query, setDoc, where, updateDoc } from '@angular/fire/firestore';
import { map, take } from 'rxjs';
import { UsuarioModel } from '../models/usuario.component';
import { ProductoModel } from '../models/producto.component';
import { Observable } from 'rxjs'; 
@Injectable({
  providedIn: 'root'
})
export class ProductoService {

  private db:Firestore = inject(Firestore);
  private productosCollection!:CollectionReference;

  constructor() {
    this.productosCollection = collection(this.db, 'productos');
  }

  

  getProductos(): Observable<ProductoModel[]> {
    let qry = query(
      this.productosCollection,
    );
    return collectionData(qry).pipe(
      map(usuarios => usuarios as ProductoModel[])
    );

  }

  getProductosPorRol(rol: string): Observable<ProductoModel[]> {
    let qry = query(
      this.productosCollection,
      where('rol', '==', rol),
    );
    return collectionData(qry).pipe(
      map(usuarios => usuarios as ProductoModel[])
    );

  }

  getProductosPorId(id: string): Observable<ProductoModel[]> {
    let qry = query(
      this.productosCollection,
      where('id', '==', id),
    );
    return collectionData(qry).pipe(
      map(usuarios => usuarios as ProductoModel[])
    );

  }

  setProducto(producto:ProductoModel){
    //debugger;
    if(producto){
      const tupla = doc(this.productosCollection);
      producto.id = tupla.id;
      setDoc(tupla, producto)
    }
    else{
      throw new Error('No se ha cargado ningun producto');
    }
  }
}