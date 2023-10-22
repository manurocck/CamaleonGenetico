import { Component, Input, OnInit } from '@angular/core';
import { GenomaCamaleon, _FASE } from 'src/app/structs/structs';

@Component({
  selector: 'app-crossover',
  templateUrl: './crossover.component.html',
  styleUrls: ['./crossover.component.css']
})
export class CrossoverComponent implements OnInit {

  constructor() {
   }

  ngOnInit(): void { }

  @Input() poblacionParaMostrar: {poblacion: GenomaCamaleon[], seleccionados : number[]} = {poblacion: [], seleccionados: []};
  @Input() poblacionCruzada: GenomaCamaleon[] = [];
}
