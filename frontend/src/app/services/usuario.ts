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

  private getToken(): string {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem('token') || '';
    }
    return '';
  }

  private getHeaders(useBearer: boolean = false): HttpHeaders {
    const token = this.getToken();

    let authorization = token;

    if (useBearer && token && !token.toLowerCase().startsWith('bearer ')) {
      authorization = `Bearer ${token}`;
    }

    let headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    if (authorization) {
      headers = headers.set('Authorization', authorization);
    }

    return headers;
  }

  private getComAuth(url: string): Observable<any> {
    return this.http.get(url, { headers: this.getHeaders(false) }).pipe(
      catchError((err) => {
        if (err.status === 401 || err.status === 403) {
          return this.http.get(url, { headers: this.getHeaders(true) });
        }

        return throwError(() => err);
      })
    );
  }

  private postComAuth(url: string, body: any): Observable<any> {
    return this.http.post(url, body, { headers: this.getHeaders(false) }).pipe(
      catchError((err) => {
        if (err.status === 401 || err.status === 403) {
          return this.http.post(url, body, { headers: this.getHeaders(true) });
        }

        return throwError(() => err);
      })
    );
  }

  private putComAuth(url: string, body: any): Observable<any> {
    return this.http.put(url, body, { headers: this.getHeaders(false) }).pipe(
      catchError((err) => {
        if (err.status === 401 || err.status === 403) {
          return this.http.put(url, body, { headers: this.getHeaders(true) });
        }

        return throwError(() => err);
      })
    );
  }

  private deleteComAuth(url: string): Observable<any> {
    return this.http.delete(url, { headers: this.getHeaders(false) }).pipe(
      catchError((err) => {
        if (err.status === 401 || err.status === 403) {
          return this.http.delete(url, { headers: this.getHeaders(true) });
        }

        return throwError(() => err);
      })
    );
  }

  private normalizarUsuario(usuario: any): any {
    if (!usuario) {
      return {};
    }

    const valorAdmin =
      usuario.administrador ??
      usuario.usuario_admin ??
      usuario.admin ??
      usuario.is_admin ??
      usuario.e_admin ??
      0;

    const valorAdminTexto = String(valorAdmin).toLowerCase();

    const administrador =
      valorAdmin === true ||
      valorAdmin === 1 ||
      valorAdminTexto === '1' ||
      valorAdminTexto === 'true' ||
      valorAdminTexto === 'sim' ||
      valorAdminTexto === 's' ||
      valorAdminTexto === 'admin' ||
      valorAdminTexto === 'administrador';

    return {
      ...usuario,
      id: Number(
        usuario.id ??
        usuario.id_usuario ??
        usuario.usuario_id ??
        usuario.codigo ??
        0
      ),
      cpf: usuario.cpf ?? usuario.CPF ?? '',
      nome: usuario.nome ?? usuario.name ?? usuario.usuario_nome ?? '',
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
    } else if (Array.isArray(resposta?.resultado)) {
      lista = resposta.resultado;
    }

    return lista.map((usuario) => this.normalizarUsuario(usuario));
  }

  cadastrar(usuario: any): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    const dados = {
      cpf: usuario.cpf,
      nome: usuario.nome,
      email: usuario.email,
      senha: usuario.senha
    };

    return this.http.post(this.apiUrl, dados, { headers }).pipe(
      catchError(() => {
        return this.http.post(`${this.apiUrl}s`, dados, { headers });
      })
    );
  }

  logar(credenciais: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/logar`, credenciais).pipe(
      catchError(() => {
        return this.http.post(`${this.apiUrl}s/logar`, credenciais);
      })
    );
  }

  obterPorToken(): Observable<any> {
    return this.getComAuth(`${this.apiUrl}/porToken`).pipe(
      catchError(() => {
        return this.getComAuth(`${this.apiUrl}s/porToken`);
      }),
      map((usuario) => this.normalizarUsuario(usuario))
    );
  }

  buscarPorToken(): Observable<any> {
    return this.obterPorToken();
  }

  listarTodos(): Observable<any[]> {
    return this.getComAuth(this.apiUrl).pipe(
      catchError(() => {
        return this.getComAuth(`${this.apiUrl}s`);
      }),
      map((resposta) => this.normalizarListaUsuarios(resposta))
    );
  }

  atualizar(id: number, dados: any): Observable<any> {
    return this.putComAuth(`${this.apiUrl}/${id}`, dados).pipe(
      catchError(() => {
        return this.putComAuth(`${this.apiUrl}s/${id}`, dados);
      })
    );
  }

  remover(id: number): Observable<any> {
    return this.deleteComAuth(`${this.apiUrl}/${id}`).pipe(
      catchError(() => {
        return this.deleteComAuth(`${this.apiUrl}s/${id}`);
      })
    );
  }

  promover(id: number): Observable<any> {
    return this.postComAuth(`${this.apiUrl}/promover/${id}`, {}).pipe(
      catchError(() => {
        return this.postComAuth(`${this.apiUrl}s/promover/${id}`, {});
      })
    );
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