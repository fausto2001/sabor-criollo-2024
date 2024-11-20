import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { addIcons } from 'ionicons';
import { thumbsUpOutline, thumbsDownOutline, sadOutline, happyOutline, alertCircleOutline } from 'ionicons/icons';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonImg, IonRow, IonCol, IonItem, IonCardHeader, IonCard, IonLabel, IonCardTitle, IonCardContent, IonIcon, IonList, IonRadio, IonRadioGroup, IonTextarea, IonButton, IonCheckbox } from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { EncuestaModel } from 'src/app/models/encuestas.component';
import { StorageService } from 'src/app/services/storage.service';
import { EncuestaService } from 'src/app/services/encuesta.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-encuesta',
  templateUrl: './encuesta.page.html',
  styleUrls: ['./encuesta.page.scss'],
  standalone: true,
  imports: [IonCheckbox, IonButton, IonTextarea, IonRadioGroup, IonRadio, IonList, IonCard, IonCardHeader, IonCol, IonRow, IonImg,  IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, 
    IonLabel, IonCardTitle, IonCardContent, IonItem, ReactiveFormsModule, IonIcon]
})
export class EncuestaPage {

  private storageService: StorageService = inject(StorageService);
  private encuestaService: EncuestaService = inject(EncuestaService);
  protected form: FormGroup;
  fotos: any[] = [];
  files: File[] = [];
  enviado:boolean=false;
  protected error: string = '';

  constructor(private router:Router)
  {
    addIcons({ //tuve que meterle esto para que funcionen los íconos de ionic
      'thumbs-up-outline': thumbsUpOutline,
      'thumbs-down-outline': thumbsDownOutline,
      'happy-outline': happyOutline,
      'sad-outline': sadOutline,
      'help-outline': alertCircleOutline
    })

    this.form = new FormGroup ({
      puntaje: new FormControl('', [Validators.required]),
      mesaOrdenada: new FormControl(true, [Validators.required]),
      opinion: new FormControl('', [Validators.required]),
      quejas: new FormControl('', [Validators.required])
    });
  }

  get puntaje(){
    return this.form.get('puntaje')?.value;
  }
  get mesaOrdenada() {
    return this.form.get('mesaOrdenada')?.value;
  }
  get opinion(){
    return this.form.get('opinion')?.value;
  }
  get quejas(){
    return this.form.get('quejas')?.value;
  }
  get foto(){
    return this.form.get('foto')?.value;
  }

  goHome(){
    this.router.navigateByUrl('/home');
  }

  onCheckboxChange(event: any) {
    const value = event.detail.checked;
    this.form.controls['mesaOrdenada'].setValue(this.mesaOrdenada);
  }

  onPuntajeChange(event: any) {
    const value = event.target.value;
    this.form.controls['puntaje'].setValue(value);
  }

  onFileSelected(event: any) {
    const files = event.target.files;
    
    this.fotos = [];
    this.files = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const reader = new FileReader();
      
      reader.onload = (e: any) => {
        const base64Url = e.target.result;
        this.fotos.push(base64Url);
      };
      reader.readAsDataURL(file);
      this.files.push(file);
    }
  }

  realizarComprobaciones(){
    let ret = false;
    this.error = '';
    if(!this.form.valid){
      this.error = 'Verifique los datos ingresados';
      console.log(this.error);
      return ret;
    }
    return true;
  }

  async registrarEncuesta() {
    this.enviado = true;
    let nuevaEncuesta: EncuestaModel;
    if (this.realizarComprobaciones()) {
      console.log(this.files[0]);
      console.log(this.files[1]);
      console.log(this.files[2]);
      const date = new Date();
      if (this.files[0] != undefined && this.files[1] != undefined && this.files[2] != undefined) {
        nuevaEncuesta = <EncuestaModel> {
          id: date.getTime().toString(),
          uid_cliente: '',
          id_pedido: '',
          puntajeEstablecimiento: this.puntaje,
          ordenMesa: '',
          quejaServicio: this.mesaOrdenada,
          cartaEstablecimiento: this.opinion,
          comentarioEstablecimiento: this.quejas,
          foto1: await this.storageService.subirFotoAdjuntada(date.getTime().toString() + '_1', 'encuestas/', this.files[0]),
          foto2: await this.storageService.subirFotoAdjuntada(date.getTime().toString() + '_2', 'encuestas/', this.files[1]),
          foto3: await this.storageService.subirFotoAdjuntada(date.getTime().toString() + '_3', 'encuestas/', this.files[2]),
        };
      } else if (this.files[0] != undefined && this.files[1] != undefined) {
        nuevaEncuesta = <EncuestaModel> {
          id: date.getTime().toString(),
          uid_cliente: '',
          id_pedido: '',
          puntajeEstablecimiento: this.puntaje,
          ordenMesa: '',
          quejaServicio: this.mesaOrdenada,
          cartaEstablecimiento: this.opinion,
          comentarioEstablecimiento: this.quejas,
          foto1: await this.storageService.subirFotoAdjuntada(date.getTime().toString() + '_1', 'encuestas/', this.files[0]),
          foto2: await this.storageService.subirFotoAdjuntada(date.getTime().toString() + '_2', 'encuestas/', this.files[1]),
          foto3: null
        };
      } else if (this.files[0] != undefined) {
        nuevaEncuesta = <EncuestaModel> {
          id: date.getTime().toString(),
          uid_cliente: '',
          id_pedido: '',
          puntajeEstablecimiento: this.puntaje,
          ordenMesa: '',
          quejaServicio: this.mesaOrdenada,
          cartaEstablecimiento: this.opinion,
          comentarioEstablecimiento: this.quejas,
          foto1: await this.storageService.subirFotoAdjuntada(date.getTime().toString() + '_1', 'encuestas/', this.files[0]),
          foto2: null,
          foto3: null
        };
      } else {
        nuevaEncuesta = <EncuestaModel> {
          id: date.getTime().toString(),
          uid_cliente: '',
          id_pedido: '',
          puntajeEstablecimiento: this.puntaje,
          ordenMesa: '',
          quejaServicio: this.mesaOrdenada,
          cartaEstablecimiento: this.opinion,
          comentarioEstablecimiento: this.quejas,
          foto1: null,
          foto2: null,
          foto3: null
        };
      }
      await this.encuestaService.setEncuesta(nuevaEncuesta).then(()=> {
        Swal.fire({
          icon: 'success',
          title: "Encuesta generada con éxito",
          toast: true,
          position: 'center',
          confirmButtonAriaLabel: "Thumbs up, Aceptar",
        }).then( () => {
          this.form.reset();
          this.router.navigateByUrl('/home');
        });
      });
    }
  }
}