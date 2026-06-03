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

  idAlvo: number = 0;
  cpfAlvo: string = '';
  // CORRIGIDO: "editar outro usuário" foi removido porque o backend não permite
  // que um usuário (mesmo admin) atualize dados de outro via PUT /usuario/{id}.
  // O backend verifica: if not usuarioLogado.id == usuario.id → rejeita.
  // Só é possível editar o próprio perfil com o próprio token.

  usuario: any = {
    nome: '',
    email: '',
    senhaAtual: '',   // NOVO: backend exige senha não-vazia no PUT
    novaSenha: '',
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
    const idLogado = this.usuarioService.getIdLogado();

    if (!idLogado) {
      alert('Você precisa estar logado para editar seu perfil.');
      this.router.navigate(['/login']);
      return;
    }

    this.idAlvo = idLogado;
    this.carregarDados();
  }

  carregarDados(): void {
    this.carregandoDados = true;
    this.erroMsg = '';

    this.usuarioService.buscarPorToken().subscribe({
      next: (dados: any) => {
        this.usuario.nome = dados.nome;
        this.usuario.email = dados.email;
        this.cpfAlvo = dados.cpf;
        this.idAlvo = dados.id;
        this.carregandoDados = false;
      },
      error: (err: any) => {
        this.erroMsg = 'Erro ao carregar dados do usuário. Verifique se o backend está rodando.';
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

    // CORRIGIDO: o backend exige senha não-vazia no body do PUT.
    // Se o usuário quer trocar a senha, usa a nova; senão, usa a senha atual
    // (que ele deve informar para confirmar a identidade).
    if (!this.usuario.senhaAtual) {
      this.erroMsg = 'Informe sua senha atual para salvar as alterações.';
      return;
    }

    if (this.usuario.novaSenha && this.usuario.novaSenha !== this.usuario.confirmarSenha) {
      this.erroMsg = 'A nova senha e a confirmação não coincidem.';
      return;
    }

    this.carregando = true;

    // Se digitou nova senha, usa ela; senão mantém a atual
    const senhaFinal = this.usuario.novaSenha || this.usuario.senhaAtual;

    const payload: any = {
      cpf:   this.cpfAlvo,
      nome:  this.usuario.nome,
      email: this.usuario.email,
      senha: senhaFinal
    };

    this.usuarioService.atualizar(this.idAlvo, payload).subscribe({
      next: () => {
        this.carregando = false;
        this.successMsg = 'Dados atualizados com sucesso!';

        if (isPlatformBrowser(this.platformId)) {
          localStorage.setItem('usuarioNome', this.usuario.nome);
        }

        setTimeout(() => {
          this.router.navigate(['/home']);
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
    this.router.navigate(['/home']);
  }
}