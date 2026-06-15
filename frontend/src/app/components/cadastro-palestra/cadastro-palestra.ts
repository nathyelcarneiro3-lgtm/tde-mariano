import { Component, OnInit, Inject, PLATFORM_ID, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { PalestraService } from '../../services/palestra';
import { EventoService } from '../../services/evento';

@Component({
  selector: 'app-cadastro-palestra',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './cadastro-palestra.html',
  changeDetection: ChangeDetectionStrategy.OnPush
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
    private route: ActivatedRoute,
    @Inject(PLATFORM_ID) private platformId: Object,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    if (!localStorage.getItem('token')) { this.router.navigate(['/login']); return; }
    if (localStorage.getItem('usuarioAdmin') !== '1') { this.router.navigate(['/home']); return; }

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

  // "2026-06-10 00:00:00" → "2026-06-10" (para o <input type="date">)
  private paraInput(v: string): string {
    if (!v) return '';
    const s = v.split('T')[0].split(' ')[0].trim();
    if (s.includes('/')) {
      const [d, m, a] = s.split('/');
      return `${a}-${m}-${d}`;
    }
    return s;
  }

  // "2026-06-10" → "10/06/2026" (que o backend exige)
  private paraEnvio(v: string): string {
    if (!v) return '';
    const s = v.split(' ')[0].trim();
    if (s.includes('-')) {
      const [a, m, d] = s.split('-');
      return `${d}/${m}/${a}`;
    }
    return s;
  }

  carregarPalestra(): void {
    this.carregando = true;
    this.palestraService.obterPorId(this.palestraId!).subscribe({
      next: (res: any) => {
        this.palestra = {
          id_evento:                 res.id_evento,
          nome:                      res.nome || '',
          descricao:                 res.descricao || '',
          dt_palestra:               this.paraInput(res.dt_palestra),
          horario_inicio_palestra:   res.horario_inicio_palestra || '',
          horario_fim_palestra:      res.horario_fim_palestra || '',
          nome_palestrante:          res.nome_palestrante || '',
          minicurriculo_palestrante: res.minicurriculo_palestrante || ''
        };
        this.carregando = false;
        this.cdr.markForCheck();
      },
      error: (err: any) => {
        this.erroMsg = err?.error?.msg || 'Erro ao carregar palestra.';
        this.carregando = false;
        this.cdr.markForCheck();
      }
    });
  }

  salvar(): void {
    this.erroMsg = '';
    this.carregando = true;

    // Converte YYYY-MM-DD → DD/MM/YYYY antes de enviar ao backend
    const payload = {
      ...this.palestra,
      dt_palestra: this.paraEnvio(this.palestra.dt_palestra)
    };

    const acao = this.isEdit
      ? this.palestraService.atualizar(this.palestraId!, payload)
      : this.palestraService.cadastrar(payload);

    acao.subscribe({
      next: () => {
        alert(this.isEdit ? 'Palestra atualizada com sucesso!' : 'Palestra cadastrada com sucesso!');
        this.router.navigate(['/lista-palestras']);
      },
      error: (err: any) => {
        this.erroMsg = err?.error?.msg || 'Erro ao salvar palestra.';
        this.carregando = false;
        this.cdr.markForCheck();
      }
    });
  }
}