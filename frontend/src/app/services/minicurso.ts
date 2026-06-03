import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';

@Injectable({ providedIn: 'root' })
export class MinicursoService {
  private apiUrl = 'http://127.0.0.1:5000/api/v1/minicurso';
  private inscricaoUrl = 'http://127.0.0.1:5000/api/v1/inscricao/minicurso';

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

  // Campos obrigatórios: id_evento, nome, descricao, dt_minicurso,
  // horario_inicio_minicurso, horario_fim_minicurso, nome_instrutor,
  // minicurriculo_instrutor, dt_limite_inscricao, numero_vagas
  cadastrar(m: any): Observable<any> {
    const payload = {
      id_evento:                m.id_evento,
      nome:                     m.nome,
      descricao:                m.descricao,
      dt_minicurso:             m.dt_minicurso,
      horario_inicio_minicurso: m.horario_inicio_minicurso,
      horario_fim_minicurso:    m.horario_fim_minicurso,
      nome_instrutor:           m.nome_instrutor,
      minicurriculo_instrutor:  m.minicurriculo_instrutor,
      dt_limite_inscricao:      m.dt_limite_inscricao,
      numero_vagas:             m.numero_vagas
    };
    return this.http.post<any>(this.apiUrl, payload, { headers: this.getHeaders() });
  }

  atualizar(id: number, m: any): Observable<any> {
    const payload = {
      id_evento:                m.id_evento,
      nome:                     m.nome,
      descricao:                m.descricao,
      dt_minicurso:             m.dt_minicurso,
      horario_inicio_minicurso: m.horario_inicio_minicurso,
      horario_fim_minicurso:    m.horario_fim_minicurso,
      nome_instrutor:           m.nome_instrutor,
      minicurriculo_instrutor:  m.minicurriculo_instrutor,
      dt_limite_inscricao:      m.dt_limite_inscricao,
      numero_vagas:             m.numero_vagas
    };
    return this.http.put<any>(`${this.apiUrl}/${id}`, payload, { headers: this.getHeaders() });
  }

  remover(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }

  listarInscritos(idMinicurso: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.inscricaoUrl}/${idMinicurso}`, { headers: this.getHeaders() });
  }

  inscrever(idMinicurso: number, idUsuario: number): Observable<any> {
    return this.http.post<any>(this.inscricaoUrl, {
      id_minicurso: idMinicurso,
      id_usuario_participante: idUsuario
    }, { headers: this.getHeaders() });
  }

  removerInscricao(idMinicurso: number, idParticipante: number): Observable<any> {
    return this.http.delete<any>(
      `${this.inscricaoUrl}/${idMinicurso}/${idParticipante}`,
      { headers: this.getHeaders() }
    );
  }
}
