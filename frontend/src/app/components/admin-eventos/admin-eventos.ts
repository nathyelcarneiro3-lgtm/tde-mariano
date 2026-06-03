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
    console.log('--- Iniciando busca de eventos ---'); // Adicionado log
    this.eventoService.obterTodos().subscribe({
      next: (dados: any) => {
         console.log('Dados recebidos do banco:', dados); // Isso vai confirmar se a lista vem vazia ou cheia
         this.eventos = dados;
         console.log('Lista de eventos no Angular:', this.eventos);
      },
      error: (erro: any) => {
        console.error('Erro na requisição:', erro);
      }
    });
  }

 excluirEvento(id: number): void {
  if (confirm('Tem certeza que deseja excluir?')) {
    this.eventoService.excluir(id).subscribe({
      next: () => {
        // Isso é o que faz a lista aparecer de novo imediatamente após apagar
        this.carregarEventos(); 
        alert('Evento excluído com sucesso!');
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