import { Component, OnInit } from '@angular/core';
import { CAMALEON_CONST, Color } from 'src/app/structs/structs';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css']
})
export class InicioComponent implements OnInit {
  
  constructor() { }
  
  ngOnInit(): void {
    this.generarClaveRandom();
  }
  
  claveRandom : Color[] = [];
  combinacionElegida : Color[] = [];
  intentos : {combinacion: Color[], aciertos: number}[] = [];
  jugando: boolean = false;

  
  // Controladores de interfaz
  colores = CAMALEON_CONST.colores;
  cambiarColor = false;
  colorSeleccionado = 0;

  cambiarColorSeleccionado(color: Color) {
    this.combinacionElegida[this.colorSeleccionado] = color;
  }

  eliminarColorSeleccionado(i: number) {
    if(this.jugando) return;
    this.combinacionElegida.splice(i, 1);
  }

  addColorSeleccionado(color: Color) {
    if(this.jugando) return;
    this.combinacionElegida.push(color);
  }
  
  generarClaveRandom() {
    for(let i = 0; i < CAMALEON_CONST.colores.length; i++) {
      this.claveRandom[i] = CAMALEON_CONST.colores[Math.floor(Math.random() * CAMALEON_CONST.colores.length)];
    }
  }

  checkear(){
    var aciertosRonda = 0;
    this.combinacionElegida.forEach( (color, index ) => {
      if(color == this.claveRandom[index]) { aciertosRonda++; }
    });
    this.intentos.unshift({combinacion: this.combinacionElegida, aciertos: aciertosRonda});
    this.combinacionElegida = [];
  }

}

