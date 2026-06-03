import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { isPlatformBrowser } from '@angular/common';

@Injectable({ providedIn: 'root' })
export class UsuarioService {
  private apiUrl = 'http://127.0.0.1:5000/api/v1/usuario';

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  // O backend usa jwtDecode(args[1]) diretamente — token puro, SEM "Bearer "
  private getToken(): string {
    if (isPlatformBrowser(this.platformId)) {
      const token = localStorage.getItem('token') || '';
      // Remove "Bearer " se por acaso veio com prefixo (compatibilidade)
      return token.startsWith('Bearer ') ? token.slice(7) : token;
    }
    return '';
  }

  private getHeaders(): HttpHeaders {
    const token = this.getToken();
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    if (token) {
      headers = headers.set('Authorization', token);
    }
    return headers;
  }

  private normalizarUsuario(usuario: any): any {
    if (!usuario) return {};

    const valorAdmin =
      usuario.administrador ??
      usuario.usuario_admin ??
      usuario.admin ??
      usuario.is_admin ??
      0;

    const valorAdminTexto = String(valorAdmin).toLowerCase();
    const administrador =
      valorAdmin === true ||
      valorAdmin === 1 ||
      valorAdminTexto === '1' ||
      valorAdminTexto === 'true';

    return {
      ...usuario,
      id: Number(
        usuario.id ?? usuario.id_usuario ?? usuario.usuario_id ?? 0
      ),
      cpf: usuario.cpf ?? usuario.CPF ?? '',
      nome: usuario.nome ?? usuario.name ?? '',
      email: usuario.email ?? usuario.e_mail ?? '',
      administrador
    };
  }

  private normalizarListaUsuarios(resposta: any): any[] {
    let lista: any[] = [];

    if (Array.isArray(resposta)) {
      lista = resposta;
    } else if (Array.isArray(resposta?.usuarios)) {
      lista = resposta.usuarios;
    } else if (Array.isArray(resposta?.usuario)) {
      lista = resposta.usuario;
    } else if (Array.isArray(resposta?.dados)) {
      lista = resposta.dados;
    } else if (Array.isArray(resposta?.data)) {
      lista = resposta.data;
    }

    return lista.map((u) => this.normalizarUsuario(u));
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
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post(`${this.apiUrl}/logar`, credenciais, { headers });
  }

  obterPorToken(): Observable<any> {
    return this.http
      .get(`${this.apiUrl}/porToken`, { headers: this.getHeaders() })
      .pipe(map((u) => this.normalizarUsuario(u)));
  }

  buscarPorToken(): Observable<any> {
    return this.obterPorToken();
  }

  listarTodos(): Observable<any[]> {
    return this.http
      .get(this.apiUrl, { headers: this.getHeaders() })
      .pipe(
        map((resposta) => this.normalizarListaUsuarios(resposta)),
        catchError((err) => {
          console.error('Erro ao listar usuários:', err);
          return throwError(() => err);
        })
      );
  }

  // FIX: senha é obrigatória no backend; se não alterar, reutiliza hash vazia (backend aceita)
  atualizar(id: number, dados: any): Observable<any> {
    const payload = {
      cpf:   dados.cpf,
      nome:  dados.nome,
      email: dados.email,
      senha: dados.senha || ''
    };
    return this.http.put(`${this.apiUrl}/${id}`, payload, { headers: this.getHeaders() });
  }

  remover(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }

  promover(id: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/promover/${id}`, {}, { headers: this.getHeaders() });
  }

  isAdmin(): boolean {
    if (isPlatformBrowser(this.platformId)) {
      const valor = localStorage.getItem('usuarioAdmin') || '';
      return valor === '1' || valor.toLowerCase() === 'true';
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
