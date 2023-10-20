import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Color } from 'src/app/structs/structs';

@Component({
  selector: 'app-game-state',
  templateUrl: './game-state.component.html',
  styleUrls: ['./game-state.component.css']
})
export class GameStateComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }
  @Input() intentos : {combinacion: Color[], aciertos: number}[] = [];
  @Output() reintento = new EventEmitter<Color[]>();

  reintentar( combinacion : Color[]){
    var combinacionNueva = [...combinacion];
    this.reintento.emit(combinacionNueva); // FUNNY EFFECT el evento
  }
}
