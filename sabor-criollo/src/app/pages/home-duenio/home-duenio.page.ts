import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonCol, IonRow, IonImg } from '@ionic/angular/standalone';

@Component({
  selector: 'app-home-duenio',
  templateUrl: './home-duenio.page.html',
  styleUrls: ['./home-duenio.page.scss'],
  standalone: true,
  imports: [IonImg, IonRow, IonCol, IonButton, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class HomeDuenioPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
