import { Routes } from '@angular/router';
import { SplashScreenComponent } from './pages/splash-screen/splash-screen.component';
import { LoginComponent } from './pages/login/login.component';

export const routes: Routes = [

  {
    path: '',
    redirectTo: 'splash-screen',
    pathMatch: 'full',
  },
  { path: 'splash-screen', component: SplashScreenComponent },
  { path: 'login', component:LoginComponent },


];
