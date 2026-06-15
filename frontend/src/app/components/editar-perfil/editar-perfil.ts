import { Component, OnInit, Inject, PLATFORM_ID, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { UsuarioService } from '../../services/usuario';
import { gerarHash } from '../../utils/hash';

@Component({
  selector: 'app-editar-perfil',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './editar-perfil.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EditarPerfilComponent implements OnInit {

  idAlvo: number = 0;
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
    private cdr: ChangeDetectorRef,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.queryParamMap.get('id');
    const idLogado = this.usuarioService.getIdLogado();

    if (idParam && Number(idParam) !== idLogado) {
      if (!this.usuarioService.isAdmin()) {
        alert('Acesso negado. Apenas administradores podem editar outros usuários.');
        this.router.navigate(['/home']);
        return;
      }
      this.idAlvo = Number(idParam);
      this.editandoOutroUsuario = true;
    } else {
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
    this.erroMsg = '';
    this.cdr.markForCheck();

    if (!this.editandoOutroUsuario) {
      this.usuarioService.buscarPorToken().subscribe({
        next: (dados: any) => {
          this.usuario.nome  = dados.nome;
          this.usuario.email = dados.email;
          this.cpfAlvo       = dados.cpf;
          this.idAlvo        = dados.id;
          this.carregandoDados = false;
          this.cdr.markForCheck();
        },
        error: (err: any) => {
          this.erroMsg = 'Erro ao carregar dados do usuário.';
          this.carregandoDados = false;
          this.cdr.markForCheck();
          console.error(err);
        }
      });
    } else {
      this.usuarioService.listarTodos().subscribe({
        next: (lista: any[]) => {
          const encontrado = lista.find((u: any) => u.id === this.idAlvo);
          if (!encontrado) {
            this.erroMsg = 'Usuário não encontrado.';
            this.carregandoDados = false;
            this.cdr.markForCheck();
            return;
          }
          this.usuario.nome  = encontrado.nome;
          this.usuario.email = encontrado.email;
          this.cpfAlvo       = encontrado.cpf;
          this.carregandoDados = false;
          this.cdr.markForCheck();
        },
        error: (err: any) => {
          this.erroMsg = 'Erro ao carregar dados do usuário.';
          this.carregandoDados = false;
          this.cdr.markForCheck();
          console.error(err);
        }
      });
    }
  }

  async salvar(): Promise<void> {
    this.erroMsg = '';
    this.successMsg = '';

    if (!this.usuario.nome || !this.usuario.email) {
      this.erroMsg = 'Nome e e-mail são obrigatórios.';
      this.cdr.markForCheck();
      return;
    }

    if (this.usuario.senha && this.usuario.senha !== this.usuario.confirmarSenha) {
      this.erroMsg = 'As senhas não coincidem.';
      this.cdr.markForCheck();
      return;
    }

    if (this.editandoOutroUsuario) {
      this.erroMsg = 'O backend não permite que um administrador edite dados de outro usuário diretamente. ' +
                     'O usuário deve editar seus próprios dados através do perfil.';
      this.cdr.markForCheck();
      return;
    }

    this.carregando = true;
    this.cdr.markForCheck();

    // Se a senha foi preenchida, gera o hash; caso contrário envia string vazia
    // (o backend aceita senha vazia como "sem alteração")
    let senhaNova = '';
    if (this.usuario.senha) {
      senhaNova = await gerarHash(this.usuario.senha);
    }

    const payload: any = {
      cpf:   this.cpfAlvo,
      nome:  this.usuario.nome,
      email: this.usuario.email,
      senha: senhaNova || 'sem_alteracao'
    };

    this.usuarioService.atualizar(this.idAlvo, payload).subscribe({
      next: () => {
        this.carregando = false;
        this.successMsg = 'Dados atualizados com sucesso!';

        if (isPlatformBrowser(this.platformId)) {
          localStorage.setItem('usuarioNome', this.usuario.nome);
        }

        this.cdr.markForCheck();

        setTimeout(() => {
          this.router.navigate(['/home']);
        }, 1500);
      },
      error: (err: any) => {
        this.carregando = false;
        this.erroMsg = err.error?.msg || err.error?.message || 'Erro ao atualizar dados.';
        this.cdr.markForCheck();
        console.error(err);
      }
    });
  }

  cancelar(): void {
    this.router.navigate(this.editandoOutroUsuario ? ['/lista-usuarios'] : ['/home']);
  }
}
