import { Component } from '@angular/core';
import { AptitudAlgoritmo, CAMALEON_CONST, Color, GenomaAlgoritmo, GenomaCamaleon } from './structs/structs';

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title() { return 'Camaleon Genetico'}
}
