import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class EventoService {
  private apiUrl = 'http://127.0.0.1:5000/api/v1/evento';

  constructor(private http: HttpClient) {}

  obterTodos(): Observable<any> {
    return this.http.get(this.apiUrl);
  }

  // 👇 É ESTA A FUNÇÃO QUE O ANGULAR ESTÁ A PROCURAR 👇
  cadastrar(evento: any): Observable<any> {
    const token = localStorage.getItem('token') || '';
    
    const headers = new HttpHeaders({ 
      'Content-Type': 'application/json',
      'Authorization': token 
    });

    return this.http.post(this.apiUrl, evento, { headers });
  }
}