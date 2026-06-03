import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { MinicursoService } from '../../services/minicurso';
import { UsuarioService } from '../../services/usuario';

@Component({
  selector: 'app-lista-minicursos',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './lista-minicursos.html'
})
export class ListaMinicursosComponent implements OnInit {
  minicursos: any[] = [];
  carregando = true;
  erroMsg = '';
  isAdmin = false;
  idLogado = 0;

  constructor(
    private minicursoService: MinicursoService,
    private usuarioService: UsuarioService,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    this.isAdmin = this.usuarioService.isAdmin();
    this.idLogado = this.usuarioService.getIdLogado();
    this.carregar();
  }

  carregar(): void {
    this.carregando = true;
    this.erroMsg = '';
    this.minicursoService.listarTodos().subscribe({
      next: (dados: any) => {
        const lista = Array.isArray(dados) ? dados : (dados?.minicursos ?? []);
        this.minicursos = lista.map((m: any) => ({
          ...m,
          dt_fmt:        this.fmtData(m.dt_minicurso),
          dt_limite_fmt: this.fmtData(m.dt_limite_inscricao)
        }));
        this.carregando = false;
      },
      error: (err: any) => {
        this.erroMsg = err?.error?.msg || 'Erro ao carregar minicursos.';
        this.carregando = false;
      }
    });
  }

  private fmtData(v: string): string {
    if (!v) return '—';
    const s = v.split('T')[0];
    const [a, m, d] = s.split('-');
    return `${d}/${m}/${a}`;
  }

  editar(id: number): void {
    this.router.navigate(['/cadastro-minicurso', id]);
  }

  verInscritos(id: number): void {
    this.router.navigate(['/inscritos-minicurso', id]);
  }

  inscrever(m: any): void {
    if (!this.idLogado) { alert('Você precisa estar logado.'); return; }
    if (!confirm(`Deseja se inscrever no minicurso "${m.nome}"?`)) return;
    this.minicursoService.inscrever(m.id, this.idLogado).subscribe({
      next: () => { alert('Inscrição realizada com sucesso!'); this.carregar(); },
      error: (err: any) => alert(err?.error?.msg || 'Erro ao se inscrever.')
    });
  }

  remover(id: number, nome: string): void {
    if (!confirm(`Remover o minicurso "${nome}"?`)) return;
    this.minicursoService.remover(id).subscribe({
      next: () => { alert('Minicurso removido!'); this.carregar(); },
      error: (err: any) => alert(err?.error?.msg || 'Erro ao remover minicurso.')
    });
  }
}