import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InicioComponent } from './inicio/inicio.component';
import { SelectionComponent } from './selection/selection.component';
import { CrossoverComponent } from './crossover/crossover.component';
import { MutationComponent } from './mutation/mutation.component';

const routes: Routes = [
  {
    path: '',
    component: InicioComponent
  },
  {
    path: 'selection',
    component: SelectionComponent
  },
  {
    path: 'crossover',
    component: CrossoverComponent
  },
  {
    path: 'mutation',
    component: MutationComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AiPlayRoutingModule { }
