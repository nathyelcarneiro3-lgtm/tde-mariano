import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { EventoService } from '../../services/evento';

@Component({
  selector: 'app-cadastro-evento',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './cadastro-evento.html'
})
export class CadastroEventoComponent {
  
  eventoData: any = {
    nome: '',
    descricao: '',
    dt_inicio: '',
    dt_fim: '',
    dt_limite_inscricao: '',
    numero_vagas: 50
  };

  carregando = false;

  constructor(private eventoService: EventoService, private router: Router) {}

  salvarEvento() {
    if (!this.eventoData.nome || !this.eventoData.dt_inicio || !this.eventoData.dt_fim) {
      alert('Por favor, preencha os campos obrigatórios (Nome e Datas).');
      return;
    }

    this.carregando = true;

    const payload = {
      ...this.eventoData,
      numero_vagas: Number(this.eventoData.numero_vagas)
    };

    this.eventoService.cadastrar(payload).subscribe({
      next: (resposta: any) => {
        this.carregando = false;
        alert('Evento registado com sucesso!');
        this.router.navigate(['/admin']); 
      },
      error: (erro: any) => {
        this.carregando = false;
        console.error('Erro ao registar evento:', erro);
        alert('Falha ao registar o evento! Verifique a conexão com o servidor.');
      }
    });
  }
}