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
    numero_vagas: 50,
    nome_responsavel: '',
    cpf_responsavel: '',
    email_responsavel: ''
  };

  carregando = false;

  constructor(private eventoService: EventoService, private router: Router) {}

  // Formata de YYYY-MM-DD (HTML) para DD/MM/YYYY (Python)
  formatarDataParaBackend(data: string): string {
    if (!data) return '';
    const partes = data.split('-');
    if (partes.length === 3) {
      return `${partes[2]}/${partes[1]}/${partes[0]}`;
    }
    return data;
  }

  salvarEvento() {
    if (!this.eventoData.nome || !this.eventoData.dt_inicio || !this.eventoData.email_responsavel) {
      alert('Por favor, preencha todos os campos obrigatórios corretamente.');
      return;
    }

    this.carregando = true;

    // PAYLOAD CORRIGIDO: Sem o 'id', para não dar conflito com o 'Evento(0, **request.json)' do Python
    const payload = {
      nome: this.eventoData.nome,
      descricao: this.eventoData.descricao,
      dt_inicio: this.formatarDataParaBackend(this.eventoData.dt_inicio),
      dt_fim: this.formatarDataParaBackend(this.eventoData.dt_fim),
      dt_limite_inscricao: this.formatarDataParaBackend(this.eventoData.dt_limite_inscricao),
      numero_vagas: Number(this.eventoData.numero_vagas),
      nome_responsavel: this.eventoData.nome_responsavel,
      cpf_responsavel: String(this.eventoData.cpf_responsavel),
      email_responsavel: this.eventoData.email_responsavel
    };

    this.eventoService.cadastrar(payload).subscribe({
      next: (resposta: any) => {
        this.carregando = false;
        alert('Evento registrado com sucesso!');
        this.router.navigate(['/admin']); 
      },
      error: (erro: any) => {
        this.carregando = false;
        console.error('Erro detalhado:', erro);
        
        let msg = '';
        if (erro.status === 0) {
          msg = 'O backend bloqueou a requisição ou está desligado.';
        } else {
          // O Python envia a recusa das datas na propriedade "msg" do erro
          msg = erro.error?.msg || erro.message; 
        }
        
        alert(`Falha ao registrar!\n\nMotivo: ${msg}`);
      }
    });
  }
}