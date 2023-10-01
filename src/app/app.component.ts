import { Component } from '@angular/core';
import { CAMALEON_CONST, Color, Genoma } from './structs/structs';

const sleep = (ms:number) => new Promise(r => setTimeout(r, ms));

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  combinacionElegida : Color[] = [];
  hasGanado = false;
  jugando = false;
  
  // Reglas del juego
  constanteSize = 5;
  constanteColores = 5;
  
  // Configuración algoritmo genético
  poblacionMaxima = 10;
  indiceMutacion = 0.05;
  indiceSeleccion = 0.7; // porcentaje que dejamos de la población anterior
  generaciones = 100;
  pesoPosicionAptitud = 1;
  pesoColorAptitud = 0;
  
  // Condiciones iniciales
  generacionActual = 0;
  poblacionParaMostrar : Genoma[] = [];
  ganador : Genoma = new Genoma();

  // Verifica si se ha encontrado la combinación correcta
  fitrarGanadores(poblacion : Genoma[]) {
    console.log("Comprobando si han ganado");
    var hanGanado : Genoma[] = [];
    poblacion.forEach( (genoma) => {
      genoma.actualizarAptitud(this.combinacionElegida);
        if(genoma.aptitud === this.constanteSize * this.pesoPosicionAptitud + this.constanteSize * this.pesoColorAptitud){
          hanGanado.push(genoma);
        }
      }
    );
    return hanGanado;
  }
  
  // * * * * * * * * * * * * * * * * * *
  // ETAPAS DEL ALGORITMO GENÉTICO
  generarPoblacionInicial() {
    console.log("Generando población inicial");
    var poblacion : Genoma[] = [];

    for (let index = 0; index < this.poblacionMaxima; index++) {
      var genoma : Genoma = new Genoma();
      // Generación de combinación aleatoria
      for (let index = 0; index < this.constanteSize; index++) {
        var random = Math.random()*100 % this.constanteColores;
        genoma.combinacion.push(CAMALEON_CONST.colores[Math.floor(random)]);
      }
      poblacion.push(genoma);
    }
    return poblacion;
  }
  seleccionar(poblacion : Genoma[]) {
    console.log("Realizando selección de individuos");
    var poblacionSeleccionada : Genoma[] = [];
    var totalAptitud = 0;
    poblacion.forEach(genoma => {
      totalAptitud += genoma.aptitud;
    });
    // Algoritmo de la ruleta
    // 1. Calcular el percentil acumulado de cada individuo
    var percentilAcumulado : number[] = [poblacion[0].aptitud/totalAptitud];
    for(var i = 1 ; i < poblacion.length ; i++){
        percentilAcumulado.push(
          percentilAcumulado[i-1] +
          poblacion[i].aptitud/totalAptitud
        );
    }
    while(poblacionSeleccionada.length < this.poblacionMaxima*this.indiceSeleccion){
      // 2. Generar un número aleatorio entre 0 y 1
      var random = Math.random();
      var index = 0;
      var indiceSeleccionado = 0;
      // 3. Buscar el individuo correspondiente al percentil
      while(random < percentilAcumulado[index]){
        indiceSeleccionado = index;
        index++;
      }
      poblacionSeleccionada.push(poblacion[indiceSeleccionado]);
      // 4. Repetir hasta tener la población seleccionada
    }
    return poblacionSeleccionada;
  }
  cruzar(poblacionSeleccionada : Genoma[]) {
    console.log("Cruzando individuos");
    var poblacionCruzada : Genoma[] = [];

    while(poblacionSeleccionada.length > 2){
     
      // Selección de individuos a cruzar (par random)
      var indicePrimerCandidato = Math.random()*100 % poblacionSeleccionada.length;
      var primerCandidato : Genoma = poblacionSeleccionada.splice(indicePrimerCandidato, 1)[0];
      var indiceSegundoCandidato = Math.random()*100 % poblacionSeleccionada.length;
      var segundoCandidato : Genoma = poblacionSeleccionada.splice(indiceSegundoCandidato, 1)[0];
      
      var genoma1 = new Genoma();
      var genoma2 = new Genoma();

      // Algoritmo de cruce de colores (máscara binaria aleatoria)
      for( var j = 0 ; j < this.constanteSize ; j++){
        if(Math.random()<0.5){
          genoma1.combinacion[j] = primerCandidato.combinacion[j];
          genoma2.combinacion[j] = segundoCandidato.combinacion[j];
        }else{
          genoma1.combinacion[j] = segundoCandidato.combinacion[j];
          genoma2.combinacion[j] = primerCandidato.combinacion[j];
        }
      }
      poblacionCruzada.push(genoma1, genoma2);
    }
    return poblacionCruzada;
  }
  mutar(poblacionCruzada : Genoma[]) {
    console.log("Mutando individuos");
    poblacionCruzada.forEach(genoma => {
      for (let index = 0; index < this.constanteSize; index++) {
        if(Math.random()<this.indiceMutacion){
          var random = Math.random()*100 % this.constanteColores;
          genoma.combinacion[index] = CAMALEON_CONST.colores[Math.floor(random)];
        }
      }
    })
    return poblacionCruzada;
  }
 
  // EJECUCIÓN DEL ALGORITMO GENÉTICO
  async ejecutarAlgoritmoGenetico() {
    // Inicializar variables
    this.ganador = new Genoma();
    this.jugando = true;
    this.hasGanado = false;
    this.generacionActual = 0;
    
    console.log("Ejecutando algoritmo genético");
    // Variables de control
    var generacionMaxima = 100;
    var poblacionActual = this.generarPoblacionInicial();

    // Loop de generaciones
    while(this.generacionActual < generacionMaxima && this.fitrarGanadores(poblacionActual).length === 0){
      // Se ordenan según aptitud
      poblacionActual.sort((a, b) => b.aptitud - a.aptitud);
      
      var poblacionNueva = this.mutar(this.cruzar(this.seleccionar(poblacionActual)));
      
      // Se añaden los mejores de la generación anterior
      var antiguosCandidatos = this.poblacionMaxima - poblacionNueva.length;
      poblacionNueva = poblacionNueva.concat(poblacionActual.slice(0, antiguosCandidatos));

      poblacionActual = poblacionNueva;
      this.generacionActual++;
      this.logEstadoActual(poblacionActual);
      
      // await sleep(1000);
    }
    
    if(this.fitrarGanadores(poblacionActual).length > 0){
      this.hasGanado = true;
      this.ganador = this.fitrarGanadores(poblacionActual)[0];
      console.log("La computadora ha encontrado tu clave y es la siguiente :");
      console.log(this.ganador.combinacion.map(color => color.emoji).join(''));
    }
    this.jugando = false;
  }

  logEstadoActual(poblacionActual : Genoma[]){
    this.poblacionParaMostrar = poblacionActual.slice(0, 5);
    console.log(
      "Generación " + this.generacionActual + "\n"
      + "--------------------------------------\n"
      + "Mejores candidatos: \n"
      + poblacionActual.slice(0, 5).map(genoma => genoma.combinacion.map(color => color.emoji).join('')).join('\n'));
  }
}
