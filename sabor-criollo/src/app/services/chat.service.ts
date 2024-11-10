import { inject, Injectable } from '@angular/core';
import { addDoc, collection, collectionData, CollectionReference, Firestore, orderBy, query, where } from '@angular/fire/firestore';
import { Chat } from '../models/chat.component';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private db:Firestore = inject(Firestore);
  private chats!:CollectionReference;

  constructor() {
    this.chats = collection(this.db,'chats');
  }

  guardarMensaje(mensaje: Chat){
    if(mensaje){
      addDoc(this.chats, mensaje)
      .then((res) => {
        console.log(res);
      }).catch( (e) =>{
        console.log(e);
      });
    }
  }
  

  cargarMensajesPorMesa(mesa:string) {
    const qry = query( this.chats, 
      where('mesa', '==', mesa),
      orderBy('fecha', 'asc')
    );
    return collectionData(qry) as Observable<Chat[]>;
  } 
  cargarMensajes() {
    const qry = query( this.chats, 
      orderBy('fecha', 'asc')
    );
    return collectionData(qry) as Observable<Chat[]>;
  } 




}