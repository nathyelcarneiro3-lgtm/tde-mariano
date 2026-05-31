import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EventoService {
  // Esta é a URL onde o seu Flask está rodando
  private apiUrl = 'http://localhost:5000/api/v1/evento';

  constructor(private http: HttpClient) {}

  // Este é o método 'salvar' que você perguntou
  salvar(evento: any): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', token || '');
    return this.http.post(this.apiUrl, evento, { headers });
  }

  // Este é o método para listar eventos
  obterTodos(): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', token || '');
    return this.http.get(this.apiUrl, { headers });
  }
}