import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { EventoService } from '../../services/evento';

@Component({
  selector: 'app-cadastro-evento',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './cadastro-evento.html',
  styleUrl: './cadastro-evento.css'
})
export class CadastroEventoComponent implements OnInit {

  evento: any = {
    nome: '',
    descricao: '',
    dt_inicio: '',
    dt_fim: '',
    nome_responsavel: '',
    cpf_responsavel: '',
    email_responsavel: '',
    dt_limite_inscricao: '',
    numero_vagas: null
  };

  isEdit = false;
  eventoId: number | null = null;
  carregando = false;
  erroMsg = '';

  constructor(
    private eventoService: EventoService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEdit = true;
      this.eventoId = Number(id);
      this.carregarEvento();
    }
  }

  // Formata datas do banco (ex: "2026-05-01" ou "2026-05-01T00:00:00") para "yyyy-MM-dd"
  private formatarData(valor: string): string {
    if (!valor) return '';
    return valor.split('T')[0].trim();
  }

  carregarEvento(): void {
    this.carregando = true;
    this.erroMsg = '';

    this.eventoService.obterPorId(this.eventoId!).subscribe({
      next: (res: any) => {
        // Monta o objeto apenas com campos conhecidos — evita passar "id" acidentalmente
        this.evento = {
          nome:              res.nome              || '',
          descricao:         res.descricao         || '',
          dt_inicio:         this.formatarData(res.dt_inicio),
          dt_fim:            this.formatarData(res.dt_fim),
          dt_limite_inscricao: this.formatarData(res.dt_limite_inscricao),
          numero_vagas:      res.numero_vagas      ?? null,
          cpf_responsavel:   res.cpf_responsavel   || '',
          nome_responsavel:  res.nome_responsavel  || '',
          email_responsavel: res.email_responsavel || ''
        };
        this.carregando = false;
      },
      error: (err: any) => {
        console.error('Erro ao carregar evento:', err);
        this.erroMsg = err?.error?.msg || 'Erro ao carregar dados do evento.';
        this.carregando = false;
      }
    });
  }

  salvar(): void {
    this.erroMsg = '';
    this.carregando = true;

    if (this.isEdit) {
      this.eventoService.atualizar(this.eventoId!, this.evento).subscribe({
        next: () => {
          alert('Evento atualizado com sucesso!');
          this.router.navigate(['/admin']);
        },
        error: (err: any) => {
          console.error('Erro ao atualizar evento:', err);
          this.erroMsg = err?.error?.msg || 'Erro ao atualizar o evento.';
          this.carregando = false;
        }
      });
    } else {
      this.eventoService.cadastrar(this.evento).subscribe({
        next: () => {
          alert('Evento criado com sucesso!');
          this.router.navigate(['/admin']);
        },
        error: (err: any) => {
          console.error('Erro ao criar evento:', err);
          this.erroMsg = err?.error?.msg || 'Erro ao criar o evento.';
          this.carregando = false;
        }
      });
    }
  }
}
