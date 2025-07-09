import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CalendarioGlobalPage } from './calendario-global.page';

const routes: Routes = [
  {
    path: '',
    component: CalendarioGlobalPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CalendarioGlobalPageRoutingModule {}
