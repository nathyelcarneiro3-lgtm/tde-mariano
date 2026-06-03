import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, switchMap } from 'rxjs';
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

  // Busca dados do usuário logado pelo token (usado após login)
  obterPorToken(): Observable<any> {
    return this.http.get(`${this.apiUrl}/porToken`, { headers: this.getHeaders() });
  }

  // Req 2 - Alterar dados — usa ID (que o backend espera)
  atualizar(id: number, dados: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, dados, { headers: this.getHeaders() });
  }

  // Req 3 - Remover usuário — usa ID
  remover(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }

  // Req 4 - Promover usuário a administrador
  promover(id: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/promover/${id}`, {}, { headers: this.getHeaders() });
  }

  // Req 5 - Listar todos os usuários
  listarTodos(): Observable<any> {
    return this.http.get(this.apiUrl, { headers: this.getHeaders() });
  }

  // Buscar usuário pelo token (para preencher formulário de edição)
  buscarPorToken(): Observable<any> {
    return this.http.get(`${this.apiUrl}/porToken`, { headers: this.getHeaders() });
  }

  // Helpers de sessão
  isAdmin(): boolean {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem('usuarioAdmin') === '1';
    }
    return false;
  }

  getIdLogado(): number {
    if (isPlatformBrowser(this.platformId)) {
      return Number(localStorage.getItem('usuarioId') || '0');
    }
    return 0;
  }

  getCpfLogado(): string {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem('usuarioCpf') || '';
    }
    return '';
  }
}