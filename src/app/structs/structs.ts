export interface Color { nombre: string; emoji: string; }

export const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
export const _FASE = { start : 0 , selection : 1, crossover : 2, mutation : 3, stop : 999};

export interface Fase{
  run() : void;
}

export class GenomaCamaleon {
  combinacion: Color[] = [];
  aptitud: number = 0; 

  actualizarAptitud(combinacionElegida: Color[]) {
    this.aptitudPosicionCorrecta(combinacionElegida);
  }
  // Suma 1 a la aptitud por cada color que esté en la posición correcta
  aptitudPosicionCorrecta(combinacionElegida: Color[]) {
    var aptitud = 0;
    combinacionElegida.forEach((color, index) => {
      if (this.combinacion[index] === color) {
        aptitud++;
      }
    });
    this.aptitud = Math.pow(2, aptitud);
  }
  esGanador( tamanoCombinacion: number){
    return this.aptitud == Math.pow(2, tamanoCombinacion);
  }

  // agregar aptitud por colores correctos
}

export interface GenomaConfiguracion {
  // Variables de control
  selectionIndex : number; // porcentaje que dejamos de la población anterior
  mutationIndex : number ; // porcentaje de mutación
  // crossOverIndex : number = 0.2; // porcentaje de cruce
  
  // Variables de estado
  generacionActual : number;
  // Variables de resultado
  resultado : AptitudAlgoritmo;
  
}
export interface AptitudAlgoritmo {
  ganador: GenomaCamaleon;
  totalGeneraciones: number; // total sum of generations
  success: number; // total times the algorithm succeeded
  // varianzaPromedioEntreGeneraciones: number; // variance between generations
}

export class CAMALEON_CONST {
  public static amarillo: Color = { nombre: 'yellow', emoji: '🟡' };
  public static naranja: Color  = { nombre: 'orange', emoji: '🟠' };
  public static azul: Color     = { nombre: 'blue',   emoji: '🔵' };
  public static rojo: Color     = { nombre: 'red',    emoji: '🔴' };
  public static verde: Color    = { nombre: 'green',  emoji: '🟢' };
  public static lila: Color     = { nombre: 'purple', emoji: '🟣' };

  public static colores: Color[] = [ this.rojo, this.naranja, this.amarillo, this.verde, this.azul, this.lila];
}
