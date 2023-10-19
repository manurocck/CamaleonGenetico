import { Injectable } from '@angular/core';
import { Color, GenomaCamaleon } from './structs/structs';
import { CamaleonGenetico } from './structs/camaleonGenetico';

@Injectable({
  providedIn: 'root'
})
export class StateService {
  
  constructor() { }
  
  combinacionElegida : Color[] = [];
  poblacionParaMostrar: GenomaCamaleon[] = [];
  jugando = false;
  hasGanado = false;
  generacionActual = 0;
  ganador: GenomaCamaleon = new GenomaCamaleon();

  setCombinacionElegida(combinacion: Color[]) { this.combinacionElegida = combinacion; }

  async play() {
    var camaleon = new CamaleonGenetico(this.combinacionElegida); // TODO: pasarle los valores de configuración
    var resultado = await camaleon.ejecutarCamaleonGenetico();
    this.hasGanado = resultado.success == 1;
    this.generacionActual = resultado.totalGeneraciones;
    console.log('Total generaciones: '+resultado.totalGeneraciones);
    console.log('Encontró el resultado? : '+(resultado.success==1));

    this.jugando = true;
    this.ganador = camaleon.ganador;
    this.generacionActual = camaleon.generacionActual;
    this.poblacionParaMostrar = camaleon.poblacionParaMostrar;
  }
}
