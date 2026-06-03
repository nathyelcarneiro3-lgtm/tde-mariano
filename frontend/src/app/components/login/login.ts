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

  constructor(private usuarioService: UsuarioService, private router: Router) {}

  fazerLogin() {
    this.carregando = true;

    this.usuarioService.logar(this.loginData).subscribe({
      next: (resposta) => {
        // 1. Salva o token
        localStorage.setItem('token', resposta.token_jwt);
        // Salva o CPF já aqui para o getHeaders() funcionar na próxima chamada
        localStorage.setItem('usuarioCpf', this.loginData.cpf);

        // 2. Com o token em mãos, busca os dados completos do usuário (id, nome, isAdmin)
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
            this.carregando = false;
            console.error('Erro ao buscar dados do usuário:', err);
            // Login funcionou, mas não conseguiu buscar detalhes — segue sem admin
            localStorage.setItem('usuarioAdmin', '0');
            this.router.navigate(['/home']);
          }
        });
      },
      error: (erro) => {
        this.carregando = false;
        console.error('Erro de Login:', erro);
        alert('CPF ou senha inválidos.');
      }
    });
  }
}