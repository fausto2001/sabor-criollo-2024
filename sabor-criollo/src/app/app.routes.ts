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
  },/* 
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
  }, */
  {
    path: 'alta-mesa',
    loadComponent: () => import('./pages/alta-mesa/alta-mesa.page').then( m => m.AltaMesaPage)
  },
  {
    path: 'listado-clientes-pendientes',
    loadComponent: () => import('./pages/listado-clientes-pendientes/listado-clientes-pendientes.page').then( m => m.ListadoClientesPendientesPage)
  },
  {
    path: 'lista-espera',
    loadComponent: () => import('./pages/lista-espera/lista-espera.page').then( m => m.ListaEsperaPage)
  },
  {
    path: 'chat',
    loadComponent: () => import('./pages/chat/chat.page').then( m => m.ChatPage)
  },
  {
    path: 'pedido',
    loadComponent: () => import('./pages/pedido/pedido.page').then( m => m.PedidoPage)
  },
  {
    path: 'home-pedido',
    loadComponent: () => import('./pages/home-pedido/home-pedido.page').then( m => m.HomePedidoPage)
  },
  {
    path: 'listado-pedidos-pendientes',
    loadComponent: () => import('./pages/listado-pedidos-pendientes/listado-pedidos-pendientes.page').then( m => m.ListadoPedidosPendientesPage)
  },
  {
    path: 'estado-mesas',
    loadComponent: () => import('./pages/estado-mesas/estado-mesas.page').then( m => m.EstadoMesasPage)
  },
  {
    path: 'graficos',
    loadComponent: () => import('./pages/graficos/graficos.page').then( m => m.GraficosPage)
  },
  {
    path: 'push',
    loadComponent: () => import('./components/push/push.component').then( m => m.PushComponent)
  },
  {// crear componente de error
    path: '**',
    redirectTo: 'splash-screen',
    pathMatch: 'full',
  },  {
    path: 'cuenta',
    loadComponent: () => import('./pages/cuenta/cuenta.page').then( m => m.CuentaPage)
  },
  {
    path: 'encuesta',
    loadComponent: () => import('./pages/encuesta/encuesta.page').then( m => m.EncuestaPage)
  },





];