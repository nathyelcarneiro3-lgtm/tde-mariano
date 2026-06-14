import { ChangeDetectorRef, Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { PalestraService } from '../../services/palestra';
import { EventoService } from '../../services/evento';
import { UsuarioService } from '../../services/usuario';

@Component({
  selector: 'app-lista-palestras',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './lista-palestras.html',
  styleUrls: ['./lista-palestras.css']
})
export class ListaPalestrasComponent implements OnInit {
  palestras: any[] = [];
  palestrasFiltered: any[] = [];
  eventos: Map<number, string> = new Map();
  carregando = true;
  erroMsg = '';
  isAdmin = false;

  termoBusca = '';

  palestraParaRemover: any = null;
  removendo = false;

  constructor(
    private palestraService: PalestraService,
    private eventoService: EventoService,
    private usuarioService: UsuarioService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    this.isAdmin = this.usuarioService.isAdmin();
    this.carregarEventos();
  }

  carregarEventos(): void {
    this.eventoService.obterTodos().subscribe({
      next: (dados: any) => {
        const lista = Array.isArray(dados) ? dados : [];
        lista.forEach((e: any) => this.eventos.set(Number(e.id), e.nome));
        this.cdr.detectChanges();
        this.carregar();
      },
      error: () => {
        this.cdr.detectChanges();
        this.carregar();
      }
    });
  }

  carregar(): void {
    this.carregando = true;
    this.erroMsg = '';
    this.palestraService.listarTodos().subscribe({
      next: (dados: any) => {
        const lista = Array.isArray(dados) ? dados : (dados?.palestras ?? []);
        this.palestras = lista.map((p: any) => ({
          ...p,
          dt_fmt: this.fmtData(p.dt_palestra),
          nome_evento: this.eventos.get(Number(p.id_evento)) ?? `Evento #${p.id_evento}`
        }));
        this.aplicarFiltro();
        this.carregando = false;
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        this.erroMsg = err?.error?.msg || 'Erro ao carregar palestras.';
        this.carregando = false;
        this.cdr.detectChanges();
      }
    });
  }

  aplicarFiltro(): void {
    const termo = this.termoBusca.toLowerCase().trim();
    if (!termo) {
      this.palestrasFiltered = [...this.palestras];
      return;
    }
    this.palestrasFiltered = this.palestras.filter(p =>
      p.nome?.toLowerCase().includes(termo) ||
      p.nome_palestrante?.toLowerCase().includes(termo) ||
      p.nome_evento?.toLowerCase().includes(termo) ||
      p.descricao?.toLowerCase().includes(termo)
    );
  }

  private fmtData(v: string): string {
    if (!v) return '—';
    const s = v.split('T')[0].split(' ')[0];
    if (s.includes('-')) {
      const [a, m, d] = s.split('-');
      return `${d}/${m}/${a}`;
    }
    return s;
  }

  fmtHorario(h: string): string {
    if (!h) return '—';
    if (h.includes(':')) return h.substring(0, 5);
    return h;
  }

  editar(id: number): void {
    this.router.navigate(['/cadastro-palestra', id]);
  }

  confirmarRemocao(palestra: any): void {
    this.palestraParaRemover = palestra;
  }

  cancelarRemocao(): void {
    this.palestraParaRemover = null;
  }

  remover(): void {
    if (!this.palestraParaRemover) return;
    this.removendo = true;
    this.palestraService.remover(this.palestraParaRemover.id).subscribe({
      next: () => {
        this.removendo = false;
        this.palestraParaRemover = null;
        this.cdr.detectChanges();
        this.carregar();
      },
      error: (err: any) => {
        this.removendo = false;
        this.erroMsg = err?.error?.msg || 'Erro ao remover palestra.';
        this.palestraParaRemover = null;
        this.cdr.detectChanges();
      }
    });
  }

  verProgramacao(idEvento: number): void {
    this.router.navigate(['/admin'], { queryParams: { evento: idEvento } });
  }
}
