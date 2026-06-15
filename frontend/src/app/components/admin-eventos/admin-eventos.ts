import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { EventoService } from '../../services/evento';

@Component({
  selector: 'app-admin-eventos',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './admin-eventos.html',
  styleUrls: ['./admin-eventos.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdminEventosComponent implements OnInit {
  eventos: any[] = [];
  carregando = false;
  erroMsg = '';

  constructor(
    private eventoService: EventoService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.carregarEventos();
  }

  carregarEventos(): void {
    this.carregando = true;
    this.erroMsg = '';
    this.cdr.markForCheck();

    this.eventoService.obterTodos().subscribe({
      next: (dados: any) => {
        const lista = Array.isArray(dados) ? dados : (dados?.eventos ?? dados?.data ?? []);
        this.eventos = lista.map((e: any) => ({
          ...e,
          dt_inicio_fmt: this.formatarData(e.dt_inicio),
          dt_fim_fmt:    this.formatarData(e.dt_fim)
        }));
        this.carregando = false;
        this.cdr.markForCheck();
      },
      error: (erro: any) => {
        this.carregando = false;
        if (erro.status === 401 || erro.status === 403) {
          this.erroMsg = 'Sessão expirada. Faça login novamente.';
        } else if (erro.status === 0) {
          this.erroMsg = 'Não foi possível conectar ao servidor. Verifique se o backend está rodando.';
        } else {
          this.erroMsg = erro?.error?.msg || 'Erro ao carregar eventos.';
        }
        this.cdr.markForCheck();
        console.error('Erro ao carregar eventos:', erro);
      }
    });
  }

  private formatarData(valor: string): string {
    if (!valor) return '—';
    const apenasData = valor.trim().split('T')[0].split(' ')[0];
    if (apenasData.includes('-')) {
      const [ano, mes, dia] = apenasData.split('-');
      return `${dia}/${mes}/${ano}`;
    }
    if (apenasData.includes('/')) return apenasData;
    return valor;
  }

  excluirEvento(id: number): void {
    if (!confirm('Tem certeza que deseja excluir este evento?')) return;
    this.eventoService.excluir(id).subscribe({
      next: () => {
        alert('Evento excluído com sucesso!');
        this.carregarEventos();
      },
      error: (erro: any) => {
        alert(erro?.error?.msg || 'Erro ao excluir o evento.');
        console.error('Erro ao excluir:', erro);
      }
    });
  }

  editarEvento(id: number): void {
    this.router.navigate(['/cadastro-evento', id]);
  }

  verInscritos(evento: any): void {
    this.router.navigate(['/lista-inscritos', evento.id], {
      state: { nomeEvento: evento.nome }
    });
  }
}
