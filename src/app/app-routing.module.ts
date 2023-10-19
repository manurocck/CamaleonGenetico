import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PresentacionComponent } from './presentacion/presentacion.component';
import { InicioJuegoComponent } from './inicio-juego/inicio-juego.component';

const routes: Routes = [
  {
    path : '',
    component : PresentacionComponent
  },
  {
    path : 'auto',
    component : InicioJuegoComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
