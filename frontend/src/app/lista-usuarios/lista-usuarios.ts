import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { UsuarioService } from '../../services/usuario';

@Component({
  selector: 'app-lista-usuarios',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './lista-usuarios.html'
})
export class ListaUsuariosComponent implements OnInit {

  usuarios: any[] = [];
  carregando: boolean = true;
  erroMsg: string = '';
  cpfLogado: string = '';

  constructor(
    private usuarioService: UsuarioService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Apenas admin pode acessar esta página
    if (!this.usuarioService.isAdmin()) {
      alert('Acesso negado. Esta área é restrita a administradores.');
      this.router.navigate(['/home']);
      return;
    }
    this.cpfLogado = this.usuarioService.getCpfLogado();
    this.carregarUsuarios();
  }

  carregarUsuarios(): void {
    this.carregando = true;
    this.erroMsg = '';
    this.usuarioService.listarTodos().subscribe({
      next: (dados: any) => {
        this.usuarios = dados;
        this.carregando = false;
      },
      error: (err: any) => {
        this.erroMsg = 'Erro ao carregar lista de usuários.';
        this.carregando = false;
        console.error(err);
      }
    });
  }

  editarUsuario(cpf: string): void {
    this.router.navigate(['/editar-perfil'], { queryParams: { cpf } });
  }

  // Req 3 — somente admin pode remover usuários
  removerUsuario(cpf: string, nome: string): void {
    if (cpf === this.cpfLogado) {
      alert('Você não pode remover sua própria conta.');
      return;
    }

    if (!confirm(`Tem certeza que deseja remover o usuário "${nome}"?\nEsta ação não pode ser desfeita.`)) {
      return;
    }

    this.usuarioService.remover(cpf).subscribe({
      next: () => {
        alert(`Usuário "${nome}" removido com sucesso.`);
        this.carregarUsuarios();
      },
      error: (err: any) => {
        const msg = err.error?.msg || err.error?.message || 'Erro ao remover usuário.';
        alert(`Falha ao remover: ${msg}`);
        console.error(err);
      }
    });
  }

  getLabelPerfil(isAdmin: boolean | number): string {
    return isAdmin ? 'Administrador' : 'Usuário Comum';
  }
}
