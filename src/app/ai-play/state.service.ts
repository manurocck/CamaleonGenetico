import { EventEmitter, Injectable } from '@angular/core';
import { CAMALEON_CONST, Color, Fase, GenomaCamaleon, _FASE } from '../structs/structs';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StateService {
  
  private fase : BehaviorSubject<number> = new BehaviorSubject<number>(_FASE.start);
  getcurrentFase() : Observable<number> { return this.fase.asObservable(); }
  setcurrentFase(newFase : number) { this.fase.next(newFase);}
  constructor() { }

  poblacion : GenomaCamaleon[] = []; // Población de individuos
  poblacionMaxima = 10; // Tamaño de la población
  combinacionElegida : Color[] = []; // Combinación elegida por el usuario

  setCombinacionElegida(combinacion : Color[]) { this.combinacionElegida = combinacion; }

  generarPoblacionInicial() {
    // console.log('Generando población inicial');
    // var poblacion: GenomaCamaleon[] = [];
    this.poblacion = [];

    for (let index = 0; index < this.poblacionMaxima; index++) {
      var genoma: GenomaCamaleon = new GenomaCamaleon();
      // Generación de combinación aleatoria
      for (let index = 0; index < this.combinacionElegida.length; index++) {
        var random = (Math.random() * 100) % CAMALEON_CONST.colores.length;
        genoma.combinacion.push(CAMALEON_CONST.colores[Math.floor(random)]);
      }
      this.poblacion.push(genoma);
    }
  } 
}
