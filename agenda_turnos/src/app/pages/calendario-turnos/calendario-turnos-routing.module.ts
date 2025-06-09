import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CalendarioTurnosPage } from './calendario-turnos.page';

const routes: Routes = [
  {
    path: '',
    component: CalendarioTurnosPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CalendarioTurnosPageRoutingModule {}
