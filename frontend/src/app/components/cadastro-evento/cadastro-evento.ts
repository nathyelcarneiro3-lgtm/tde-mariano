import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { EventoService } from '../../services/evento';

@Component({
  selector: 'app-cadastro-evento',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './cadastro-evento.html'
})
export class CadastroEventoComponent {
  novoEvento = { nome: '', data: '', local: '' };

  constructor(private eventoService: EventoService) {}

  cadastrar() {
    this.eventoService.salvar(this.novoEvento).subscribe({
      next: () => alert('Evento cadastrado com sucesso!'),
      error: (err) => console.error('Erro ao salvar', err)
    });
  }
}