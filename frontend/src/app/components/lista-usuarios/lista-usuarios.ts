import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { UsuarioService } from '../../services/usuario';
import { timeout } from 'rxjs/operators';

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
  erroDetalhe: string = '';
  idLogado: number = 0;

  constructor(
    private usuarioService: UsuarioService,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (!this.usuarioService.isAdmin()) {
      alert('Acesso negado. Esta área é restrita a administradores.');
      this.router.navigate(['/home']);
      return;
    }

    this.idLogado = this.usuarioService.getIdLogado();
    this.carregarUsuarios();
  }

  carregarUsuarios(): void {
    this.carregando = true;
    this.erroMsg = '';
    this.erroDetalhe = '';
    this.usuarios = [];

    this.usuarioService.listarTodos()
      .pipe(timeout(10000))
      .subscribe({
        next: (dados: any[]) => {
          this.usuarios = Array.isArray(dados) ? dados : [];
          this.carregando = false;
        },
        error: (err: any) => {
          this.carregando = false;

          if (err.name === 'TimeoutError') {
            this.erroMsg = 'O servidor demorou muito para responder.';
            this.erroDetalhe = 'Verifique se o backend está rodando em http://127.0.0.1:5000.';
          } else if (err.status === 0) {
            this.erroMsg = 'Não foi possível conectar ao servidor.';
            this.erroDetalhe = 'O backend pode estar offline ou bloqueado por CORS.';
          } else if (err.status === 401 || err.status === 403) {
            this.erroMsg = 'Sem permissão para listar usuários.';
            this.erroDetalhe = 'Faça logout, entre novamente com uma conta administradora e tente outra vez.';
          } else if (err.status === 404) {
            this.erroMsg = 'Rota de usuários não encontrada.';
            this.erroDetalhe = 'O front tentou /usuario e /usuarios, mas nenhuma rota respondeu corretamente.';
          } else if (err.status === 500) {
            this.erroMsg = 'Erro interno no backend.';
            this.erroDetalhe = err.error?.msg || err.error?.message || 'Pode haver diferença entre o nome da tabela no banco e o nome usado no backend.';
          } else {
            this.erroMsg = 'Erro ao carregar lista de usuários.';
            this.erroDetalhe = err.error?.msg || err.error?.message || err.message || 'Erro desconhecido.';
          }

          console.error('Erro ao listar usuários:', err);
        }
      });
  }

  editarUsuario(id: number): void {
    if (!id) {
      alert('ID do usuário não encontrado.');
      return;
    }

    this.router.navigate(['/editar-perfil'], { queryParams: { id } });
  }

  removerUsuario(id: number, nome: string): void {
    if (!id) {
      alert('ID do usuário não encontrado.');
      return;
    }

    if (id === this.idLogado) {
      alert('Você não pode remover sua própria conta.');
      return;
    }

    if (!confirm(`Tem certeza que deseja remover o usuário "${nome}"?\nEsta ação não pode ser desfeita.`)) {
      return;
    }

    this.usuarioService.remover(id).subscribe({
      next: () => {
        alert(`Usuário "${nome}" removido com sucesso.`);
        this.carregarUsuarios();
      },
      error: (err: any) => {
        const msg = err.error?.msg || err.error?.message || 'Erro ao remover usuário.';
        alert(`Falha ao remover: ${msg}`);
        console.error('Erro ao remover usuário:', err);
      }
    });
  }

  promoverUsuario(id: number, nome: string): void {
    if (!id) {
      alert('ID do usuário não encontrado.');
      return;
    }

    if (!confirm(`Promover "${nome}" a Administrador?\nEsta ação não pode ser desfeita.`)) {
      return;
    }

    this.usuarioService.promover(id).subscribe({
      next: () => {
        alert(`"${nome}" agora é Administrador.`);
        this.carregarUsuarios();
      },
      error: (err: any) => {
        const msg = err.error?.msg || err.error?.message || 'Erro ao promover usuário.';
        alert(`Falha ao promover: ${msg}`);
        console.error('Erro ao promover usuário:', err);
      }
    });
  }

  getLabelPerfil(isAdmin: boolean | number | string): string {
    return isAdmin ? 'Administrador' : 'Usuário Comum';
  }
}
