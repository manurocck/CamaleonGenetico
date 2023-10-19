import { Component } from '@angular/core';
import { AptitudAlgoritmo, CAMALEON_CONST, Color, GenomaAlgoritmo, GenomaCamaleon, sleep} from './structs/structs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  combinacionElegida: Color[] = [];
  hasGanado = false;
  jugando = false;

  // Reglas del juego
  constanteColores = 6;

  // Configuración algoritmo genético
  poblacionMaxima = 10;
  indiceMutacion = 0.05;
  indiceSeleccion = 0.7; // porcentaje que dejamos de la población anterior
  generaciones = 100;
  pesoPosicionAptitud = 1;
  pesoColorAptitud = 0;

  // Condiciones iniciales
  generacionActual = 0;
  poblacionParaMostrar: GenomaCamaleon[] = [];
  ganador: GenomaCamaleon = new GenomaCamaleon();

  // Verifica si se ha encontrado la combinación correcta
  fitrarGanadores(poblacion: GenomaCamaleon[]) {
    // console.log('Comprobando si han ganado');
    var hanGanado: GenomaCamaleon[] = [];
    poblacion.forEach((genoma) => {
      genoma.actualizarAptitud(this.combinacionElegida);
      if (
        genoma.aptitud ===
        this.combinacionElegida.length * this.pesoPosicionAptitud +
          this.combinacionElegida.length * this.pesoColorAptitud
      ) {
        hanGanado.push(genoma);
      }
    });
    return hanGanado;
  }

  // * * * * * * * * * * * * * * * * * *
  // ETAPAS DEL ALGORITMO GENÉTICO
  generarPoblacionInicial() {
    // console.log('Generando población inicial');
    var poblacion: GenomaCamaleon[] = [];

    for (let index = 0; index < this.poblacionMaxima; index++) {
      var genoma: GenomaCamaleon = new GenomaCamaleon();
      // Generación de combinación aleatoria
      for (let index = 0; index < this.combinacionElegida.length; index++) {
        var random = (Math.random() * 100) % this.constanteColores;
        genoma.combinacion.push(CAMALEON_CONST.colores[Math.floor(random)]);
      }
      poblacion.push(genoma);
    }
    return poblacion;
  }
  seleccionar(poblacion: GenomaCamaleon[]) {
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
  cruzar(poblacionSeleccionada: GenomaCamaleon[]) {
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
  mutar(poblacionCruzada: GenomaCamaleon[]) {
    // console.log('Mutando individuos');
    poblacionCruzada.forEach((genoma) => {
      for (let index = 0; index < this.combinacionElegida.length; index++) {
        if (Math.random() < this.indiceMutacion) {
          var random = (Math.random() * 100) % this.constanteColores;
          genoma.combinacion[index] =
            CAMALEON_CONST.colores[Math.floor(random)];
        }
      }
    });
    return poblacionCruzada;
  }

  // EJECUCIÓN DEL ALGORITMO GENÉTICO
  // finds the combination
  async ejecutarCamaleonGenetico(configuracion : GenomaAlgoritmo) : Promise<AptitudAlgoritmo>{
    // Inicializar variables
    this.indiceSeleccion = configuracion.selectionIndex;
    this.indiceMutacion = configuracion.mutationIndex;

    this.ganador = new GenomaCamaleon();
    this.jugando = true;
    this.hasGanado = false;
    this.generacionActual = 0;

    // console.log('Ejecutando algoritmo genético');
    // Variables de control
    var generacionMaxima = 100;
    var poblacionActual = this.generarPoblacionInicial();

    // Loop generacional
    while (
      this.generacionActual < generacionMaxima &&
      this.fitrarGanadores(poblacionActual).length === 0
    ) {
      // Se ordenan según aptitud
      poblacionActual.sort((a, b) => b.aptitud - a.aptitud);

      //      Avanzar 1 generación 
      var poblacionNueva : GenomaCamaleon[];
      poblacionNueva =  this.mutar( this.cruzar( this.seleccionar(poblacionActual) ));

      // Se añaden los mejores de la generación anterior
      // Acá deberían agregarse al azar de la generación anterior, no a los mejores
      var antiguosCandidatos = this.poblacionMaxima - poblacionNueva.length;
      poblacionNueva = poblacionNueva.concat(
        poblacionActual.slice(0, antiguosCandidatos)
      );

      poblacionActual = poblacionNueva;
      this.generacionActual++;
      this.logEstadoActual(poblacionActual);

      await sleep(0);
    }

    if (this.fitrarGanadores(poblacionActual).length > 0) {
      this.hasGanado = true;
      this.ganador = this.fitrarGanadores(poblacionActual)[0];
      // console.log('La computadora ha encontrado tu clave y es la siguiente :');
      // console.log(
      //   this.ganador.combinacion.map((color) => color.emoji).join('')
      // );
    }{
      // console.log("La computadora no ha encontrado tu clave");
    }
    this.jugando = false;

    return {
      totalGeneraciones: this.generacionActual,
      success: this.hasGanado ? 1 : 0,
    }
  }

  async ejecutarProgramaGenetico(){
    var poblacionPrograma = 10;
    var poblacion : GenomaAlgoritmo[] = [];
    
    // Initialize population with random values
    for(let i=0; i<poblacionPrograma; i++){
      var genomaPrograma : GenomaAlgoritmo ={
        selectionIndex: Math.random(),
        mutationIndex: Math.random(),
        aptitud : {
          totalGeneraciones: 0, // promedioGeneraciones
          success: 0 //             succesRate
        }
      }
      // genomaPrograma.crossOverIndex = 0.2;
      poblacion.push(genomaPrograma);
    }

    // Give a score to each individual
    poblacion.forEach(async (altParametros,index) => {
      var sumaCorridas = 0;
      var sumaExitos = 0;
      console.log(">>>>>>>>>>>>>>>>>");
      console.log(">>>>> GENOMA NÚMERO <"+(index+1)+">");
      console.log((index+1)+">>>>> INFORMACIÓN DE PARTIDAS");
      for(let i = 0; i < 10; i++){
        var funcionAptitud  = await this.ejecutarCamaleonGenetico(altParametros);
        sumaCorridas += funcionAptitud.totalGeneraciones;
        sumaExitos += funcionAptitud.success;
        console.log((index+1)+"> Llegué hasta la generación " + funcionAptitud.totalGeneraciones);
      }
      altParametros.aptitud.success = (sumaExitos!=0)? sumaExitos/10 : 0;
      altParametros.aptitud.totalGeneraciones = (sumaCorridas!=0)? sumaExitos/10 : 0;
      
      console.log((index+1)+">>>>> RESULTADOS");
      console.log((index+1)+"> Total de exitos (over 10): " + sumaExitos);
      if(sumaCorridas!=0)
        console.log((index+1)+"> Promedio de generaciones : " + sumaCorridas/10);
      else 
        console.log((index+1)+"> Promedio de generaciones : 0");
      console.log((index+1)+">>>>> PARÁMETROS UTILIZADOS");
      console.log((index+1)+"> Selection Index : " + altParametros.selectionIndex);
      console.log((index+1)+"> Mutation Index :" + altParametros.mutationIndex);
    });

    // Cross over the best individuals
    poblacion.sort((a,b) => (b.aptitud.success*b.aptitud.totalGeneraciones) 
                          - (a.aptitud.success*a.aptitud.totalGeneraciones) );
    var poblacionNueva : GenomaAlgoritmo[] = [];


    
    // Mutate the individuals

    // y repetir
  }

  logEstadoActual(poblacionActual: GenomaCamaleon[]) {
    this.poblacionParaMostrar = poblacionActual.slice(0, 5);
    // console.log(
    //   'Generación ' +
    //     this.generacionActual +
    //     '\n' +
    //     '--------------------------------------\n' +
    //     'Mejores candidatos: \n' +
    //     poblacionActual
    //       .slice(0, 5)
    //       .map((genoma) =>
    //         genoma.combinacion.map((color) => color.emoji).join('')
    //       )
    //       .join('\n')
    // );
  }
}
