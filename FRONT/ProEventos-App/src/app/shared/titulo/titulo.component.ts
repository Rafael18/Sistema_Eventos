import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-titulo',
  templateUrl: './titulo.component.html',
  styleUrls: ['./titulo.component.css']
})
export class TituloComponent implements OnInit {

  @Input() titulo = 'Informe o titulo';
  @Input() iconClass = 'fa fa-user';
  @Input() subtitulo = 'Desde 2024';
  @Input() botaoListar = false;

  constructor( private router: Router) { }

  ngOnInit():void {
    // this.listar();
  }

  listar(): void{
    this.router.navigate([`/${this.titulo.toLocaleLowerCase()}/lista`]);
  }

}
