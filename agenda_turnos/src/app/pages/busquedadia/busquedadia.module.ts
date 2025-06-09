import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BusquedadiaPageRoutingModule } from './busquedadia-routing.module';

import { BusquedadiaPage } from './busquedadia.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BusquedadiaPageRoutingModule
  ],
  declarations: [BusquedadiaPage]
})
export class BusquedadiaPageModule {}
