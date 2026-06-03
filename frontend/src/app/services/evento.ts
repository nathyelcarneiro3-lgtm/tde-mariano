import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class EventoService {
  private apiUrl = 'http://127.0.0.1:5000/api/v1/evento';

  constructor(private http: HttpClient) {}

 obterTodos(): Observable<any> {
    // 1. Pega o token salvo no navegador
    const token = localStorage.getItem('token') || '';
    
    // 2. Coloca o token no cabeçalho de Autorização
    const headers = new HttpHeaders({ 
      'Content-Type': 'application/json',
      'Authorization': token 
    });

    // 3. Envia o GET junto com o cabeçalho
    return this.http.get(this.apiUrl, { headers });
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
  excluir(id: number): Observable<any> {
    const token = localStorage.getItem('token') || '';
    const headers = new HttpHeaders({ 
      'Content-Type': 'application/json',
      'Authorization': token 
    });

    return this.http.delete(`${this.apiUrl}/${id}`, { headers });
  }
  obterPorId(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  atualizar(id: number, evento: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, evento);
  }
}