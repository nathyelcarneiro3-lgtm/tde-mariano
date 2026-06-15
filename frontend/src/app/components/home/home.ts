import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { EventoService } from '../../services/evento';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './home.html',
  styleUrls: ['./home.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent implements OnInit {
  eventos: any[] = [];
  termoBusca = '';
  carregando = false;

  constructor(
    private eventoService: EventoService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.carregando = true;
    this.cdr.markForCheck();
    this.eventoService.obterTodos().subscribe({
      next: (dados: any) => {
        this.eventos = Array.isArray(dados) ? dados : [];
        this.carregando = false;
        this.cdr.markForCheck();
      },
      error: (err: any) => {
        console.error('Erro ao procurar eventos:', err);
        this.carregando = false;
        this.cdr.markForCheck();
      }
    });
  }

  get eventosFiltrados(): any[] {
    const t = this.termoBusca.trim().toLowerCase();
    if (!t) return this.eventos;
    return this.eventos.filter(e =>
      (e.nome        || '').toLowerCase().includes(t) ||
      (e.descricao   || '').toLowerCase().includes(t) ||
      (e.nome_responsavel || '').toLowerCase().includes(t)
    );
  }

  formatarData(v: string): string {
    if (!v) return '—';
    const s = v.split('T')[0].split(' ')[0];
    if (s.includes('-')) { const [a, m, d] = s.split('-'); return `${d}/${m}/${a}`; }
    return s;
  }

  limparBusca(): void {
    this.termoBusca = '';
    this.cdr.markForCheck();
  }
}
