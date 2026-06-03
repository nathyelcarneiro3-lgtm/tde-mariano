import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';

@Injectable({ providedIn: 'root' })
export class UsuarioService {
  private apiUrl = 'http://127.0.0.1:5000/api/v1/usuario';

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  private getHeaders(): HttpHeaders {
    const token = isPlatformBrowser(this.platformId)
      ? localStorage.getItem('token') || ''
      : '';
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': token
    });
  }

  cadastrar(usuario: any): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const dados = {
      cpf: usuario.cpf,
      nome: usuario.nome,
      email: usuario.email,
      senha: usuario.senha
    };
    return this.http.post(this.apiUrl, dados, { headers });
  }

  logar(credenciais: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/logar`, credenciais);
  }

  // Req 2 - Alterar dados do usuário
  atualizar(cpf: string, dados: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${cpf}`, dados, { headers: this.getHeaders() });
  }

  // Req 3 - Remover usuário (somente admin)
  remover(cpf: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${cpf}`, { headers: this.getHeaders() });
  }

  // Req 5 - Listar todos os usuários
  listarTodos(): Observable<any> {
    return this.http.get(this.apiUrl, { headers: this.getHeaders() });
  }

  // Buscar um usuário pelo CPF
  buscarPorCpf(cpf: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${cpf}`, { headers: this.getHeaders() });
  }

  isAdmin(): boolean {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem('usuarioAdmin') === '1';
    }
    return false;
  }

  getCpfLogado(): string {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem('usuarioCpf') || '';
    }
    return '';
  }
}