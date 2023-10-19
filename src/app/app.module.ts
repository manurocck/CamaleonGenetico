import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { PresentacionComponent } from './presentacion/presentacion.component';
import { InicioJuegoComponent } from './inicio-juego/inicio-juego.component';
import { InformeJuegoComponent } from './informe-juego/informe-juego.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    PresentacionComponent,
    InformeJuegoComponent,
    InicioJuegoComponent,
  ],
  imports: [BrowserModule, AppRoutingModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
