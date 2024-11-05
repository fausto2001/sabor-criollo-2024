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
    path: 'login',
    loadComponent: () => import('./pages/login/login.component').then(m => m.LoginComponent)
  },
  { 
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
    path: 'alta-cliente',
    loadComponent: () => import('./pages/alta-cliente/alta-cliente.page').then( m => m.AltaClientePage)
  },
  {
    path: 'home-cliente',
    loadComponent: () => import('./pages/home-cliente/home-cliente.page').then( m => m.HomeClientePage)
  },
  {
    path: 'home-duenio',
    loadComponent: () => import('./pages/home-duenio/home-duenio.page').then( m => m.HomeDuenioPage)
  },
  {
    path: 'home-supervisor',
    loadComponent: () => import('./pages/home-supervisor/home-supervisor.page').then( m => m.HomeSupervisorPage)
  },
  {
    path: 'home-cocinero',
    loadComponent: () => import('./pages/home-cocinero/home-cocinero.page').then( m => m.HomeCocineroPage)
  },
  {
    path: 'home-bartender',
    loadComponent: () => import('./pages/home-bartender/home-bartender.page').then( m => m.HomeBartenderPage)
  },
  {
    path: 'home-mozo',
    loadComponent: () => import('./pages/home-mozo/home-mozo.page').then( m => m.HomeMozoPage)
  },
  {
    path: 'home-metre',
    loadComponent: () => import('./pages/home-metre/home-metre.page').then( m => m.HomeMetrePage)
  },
  {
    path: 'alta-mesa',
    loadComponent: () => import('./pages/alta-mesa/alta-mesa.page').then( m => m.AltaMesaPage)
  },
  {
    path: 'test-page',
    loadComponent: () => import('./pages/test-page/test-page.page').then( m => m.TestPagePage)
  },
  {
    path: '**',
    redirectTo: 'splash-screen',
    pathMatch: 'full',
  }



];