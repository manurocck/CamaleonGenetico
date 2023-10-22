import { Component, Input, OnInit} from '@angular/core';
import { GenomaCamaleon } from 'src/app/structs/structs';


@Component({
  selector: 'app-selection',
  templateUrl: './selection.component.html',
  styleUrls: ['./selection.component.css']
})
export class SelectionComponent implements OnInit {

  constructor () {}

  ngOnInit(): void { }
 
  @Input() poblacionParaMostrar: {poblacion: GenomaCamaleon[], seleccionados : number[]} = {poblacion: [], seleccionados: []};
}
