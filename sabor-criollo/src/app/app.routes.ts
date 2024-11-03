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
  { 
    // Lazy loading
    path: 'home',
    loadComponent: () => import('./pages/home/home.page').then(m => m.HomePage)
  },
  {
    path: 'alta-empleado',
    loadComponent: () => import('./pages/alta-empleado/alta-empleado.page').then( m => m.AltaEmpleadoPage)
  },
  {
    path: 'alta-duenio',
    loadComponent: () => import('./pages/alta-duenio/alta-duenio.page').then( m => m.AltaDuenioPage)
  },
  {
    path: '**',
    redirectTo: 'splash-screen',
    pathMatch: 'full',
  }
  {
    path: 'alta-cliente',
    loadComponent: () => import('./pages/alta-cliente/alta-cliente.page').then( m => m.AltaClientePage)
  },

];