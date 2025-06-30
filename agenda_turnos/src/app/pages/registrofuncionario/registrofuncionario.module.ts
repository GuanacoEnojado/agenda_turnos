import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RegistrofuncionarioPageRoutingModule } from './registrofuncionario-routing.module';

import { RegistroFuncionarioPage } from './registrofuncionario.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    RegistrofuncionarioPageRoutingModule
  ],
  declarations: [RegistroFuncionarioPage]
})
export class RegistrofuncionarioPageModule {}
