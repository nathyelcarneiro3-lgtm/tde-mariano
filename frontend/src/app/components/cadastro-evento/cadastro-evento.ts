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
  // FIX: campos renomeados para dt_inicio/dt_fim (igual ao que o backend retorna e espera)
  evento: any = {
    nome: '',
    descricao: '',
    dt_inicio: '',
    dt_fim: '',
    local: '',
    nome_responsavel: '',
    cpf_responsavel: '',
    email_responsavel: '',
    dt_limite_inscricao: '',
    numero_vagas: null
  };

  isEdit = false;
  eventoId: number | null = null;
  carregando = false;

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

  carregarEvento(): void {
    this.carregando = true;
    this.eventoService.obterPorId(this.eventoId!).subscribe({
      next: (res: any) => {
        this.evento = res;

        // FIX: formatar datas usando os nomes corretos dt_inicio/dt_fim
        if (this.evento.dt_inicio) {
          this.evento.dt_inicio = this.evento.dt_inicio.split('T')[0];
        }
        if (this.evento.dt_fim) {
          this.evento.dt_fim = this.evento.dt_fim.split('T')[0];
        }
        if (this.evento.dt_limite_inscricao) {
          this.evento.dt_limite_inscricao = this.evento.dt_limite_inscricao.split('T')[0];
        }

        this.carregando = false;
      },
      error: (err) => {
        console.error('Erro ao carregar evento:', err);
        alert('Erro ao carregar dados do evento.');
        this.carregando = false;
      }
    });
  }

  salvar(): void {
    this.carregando = true;
    if (this.isEdit) {
      this.eventoService.atualizar(this.eventoId!, this.evento).subscribe({
        next: () => {
          alert('Evento atualizado com sucesso!');
          // FIX: rota correta é /admin (não /admin-eventos)
          this.router.navigate(['/admin']);
        },
        error: (err) => {
          console.error('Erro ao atualizar evento:', err);
          const msg = err?.error?.msg || 'Erro ao atualizar o evento.';
          alert(msg);
          this.carregando = false;
        }
      });
    } else {
      this.eventoService.cadastrar(this.evento).subscribe({
        next: () => {
          alert('Evento criado com sucesso!');
          // FIX: rota correta é /admin (não /admin-eventos)
          this.router.navigate(['/admin']);
        },
        error: (err) => {
          console.error('Erro ao criar evento:', err);
          const msg = err?.error?.msg || 'Erro ao criar o evento.';
          alert(msg);
          this.carregando = false;
        }
      });
    }
  }
}