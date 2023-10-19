import {
  AptitudAlgoritmo,
  CAMALEON_CONST,
  Color,
  GenomaCamaleon,
  sleep,
} from './structs';

export class CamaleonGenetico {
  constructor(combinacionElegida: Color[]) {
    this.combinacionElegida = combinacionElegida;
    this.poblacion = this.generarPoblacionInicial();
    // debería recibir por parámetro también los valores de configuración
  }
  // Variables de control
  combinacionElegida: Color[] = [];

  // Configuración
  poblacionMaxima = 10;
  indiceMutacion = 0.05;
  indiceSeleccion = 0.7; // porcentaje que dejamos de la población anterior
  generaciones = 100;
  poblacion: GenomaCamaleon[] = [];

  // Información de muestra por pantalla
  jugando = false;
  hasGanado = false;
  generacionActual = 0;
  poblacionParaMostrar: GenomaCamaleon[] = [];
  ganador: GenomaCamaleon = new GenomaCamaleon();

  // Verifica si se ha encontrado la combinación correcta
  private fitrarGanadores() {
    // console.log('Comprobando si han ganado');
    var hanGanado: GenomaCamaleon[] = [];
    this.poblacion.forEach((genoma) => {
      genoma.actualizarAptitud(this.combinacionElegida);
      if (genoma.aptitud === this.combinacionElegida.length)
        hanGanado.push(genoma);
    });
    return hanGanado;
  }

  // EJECUCIÓN DEL ALGORITMO GENÉTICO
  // finds the combination
  async ejecutarCamaleonGenetico(): Promise<AptitudAlgoritmo> {
    this.ganador = new GenomaCamaleon();
    this.jugando = true;
    this.hasGanado = false;
    this.generacionActual = 0;

    // console.log('Ejecutando algoritmo genético');
    // Variables de control
    var generacionMaxima = 100;

    // Loop generacional
    while (
      this.generacionActual < generacionMaxima &&
      this.fitrarGanadores().length === 0
    ) {
      // Se ordenan según aptitud
      this.poblacion.sort((a, b) => b.aptitud - a.aptitud);

      //      Avanzar 1 generación
      var poblacionNueva: GenomaCamaleon[];
      poblacionNueva = this.mutar(
        this.cruzar(this.seleccionar(this.poblacion))
      );

      // Se añaden los mejores de la generación anterior
      // Acá deberían agregarse al azar de la generación anterior, no a los mejores
      var antiguosCandidatos = this.poblacionMaxima - poblacionNueva.length;
      poblacionNueva = poblacionNueva.concat(
        this.poblacion.slice(0, antiguosCandidatos)
      );

      this.poblacion = poblacionNueva;
      this.generacionActual++;
    //   this.logEstadoActual(this.poblacion);

      await sleep(100);
    }

    if (this.fitrarGanadores().length > 0) {
      this.hasGanado = true;
      this.ganador = this.fitrarGanadores()[0];
      // console.log('La computadora ha encontrado tu clave y es la siguiente :');
      // console.log(
      //   this.ganador.combinacion.map((color) => color.emoji).join('')
      // );
    }
    {
      // console.log("La computadora no ha encontrado tu clave");
    }
    this.jugando = false;

    return {
      totalGeneraciones: this.generacionActual,
      success: this.hasGanado ? 1 : 0,
    };
  }

  // * * * * * * * * * * * * * * * * * *
  // ETAPAS DEL ALGORITMO GENÉTICO
  private generarPoblacionInicial() {
    // console.log('Generando población inicial');
    var poblacion: GenomaCamaleon[] = [];

    for (let index = 0; index < this.poblacionMaxima; index++) {
      var genoma: GenomaCamaleon = new GenomaCamaleon();
      // Generación de combinación aleatoria
      for (let index = 0; index < this.combinacionElegida.length; index++) {
        var random = (Math.random() * 100) % CAMALEON_CONST.colores.length;
        genoma.combinacion.push(CAMALEON_CONST.colores[Math.floor(random)]);
      }
      poblacion.push(genoma);
    }
    return poblacion;
  }
  private seleccionar(poblacion: GenomaCamaleon[]) {
    // console.log('Realizando selección de individuos');
    var poblacionSeleccionada: GenomaCamaleon[] = [];
    var totalAptitud = 0;
    poblacion.forEach((genoma) => {
      totalAptitud += genoma.aptitud;
    });
    // Algoritmo de la ruleta
    // 1. Calcular el percentil acumulado de cada individuo
    var percentilAcumulado: number[] = [poblacion[0].aptitud / totalAptitud];
    for (var i = 1; i < poblacion.length; i++) {
      percentilAcumulado.push(
        percentilAcumulado[i - 1] + poblacion[i].aptitud / totalAptitud
      );
    }
    while (
      poblacionSeleccionada.length <
      this.poblacionMaxima * this.indiceSeleccion
    ) {
      // 2. Generar un número aleatorio entre 0 y 1
      var random = Math.random();
      var index = 0;
      var indiceSeleccionado = 0;
      // 3. Buscar el individuo correspondiente al percentil
      while (random < percentilAcumulado[index]) {
        indiceSeleccionado = index;
        index++;
      }
      poblacionSeleccionada.push(poblacion[indiceSeleccionado]);
      // 4. Repetir hasta tener la población seleccionada
    }
    return poblacionSeleccionada;
  }
  private cruzar(poblacionSeleccionada: GenomaCamaleon[]) {
    // console.log('Cruzando individuos');
    var poblacionCruzada: GenomaCamaleon[] = [];

    while (poblacionSeleccionada.length > 2) {
      // Selección de individuos a cruzar (par random)
      var indicePrimerCandidato =
        (Math.random() * 100) % poblacionSeleccionada.length;
      var primerCandidato: GenomaCamaleon = poblacionSeleccionada.splice(
        indicePrimerCandidato,
        1
      )[0];
      var indiceSegundoCandidato =
        (Math.random() * 100) % poblacionSeleccionada.length;
      var segundoCandidato: GenomaCamaleon = poblacionSeleccionada.splice(
        indiceSegundoCandidato,
        1
      )[0];

      var genoma1 = new GenomaCamaleon();
      var genoma2 = new GenomaCamaleon();

      // Algoritmo de cruce de colores (máscara binaria aleatoria)
      for (var j = 0; j < this.combinacionElegida.length; j++) {
        if (Math.random() < 0.5) {
          genoma1.combinacion[j] = primerCandidato.combinacion[j];
          genoma2.combinacion[j] = segundoCandidato.combinacion[j];
        } else {
          genoma1.combinacion[j] = segundoCandidato.combinacion[j];
          genoma2.combinacion[j] = primerCandidato.combinacion[j];
        }
      }
      poblacionCruzada.push(genoma1, genoma2);
    }
    return poblacionCruzada;
  }
  private mutar(poblacionCruzada: GenomaCamaleon[]) {
    // console.log('Mutando individuos');
    poblacionCruzada.forEach((genoma) => {
      for (let index = 0; index < this.combinacionElegida.length; index++) {
        if (Math.random() < this.indiceMutacion) {
          var random = (Math.random() * 100) % CAMALEON_CONST.colores.length;
          genoma.combinacion[index] =
            CAMALEON_CONST.colores[Math.floor(random)];
        }
      }
    });
    return poblacionCruzada;
  }
}

