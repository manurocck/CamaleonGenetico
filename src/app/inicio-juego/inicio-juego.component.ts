import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CAMALEON_CONST, Color, sleep } from '../structs/structs';
import { StateService } from '../state.service';

@Component({
  selector: 'app-inicio-juego',
  templateUrl: './inicio-juego.component.html',
  styleUrls: ['./inicio-juego.component.css'],
})
export class InicioJuegoComponent implements OnInit {
  constructor(private stateService : StateService) {}

  ngOnInit(): void {}
  @Output() eligeCombinacion = new EventEmitter<Color[]>();
  @Output() jugar = new EventEmitter<boolean>();
  @Input() jugando = false;

  combinacionElegida = CAMALEON_CONST.combinacionDefault;
  colores = CAMALEON_CONST.colores;
  cambiarColor = false;
  colorSeleccionado = 0;
  generacionActual = 0;

  isPlaying() { return this.stateService.jugando; }
  hasWon() { return this.stateService.hasGanado; }
  // generacionActual() { return this.stateService.generacionActual; }
  poblacionParaMostrar() { return this.stateService.poblacionParaMostrar; }
  ganador() { return this.stateService.ganador.combinacion; }

  cambiarColorSeleccionado(color: Color) {
    this.combinacionElegida[this.colorSeleccionado] = color;
  }

  eliminarColorSeleccionado(i: number) {
    if(this.stateService.jugando) return;
    this.combinacionElegida.splice(i, 1);
  }

  addColorSeleccionado(color: Color) {
    if(this.stateService.jugando) return;
    this.combinacionElegida.push(color);
  }

  actualizar() { this.generacionActual = this.stateService.generacionActual; }

  jugarPartida() {
    if(this.stateService.jugando) return;
    this.stateService.setCombinacionElegida(this.combinacionElegida);
    this.stateService.play();
    while(this.stateService.jugando) { this.actualizar(); sleep(100); }
    // this.eligeCombinacion.emit(this.combinacionElegida);
    // this.jugar.emit(true);
  }
}
