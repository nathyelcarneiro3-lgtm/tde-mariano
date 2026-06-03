import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class EventoService {
  private apiUrl = 'http://127.0.0.1:5000/api/v1/evento';

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token') || '';
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': token
    });
  }

  obterTodos(): Observable<any> {
    return this.http.get(this.apiUrl, { headers: this.getHeaders() });
  }

  cadastrar(evento: any): Observable<any> {
    return this.http.post(this.apiUrl, evento, { headers: this.getHeaders() });
  }

  excluir(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }

  // FIX: adicionado token no header (antes estava sem Authorization)
  obterPorId(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }

  // FIX: adicionado token no header (antes estava sem Authorization)
  atualizar(id: number, evento: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, evento, { headers: this.getHeaders() });
  }
}