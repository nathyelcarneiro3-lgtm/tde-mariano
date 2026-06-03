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

  // ID do usuário sendo editado
  idAlvo: number = 0;
  cpfAlvo: string = '';          // só para exibir no formulário
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
    const idParam = this.route.snapshot.queryParamMap.get('id');
    const idLogado = this.usuarioService.getIdLogado();

    if (idParam && Number(idParam) !== idLogado) {
      // Admin editando outro usuário
      if (!this.usuarioService.isAdmin()) {
        alert('Acesso negado. Apenas administradores podem editar outros usuários.');
        this.router.navigate(['/home']);
        return;
      }
      this.idAlvo = Number(idParam);
      this.editandoOutroUsuario = true;
    } else {
      // Usuário editando a si mesmo
      if (!idLogado) {
        alert('Você precisa estar logado para editar seu perfil.');
        this.router.navigate(['/login']);
        return;
      }
      this.idAlvo = idLogado;
      this.editandoOutroUsuario = false;
    }

    this.carregarDados();
  }

  carregarDados(): void {
    this.carregandoDados = true;

    if (!this.editandoOutroUsuario) {
      // Próprio usuário: usa o endpoint /porToken (não precisa de ID)
      this.usuarioService.buscarPorToken().subscribe({
        next: (dados: any) => {
          this.usuario.nome = dados.nome;
          this.usuario.email = dados.email;
          this.cpfAlvo = dados.cpf;
          this.idAlvo = dados.id;
          this.carregandoDados = false;
        },
        error: (err: any) => {
          this.erroMsg = 'Erro ao carregar dados do usuário.';
          this.carregandoDados = false;
          console.error(err);
        }
      });
    } else {
      // Admin editando outro: usa listarTodos e filtra pelo ID
      // (o backend não tem GET /usuario/{id} público, mas tem GET /usuario que retorna todos)
      this.usuarioService.listarTodos().subscribe({
        next: (lista: any[]) => {
          const encontrado = lista.find((u: any) => u.id === this.idAlvo);
          if (!encontrado) {
            this.erroMsg = 'Usuário não encontrado.';
            this.carregandoDados = false;
            return;
          }
          this.usuario.nome = encontrado.nome;
          this.usuario.email = encontrado.email;
          this.cpfAlvo = encontrado.cpf;
          this.carregandoDados = false;
        },
        error: (err: any) => {
          this.erroMsg = 'Erro ao carregar dados do usuário.';
          this.carregandoDados = false;
          console.error(err);
        }
      });
    }
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

    const payload: any = {
      cpf:   this.cpfAlvo,   // backend exige cpf no body do PUT
      nome:  this.usuario.nome,
      email: this.usuario.email,
      senha: this.usuario.senha || ''
    };

    this.usuarioService.atualizar(this.idAlvo, payload).subscribe({
      next: () => {
        this.carregando = false;
        this.successMsg = 'Dados atualizados com sucesso!';

        if (!this.editandoOutroUsuario && isPlatformBrowser(this.platformId)) {
          localStorage.setItem('usuarioNome', this.usuario.nome);
        }

        setTimeout(() => {
          this.router.navigate(this.editandoOutroUsuario ? ['/lista-usuarios'] : ['/home']);
        }, 1500);
      },
      error: (err: any) => {
        this.carregando = false;
        this.erroMsg = err.error?.msg || err.error?.message || 'Erro ao atualizar dados.';
        console.error(err);
      }
    });
  }

  cancelar(): void {
    this.router.navigate(this.editandoOutroUsuario ? ['/lista-usuarios'] : ['/home']);
  }
}