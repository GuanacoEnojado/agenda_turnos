import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EliminacionPage } from './eliminacion.page';

const routes: Routes = [
  {
    path: '',
    component: EliminacionPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EliminacionPageRoutingModule {}
