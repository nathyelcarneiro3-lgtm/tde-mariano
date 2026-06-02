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
    // Mande apenas o necessário
    const payload = {
      nome: this.novoUsuario.nome,
      cpf: this.novoUsuario.cpf,
      email: this.novoUsuario.email,
      senha: this.novoUsuario.senha
    };

    this.usuarioService.cadastrar(payload).subscribe({
      next: (res) => {
        alert('Conta criada com sucesso!');
        this.router.navigate(['/login']);
      },
      error: (err) => {
        console.log(err); // Veja no console do navegador o que o Python está a devolver
        alert('Erro ao cadastrar. Verifique o console.');
      }
    });
  }
}