import { Component, Input, OnInit } from '@angular/core';
import { Color } from '../structs/structs';

@Component({
  selector: 'app-informe-juego',
  templateUrl: './informe-juego.component.html',
  styleUrls: ['./informe-juego.component.css']
})
export class InformeJuegoComponent implements OnInit {

  constructor() { }
  ngOnInit(): void { }

  @Input() combinacionGanadora : Color[] = [];
  @Input() cantGeneraciones : number = 0;
}
