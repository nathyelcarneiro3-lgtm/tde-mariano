import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { UsuarioService } from '../../services/usuario';

@Component({
  selector: 'app-editar-perfil',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './editar-perfil.html'
})
export class EditarPerfilComponent implements OnInit {

  // CPF do usuário sendo editado (vem da rota ou é o próprio logado)
  cpfAlvo: string = '';
  editandoOutroUsuario: boolean = false;

  usuario: any = {
    nome: '',
    email: '',
    senha: '',
    confirmarSenha: ''
  };

  carregando: boolean = false;
  carregandoDados: boolean = true;
  erroMsg: string = '';
  successMsg: string = '';

  constructor(
    private usuarioService: UsuarioService,
    private router: Router,
    private route: ActivatedRoute,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    // Se vier ?cpf=xxx na rota, é um admin editando outro usuário
    const cpfParam = this.route.snapshot.queryParamMap.get('cpf');
    const cpfLogado = this.usuarioService.getCpfLogado();

    if (cpfParam && cpfParam !== cpfLogado) {
      // Admin editando outro usuário — verifica se é admin
      if (!this.usuarioService.isAdmin()) {
        alert('Acesso negado. Apenas administradores podem editar outros usuários.');
        this.router.navigate(['/home']);
        return;
      }
      this.cpfAlvo = cpfParam;
      this.editandoOutroUsuario = true;
    } else {
      // Usuário editando a si mesmo
      if (!cpfLogado) {
        alert('Você precisa estar logado para editar seu perfil.');
        this.router.navigate(['/login']);
        return;
      }
      this.cpfAlvo = cpfLogado;
      this.editandoOutroUsuario = false;
    }

    this.carregarDados();
  }

  carregarDados(): void {
    this.carregandoDados = true;
    this.usuarioService.buscarPorCpf(this.cpfAlvo).subscribe({
      next: (dados: any) => {
        this.usuario.nome = dados.nome;
        this.usuario.email = dados.email;
        this.carregandoDados = false;
      },
      error: (err: any) => {
        this.erroMsg = 'Erro ao carregar dados do usuário.';
        this.carregandoDados = false;
        console.error(err);
      }
    });
  }

  salvar(): void {
    this.erroMsg = '';
    this.successMsg = '';

    if (!this.usuario.nome || !this.usuario.email) {
      this.erroMsg = 'Nome e e-mail são obrigatórios.';
      return;
    }

    if (this.usuario.senha && this.usuario.senha !== this.usuario.confirmarSenha) {
      this.erroMsg = 'As senhas não coincidem.';
      return;
    }

    this.carregando = true;

    // Monta payload — CPF não pode ser alterado (req 2)
    const payload: any = {
      nome: this.usuario.nome,
      email: this.usuario.email
    };

    // Só envia nova senha se o usuário preencheu o campo
    if (this.usuario.senha) {
      payload.senha = this.usuario.senha;
    }

    this.usuarioService.atualizar(this.cpfAlvo, payload).subscribe({
      next: () => {
        this.carregando = false;
        this.successMsg = 'Dados atualizados com sucesso!';

        // Atualiza o nome no localStorage se estava editando a si mesmo
        if (!this.editandoOutroUsuario && isPlatformBrowser(this.platformId)) {
          localStorage.setItem('usuarioNome', this.usuario.nome);
        }

        setTimeout(() => {
          if (this.editandoOutroUsuario) {
            this.router.navigate(['/lista-usuarios']);
          } else {
            this.router.navigate(['/home']);
          }
        }, 1500);
      },
      error: (err: any) => {
        this.carregando = false;
        const msg = err.error?.msg || err.error?.message || 'Erro ao atualizar dados.';
        this.erroMsg = msg;
        console.error(err);
      }
    });
  }

  cancelar(): void {
    if (this.editandoOutroUsuario) {
      this.router.navigate(['/lista-usuarios']);
    } else {
      this.router.navigate(['/home']);
    }
  }
}