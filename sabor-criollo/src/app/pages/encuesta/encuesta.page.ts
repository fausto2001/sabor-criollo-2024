import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonImg, IonIcon, IonFabButton, IonFabList, IonFab, IonRow, IonItem,
         IonButton, IonCol, IonInput, IonLabel, IonBackButton, IonSegmentButton, IonText, IonButtons, IonRadio, IonList,
         IonRange, IonCheckbox, IonRadioGroup, IonSelect,IonSelectOption,IonTextarea } from '@ionic/angular/standalone';
import { ToastService } from 'src/app/services/toast.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { StorageService } from 'src/app/services/storage.service';
import { QrService } from 'src/app/services/qr.service';
import { CamaraService } from 'src/app/services/camara.service';
import { EncuestaService } from 'src/app/services/encuesta.service';
import { EncuestaModel } from 'src/app/models/encuestas.component';

@Component({
  selector: 'app-encuesta',
  templateUrl: './encuesta.page.html',
  styleUrls: ['./encuesta.page.scss'],
  standalone: true,
  imports: [IonRadioGroup, IonCheckbox, IonRange, IonList, IonRadio, IonButtons, IonText, IonSegmentButton, IonBackButton, IonLabel,
    IonInput, IonCol, IonButton, IonItem, IonRow, IonFab, IonFabList,
    IonFabButton, IonIcon, IonImg, IonContent, IonHeader, IonTitle,
    IonToolbar, CommonModule, FormsModule, CommonModule,
    ReactiveFormsModule,IonCheckbox,IonRadioGroup,IonSelect,IonSelectOption,IonTextarea
  ]
})
export class EncuestaPage implements OnInit {

  private usuarioServ:UsuarioService = inject(UsuarioService);
  private encuestaSer:EncuestaService = inject(EncuestaService);
  private authServ:AuthService = inject(AuthService);
  private router:Router = inject(Router);
  private storageServ: StorageService = inject(StorageService);
  private qrServ:QrService = inject(QrService);
  private camaraServ:CamaraService = inject(CamaraService);
  // private toastServ:ToastService = inject(ToastService);


  img1! : any;
  isChecked = false;
  mesaOrdenada='';
  datoRango='';

  form: FormGroup = new FormGroup({
    puntajeEstablecimiento: new FormControl('5',[Validators.required]),
    ordenMesa: new FormControl(''),
    quejaServicio: new FormControl('', [Validators.required]),
    cartaEstablecimiento: new FormControl('', [Validators.required]),
    comentarioEstablecimiento: new FormControl(''),
    foto1: new FormControl(''),
    uid_cliente: new FormControl(''),
    id_pedido: new FormControl(''),
  });

  get puntajeEstablecimiento(){
    return this.form.get('puntajeEstablecimiento')?.value;
  }

  get ordenMesa(){
    return this.form.get('ordenMesa')?.value;
  }

  get quejaServicio(){
    return this.form.get('quejaServicio')?.value;
  }
  get cartaEstablecimiento(){
    return this.form.get('cartaEstablecimiento')?.value;
  }

  get comentarioEstablecimiento(){
    return this.form.get('comentarioEstablecimiento')?.value;
  }

  async  registrar(){


    if (this.form.valid) {

      console.log('Campo puntajeEstablecimiento: ',this.puntajeEstablecimiento);
      console.log('ordenMesa:',this.ordenMesa);
      console.log('quejaServicio:',this.quejaServicio);
      console.log('cartaEstablecimiento:',this.cartaEstablecimiento);
      console.log('comentarioEstablecimiento:',this.comentarioEstablecimiento);

      if (this.ordenMesa == true) {
        this.mesaOrdenada = 'SI';
      }else{
        this.mesaOrdenada = 'NO'
      }
      console.log('Mesa Ordenada: ', this.mesaOrdenada);

      //const foto = await this.camaraServ.tomarFoto();
      //const urlFoto = await this.storageServ.subirFotoBase64('foto', 'encuesta/', foto);
      const encuestaData = this.form.value;
      console.log('ver ', encuestaData);
      const nuevaEncuesta = <EncuestaModel>{
        id: '',
        uid_cliente:'1',
        id_pedido: '1',
        puntajeEstablecimiento: this.puntajeEstablecimiento,
        ordenMesa: this.ordenMesa,
        quejaServicio: this.quejaServicio,
        cartaEstablecimiento: this.cartaEstablecimiento,
        comentarioEstablecimiento: this.comentarioEstablecimiento,
        foto: '',//urlFoto!,
      }
      //console.log('Que grabamos:', nuevaEncuesta);
      this.encuestaSer.setEncuesta(nuevaEncuesta)
       .then( () => {
        // this.toastServ.presentToast('bottom', 'Encuesta registrada', 'success', 3000);
        //this.toast2Serv.showToast('Encuesta registrada', 'short', 'bottom');
        this.form.reset();
      }).catch( error => {
        // this.toastServ.presentToast('bottom', error.message, 'danger', 3000);
        //this.toast2Serv.showToast(error.message, 'short', 'bottom');
        console.error('Error :', error);
       });


    }
  }

  constructor() { }

  ngOnInit() {
  }

  rangeChange(event:any) {
    this.datoRango = event.detail.value;
    console.log(event.detail.value);
    console.log('Campo puntaje: ',this.form.get('puntaje'));
  }

  async  registrarProducto(){

      const nuevoProducto = <any><unknown>{
        //id: '',
        nombre: 'Queso y Dulce',
        descripcion: 'Queso mar del plata y dulce de batata o membrillo',
        tiempoelavoracion: '12',
        precio: '2500',
        rol:'cocinero',
        imagen: ['https://firebasestorage.googleapis.com/v0/b/pps-2do-parcial-f8235.appspot.com/o/postres%2Fquesodulce1.jpg?alt=media&token=a8204767-197c-4d00-8dd0-bdd26c3d99d1','https://firebasestorage.googleapis.com/v0/b/pps-2do-parcial-f8235.appspot.com/o/postres%2Fquesodulce2.jpg?alt=media&token=3d0f5c95-cd37-47c6-a343-31181c4e35ce','https://firebasestorage.googleapis.com/v0/b/pps-2do-parcial-f8235.appspot.com/o/postres%2Fquesodulce3.jpg?alt=media&token=c1231b12-8fc3-47f7-b994-1b364519b782'],
      }
      console.log('Que grabamos:', nuevoProducto);
      this.encuestaSer.setProducto(nuevoProducto)
       .then( () => {
        // this.toastServ.presentToast('middle', 'Producto registrado', 'success', 3000);
        //this.toast2Serv.showToast('Producto registrado', 'short', 'bottom');
        this.form.reset();
       }).catch( error => {
        // this.toastServ.presentToast('bottom', error.message, 'danger', 3000);
        //this.toast2Serv.showToast(error.message, 'short', 'bottom');
        console.error('Error :', error);
       });
  }


}