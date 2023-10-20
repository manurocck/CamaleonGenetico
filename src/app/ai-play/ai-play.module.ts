import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AiPlayRoutingModule } from './ai-play-routing.module';
import { InicioComponent } from './inicio/inicio.component';
import { SelectionComponent } from './selection/selection.component';
import { CrossoverComponent } from './crossover/crossover.component';
import { MutationComponent } from './mutation/mutation.component';
import { WidgetsModule } from '../widgets/widgets.module';


@NgModule({
  declarations: [
    InicioComponent,
    SelectionComponent,
    CrossoverComponent,
    MutationComponent
  ],
  imports: [
    CommonModule,
    WidgetsModule,
    AiPlayRoutingModule
  ]
})
export class AiPlayModule { }
