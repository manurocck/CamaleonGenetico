
export interface Color {
  nombre: string;
  emoji: string;
}

export class CAMALEON_CONST {
  public static amarillo : Color =  { nombre : 'yellow',    emoji : '🟡' };
  public static azul : Color =      { nombre : 'blue',      emoji : '🔵' };
  public static rojo : Color =      { nombre : 'red',       emoji : '🔴' };
  public static verde : Color =     { nombre : 'green',     emoji : '🟢' };
  public static lila : Color =      { nombre : 'purple',    emoji : '🟣' };
  
  public static colores : Color[] = [this.rojo, this.amarillo, this.verde, this.azul, this.lila];
  public static combinacionDefault : Color[] = [this.rojo, this.amarillo, this.azul, this.amarillo, this.lila];
}

export class Genoma {
  combinacion : Color[] = [];
  aptitud: number = 0;
  
  actualizarAptitud(combinacionElegida : Color[]){
    this.aptitudPosicionCorrecta(combinacionElegida);
  }
  // Suma 1 a la aptitud por cada color que esté en la posición correcta
  aptitudPosicionCorrecta(combinacionElegida : Color[]){
    var aptitud = 0;
    combinacionElegida.forEach((color, index) => {
      if (this.combinacion[index] === color) {
        aptitud++;
      }
    });
    this.aptitud = aptitud;
  }

  // agregar aptitud por colores correctos
}
