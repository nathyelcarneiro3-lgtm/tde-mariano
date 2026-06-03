import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';

@Injectable({ providedIn: 'root' })
export class EventoService {
  private apiUrl = 'http://127.0.0.1:5000/api/v1/evento';

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  // O backend usa jwtDecode() direto no token — sem "Bearer "
  private getHeaders(): HttpHeaders {
    const token = isPlatformBrowser(this.platformId)
      ? localStorage.getItem('token') || ''
      : '';
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': token
    });
  }

  obterTodos(): Observable<any> {
    return this.http.get(this.apiUrl, { headers: this.getHeaders() });
  }

  cadastrar(evento: any): Observable<any> {
    // Garante que apenas os campos esperados pelo backend são enviados
    const payload = {
      nome: evento.nome,
      descricao: evento.descricao,
      dt_inicio: evento.dt_inicio,
      dt_fim: evento.dt_fim,
      dt_limite_inscricao: evento.dt_limite_inscricao,
      numero_vagas: evento.numero_vagas,
      cpf_responsavel: evento.cpf_responsavel,
      nome_responsavel: evento.nome_responsavel,
      email_responsavel: evento.email_responsavel
    };
    return this.http.post(this.apiUrl, payload, { headers: this.getHeaders() });
  }

  excluir(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }

  obterPorId(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }

  // FIX CRÍTICO: o body do PUT NÃO pode conter "id"
  // Backend faz: Evento(id, **request.json) — se "id" vier no JSON, TypeError
  atualizar(id: number, evento: any): Observable<any> {
    const payload = {
      nome: evento.nome,
      descricao: evento.descricao,
      dt_inicio: evento.dt_inicio,
      dt_fim: evento.dt_fim,
      dt_limite_inscricao: evento.dt_limite_inscricao,
      numero_vagas: evento.numero_vagas,
      cpf_responsavel: evento.cpf_responsavel,
      nome_responsavel: evento.nome_responsavel,
      email_responsavel: evento.email_responsavel
    };
    return this.http.put<any>(`${this.apiUrl}/${id}`, payload, { headers: this.getHeaders() });
  }

  obterInscritosPorEvento(idEvento: number): Observable<any> {
    return this.http.get<any>(
      `http://127.0.0.1:5000/api/v1/inscricao/evento/${idEvento}`,
      { headers: this.getHeaders() }
    );
  }

  inscrever(idEvento: number, idUsuarioParticipante: number): Observable<any> {
    return this.http.post<any>(
      `http://127.0.0.1:5000/api/v1/inscricao/evento`,
      { id_evento: idEvento, id_usuario_participante: idUsuarioParticipante },
      { headers: this.getHeaders() }
    );
  }

  removerInscricao(idEvento: number, idParticipante: number): Observable<any> {
    return this.http.delete<any>(
      `http://127.0.0.1:5000/api/v1/inscricao/evento/${idEvento}/${idParticipante}`,
      { headers: this.getHeaders() }
    );
  }
}