import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { addIcons } from 'ionicons';
import { thumbsUpOutline, thumbsDownOutline, sadOutline, happyOutline, helpOutline, alertCircleOutline } from 'ionicons/icons';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonImg, IonRow, IonCol, IonItem, IonCardHeader, IonCard, IonLabel, IonCardTitle, IonCardContent, IonIcon, IonList, IonRadio, IonRadioGroup, IonTextarea, IonButton } from '@ionic/angular/standalone';
import { Router } from '@angular/router';

@Component({
  selector: 'app-encuesta',
  templateUrl: './encuesta.page.html',
  styleUrls: ['./encuesta.page.scss'],
  standalone: true,
  imports: [IonButton, IonTextarea, IonRadioGroup, IonRadio, IonList, IonCard, IonCardHeader, IonCol, IonRow, IonImg,  IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, 
    IonLabel, IonCardTitle, IonCardContent, IonItem, ReactiveFormsModule, IonIcon]
})
export class EncuestaPage {

  protected form: FormGroup;
  opinion: string = '';
  fotos: string[] = [];
  enviado:boolean=false;

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
      mesaOrdenada: new FormControl('', [Validators.required]),
      opinion: new FormControl('', [Validators.required]),
      quejas: new FormControl('', [Validators.required])
    });
  }

  goHome(){
    this.router.navigateByUrl('/home');
  }

  onFileSelected(event: any) {
    const files = event.target.files;

    this.fotos = [];
    for (let i = 0; i < files.length; i++) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.fotos.push(e.target.result);
      };
      reader.readAsDataURL(files[i]);
    }
  }

  registrarEncuesta(){
    this.enviado = true;
  }

}
