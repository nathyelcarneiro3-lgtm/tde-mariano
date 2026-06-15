import { Component, OnInit, Inject, PLATFORM_ID, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MinicursoService } from '../../services/minicurso';
import { EventoService } from '../../services/evento';

@Component({
  selector: 'app-cadastro-minicurso',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './cadastro-minicurso.html',
  styleUrls: ['./cadastro-minicurso.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CadastroMinicursoComponent implements OnInit {
  minicurso: any = {
    id_evento: null,
    nome: '',
    descricao: '',
    dt_minicurso: '',
    horario_inicio_minicurso: '',
    horario_fim_minicurso: '',
    nome_instrutor: '',
    minicurriculo_instrutor: '',
    dt_limite_inscricao: '',
    numero_vagas: null
  };

  eventos: any[] = [];
  isEdit = false;
  minicursoId: number | null = null;
  carregando = false;
  erroMsg = '';

  constructor(
    private minicursoService: MinicursoService,
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
      this.minicursoId = Number(id);
      this.carregarMinicurso();
    }
  }

  // "2026-06-10 00:00:00" ou "2026-06-10T..." → "2026-06-10" (para o <input type="date">)
  private paraInput(v: string): string {
    if (!v) return '';
    const s = v.split('T')[0].split(' ')[0].trim();
    // Se vier DD/MM/YYYY do banco, inverte para YYYY-MM-DD
    if (s.includes('/')) {
      const [d, m, a] = s.split('/');
      return `${a}-${m}-${d}`;
    }
    return s;
  }

  // "2026-06-10" (do <input type="date">) → "10/06/2026" (que o backend exige)
  private paraEnvio(v: string): string {
    if (!v) return '';
    const s = v.split(' ')[0].trim();
    if (s.includes('-')) {
      const [a, m, d] = s.split('-');
      return `${d}/${m}/${a}`;
    }
    return s;
  }

  carregarMinicurso(): void {
    this.carregando = true;
    this.minicursoService.obterPorId(this.minicursoId!).subscribe({
      next: (res: any) => {
        this.minicurso = {
          id_evento:                res.id_evento,
          nome:                     res.nome || '',
          descricao:                res.descricao || '',
          dt_minicurso:             this.paraInput(res.dt_minicurso),
          horario_inicio_minicurso: res.horario_inicio_minicurso || '',
          horario_fim_minicurso:    res.horario_fim_minicurso || '',
          nome_instrutor:           res.nome_instrutor || '',
          minicurriculo_instrutor:  res.minicurriculo_instrutor || '',
          dt_limite_inscricao:      this.paraInput(res.dt_limite_inscricao),
          numero_vagas:             res.vagas_disponiveis ?? res.numero_vagas ?? null
        };
        this.carregando = false;
        this.cdr.markForCheck();
      },
      error: (err: any) => {
        this.erroMsg = err?.error?.msg || 'Erro ao carregar minicurso.';
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
      ...this.minicurso,
      dt_minicurso:        this.paraEnvio(this.minicurso.dt_minicurso),
      dt_limite_inscricao: this.paraEnvio(this.minicurso.dt_limite_inscricao)
    };

    const acao = this.isEdit
      ? this.minicursoService.atualizar(this.minicursoId!, payload)
      : this.minicursoService.cadastrar(payload);

    acao.subscribe({
      next: () => {
        alert(this.isEdit ? 'Minicurso atualizado com sucesso!' : 'Minicurso cadastrado com sucesso!');
        this.router.navigate(['/lista-minicursos']);
      },
      error: (err: any) => {
        this.erroMsg = err?.error?.msg || 'Erro ao salvar minicurso.';
        this.carregando = false;
        this.cdr.markForCheck();
      }
    });
  }
}