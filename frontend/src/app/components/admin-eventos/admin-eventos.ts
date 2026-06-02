import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router'; // Importação crucial para o botão funcionar
import { EventoService } from '../../services/evento';

@Component({
  selector: 'app-admin-eventos',
  standalone: true,
  imports: [CommonModule, RouterLink], // RouterLink injetado aqui
  templateUrl: './admin-eventos.html',
  styleUrls: ['./admin-eventos.css']
})
export class AdminEventosComponent implements OnInit {
  eventos: any[] = [];

  constructor(private eventoService: EventoService) {}

  ngOnInit(): void {
    this.carregarEventos();
  }

  carregarEventos() {
    this.eventoService.obterTodos().subscribe({
      next: (dados) => {
         this.eventos = dados;
      },
      error: (erro) => {
        console.error('Erro ao carregar eventos:', erro);
      }
    });
  }
}