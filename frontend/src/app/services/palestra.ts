import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';

@Injectable({ providedIn: 'root' })
export class PalestraService {
  private apiUrl = 'http://127.0.0.1:5000/api/v1/palestra';

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  private getHeaders(): HttpHeaders {
    const token = isPlatformBrowser(this.platformId)
      ? (localStorage.getItem('token') || '').replace('Bearer ', '')
      : '';
    return new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': token });
  }

  listarTodos(): Observable<any[]> {
    if (!isPlatformBrowser(this.platformId)) return of([]);
    return this.http.get<any[]>(this.apiUrl, { headers: this.getHeaders() });
  }

  obterPorId(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }

  // Campos obrigatórios: id_evento, nome, descricao, dt_palestra,
  // horario_inicio_palestra, horario_fim_palestra, nome_palestrante, minicurriculo_palestrante
  cadastrar(p: any): Observable<any> {
    const payload = {
      id_evento:               p.id_evento,
      nome:                    p.nome,
      descricao:               p.descricao,
      dt_palestra:             p.dt_palestra,
      horario_inicio_palestra: p.horario_inicio_palestra,
      horario_fim_palestra:    p.horario_fim_palestra,
      nome_palestrante:        p.nome_palestrante,
      minicurriculo_palestrante: p.minicurriculo_palestrante
    };
    return this.http.post<any>(this.apiUrl, payload, { headers: this.getHeaders() });
  }

  atualizar(id: number, p: any): Observable<any> {
    const payload = {
      id_evento:               p.id_evento,
      nome:                    p.nome,
      descricao:               p.descricao,
      dt_palestra:             p.dt_palestra,
      horario_inicio_palestra: p.horario_inicio_palestra,
      horario_fim_palestra:    p.horario_fim_palestra,
      nome_palestrante:        p.nome_palestrante,
      minicurriculo_palestrante: p.minicurriculo_palestrante
    };
    return this.http.put<any>(`${this.apiUrl}/${id}`, payload, { headers: this.getHeaders() });
  }

  remover(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }
}
