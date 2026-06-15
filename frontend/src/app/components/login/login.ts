import { Component, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { UsuarioService } from '../../services/usuario';
import { gerarHash } from '../../utils/hash';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrls: ['./login.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginComponent {

  loginData = { cpf: '', senha: '' };
  carregando = false;
  erroMsg = '';

  constructor(
    private usuarioService: UsuarioService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  async fazerLogin() {
    this.carregando = true;
    this.erroMsg = '';
    this.cdr.markForCheck();

    // Gera o hash SHA-256 da senha antes de enviar ao backend
    const hashSenha = await gerarHash(this.loginData.senha);

    const credenciais = {
      cpf: this.loginData.cpf,
      senha: hashSenha
    };

    this.usuarioService.logar(credenciais).subscribe({
      next: (resposta) => {
        const token = resposta.token_jwt || resposta.token || '';
        localStorage.setItem('token', token);
        localStorage.setItem('usuarioCpf', this.loginData.cpf);

        this.usuarioService.obterPorToken().subscribe({
          next: (usuario) => {
            localStorage.setItem('usuarioId',    String(usuario.id));
            localStorage.setItem('usuarioNome',  usuario.nome || '');
            localStorage.setItem('usuarioCpf',   usuario.cpf || this.loginData.cpf);
            localStorage.setItem('usuarioAdmin', usuario.administrador ? '1' : '0');

            this.carregando = false;
            this.cdr.markForCheck();
            alert('Login efetuado com sucesso!');
            this.router.navigate(['/home']);
          },
          error: (err) => {
            localStorage.setItem('usuarioAdmin', '0');
            this.carregando = false;
            this.cdr.markForCheck();
            console.warn('Aviso: não foi possível buscar dados do usuário após login.', err);
            this.router.navigate(['/home']);
          }
        });
      },
      error: (erro) => {
        this.carregando = false;
        this.erroMsg = 'CPF ou senha inválidos. Verifique suas credenciais.';
        this.cdr.markForCheck();
        console.error('Erro de Login:', erro);
      }
    });
  }
}
