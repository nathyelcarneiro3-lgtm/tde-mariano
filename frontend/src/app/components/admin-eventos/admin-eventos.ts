import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router'; 
import { EventoService } from '../../services/evento';

@Component({
  selector: 'app-admin-eventos',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './admin-eventos.html',
  styleUrls: ['./admin-eventos.css']
})
export class AdminEventosComponent implements OnInit {
  eventos: any[] = [];
  adminResponsavel: string = 'nathyel';

  constructor(
    private eventoService: EventoService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.carregarEventos();
  }

  carregarEventos(): void {
    this.eventoService.obterTodos().subscribe({
      next: (dados: any) => {
         this.eventos = dados;
      },
      error: (erro: any) => {
        console.error('Erro ao carregar eventos:', erro);
      }
    });
  }

  excluirEvento(id: number): void {
    if (confirm('Tem certeza que deseja excluir este evento definitivamente?')) {
      this.eventoService.excluir(id).subscribe({
        next: () => {
          alert('Evento excluído com sucesso!');
          this.carregarEventos(); // Atualiza a tabela na mesma hora
        },
        error: (erro: any) => {
          console.error('Erro ao excluir:', erro);
          alert('Erro ao excluir o evento.');
        }
      });
    }
  }

  editarEvento(id: number): void {
    this.router.navigate(['/cadastro-evento', id]);
  }
}