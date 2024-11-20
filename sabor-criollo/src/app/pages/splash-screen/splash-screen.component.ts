import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent } from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { SplashScreen } from '@capacitor/splash-screen';

@Component({
  selector: 'app-splash-screen',
  templateUrl: './splash-screen.component.html',
  styleUrls: ['./splash-screen.component.scss'],
  standalone: true,
  imports: [IonContent, CommonModule, FormsModule]
})
export class SplashScreenComponent  implements OnInit {
  private router: Router = inject(Router);

  constructor() { 
    setTimeout( () => {
      this.router.navigateByUrl('/login');
    }, 2850);
  }

  ngOnInit() {
  }
  ngAfterViewInit(): void {
    setTimeout(() => {
      SplashScreen.hide({fadeOutDuration: 500});
    }, 100);
  }

}
