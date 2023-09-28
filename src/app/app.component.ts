import { Component } from '@angular/core';
import { Color, Genoma } from './structs/structs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'CamaleonGenetico';

  amarillo : Color =  { nombre : 'amarillo',  emoji : '🟡' };
  azul : Color =      { nombre : 'azul',      emoji : '🔵' };
  rojo : Color =      { nombre : 'rojo',      emoji : '🔴' };
  verde : Color =     { nombre : 'verde',     emoji : '🟢' };
  lila : Color =      { nombre : 'lila',      emoji : '🟣' };

  colores : Color[] = [this.amarillo, this.azul, this.rojo, this.verde, this.lila];
  
  // Lista de colores
  genoma : Genoma = { combinacion : [], aptitud : 0};

  combinacionElegida = [this.amarillo, this.azul, this.rojo, this.verde, this.lila];
  
  // Reglas del juego
  constanteSize = 5;
  constanteColores = 5;
  
  // Configuración algoritmo genético
  poblacion = 10;
  indiceMutacion = 0.05;
  indiceSeleccion = 0.7; // porcentaje que dejamos de la población anterior
  generaciones = 100;
  pesoPosicionAptitud = 1;
  pesoColorAptitud = 1;
  
  // Función para calcular la aptitud de un genoma
  aptitudPosicionCorrecta(genoma : Genoma){
    var aptitud = 0;
    this.combinacionElegida.forEach((color, index) => {
      if (genoma.combinacion[index] === color) {
        aptitud++;
      }
    });
    return aptitud;
  }
  aptitudColoresCorrectos(genoma : Genoma){
    var aptitud = 0;
    genoma.combinacion.forEach(color => {
      if(this.combinacionElegida.includes(color)){
        aptitud++;
      }
    })
    return aptitud;
  }
  actualizarAptitud( genoma : Genoma){
    console.log("Actualizando aptitud");
    genoma.aptitud = this.pesoPosicionAptitud*this.aptitudPosicionCorrecta(genoma) + this.pesoColorAptitud*this.aptitudColoresCorrectos(genoma);
  }
  
  // Función para generar una población inicial aleatoria
  generarPoblacionInicial() {
    console.log("Generando población inicial");
    var poblacion : Genoma[] = [];

    for (let index = 0; index < this.poblacion; index++) {
      var genoma : Genoma = { combinacion : [], aptitud : 0 };
      for (let index = 0; index < this.constanteSize; index++) {
        var random = Math.random()*100 % this.constanteColores;
        genoma.combinacion.push(this.colores[Math.floor(random)]);
      }
      poblacion.push(genoma);
    }
    return poblacion;
  }
  // Función para seleccionar individuos para la siguiente generación
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
    while(poblacionSeleccionada.length < this.poblacion*this.indiceSeleccion){
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
  // Función para cruzar individuos seleccionados
  cruzar(poblacionSeleccionada : Genoma[]) {
    console.log("Cruzando individuos");
    var poblacionCruzada : Genoma[] = [];

    while(poblacionSeleccionada.length > 2){
      // Selección de individuos a cruzar
      
      var indicePrimerCandidato = Math.random()*100 % poblacionSeleccionada.length;
      var primerCandidato : Genoma = poblacionSeleccionada.splice(indicePrimerCandidato, 1)[0];
      var indiceSegundoCandidato = Math.random()*100 % poblacionSeleccionada.length;
      var segundoCandidato : Genoma = poblacionSeleccionada.splice(indiceSegundoCandidato, 1)[0];
      
      var genoma1 : Genoma = { combinacion : [], aptitud : 0 };
      var genoma2 : Genoma = { combinacion : [], aptitud : 0 };
      
      
      // console.log("1- Primer candidato : " + primerCandidato + "\n");
      // console.log("2- Segundo candidato : " + segundoCandidato + "\n");
        
        // Algoritmo de cruce de colores
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
  // Función para aplicar mutaciones a la población
  mutar(poblacionCruzada : Genoma[]) {
    console.log("Mutando individuos");
    poblacionCruzada.forEach(genoma => {
      for (let index = 0; index < this.constanteSize; index++) {
        if(Math.random()<this.indiceMutacion){
          var random = Math.random()*100 % this.constanteColores;
          genoma.combinacion[index] = this.colores[Math.floor(random)];
        }
      }
    })
    return poblacionCruzada;
  }
  // Función para verificar si se ha encontrado la combinación correcta
  hanGanado(poblacion : Genoma[]) {
    console.log("Comprobando si han ganado");
    var hanGanado : Genoma[] = [];
    poblacion.forEach( (genoma) => {
      this.actualizarAptitud(genoma);
        if(genoma.aptitud === this.constanteSize * this.pesoPosicionAptitud + this.constanteSize * this.pesoColorAptitud){
          hanGanado.push(genoma);
        }
      }
    );
    return hanGanado;
  }

  // Función para ejecutar el algoritmo genético
  ejecutarAlgoritmoGenetico() {
    console.log("Ejecutando algoritmo genético");
    // Variables de control
    var generacionActual = 0;
    var generacionMaxima = 100;
    var poblacionMinima = 100;
    var poblacionActual = this.generarPoblacionInicial();

    // loop de generaciones
    while(generacionActual < generacionMaxima){
      this.hanGanado(poblacionActual);
      // Se ordenan según aptitud
      poblacionActual.sort((a, b) => b.aptitud - a.aptitud);
      
      var poblacionNueva = this.seleccionar(poblacionActual);
      if(!poblacionNueva.every((element) => element !== undefined))
      console.log("undefined en seleccionar");
    
    
    poblacionNueva = this.cruzar(poblacionNueva);
    if(!poblacionNueva.every((element) => element !== undefined))
    console.log("undefined en cruzar");
  
  
    poblacionNueva = this.mutar(poblacionNueva);
    if(!poblacionNueva.every((element) => element !== undefined))
      console.log("undefined en mutar");
        
      
      if(poblacionNueva.length < poblacionMinima){
        var antiguosCandidatos = poblacionMinima - poblacionNueva.length;
        poblacionNueva = poblacionNueva.concat(poblacionActual.slice(0, antiguosCandidatos));
      }
      poblacionActual = poblacionNueva;
      generacionActual++;
      console.log(
        "Generación " + generacionActual + "\n"
        + "--------------------------------------\n"
        + "Mejores candidatos: \n"
        + poblacionActual.slice(0, 5).map(genoma => genoma.combinacion.map(color => color.emoji).join('')).join('\n'));
    }
    // Implementa el ciclo de generaciones y lógica principal del algoritmo genético aquí
  }

  avanzar = false;
  
}
