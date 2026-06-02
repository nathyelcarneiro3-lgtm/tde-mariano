import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { UsuarioService } from '../../services/usuario'; // Certifique-se de importar o serviço

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.html'
})
export class LoginComponent {
  
  loginData = {
    cpf: '',
    senha: ''
  };

  constructor(private usuarioService: UsuarioService, private router: Router) {}

  fazerLogin() {
    // Aqui enviamos os dados exatamente como o UsuarioBC.logar(cpf, senha) espera
    this.usuarioService.logar(this.loginData).subscribe({
      next: (resposta) => {
        // Guarda o token no navegador
        localStorage.setItem('token', resposta.token_jwt);
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