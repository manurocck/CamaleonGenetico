import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PresentacionComponent } from './presentacion/presentacion.component';

const routes: Routes = [
  {
    path:'home',
    component: PresentacionComponent
  },
  {
    path:'ai-play',
    loadChildren: () => import('./ai-play/ai-play.module').then(m => m.AiPlayModule)
  },
  {
    path: 'solo-play',
    loadChildren: () => import('./solo-play/solo-play.module').then(m => m.SoloPlayModule)
  }, 
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: '/home'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
