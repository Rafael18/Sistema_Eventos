import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Lote } from '../models/Lote';

import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';

@Injectable()
export class LoteService {

  baseUrl = 'http://localhost:5233/api/lotes';

  constructor(private http: HttpClient) { }

  public getLotesByEventoId(eventoId: number): Observable<Lote[]>{
    return this.http.get<Lote[]>(`${this.baseUrl}/${eventoId}`).pipe(take(1));
  }


  public saveLote(eventoId: number, lotes: Lote[]): Observable<Lote[]>{
    return this.http.put<Lote[]>(`${this.baseUrl}/${eventoId}`, lotes)
      .pipe(take(1));
  }

  public deleteLote(eventoId: number, loteId: number): Observable<any>{
    return this.http
    .delete(`${this.baseUrl}/${eventoId}/${loteId}`)
      .pipe(take(1));
  }
}
