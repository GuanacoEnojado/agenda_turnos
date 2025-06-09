import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CalendarioGlobalPageRoutingModule } from './calendario-global-routing.module';

import { CalendarioGlobalPage } from './calendario-global.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CalendarioGlobalPageRoutingModule
  ],
  declarations: [CalendarioGlobalPage]
})
export class CalendarioGlobalPageModule {}
