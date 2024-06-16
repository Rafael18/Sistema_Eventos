import { Component, OnInit, TemplateRef } from '@angular/core';

import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';

import { EventoService } from '../../services/evento.service'
import { Evento } from '../../models/Evento';

@Component({
  selector: 'app-eventos',
  templateUrl: './eventos.component.html',
  styleUrls: ['./eventos.component.scss'],
  // providers: [EventoService]
})
export class EventosComponent implements OnInit {
  modalRef?: BsModalRef;
  public eventos: Evento[] = [];
  public eventosFiltrados: any = [];

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
      private spinner: NgxSpinnerService
  ) { }

  public ngOnInit(): void {
    /** spinner starts on init */
    this.spinner.show();
    this.getEventos();
  }

  public alterarImagem(): void{
    this.exibirImagem = !this.exibirImagem;
  }

  public getEventos(): void {

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

   
  openModal(template: TemplateRef<any>): void {
    this.modalRef = this.modalService.show(template, {class: 'modal-sm'});
  }
 
  confirm(): void {
    this.modalRef?.hide();
    this.toastr.success('Evento excluido com sucesso.', 'Sistema informa:');
  }
 
  decline(): void {
    this.modalRef?.hide();
    this.toastr.info('Exclusão canceleda!', 'Sistema informa:');
  }




}
