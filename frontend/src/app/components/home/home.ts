import { ChangeDetectorRef, Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { EventoService } from '../../services/evento';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './home.html',
  styleUrls: ['./home.css']
})
export class HomeComponent implements OnInit {
  eventos: any[] = [];
  termoBusca = '';
  carregando = false;

  inscritosNosEventos = new Set<number>();

  constructor(
    private eventoService: EventoService,
    private cdr: ChangeDetectorRef,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    this.carregando = true;
    this.eventoService.obterTodos().subscribe({
      next: (dados: any) => {
        this.eventos = Array.isArray(dados) ? dados : [];
        this.carregando = false;
        this.cdr.detectChanges();
        if (this.getIdUsuario()) {
          this.verificarInscricoes();
        }
      },
      error: (err: any) => {
        console.error('Erro ao procurar eventos:', err);
        this.carregando = false;
        this.cdr.detectChanges();
      }
    });
  }

  private getIdUsuario(): number {
    if (!isPlatformBrowser(this.platformId)) return 0;
    return Number(localStorage.getItem('usuarioId') || '0');
  }

  private verificarInscricoes(): void {
    const idUsuario = this.getIdUsuario();
    if (!idUsuario || this.eventos.length === 0) return;

    const requests = this.eventos.map(e =>
      this.eventoService.obterInscritosPorEvento(e.id).pipe(catchError(() => of([])))
    );

    forkJoin(requests).subscribe((respostas: any[]) => {
      respostas.forEach((lista: any, i: number) => {
        const inscritos = Array.isArray(lista) ? lista : (lista?.inscritos ?? lista?.data ?? []);
        const jaInscrito = inscritos.some(
          (ins: any) => Number(ins.id_usuario ?? ins.id) === idUsuario
        );
        if (jaInscrito) {
          this.inscritosNosEventos.add(this.eventos[i].id);
        }
      });
      this.inscritosNosEventos = new Set(this.inscritosNosEventos);
      this.cdr.detectChanges();
    });
  }

  estaInscrito(idEvento: number): boolean {
    return this.inscritosNosEventos.has(idEvento);
  }

  get eventosFiltrados(): any[] {
    const t = this.termoBusca.trim().toLowerCase();
    if (!t) return this.eventos;
    return this.eventos.filter(e =>
      (e.nome             || '').toLowerCase().includes(t) ||
      (e.descricao        || '').toLowerCase().includes(t) ||
      (e.nome_responsavel || '').toLowerCase().includes(t)
    );
  }

  formatarData(v: string): string {
    if (!v) return '—';
    const s = v.split('T')[0].split(' ')[0];
    if (s.includes('-')) { const [a, m, d] = s.split('-'); return `${d}/${m}/${a}`; }
    return s;
  }

  limparBusca(): void { this.termoBusca = ''; }
}
