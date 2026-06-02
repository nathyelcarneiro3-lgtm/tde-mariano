import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class UsuarioService {
  private apiUrl = 'http://127.0.0.1:5000/api/v1/usuario';

  constructor(private http: HttpClient) {}

  cadastrar(usuario: any): Observable<any> {
  const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
  // IMPORTANTE: Envie apenas os campos que o UsuarioBC espera (cpf, nome, email, senha)
  // Não envie 'hash_senha' ou 'usuario_admin' se o UsuarioBC não os espera.
  const dados = {
    cpf: usuario.cpf,
    nome: usuario.nome,
    email: usuario.email,
    senha: usuario.senha
  };
  return this.http.post(this.apiUrl, dados, { headers });
}
logar(credenciais: any): Observable<any> {
    // O seu Python espera receber (cpf, senha). 
    // Certifique-se que o backend tem a rota /api/v1/usuario/logar
    return this.http.post('http://127.0.0.1:5000/api/v1/usuario/logar', credenciais);
  }
}
