import { Component } from '@angular/core';
import {
  AptitudAlgoritmo,
  CAMALEON_CONST,
  Color,
  GenomaCamaleon,
  GenomaConfiguracion,
  _FASE,
  sleep,
} from 'src/app/structs/structs';
import { StateService } from '../state.service';


@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css'],
})
export class InicioComponent {
  constructor(private stateService: StateService) {}
  
  SLEEP_FACTOR = 0;

  // Configuración algoritmo genético
  poblacionMaxima = 30;

  // Variables de juego
  defaultConfiguration: GenomaConfiguracion = {
    selectionIndex: 0.7,
    mutationIndex: 0.05,
    resultado: {
      ganador: new GenomaCamaleon(),
      totalGeneraciones: 0,
      success: 0,
    },
    generacionActual: 0
  };
  // Variables de interfaz
  fase = _FASE.start;
  combinacionElegida: Color[] = [];
  hasGanado = false;
  jugando = false;
  colores = CAMALEON_CONST.colores;
  colorSeleccionado = 0;
  // Interfaz de juego x ray
  poblacionCruzadaParaMostrar: GenomaCamaleon[] = [];
  poblacionParaMostrar: {poblacion: GenomaCamaleon[], seleccionados : number[]} = {poblacion: [], seleccionados: []};
  poblacionActual: GenomaCamaleon[] = [];
  
  

  cambiarColorSeleccionado(color: Color) {
    this.combinacionElegida[this.colorSeleccionado] = color;
  }
  eliminarColorSeleccionado(i: number) {
    if (this.jugando) return;
    this.combinacionElegida.splice(i, 1);
  }
  addColorSeleccionado(color: Color) {
    if (this.jugando) return;
    this.combinacionElegida.push(color);
  }

  // MAIN FUNCTIONS
  async runCamaleonGenetico( configuracion: GenomaConfiguracion ): Promise<AptitudAlgoritmo> {
    // Variables de control
    var generacionMaxima = 100;
    var poblacionActual = this.generarPoblacionInicial();
    var hayGanador = false;

    // Loop generacional
    while (configuracion.generacionActual < generacionMaxima && this.fitrarGanadores(poblacionActual).length === 0) {
      // Se ordenan según aptitud
      poblacionActual.sort((a, b) => b.aptitud - a.aptitud);
      // Individuo con mejor función de aptitud
      console.log('Generación ' + configuracion.generacionActual+" mejor aptitud : "+poblacionActual[0].aptitud);

      // Avanzar 1 generación
      var poblacionNueva: GenomaCamaleon[];
      poblacionNueva = await this.mutar(configuracion.mutationIndex, 
                       await this.cruzar(
                       await this.seleccionar(configuracion.selectionIndex, poblacionActual)));
      
      // Se añaden los mejores de la generación anterior
      // Acá deberían agregarse al azar de la generación anterior, no a los mejores
      var antiguosCandidatos = this.poblacionMaxima - poblacionNueva.length;
      poblacionNueva = poblacionNueva.concat( poblacionActual.slice(0, antiguosCandidatos) );
      poblacionActual = poblacionNueva;

      configuracion.generacionActual++;
      await sleep(this.SLEEP_FACTOR*2000);
    }
    
    if (this.fitrarGanadores(poblacionActual).length > 0) {
      hayGanador = true;
      this.hasGanado = true;
      configuracion.resultado.ganador = this.fitrarGanadores(poblacionActual)[0];
      // Individuo con mejor función de aptitud
      console.log('Generación ' + configuracion.generacionActual+" mejor aptitud : "+configuracion.resultado.ganador.aptitud);
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
      ganador : configuracion.resultado.ganador,
      totalGeneraciones: configuracion.generacionActual,
      success: hayGanador ? 1 : 0,
    };
  }
  async runProgramaGenetico() {
    var poblacionPrograma = 5; // Cantidad de alternativas de configuración que se van a probar
    var iteraciones = 100; // Cantidad de veces que se va a correr el programa con cada configuración

    var poblacion: GenomaConfiguracion[] = [];
    poblacion.push(this.defaultConfiguration);

    // Inicializo el juego con una configuración random
    for (let i = 0; i < poblacionPrograma; i++) {
      var genomaPrograma: GenomaConfiguracion = {
        selectionIndex: Math.random(),
        mutationIndex: Math.random(),
        resultado: {
          totalGeneraciones: 0,
          success: 0,
          ganador: new GenomaCamaleon()
        },
        generacionActual: 0
      };
      // genomaPrograma.crossOverIndex = 0.2;
      poblacion.push(genomaPrograma);
    }

    // Darle un puntaje a cada corrida de programa
    poblacion.forEach(async (altParametros, index) => {
      var sumaCorridas = 0;
      var sumaExitos = 0;
      console.log(index+1+'>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>');
      console.log(index+1+'>>>>>>> CORRIDA NÚMERO <' + (index + 1) + '>');
      console.log(index+1+'>>>> PARÁMETROS UTILIZADOS');
      console.log(index+1+'>>> Selection Index : '+altParametros.selectionIndex);
      console.log(index+1+'>>> Mutation Index  : '+altParametros.mutationIndex);
      for (let i = 0; i < iteraciones; i++) {
        altParametros.generacionActual = 0;
        altParametros.resultado.ganador = new GenomaCamaleon();
        var funcionAptitud = await this.runCamaleonGenetico(altParametros);
        sumaCorridas += funcionAptitud.totalGeneraciones;
        sumaExitos   += funcionAptitud.success;
        console.log(index+1+'> Llegué hasta la generación '+funcionAptitud.totalGeneraciones);
        if(funcionAptitud.success == 1)
        console.log(index+1+'> Combinación ganadora: '+altParametros.resultado.ganador.combinacion.map((color) => color.emoji).join(''));
        else 
        console.log(index+1+'> No se encontró la combinación');
      }
      altParametros.resultado.success = sumaExitos != 0 ? sumaExitos / iteraciones : 0;
      altParametros.resultado.totalGeneraciones = sumaCorridas != 0 ? sumaCorridas / iteraciones : 0;

      console.log(index+1+'>>>> RESULTADOS');
      console.log(index+1+'>>> Total de exitos (over '+iteraciones+'): ' + sumaExitos);
      if (sumaCorridas != 0)
      console.log(index+1+'>>> Promedio de generaciones : ' + sumaCorridas / iteraciones);
      else 
      console.log(index+1+'>>> Promedio de generaciones : 0');
    });

    // Cross over the best individuals
    poblacion.sort(
      (a, b) =>
        b.resultado.success * b.resultado.totalGeneraciones -
        a.resultado.success * a.resultado.totalGeneraciones
    );
    // var poblacionNueva: GenomaConfiguracion[] = [];

    // Mutate the individuals

    // y repetir
  }

  // Verifica si se ha encontrado la combinación correcta
  fitrarGanadores(poblacion: GenomaCamaleon[]) {
    // console.log('Comprobando si han ganado');
    var hanGanado: GenomaCamaleon[] = [];
    poblacion.forEach((genoma) => {
      genoma.actualizarAptitud(this.combinacionElegida);
      if(genoma.esGanador(this.combinacionElegida.length)){
        hanGanado.push(genoma);
      }
    });
    return hanGanado;
  }

  
  generarPoblacionInicial(){
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
  
  async seleccionar(indiceSeleccion : number, poblacion: GenomaCamaleon[]) {
    // console.log('Seleccionando individuos');
    this.fase = _FASE.selection;
    this.poblacionParaMostrar = { poblacion: poblacion, seleccionados: []};

    var poblacionSeleccionada: GenomaCamaleon[] = [];
    
    // Algoritmo de la ruleta
    // 1. Calcular el percentil acumulado de cada individuo
    var totalAptitud = poblacion.map((genoma) => genoma.aptitud).reduce((a, b) => a + b, 0);
    var percentilAcumulado: number[] = [poblacion[0].aptitud / totalAptitud];
    for (var i = 1; i < poblacion.length; i++) {
      percentilAcumulado.push(
        percentilAcumulado[i - 1] + poblacion[i].aptitud / totalAptitud
      );
    }
    // console.log("Percentil Acumulado");
    // console.log(percentilAcumulado);
    while ( poblacionSeleccionada.length < (this.poblacionMaxima * indiceSeleccion) ) {
      let random = Math.random();
      // console.log("Random : "+random);
      // 2. Buscar el individuo correspondiente al percentil
      let primerMayor = false;
      var indiceSeleccionado = 0;
      for(let i = 0 ; i< percentilAcumulado.length; i++){
        if(random < percentilAcumulado[i]){
          if(!primerMayor){
            indiceSeleccionado = i;
            primerMayor = true;
          }
        }else{
          indiceSeleccionado = i;
        }
      }
      // console.log("Indice seleccionado : "+indiceSeleccionado);
      
      this.poblacionParaMostrar.seleccionados.push(indiceSeleccionado);
      await sleep(this.SLEEP_FACTOR*5000/this.poblacionMaxima);
      poblacionSeleccionada.push(poblacion[indiceSeleccionado]);
      // 3. Repetir hasta tener la población seleccionada
    }
    return poblacionSeleccionada;
  }
  async cruzar(poblacionSeleccionada: GenomaCamaleon[]) {
    this.fase = _FASE.crossover;
    // console.log('Cruzando individuos');
    this.poblacionParaMostrar.poblacion = [];
    // console.log("Cruzando un total de "+poblacionSeleccionada.length+" individuos");

    var poblacionCruzada: GenomaCamaleon[] = [];

    while (poblacionSeleccionada.length >= 2) {
      this.poblacionCruzadaParaMostrar = [];
      this.poblacionParaMostrar = { poblacion:[], seleccionados: []};
      // Selección de individuos a cruzar (par random)
      var indicePrimerCandidato = Math.floor((Math.random() * 100) % poblacionSeleccionada.length);
      var primerCandidato: GenomaCamaleon = poblacionSeleccionada.splice(indicePrimerCandidato, 1)[0];
      var indiceSegundoCandidato = Math.floor((Math.random() * 100) % poblacionSeleccionada.length);
      var segundoCandidato: GenomaCamaleon = poblacionSeleccionada.splice(indiceSegundoCandidato,1)[0];
      
      this.poblacionParaMostrar.seleccionados.push(indicePrimerCandidato, indiceSegundoCandidato);
      this.poblacionParaMostrar.poblacion.push(primerCandidato, segundoCandidato);
      // console.log("Se seleccionaron para cruzar a los individuos: "+indicePrimerCandidato+" y "+indiceSegundoCandidato);

      // Cruzamiento binario de colores (máscara binaria aleatoria)
      var genoma1 = new GenomaCamaleon();
      var genoma2 = new GenomaCamaleon();
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
      this.poblacionCruzadaParaMostrar.push(genoma1, genoma2);
      await sleep(this.SLEEP_FACTOR*6000/(this.poblacionMaxima/3));
    }

    this.poblacionCruzadaParaMostrar = [];
    return poblacionCruzada;
  }
  async mutar(indiceMutacion:number, poblacionCruzada: GenomaCamaleon[]) {
    this.fase = _FASE.mutation;
    // console.log('Mutando individuos');
    poblacionCruzada.forEach(async (genoma) => {
      for (let index = 0; index < this.combinacionElegida.length; index++) {
        if (Math.random() < indiceMutacion) {
          var random = Math.floor((Math.random() * 100) % CAMALEON_CONST.colores.length);
          if(genoma.combinacion[index] == CAMALEON_CONST.colores[Math.floor(random)]){
            random = (random + 1) % CAMALEON_CONST.colores.length;
          }
          genoma.combinacion[index] = CAMALEON_CONST.colores[Math.floor(random)];
        }
      }
      await sleep(this.SLEEP_FACTOR*2000/this.poblacionMaxima);
    });
    return poblacionCruzada;
  }
}
