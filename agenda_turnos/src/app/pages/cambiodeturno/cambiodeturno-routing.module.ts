import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CambiodeturnoPage } from './cambiodeturno.page';

const routes: Routes = [
  {
    path: '',
    component: CambiodeturnoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CambiodeturnoPageRoutingModule {}
