import { Component, OnInit, Inject, PLATFORM_ID, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MinicursoService } from '../../services/minicurso';
import { UsuarioService } from '../../services/usuario';

@Component({
  selector: 'app-lista-minicursos',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './lista-minicursos.html',
  styleUrls: ['./lista-minicursos.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ListaMinicursosComponent implements OnInit {
  minicursos: any[] = [];
  carregando = true;
  erroMsg = '';
  sucessoMsg = '';
  isAdmin = false;
  idLogado = 0;
  removendo: number | null = null;
  inscrevendo: number | null = null;

  filtroIdEvento: number | null = null;

  get minicursosFiltrados(): any[] {
    if (!this.filtroIdEvento) return this.minicursos;
    return this.minicursos.filter(m => Number(m.id_evento) === Number(this.filtroIdEvento));
  }

  get eventosFiltro(): any[] {
    const ids = new Set<number>();
    const result: any[] = [];
    for (const m of this.minicursos) {
      if (!ids.has(m.id_evento)) {
        ids.add(m.id_evento);
        result.push({ id: m.id_evento, nome: m.nome_evento || `Evento #${m.id_evento}` });
      }
    }
    return result;
  }

  constructor(
    private minicursoService: MinicursoService,
    private usuarioService: UsuarioService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    if (!localStorage.getItem('token')) { this.router.navigate(['/login']); return; }
    this.isAdmin  = this.usuarioService.isAdmin();
    this.idLogado = this.usuarioService.getIdLogado();
    this.carregar();
  }

  carregar(): void {
    this.carregando = true;
    this.erroMsg = '';
    this.cdr.markForCheck();
    this.minicursoService.listarTodos().subscribe({
      next: (dados: any) => {
        const lista = Array.isArray(dados) ? dados : (dados?.minicursos ?? []);
        this.minicursos = lista.map((m: any) => ({
          ...m,
          dt_fmt:        this.fmtData(m.dt_minicurso),
          dt_limite_fmt: this.fmtData(m.dt_limite_inscricao),
          inscricaoEncerrada: this.inscricaoEncerrada(m.dt_limite_inscricao)
        }));
        this.carregando = false;
        this.cdr.markForCheck();
      },
      error: (err: any) => {
        this.erroMsg = err?.error?.msg || 'Erro ao carregar minicursos.';
        this.carregando = false;
        this.cdr.markForCheck();
      }
    });
  }

  private fmtData(v: string): string {
    if (!v) return '—';
    const s = v.split('T')[0].split(' ')[0];
    if (s.includes('-')) { const [a, m, d] = s.split('-'); return `${d}/${m}/${a}`; }
    return s;
  }

  private inscricaoEncerrada(dtLimite: string): boolean {
    if (!dtLimite) return true;
    const d = dtLimite.split('T')[0].split(' ')[0];
    return new Date(d) < new Date(new Date().toISOString().split('T')[0]);
  }

  editar(id: number): void { this.router.navigate(['/cadastro-minicurso', id]); }

  verInscritos(m: any): void {
    this.router.navigate(['/inscritos-minicurso', m.id], { state: { nomeMinicurso: m.nome } });
  }

  inscrever(m: any): void {
    if (!this.idLogado) { alert('Você precisa estar logado.'); return; }
    if (!confirm(`Deseja se inscrever no minicurso "${m.nome}"?\n\nAtenção: você precisa estar inscrito no evento ao qual este minicurso pertence.`)) return;
    this.inscrevendo = m.id;
    this.erroMsg = '';
    this.sucessoMsg = '';
    this.cdr.markForCheck();
    this.minicursoService.inscrever(m.id, this.idLogado).subscribe({
      next: (resp: any) => {
        this.inscrevendo = null;
        this.sucessoMsg = resp?.msg || 'Inscrição realizada com sucesso! 🎉';
        this.cdr.markForCheck();
        this.carregar();
      },
      error: (err: any) => {
        this.inscrevendo = null;
        this.erroMsg = err?.error?.msg || 'Erro ao realizar inscrição.';
        this.cdr.markForCheck();
      }
    });
  }

  remover(id: number, nome: string): void {
    if (!confirm(`Remover o minicurso "${nome}"?`)) return;
    this.removendo = id;
    this.erroMsg = '';
    this.cdr.markForCheck();
    this.minicursoService.remover(id).subscribe({
      next: (resp: any) => {
        this.removendo = null;
        this.sucessoMsg = resp?.msg || 'Minicurso removido com sucesso.';
        this.cdr.markForCheck();
        this.carregar();
      },
      error: (err: any) => {
        this.removendo = null;
        this.erroMsg = err?.error?.msg || 'Erro ao remover minicurso.';
        this.cdr.markForCheck();
      }
    });
  }
}
