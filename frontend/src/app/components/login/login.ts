import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { UsuarioService } from '../../services/usuario';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class LoginComponent {

  loginData = {
    cpf: '',
    senha: ''
  };

  carregando = false;
  erroMsg = '';

  constructor(private usuarioService: UsuarioService, private router: Router) {}

  fazerLogin() {
    this.carregando = true;
    this.erroMsg = '';

    this.usuarioService.logar(this.loginData).subscribe({
      next: (resposta) => {
        // Salva o token JWT puro — o backend NÃO aceita "Bearer " no prefixo
        const token = resposta.token_jwt || resposta.token || '';
        localStorage.setItem('token', token);
        localStorage.setItem('usuarioCpf', this.loginData.cpf);

        // Busca dados completos do usuário para popular o localStorage
        this.usuarioService.obterPorToken().subscribe({
          next: (usuario) => {
            localStorage.setItem('usuarioId',    String(usuario.id));
            localStorage.setItem('usuarioNome',  usuario.nome || '');
            localStorage.setItem('usuarioCpf',   usuario.cpf || this.loginData.cpf);
            localStorage.setItem('usuarioAdmin', usuario.administrador ? '1' : '0');

            this.carregando = false;
            alert('Login efetuado com sucesso!');
            this.router.navigate(['/home']);
          },
          error: (err) => {
            // Login funcionou mas não conseguiu buscar detalhes — continua sem admin
            localStorage.setItem('usuarioAdmin', '0');
            this.carregando = false;
            console.warn('Aviso: não foi possível buscar dados do usuário após login.', err);
            this.router.navigate(['/home']);
          }
        });
      },
      error: (erro) => {
        this.carregando = false;
        this.erroMsg = 'CPF ou senha inválidos. Verifique suas credenciais.';
        console.error('Erro de Login:', erro);
      }
    });
  }
}
