import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { sleep } from '../structs/structs';

@Component({
  selector: 'app-presentacion',
  templateUrl: './presentacion.component.html',
  styleUrls: ['./presentacion.component.css']
})
export class PresentacionComponent implements OnInit {

  constructor(private router : Router) { }

  ngOnInit(): void {
  }

  async routeTo( route : string ){
    // await sleep(150);
    this.router.navigate([route]);
  }
}
