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
         console.log('O que chegou do Python:', dados); // Para você ver no F12
         
         // Tenta pegar a lista de eventos de qualquer formato que o Python mandar
         if (Array.isArray(dados)) {
           this.eventos = dados; // Se for direto uma lista
         } else if (dados && dados.eventos) {
           this.eventos = dados.eventos; // Se vier dentro de uma chave "eventos"
         } else if (dados && dados.data) {
           this.eventos = dados.data; // Se vier dentro de uma chave "data"
         } else {
           // Se for um formato desconhecido, joga o objeto numa lista
           this.eventos = [dados]; 
         }
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