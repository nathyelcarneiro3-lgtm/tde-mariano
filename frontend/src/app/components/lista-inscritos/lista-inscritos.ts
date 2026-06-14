import { ChangeDetectorRef, Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { EventoService } from '../../services/evento';

@Component({
  selector: 'app-lista-inscritos',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './lista-inscritos.html',
  styleUrls: ['./lista-inscritos.css']
})
export class ListaInscritosComponent implements OnInit {
  idEvento: number = 0;
  nomeEvento: string = '';
  inscritos: any[] = [];
  carregando = false;
  removendo: number | null = null;
  erroMsg = '';
  sucessoMsg = '';

  termoBusca = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private eventoService: EventoService,
    private cdr: ChangeDetectorRef,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    if (!this.estaLogado()) {
      this.router.navigate(['/login']);
      return;
    }
    if (!this.eAdmin()) {
      this.router.navigate(['/home']);
      return;
    }

    this.idEvento = Number(this.route.snapshot.paramMap.get('id'));
    const state = window.history.state;
    this.nomeEvento = state?.nomeEvento || '';

    if (!this.idEvento) {
      this.erroMsg = 'ID do evento inválido.';
      return;
    }

    this.carregarInscritos();
  }

  estaLogado(): boolean {
    if (isPlatformBrowser(this.platformId)) {
      return !!localStorage.getItem('token');
    }
    return false;
  }

  eAdmin(): boolean {
    if (isPlatformBrowser(this.platformId)) {
      const v = localStorage.getItem('usuarioAdmin') || '';
      return v === '1' || v.toLowerCase() === 'true';
    }
    return false;
  }

  carregarInscritos(): void {
    this.carregando = true;
    this.erroMsg = '';

    this.eventoService.obterInscritosPorEvento(this.idEvento).subscribe({
      next: (dados: any) => {
        this.inscritos = Array.isArray(dados)
          ? dados
          : (dados?.inscritos ?? dados?.data ?? []);
        this.carregando = false;
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        this.carregando = false;
        if (err.status === 401 || err.status === 403) {
          this.erroMsg = 'Sessão expirada. Faça login novamente.';
        } else {
          this.erroMsg = err?.error?.msg || 'Erro ao carregar inscritos.';
        }
        this.cdr.detectChanges();
      }
    });
  }

  get inscritosFiltrados(): any[] {
    if (!this.termoBusca.trim()) return this.inscritos;
    const t = this.termoBusca.toLowerCase();
    return this.inscritos.filter(i =>
      (i.nome || '').toLowerCase().includes(t) ||
      (i.cpf || '').includes(t) ||
      (i.email || '').toLowerCase().includes(t)
    );
  }

  removerInscricao(idParticipante: number, nomeParticipante: string): void {
    if (!confirm(`Remover a inscrição de "${nomeParticipante}"?`)) return;

    this.removendo = idParticipante;
    this.erroMsg = '';
    this.sucessoMsg = '';

    this.eventoService.removerInscricao(this.idEvento, idParticipante).subscribe({
      next: (resp: any) => {
        this.removendo = null;
        this.sucessoMsg = resp?.msg || 'Inscrição removida com sucesso.';
        this.cdr.detectChanges();
        this.carregarInscritos();
      },
      error: (err: any) => {
        this.removendo = null;
        this.erroMsg = err?.error?.msg || 'Erro ao remover inscrição.';
        this.cdr.detectChanges();
      }
    });
  }

  voltar(): void {
    this.router.navigate(['/admin']);
  }
}
