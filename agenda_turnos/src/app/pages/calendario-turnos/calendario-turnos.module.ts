import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CalendarioTurnosPageRoutingModule } from './calendario-turnos-routing.module';

import { CalendarioTurnosPage } from './calendario-turnos.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CalendarioTurnosPageRoutingModule
  ],
  declarations: [CalendarioTurnosPage]
})
export class CalendarioTurnosPageModule {}
