import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { RouteGuardService } from './services/route.guard.service';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'main',
    loadChildren: () => import('./pages/main/main.module').then( m => m.MainPageModule),
        canActivate: [RouteGuardService]

  },
  {
    path: 'lista-funcionarios',
    loadChildren: () => import('./pages/lista-funcionarios/lista-funcionarios.module').then( m => m.ListaFuncionariosPageModule),
    canActivate: [RouteGuardService]
  },
  {
    path: 'calendario-turnos',
    loadChildren: () => import('./pages/calendario-turnos/calendario-turnos.module').then( m => m.CalendarioTurnosPageModule),
    canActivate: [RouteGuardService]

  },
  {
    path: 'calendario-global',
    loadChildren: () => import('./pages/calendario-global/calendario-global.module').then( m => m.CalendarioGlobalPageModule),
        canActivate: [RouteGuardService]

  },
  {
    path: 'busquedadia',
    loadChildren: () => import('./pages/busquedadia/busquedadia.module').then( m => m.BusquedadiaPageModule),
        canActivate: [RouteGuardService]

  },
  {
    path: 'preferencias',
    loadChildren: () => import('./pages/preferencias/preferencias.module').then( m => m.PreferenciasPageModule),
        canActivate: [RouteGuardService]

  },
  {
    path: 'registro',
    loadChildren: () => import('./pages/registro/registro.module').then( m => m.RegistroPageModule),
    canActivate: [RouteGuardService]
  },
  {
    path: 'eliminacion',
    loadChildren: () => import('./pages/eliminacion/eliminacion.module').then( m => m.EliminacionPageModule),
        canActivate: [RouteGuardService]

  },
  {
    path: 'registrofuncionario',
    loadChildren: () => import('./pages/registrofuncionario/registrofuncionario.module').then( m => m.RegistrofuncionarioPageModule),
    canActivate: [RouteGuardService]
  },
  {
    path: 'cambiodeturno',
    loadChildren: () => import('./pages/cambiodeturno/cambiodeturno.module').then( m => m.CambiodeturnoPageModule),
    canActivate: [RouteGuardService]
  },

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
