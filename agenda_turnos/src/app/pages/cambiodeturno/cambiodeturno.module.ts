import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CambiodeturnoPageRoutingModule } from './cambiodeturno-routing.module';

import { CambiodeturnoPage } from './cambiodeturno.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CambiodeturnoPageRoutingModule
  ],
  declarations: [CambiodeturnoPage]
})
export class CambiodeturnoPageModule {}
