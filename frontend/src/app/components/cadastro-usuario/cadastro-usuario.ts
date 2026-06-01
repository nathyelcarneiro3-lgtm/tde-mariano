import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { UsuarioService } from '../../services/usuario'; // O serviço que acabámos de criar

@Component({
  selector: 'app-cadastro-usuario',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './cadastro-usuario.html'
})
export class CadastroUsuarioComponent {
  novoUsuario = {
    nome: '',
    cpf: '',
    email: '', // <-- ADICIONE ESTA LINHA!
    senha: ''
  };
// ... o resto do código continua igual

  constructor(private usuarioService: UsuarioService, private router: Router) {}

  cadastrar() {
    this.usuarioService.cadastrar(this.novoUsuario).subscribe({
      next: (resposta) => {
        alert('Conta criada com sucesso! Já pode iniciar sessão.');
        this.router.navigate(['/login']); // Redireciona para o login
      },
      error: (erro) => {
        console.error('Erro ao criar utilizador', erro);
        alert('Ocorreu um erro ao criar a conta. Verifique os dados.');
      }
    });
  }
}