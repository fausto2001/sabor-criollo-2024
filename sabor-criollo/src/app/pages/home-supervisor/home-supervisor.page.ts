import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonCol, IonRow, IonImg } from '@ionic/angular/standalone';

@Component({
  selector: 'app-home-supervisor',
  templateUrl: './home-supervisor.page.html',
  styleUrls: ['./home-supervisor.page.scss'],
  standalone: true,
  imports: [IonImg, IonRow, IonCol, IonButton, IonHeader, IonToolbar, IonTitle, IonContent, RouterLink, FormsModule, CommonModule],
})
export class HomeSupervisorPage implements OnInit {

  router: Router = inject(Router);

  constructor() { }

  ngOnInit() {

  }

  goHome(){
    this.router.navigateByUrl('/home');
  }
}