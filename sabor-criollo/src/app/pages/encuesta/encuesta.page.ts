import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { addIcons } from 'ionicons';
import { thumbsUpOutline, thumbsDownOutline } from 'ionicons/icons';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonImg, IonRow, IonCol, IonItem, IonCardHeader, IonCard, IonLabel, IonCardTitle, IonCardContent, IonIcon } from '@ionic/angular/standalone';
import { Router } from '@angular/router';

@Component({
  selector: 'app-encuesta',
  templateUrl: './encuesta.page.html',
  styleUrls: ['./encuesta.page.scss'],
  standalone: true,
  imports: [IonCard, IonCardHeader, IonCol, IonRow, IonImg,  IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, 
    IonLabel, IonCardTitle, IonCardContent, IonItem, ReactiveFormsModule, IonIcon]
})
export class EncuestaPage implements OnInit {

  protected form: FormGroup;
  puntaje: number = 1;

  constructor(private router:Router)
  {
    addIcons({ //tuve que meterle esto para que funcionen los íconos de ionic
      'thumbs-up-outline': thumbsUpOutline,
      'thumbs-down-outline': thumbsDownOutline      
    })

    this.form = new FormGroup ({
      
    });
  }

  ngOnInit() {
  }

  goHome(){
    this.router.navigateByUrl('/home');
  }

  registrarEncuesta(){
    
  }

}
