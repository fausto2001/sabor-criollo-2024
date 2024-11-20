import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonCol, IonRow, IonImg } from '@ionic/angular/standalone';

@Component({
  selector: 'app-home-cocinero',
  templateUrl: './home-cocinero.page.html',
  styleUrls: ['./home-cocinero.page.scss'],
  standalone: true,
  imports: [IonImg, IonRow, IonCol, IonButton, IonHeader, IonToolbar, IonTitle, IonContent, RouterLink, FormsModule, ReactiveFormsModule, CommonModule],
})
export class HomeCocineroPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}