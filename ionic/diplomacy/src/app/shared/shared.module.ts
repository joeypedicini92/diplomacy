import { NgModule } from '@angular/core';
import { MapComponent } from '../map/map.component';
import { CommonModule } from '@angular/common';
import { GameService } from './game.service';

@NgModule({
  imports: [CommonModule],
  declarations: [MapComponent],
  exports: [MapComponent],
  providers: [
    GameService
  ]
})
export class SharedModule {}
