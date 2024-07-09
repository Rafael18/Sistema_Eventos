import { Component, OnInit, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Evento } from 'src/app/models/Evento';

import { EventoService } from '../../services/evento.service'

@Component({
  selector: 'app-evento-lista',
  templateUrl: './evento-lista.component.html',
  styleUrls: ['./evento-lista.component.scss']
})
export class EventoListaComponent implements OnInit {

  modalRef?: BsModalRef;
  public eventos: Evento[] = [];
  public eventosFiltrados: any = [];
  public eventoId = 0;

  public larguraImagem: number = 150;
  public margemImagem: number = 2;
  public exibirImagem: boolean = true;

  private filtroListado: string = '';

  public get filtrolista(): string {
    return this.filtroListado;
  }

  public set filtrolista(value: string) {
    this.filtroListado = value;

    this.eventosFiltrados = this.filtrolista ? this.filtrarEventos(this.filtrolista) : this.eventos;
  }

  filtrarEventos(filtrarPor: string): Evento[] {
    filtrarPor = filtrarPor.toLocaleLowerCase();
    return this.eventos.filter(
     ( evento: Evento) => evento.tema.toLocaleLowerCase().indexOf(filtrarPor) !== -1 || 
       evento.local.toLocaleLowerCase().indexOf(filtrarPor) !== -1
    )
  }

  constructor(
      private EventoService: EventoService,
      private modalService: BsModalService,
      private toastr: ToastrService,
      private spinner: NgxSpinnerService,
      private router: Router
  ) { }

  public ngOnInit(): void {
    /** spinner starts on init */
    this.spinner.show();
    this.carregarEventos();
  }

  public alterarImagem(): void{
    this.exibirImagem = !this.exibirImagem;
  }

  public carregarEventos(): void {

    this.EventoService.getEventos().subscribe({
      next: (eventoResp: Evento[]) => {
        this.eventos = eventoResp;
        this.eventosFiltrados = this.eventos;
      },
      error: (error: any) => {
        this.spinner.hide();
        this.toastr.error('Erro ao carregar os Eventos','Sistema informa:')
      },
      complete: () => this.spinner.hide()
    });
  }

   
  openModal(event: any, template: TemplateRef<any>, eventoId: number): void {
    event.stopPropagation();
    this.eventoId = eventoId;
    this.modalRef = this.modalService.show(template, {class: 'modal-sm'});
  }
 
  confirm(): void {
    this.modalRef?.hide();
    this.spinner.show();

    this.EventoService.deleteEvento(this.eventoId).subscribe(
      (result: any) => {
        
        if(result.message === 'Deletado'){
          this.toastr.success('Evento excluido com sucesso.', 'Sistema informa:');
          this.carregarEventos();
        }
      },
      (error: any) => {
        this.toastr.error(`Erro ao tentar deletar o evento #${this.eventoId}`, 'Erro');
        console.error(error);
      },
    ).add( () => this.spinner.hide() );

  }
 
  decline(): void {
    this.modalRef?.hide();
    this.toastr.info('Exclusão canceleda!', 'Sistema informa:');
  }

  detalheEvento(id: number):void {
    this.router.navigate([`eventos/detalhe/${id}`]);
  }

}
