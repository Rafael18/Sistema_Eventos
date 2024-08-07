import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder, FormControl, Validators, FormGroup, FormArray, AbstractControl  } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { BsLocaleService } from 'ngx-bootstrap/datepicker';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

import { EventoService } from 'src/app/services/evento.service';
import { LoteService } from 'src/app/services/lote.service';

import { Evento } from 'src/app/models/Evento';
import { Lote } from 'src/app/models/Lote';

@Component({
  selector: 'app-evento-detalhe',
  templateUrl: './evento-detalhe.component.html',
  styleUrls: ['./evento-detalhe.component.scss']
})
export class EventoDetalheComponent implements OnInit {
  
  modalRef: BsModalRef;
  eventoId: number;
  evento = {} as Evento;
  form: FormGroup;
  estadoSalvar = 'post';

  loteAtual = {id :0, nome:'', indice: 0}

  get modoEditar():boolean {
    return this.estadoSalvar == 'put';
  }

  get lotes(): FormArray{
    return this.form.get('lotes') as FormArray;
  }

  get f(): any{
    return this.form.controls;
  }

  get bsConfig(): any {
    return {
            adaptivePosition: true,
            dateInputFormat: 'DD/MM/YYYY',
            containerClass: 'theme-default',
            showWeekNumbers: false
    }
  }

  constructor(private fb: FormBuilder, 
    private localeService: BsLocaleService,
    private activatedRouter:ActivatedRoute,
    private eventoService: EventoService,
    private loteService: LoteService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private router: Router,
    private modalService: BsModalService)  
  { 
    this.localeService.use('pt-br');
  }

  public carregarEvento(): void {
    this.eventoId = +this.activatedRouter.snapshot.paramMap.get('id');

    if (this.eventoId  == null || this.eventoId !== 0){
      this.spinner.show();
      console.log(this.eventoId);
      this.estadoSalvar = 'put';

      this.eventoService.getEventoById(this.eventoId ).subscribe(
        (evento: Evento) => {
          this.evento = { ... evento };
          this.form.patchValue(this.evento);
          
          this.carregarLotes();

          // O código abaixo realiza a mesma ação do método acima "this.carregarLotes();"
          // this.evento.lotes.forEach(lote => {
          //   this.lotes.push(this.criarLote(lote));
          // });
        },
        (error: any) => {
          this.spinner.hide();
          this.toastr.error('Erro ao tentar carregar evento');
          console.error(error);
        }
      ).add(() => this.spinner.hide());
    }
  }

  public carregarLotes():void {
    this.loteService.getLotesByEventoId(this.eventoId).subscribe(
      (lotesRetorno: Lote[]) => {
        
        lotesRetorno.forEach(lote => {
          this.lotes.push(this.criarLote(lote));
        });

      },
      (error: any)=>{
        this.toastr.error('Erro ao tentar carregar lotes','Erro');
        console.error(error);
      }
    ).add(() => this.spinner.hide());
  }
  
  ngOnInit(): void {
    this.carregarEvento();
    this.validation();
  }
  
  public validation(): void {
    this.form = this.fb.group({
      tema: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(50)]],
      local: ['', Validators.required],
      dataEvento: ['', Validators.required],
      qtdPessoas: ['', [Validators.required, Validators.max(120000)]],
      telefone: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      imagemUrl: ['', Validators.required],
      // lotes: [''],
      lotes: this.fb.array([]),
      redesSociais: [''],
      palestrantesEventos: ['']
    });
  }

  adicionarLote(): void {
    this.lotes.push( this.criarLote({ id: 0} as Lote));
  }

  criarLote(lote: Lote): FormGroup {
    return  this.fb.group({
      id: [lote.id],
      nome:[lote.nome, Validators.required],
      preco:[lote.preco, Validators.required],
      dataInicio:[lote.dataInicio],
      dataFim:[lote.dataFim],
      quantidade:[lote.quantidade, Validators.required]
    });
  }

  public retornaTituloLote(nome: string): string{
    return nome === null || nome === '' ? 'Nome do lote' : nome;
  }

  public resetForm(): void {
    this.form.reset();
  }

  public cssValidator(campoForm: FormControl | AbstractControl): any {
    return {'is-invalid': campoForm.errors  && campoForm.touched};
  }

  public salvarEvento(): void {
    this.spinner.show();

    if(this.form.valid) {

      if(this.estadoSalvar === 'post'){
        this.evento = {... this.form.value};
      }else{
        this.evento = {id: this.evento.id, ... this.form.value}
      }

      //  Opção para substituir o método acima e refatorar o código
      // this.evento = (this.estadoSalvar === 'post')
      //               ? {... this.form.value}
      //               : {id: this.evento.id, ... this.form.value};

      this.eventoService[this.estadoSalvar](this.evento).subscribe(
        (eventoRetorno: Evento) =>{
          this.toastr.success("Evento atualizado com Sucesso!",'Sucesso');
          this.router.navigate([`eventos/detalhe/${eventoRetorno.id}`]);
        },
        (error: any) => {
          console.error(error);
          this.spinner.hide();
          this.toastr.error('Erro ao atualizar evento!','Erro');
        },
        () => this.spinner.hide()
      );
    }
  }

  public salvarLotes(): void{   
    if(this.form.controls.lotes.valid){
      this.spinner.show();
      this.loteService.saveLote(this.eventoId, this.form.value.lotes).subscribe(
        () => {
          this.toastr.success('Lotes salvos com sucesso', 'Sucesso');
          // this.lotes.reset();
        },
        (error: any) => {
          this.toastr.error('Erro ao tentar salvar lotes','Erro');
          console.error(error);
        }
      ).add(() => this.spinner.hide());
    }
  }

  public removerLote(template: TemplateRef<any>,indice: number): void {

    this.loteAtual.id = this.lotes.get(indice +'.id').value;
    this.loteAtual.nome = this.lotes.get(indice +'.nome').value;
    this.loteAtual.indice = indice;

    this.modalRef = this.modalService.show(template, {class:'modal-sm'});
  }

  confirmDeleteLote(): void {
    this.modalRef.hide();
    this.spinner.show();

    this.loteService.deleteLote(this.eventoId, this.loteAtual.id).subscribe(
      () => {
        this.toastr.success(`Lote "${this.loteAtual.nome}" excluido com exito.`,'Sucesso');
        this.lotes.removeAt(this.loteAtual.indice);
      },
      (error: any) => {
        this.toastr.error(`Erro ao excluir o Lote "${this.loteAtual.nome}"`,'Erro');
        console.error(error);
      }
    ).add(() => this.spinner.hide());
  }

  declineDeleteLote(): void {
    this.modalRef.hide();
  }
  
}