import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RegistroFuncionarioPage } from './registrofuncionario.page';

const routes: Routes = [
  {
    path: '',
    component: RegistroFuncionarioPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RegistrofuncionarioPageRoutingModule {}
