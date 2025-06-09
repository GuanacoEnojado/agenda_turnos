import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

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
    loadChildren: () => import('./pages/main/main.module').then( m => m.MainPageModule)
  },
  {
    path: 'lista-funcionarios',
    loadChildren: () => import('./pages/lista-funcionarios/lista-funcionarios.module').then( m => m.ListaFuncionariosPageModule)
  },
  {
    path: 'calendario-turnos',
    loadChildren: () => import('./pages/calendario-turnos/calendario-turnos.module').then( m => m.CalendarioTurnosPageModule)
  },
  {
    path: 'calendario-global',
    loadChildren: () => import('./pages/calendario-global/calendario-global.module').then( m => m.CalendarioGlobalPageModule)
  },
  {
    path: 'busquedadia',
    loadChildren: () => import('./pages/busquedadia/busquedadia.module').then( m => m.BusquedadiaPageModule)
  },
  {
    path: 'preferencias',
    loadChildren: () => import('./pages/preferencias/preferencias.module').then( m => m.PreferenciasPageModule)
  },
  {
    path: 'registro',
    loadChildren: () => import('./pages/registro/registro.module').then( m => m.RegistroPageModule)
  },
  {
    path: 'eliminacion',
    loadChildren: () => import('./pages/eliminacion/eliminacion.module').then( m => m.EliminacionPageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
