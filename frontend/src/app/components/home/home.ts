import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { EventoService } from '../../services/evento';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './home.html'
})
export class HomeComponent implements OnInit {
  eventos: any[] = [];

  constructor(private eventoService: EventoService) {}

  ngOnInit(): void {
    // Ao abrir a página inicial, procura os eventos no banco de dados
    this.eventoService.obterTodos().subscribe({
      next: (dados: any) => {
        this.eventos = dados;
      },
      error: (err: any) => {
        console.error('Erro ao procurar eventos:', err);
      }
    });
  }
}
