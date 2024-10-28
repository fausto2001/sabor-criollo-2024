import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'splash-screen',
    pathMatch: 'full',
  },
  { 
    // Lazy loading
    path: 'splash-screen',
    loadComponent: () => import('./pages/splash-screen/splash-screen.component').then(m => m.SplashScreenComponent)
  },
  { 
    // Lazy loading
    path: 'login',
    loadComponent: () => import('./pages/login/login.component').then(m => m.LoginComponent)
  },
];