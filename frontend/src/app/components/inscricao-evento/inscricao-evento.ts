import { ChangeDetectorRef, Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { EventoService } from '../../services/evento';
import { MinicursoService } from '../../services/minicurso';

@Component({
  selector: 'app-inscricao-evento',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './inscricao-evento.html',
  styleUrls: ['./inscricao-evento.css']
})
export class InscricaoEventoComponent implements OnInit {
  evento: any = null;
  carregando = false;
  inscrevendo = false;
  erroMsg = '';
  sucessoMsg = '';
  jaInscrito = false;

  palestras: any[] = [];
  minicursos: any[] = [];
  carregandoProgramacao = false;

  inscrevendoMinicurso: number | null = null;
  erroMinicurso = '';
  sucessoMinicurso = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private eventoService: EventoService,
    private minicursoService: MinicursoService,
    private cdr: ChangeDetectorRef,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (!id) { this.erroMsg = 'Evento não encontrado.'; return; }
    if (!this.estaLogado()) { this.router.navigate(['/login']); return; }
    this.carregarEvento(id);
  }

  estaLogado(): boolean {
    return isPlatformBrowser(this.platformId) ? !!localStorage.getItem('token') : false;
  }

  getIdUsuario(): number {
    return isPlatformBrowser(this.platformId)
      ? Number(localStorage.getItem('usuarioId') || '0') : 0;
  }

  getNomeUsuario(): string {
    return isPlatformBrowser(this.platformId)
      ? (localStorage.getItem('usuarioNome') || 'Usuário') : 'Usuário';
  }

  carregarEvento(id: number): void {
    this.carregando = true;
    this.eventoService.obterPorId(id).subscribe({
      next: (dados: any) => {
        this.evento = dados;
        this.carregando = false;
        this.cdr.detectChanges();
        this.verificarSeJaInscrito(id);
        this.carregarProgramacao(id);
      },
      error: (err: any) => {
        this.carregando = false;
        this.erroMsg = err?.error?.msg || 'Erro ao carregar dados do evento.';
        this.cdr.detectChanges();
      }
    });
  }

  carregarProgramacao(idEvento: number): void {
    this.carregandoProgramacao = true;
    this.eventoService.obterProgramacao(idEvento).subscribe({
      next: (dados: any) => {
        this.palestras  = Array.isArray(dados?.palestras)  ? dados.palestras  : [];
        this.minicursos = Array.isArray(dados?.minicursos) ? dados.minicursos : [];
        this.carregandoProgramacao = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.carregandoProgramacao = false;
        this.cdr.detectChanges();
      }
    });
  }

  verificarSeJaInscrito(idEvento: number): void {
    const idUsuario = this.getIdUsuario();
    this.eventoService.obterInscritosPorEvento(idEvento).subscribe({
      next: (lista: any) => {
        const inscritos = Array.isArray(lista) ? lista : (lista?.inscritos ?? lista?.data ?? []);
        this.jaInscrito = inscritos.some((i: any) => Number(i.id_usuario ?? i.id) === idUsuario);
        this.cdr.detectChanges();
      },
      error: () => {
        this.jaInscrito = false;
        this.cdr.detectChanges();
      }
    });
  }

  inscrever(): void {
    if (!this.evento) return;
    const idUsuario = this.getIdUsuario();
    if (!idUsuario) { this.erroMsg = 'Não foi possível identificar o usuário. Faça login novamente.'; return; }
    this.inscrevendo = true;
    this.erroMsg = '';
    this.sucessoMsg = '';
    this.eventoService.inscrever(this.evento.id, idUsuario).subscribe({
      next: (resp: any) => {
        this.inscrevendo = false;
        this.sucessoMsg = resp?.msg || 'Inscrição realizada com sucesso! 🎉';
        this.jaInscrito = true;
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        this.inscrevendo = false;
        this.erroMsg = err?.error?.msg || 'Erro ao realizar inscrição. Tente novamente.';
        this.cdr.detectChanges();
      }
    });
  }

  inscreverMinicurso(m: any): void {
    if (!this.jaInscrito) {
      this.erroMinicurso = 'Você precisa estar inscrito no evento antes de se inscrever em um minicurso.';
      return;
    }
    const idUsuario = this.getIdUsuario();
    if (!confirm(`Inscrever-se no minicurso "${m.nome}"?`)) return;
    this.inscrevendoMinicurso = m.id;
    this.erroMinicurso = '';
    this.sucessoMinicurso = '';
    this.minicursoService.inscrever(m.id, idUsuario).subscribe({
      next: (resp: any) => {
        this.inscrevendoMinicurso = null;
        this.sucessoMinicurso = `✅ Inscrito em "${m.nome}" com sucesso!`;
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        this.inscrevendoMinicurso = null;
        this.erroMinicurso = err?.error?.msg || 'Erro ao se inscrever no minicurso.';
        this.cdr.detectChanges();
      }
    });
  }

  inscricaoMinicursoEncerrada(dtLimite: string): boolean {
    if (!dtLimite) return true;
    const s = dtLimite.split('T')[0].split(' ')[0];
    return new Date(s) < new Date(new Date().toISOString().split('T')[0]);
  }

  formatarData(valor: string): string {
    if (!valor) return '—';
    const s = valor.split('T')[0].split(' ')[0];
    if (s.includes('-')) { const [a, m, d] = s.split('-'); return `${d}/${m}/${a}`; }
    return valor;
  }
}
