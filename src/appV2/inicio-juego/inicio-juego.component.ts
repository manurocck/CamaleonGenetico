import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CAMALEON_CONST, Color } from '../structs/structs';

@Component({
  selector: 'app-inicio-juego',
  templateUrl: './inicio-juego.component.html',
  styleUrls: ['./inicio-juego.component.css'],
})
export class InicioJuegoComponent implements OnInit {
  constructor() {}
  ngOnInit(): void {}
  @Output() eligeCombinacion = new EventEmitter<Color[]>();
  @Output() jugar = new EventEmitter<boolean>();
  @Input() jugando = false;

  combinacionElegida = CAMALEON_CONST.combinacionDefault;
  colores = CAMALEON_CONST.colores;

  cambiarColor = false;
  colorSeleccionado = 0;

  cambiarColorSeleccionado(color: Color) {
    this.combinacionElegida[this.colorSeleccionado] = color;
  }

  eliminarColorSeleccionado(i: number) {
    this.combinacionElegida.splice(i, 1);
  }

  addColorSeleccionado(color: Color) {
    this.combinacionElegida.push(color);
  }

  jugarPartida() {
    this.eligeCombinacion.emit(this.combinacionElegida);
    this.jugar.emit(true);
  }
}
