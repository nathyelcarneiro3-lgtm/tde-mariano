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

  constructor(private usuarioService: UsuarioService, private router: Router) {}

  fazerLogin() {
    this.usuarioService.logar(this.loginData).subscribe({
      next: (resposta) => {
        // Salva token e dados básicos do usuário na sessão
        localStorage.setItem('token', resposta.token_jwt);
        localStorage.setItem('usuarioNome', resposta.nome || '');
        localStorage.setItem('usuarioCpf', resposta.cpf || this.loginData.cpf);

        // Salva se é admin (o backend deve retornar usuario_admin: 0 ou 1)
        const isAdmin = resposta.usuario_admin === 1 || resposta.usuario_admin === true;
        localStorage.setItem('usuarioAdmin', isAdmin ? '1' : '0');

        alert('Login efetuado com sucesso!');
        this.router.navigate(['/home']);
      },
      error: (erro) => {
        console.error('Erro de Login:', erro);
        alert('CPF ou senha inválidos.');
      }
    });
  }
}