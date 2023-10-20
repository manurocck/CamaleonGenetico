import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SoloPlayRoutingModule } from './solo-play-routing.module';
import { InicioComponent } from './inicio/inicio.component';
import { WidgetsModule } from '../widgets/widgets.module';
import { GameStateComponent } from './game-state/game-state.component';


@NgModule({
  declarations: [
    InicioComponent,
    GameStateComponent,
  ],
  imports: [
    CommonModule,
    WidgetsModule,
    SoloPlayRoutingModule
  ]
})
export class SoloPlayModule { }
