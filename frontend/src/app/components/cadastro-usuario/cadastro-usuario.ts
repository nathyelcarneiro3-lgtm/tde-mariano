import { Component, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { UsuarioService } from '../../services/usuario';
import { gerarHash } from '../../utils/hash';

@Component({
  selector: 'app-cadastro-usuario',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './cadastro-usuario.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CadastroUsuarioComponent {

  novoUsuario = {
    nome: '',
    cpf: '',
    email: '',
    senha: ''
  };

  carregando = false;
  erroMsg = '';

  constructor(
    private usuarioService: UsuarioService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  async cadastrar() {
    this.erroMsg = '';
    this.carregando = true;
    this.cdr.markForCheck();

    // Gera hash SHA-256 da senha — o backend não deve receber a senha em texto plano
    const hashSenha = await gerarHash(this.novoUsuario.senha);

    const payload = {
      nome:  this.novoUsuario.nome,
      cpf:   this.novoUsuario.cpf,
      email: this.novoUsuario.email,
      senha: hashSenha
    };

    this.usuarioService.cadastrar(payload).subscribe({
      next: () => {
        this.carregando = false;
        this.cdr.markForCheck();
        alert('Conta criada com sucesso!');
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.carregando = false;
        this.erroMsg = err?.error?.msg || 'Erro ao cadastrar. Verifique os dados e tente novamente.';
        this.cdr.markForCheck();
        console.error('Erro ao cadastrar usuário:', err);
      }
    });
  }
}
