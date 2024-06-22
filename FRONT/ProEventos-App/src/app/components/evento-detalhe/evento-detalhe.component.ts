import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-evento-detalhe',
  templateUrl: './evento-detalhe.component.html',
  styleUrls: ['./evento-detalhe.component.scss']
})
export class EventoDetalheComponent implements OnInit {
  
  form: FormGroup;

  get f(): any{
    return this.form.controls;
  }
  constructor(private fb: FormBuilder) { }
  
  ngOnInit(): void {
    this.validation();
  }
  
  public validation(): void {
    this.form = this.fb.group({
      tema: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(50)]],
      local: ['', Validators.required],
      dataevento: ['', Validators.required],
      qtdpessoas: ['', [Validators.required, Validators.max(120000)]],
      telefone: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      imagemurl: ['', Validators.required],
    });
  }

  public resetForm(): void {
    this.form.reset();
  }
  
}
