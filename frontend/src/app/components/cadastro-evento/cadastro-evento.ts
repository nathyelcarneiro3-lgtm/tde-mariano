import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { EventoService } from '../../services/evento';

@Component({
  selector: 'app-cadastro-evento',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './cadastro-evento.html',
  styleUrls: ['./cadastro-evento.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
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
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEdit = true;
      this.eventoId = Number(id);
      this.carregarEvento();
    }
  }

  // Transforma o que vem da API para o formato "yyyy-MM-dd" que o <input type="date"> exige
private formatarParaInput(valor: string): string {
  if (!valor) return '';
  
  // Limpa espaços extras e remove qualquer parte de hora que venha após espaço ou T
  // Transforma "2026-06-20 00:00:00" ou "2026-06-20T00:00:00" apenas em "2026-06-20"
  let dataLimpa = valor.split('T')[0].split(' ')[0].trim();

  // Caso a API retorne no formato DD/MM/AAAA, converte para AAAA-MM-DD
  if (dataLimpa.includes('/')) {
    const partes = dataLimpa.split('/');
    if (partes.length === 3) {
      return `${partes[2]}-${partes[1]}-${partes[0]}`;
    }
  }

  return dataLimpa;
}

// Transforma o formato do <input type="date"> ("yyyy-MM-dd") para o formato da sua API ("dd/mm/yyyy")
private formatarParaEnvio(data: string): string {
  if (!data) return '';
  
  // Garante que estamos pegando apenas a data limpa antes de inverter
  const dataLimpa = data.split(' ')[0].trim();
  const partes = dataLimpa.split('-'); 
  
  if (partes.length !== 3) return dataLimpa;
  return `${partes[2]}/${partes[1]}/${partes[0]}`; // Inverte para DD/MM/AAAA
}


  carregarEvento(): void {
    this.carregando = true;
    this.cdr.markForCheck();
        this.erroMsg = '';

    this.eventoService.obterPorId(this.eventoId!).subscribe({
      next: (res: any) => {
        this.evento = {
          nome:              res.nome              || '',
          descricao:         res.descricao         || '',
          dt_inicio:         this.formatarParaInput(res.dt_inicio),
          dt_fim:            this.formatarParaInput(res.dt_fim),
          dt_limite_inscricao: this.formatarParaInput(res.dt_limite_inscricao),
          numero_vagas:      res.numero_vagas      ?? null,
          cpf_responsavel:   res.cpf_responsavel   || '',
          nome_responsavel:  res.nome_responsavel  || '',
          email_responsavel: res.email_responsavel || ''
        };
        this.carregando = false;
        this.cdr.markForCheck();
      },
      error: (err: any) => {
        console.error('Erro ao carregar evento:', err);
        this.cdr.markForCheck();
        this.erroMsg = err?.error?.msg || 'Erro ao carregar dados do evento.';
        this.carregando = false;
        this.cdr.markForCheck();
      }
    });
  }

  salvar(): void {
    this.cdr.markForCheck();
        this.erroMsg = '';
    this.carregando = true;

    // Cria um payload clonado aplicando a máscara DD/MM/AAAA para submeter à API
    const payload = {
      ...this.evento,
      dt_inicio:           this.formatarParaEnvio(this.evento.dt_inicio),
      dt_fim:              this.formatarParaEnvio(this.evento.dt_fim),
      dt_limite_inscricao: this.formatarParaEnvio(this.evento.dt_limite_inscricao)
    };

    if (this.isEdit) {
      this.eventoService.atualizar(this.eventoId!, payload).subscribe({
        next: () => {
          alert('Evento atualizado com sucesso!');
          this.router.navigate(['/admin']);
        },
        error: (err: any) => {
          console.error('Erro ao atualizar evento:', err);
          this.cdr.markForCheck();
        this.erroMsg = err?.error?.msg || 'Erro ao atualizar o evento.';
          this.carregando = false;
        this.cdr.markForCheck();
        }
      });
    } else {
      this.eventoService.cadastrar(payload).subscribe({
        next: () => {
          alert('Evento criado com sucesso!');
          this.router.navigate(['/admin']);
        },
        error: (err: any) => {
          console.error('Erro ao criar evento:', err);
          this.cdr.markForCheck();
        this.erroMsg = err?.error?.msg || 'Erro ao criar o evento.';
          this.carregando = false;
        this.cdr.markForCheck();
        }
      });
    }
  }
}
