import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { EventoService } from '../../services/evento'; // Certifique-se que o caminho está correto

@Component({
  selector: 'app-cadastro-evento',
  standalone: true, // <-- Isto faltava!
  imports: [CommonModule, FormsModule, RouterLink], // <-- Isto faz o ngModel e o RouterLink funcionarem!
  templateUrl: './cadastro-evento.html',
  styleUrl: './cadastro-evento.css'
})
export class CadastroEventoComponent implements OnInit {
  evento: any = {
    nome: '',
    descricao: '',
    data_inicio: '',
    data_fim: '',
    local: '',
    nome_responsavel: '', // Adicionado para evitar erros caso utilize no HTML
    cpf_responsavel: '',
    email_responsavel: '',
    dt_limite_inscricao: '',
    numero_vagas: null
  };

  isEdit = false;
  eventoId: number | null = null;
  carregando = false; // Adicionado para controlar o botão de submit

  constructor(
    private eventoService: EventoService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // Verifica se a rota possui um parâmetro de ID
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
        
        // Formatar datas para os campos input type="date" não ficarem em branco
        if (this.evento.data_inicio) {
          this.evento.data_inicio = this.evento.data_inicio.split('T')[0];
        }
        if (this.evento.data_fim) {
          this.evento.data_fim = this.evento.data_fim.split('T')[0];
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
          this.router.navigate(['/admin-eventos']);
        },
        error: (err) => {
          console.error('Erro ao atualizar evento:', err);
          alert('Erro ao atualizar o evento.');
          this.carregando = false;
        }
      });
    } else {
      this.eventoService.cadastrar(this.evento).subscribe({
        next: () => {
          alert('Evento criado com sucesso!');
          this.router.navigate(['/admin-eventos']);
        },
        error: (err) => {
          console.error('Erro ao criar evento:', err);
          alert('Erro ao criar o evento.');
          this.carregando = false;
        }
      });
    }
  }
}