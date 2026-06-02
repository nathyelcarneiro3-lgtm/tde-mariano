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
    email: '',
    senha: '',        // A senha que o usuário digita
    hash_senha: '',   // Iremos copiar a senha para cá
    usuario_admin: 0  // Valor fixo que o banco exige
  };

  
// ... o resto do código continua igual

  constructor(private usuarioService: UsuarioService, private router: Router) {}

 cadastrar() {
    // Antes de enviar, preenchemos os campos obrigatórios ocultos
    this.novoUsuario.hash_senha = this.novoUsuario.senha;
    this.novoUsuario.usuario_admin = 0; 

    this.usuarioService.cadastrar(this.novoUsuario).subscribe({
      next: (res) => {
        alert('Conta criada com sucesso!');
        this.router.navigate(['/login']);
      },
      error: (err) => {
        console.error('Erro detalhado:', err);
        alert('Erro: ' + (err.error?.msg || 'Falha ao salvar no banco'));
      }
    });
  }
}