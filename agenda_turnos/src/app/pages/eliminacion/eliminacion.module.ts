import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EliminacionPageRoutingModule } from './eliminacion-routing.module';

import { EliminacionPage } from './eliminacion.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EliminacionPageRoutingModule
  ],
  declarations: [EliminacionPage]
})
export class EliminacionPageModule {}
