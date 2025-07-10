import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ExtraShiftModalComponent } from './extra-shift-modal/extra-shift-modal.component';
import { ShiftVisualizationModalComponent } from './shift-visualization-modal/shift-visualization-modal.component';

@NgModule({
  declarations: [
    ExtraShiftModalComponent,
    ShiftVisualizationModalComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule
  ],
  exports: [
    ExtraShiftModalComponent,
    ShiftVisualizationModalComponent
  ]
})
export class ComponentsModule { }
