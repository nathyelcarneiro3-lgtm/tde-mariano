import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { PalestraService } from '../../services/palestra';
import { EventoService } from '../../services/evento';

@Component({
  selector: 'app-cadastro-palestra',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './cadastro-palestra.html'
})
export class CadastroPalestraComponent implements OnInit {
  palestra: any = {
    id_evento: null,
    nome: '',
    descricao: '',
    dt_palestra: '',
    horario_inicio_palestra: '',
    horario_fim_palestra: '',
    nome_palestrante: '',
    minicurriculo_palestrante: ''
  };

  eventos: any[] = [];
  isEdit = false;
  palestraId: number | null = null;
  carregando = false;
  erroMsg = '';

  constructor(
    private palestraService: PalestraService,
    private eventoService: EventoService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.eventoService.obterTodos().subscribe({
      next: (dados: any) => { this.eventos = Array.isArray(dados) ? dados : []; },
      error: () => { this.eventos = []; }
    });

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEdit = true;
      this.palestraId = Number(id);
      this.carregarPalestra();
    }
  }

  carregarPalestra(): void {
    this.carregando = true;
    this.palestraService.obterPorId(this.palestraId!).subscribe({
      next: (res: any) => {
        this.palestra = {
          id_evento:                 res.id_evento,
          nome:                      res.nome || '',
          descricao:                 res.descricao || '',
          dt_palestra:               (res.dt_palestra || '').split('T')[0],
          horario_inicio_palestra:   res.horario_inicio_palestra || '',
          horario_fim_palestra:      res.horario_fim_palestra || '',
          nome_palestrante:          res.nome_palestrante || '',
          minicurriculo_palestrante: res.minicurriculo_palestrante || ''
        };
        this.carregando = false;
      },
      error: (err: any) => {
        this.erroMsg = err?.error?.msg || 'Erro ao carregar palestra.';
        this.carregando = false;
      }
    });
  }

  salvar(): void {
    this.erroMsg = '';
    this.carregando = true;

    const acao = this.isEdit
      ? this.palestraService.atualizar(this.palestraId!, this.palestra)
      : this.palestraService.cadastrar(this.palestra);

    acao.subscribe({
      next: () => {
        alert(this.isEdit ? 'Palestra atualizada!' : 'Palestra cadastrada!');
        this.router.navigate(['/lista-palestras']);
      },
      error: (err: any) => {
        this.erroMsg = err?.error?.msg || 'Erro ao salvar palestra.';
        this.carregando = false;
      }
    });
  }
}