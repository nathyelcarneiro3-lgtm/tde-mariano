import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  // Ajuste o URL se a sua rota no Python for diferente
  private apiUrl = 'http://localhost:5000/api/v1/usuario'; 

  constructor(private http: HttpClient) {}

  cadastrar(usuario: any): Observable<any> {
    return this.http.post(this.apiUrl, usuario);
  }
}
