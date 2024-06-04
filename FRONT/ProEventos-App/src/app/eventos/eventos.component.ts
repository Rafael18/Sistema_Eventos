import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-eventos',
  templateUrl: './eventos.component.html',
  styleUrls: ['./eventos.component.scss']
})
export class EventosComponent implements OnInit {

  public eventos: any = [];
  public eventosFiltrados: any = [];

  larguraImagem: number = 150;
  margemImagem: number = 2;
  exibirImagem: boolean = true;

  private _filtrolista: string = '';

  public get filtrolista(): string {
    return this._filtrolista;
  }

  public set filtrolista(value: string) {
    this._filtrolista = value;

    this.eventosFiltrados = this.filtrolista ? this.filtrarEventos(this.filtrolista) : this.eventos;
  }

  filtrarEventos(filtrarPor: string): any {
    filtrarPor = filtrarPor.toLocaleLowerCase();
    return this.eventos.filter(
     ( evento: any) => evento.tema.toLocaleLowerCase().indexOf(filtrarPor) !== -1 || 
       evento.local.toLocaleLowerCase().indexOf(filtrarPor) !== -1
    )
  }

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.getEventos();
  }

  alterarImagem(){
    this.exibirImagem = !this.exibirImagem;
  }

  public getEventos(): void {

    this.http.get('http://localhost:5233/api/eventos').subscribe(
      response => {
        this.eventos = response,
        this.eventosFiltrados = response
        
      },
      error => console.log(error)
    );
  }
}
