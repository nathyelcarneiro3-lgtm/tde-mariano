import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventoService } from '../../services/evento';

@Component({
  selector: 'app-admin-eventos',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-eventos.html', // APAGUE o ".component" desta linha!
  styleUrls: ['./admin-eventos.css'] 
})
export class AdminEventosComponent implements OnInit {
  eventos: any = [];
  constructor(private eventoService: EventoService) {}

  ngOnInit(): void {
    this.carregarEventos();
  }

carregarEventos(): void {
    this.eventoService.obterTodos().subscribe({
      next: (dados: any) => { // Adicione o : any aqui
        this.eventos = dados;
        console.log('Eventos carregados:', dados);
      },
      error: (err: any) => { // Adicione o : any aqui
        console.error('Erro ao buscar eventos:', err);
      }
    });
  }

  removerEvento(id: number): void {
    if (confirm('Tem certeza que deseja remover este evento?')) {
      this.eventoService.remover(id).subscribe({
        next: () => {
          alert('Evento removido com sucesso!');
          this.carregarEventos();
        },
        error: (err: any) => { // Adicione o : any aqui também
          alert('Erro ao remover: ' + (err.error?.msg || 'Erro desconhecido'));
        }
      });
    }
  }

  editarEvento(id: number): void {
    // Navegar para a tela de edição
    console.log('Editar evento:', id);
  }
}
