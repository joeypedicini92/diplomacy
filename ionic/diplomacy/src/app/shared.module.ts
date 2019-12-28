import { NgModule } from '@angular/core';
import { MapComponent } from './map/map.component';
import { CommonModule } from '@angular/common';

@NgModule({
  imports: [CommonModule],
  declarations: [MapComponent],
  exports: [MapComponent]
})
export class SharedModule {}
